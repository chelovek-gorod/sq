import { Container, Sprite, MeshPlane } from 'pixi.js'
import { tickerAdd } from '../../../app/application'
import { atlases, images } from '../../../app/assets'
import { EventHub, events } from '../../../app/events'
import { moveToTarget } from '../../../utils/functions'
import HelpFinger from '../../effects/HelpFinger'
import SparkParticles from '../../effects/SparkParticles'
import { dragonPointIndex, isNeedHelp, world } from '../../state'
import { PET } from '../Level/constants'
import { MAP_WIDTH, MAP_HEIGHT, POINTS, MAP_HALF_WIDTH, MAP_HALF_HEIGHT, FREE_POINTS } from './constants'
import FreePoint from './FreePoint'
import MapDot from './MapDot'
import MapPoint from './MapPoint'
import SmokeContainer from './SmokeContainer'

const DRAG_DISTANCE = 5 // число пикселей, при перетаскивании на которое клики не обработаются

const WATER_SPEED = 0.003     // Общая скорость анимации
const WATER_AMPLITUDE = 3     // Максимальное смещение в пикселях (сила шторма)
const WATER_WAVELENGTH = 0.03 // Частота волн (чем меньше, тем шире волны)
const WATER_X_FREQ = 0.5      // Коэффициент разницы фаз по X
const WATER_Y_FREQ = 0.7      // Коэффициент разницы фаз по Y
const WATER_GRID_X = 30       // Плотность сетки (количество полигонов) по X
const WATER_GRID_Y = 20       // Плотность сетки (количество полигонов) по Y

const DRAG_SENSITIVITY = 1.2
const EDGE_PAN_SPEED = 6 // 0.6px в миллисекунду или 600px в секунду
const EDGE_PAN_ZONE = 30
const RETURN_LERP = 0.12 //  коэффициент плавности позиция += (цель - позиция) * RETURN_LERP
const FOCUS_TOLERANCE = 0.3 // пикселей — если до цели меньше, прыгаем сразу

export default class WorldMap extends Container {
    constructor() {
        super()

        this.isOn = true

        this.dragStartPoint = null
        this.isChildrenInteractive = false

        // ================= MAP =================

        this.staticImage = new Sprite(images.map_static)
        this.staticImage.anchor.set(0.5)
        this.addChild(this.staticImage)

        this.actionImage = new MeshPlane({
            texture: images.map_action,
            verticesX: WATER_GRID_X,
            verticesY: WATER_GRID_Y
        })
        this.actionImage.pivot.set(
            images.map_action.width * 0.5, 
            images.map_action.height * 0.5
        )
        this.addChild(this.actionImage)
        this.originalVertices = this.actionImage.geometry.getBuffer('aPosition').data.slice()

        this.waterTime = 0

        //--//
        this.addChild( new SmokeContainer() )

        // ================= STATE =================

        this.isDragging = false
        this.dragStart = null
        this.dragCoefficient = 1

        this.isIgnoringPointerMove = false

        this.edgePan = { x: 0, y: 0 }

        this.focusPoint = { x: 0, y: 0 }

        this.autoFocus = false

        this.screenWidth = 0
        this.screenHeight = 0

        this.minX = 0
        this.maxX = 0
        this.minY = 0
        this.maxY = 0

        this.edgeSpeedX = 0
        this.edgeSpeedY = 0

        // ================= CONTENT =================

        this.points = new Container()
        this.addChild(this.points)

        for (let d = 1; d < 83; d++) this.points.addChild(new MapDot(d))
        for (let p = 0; p < POINTS.length; p++) this.points.addChild(new MapPoint(p, this))
        for (let f = 0; f < FREE_POINTS.length; f++) this.points.addChild(new FreePoint(f, this))

        this.ship = new Sprite(atlases.world.textures.ship)
        //this.ship.scale.set(0.4)
        this.ship.anchor.set(0.5, 0.8)
        this.ship.position.set(-600, 380)
        this.ship.swingDirection = 1
        this.ship.swingProgress = 0
        this.ship.swingSpeed = 0.0003
        this.ship.swingAmplitude = 0.07
        this.addChild(this.ship)

        this.dragon = new Sprite(atlases.units.textures[PET.Dragon])
        this.dragon.scale.set(0.4)
        this.dragon.anchor.set(0.5, 0.75)
        this.dragon.eventMode = 'none'
        this.dragon.target = null
        this.addChild(this.dragon)
        this.setDragon()

        EventHub.on( events.flyDragonToPoint, this.flyDragonToPoint, this )

        // =============== FREE SPARKS ==============

        this.sparks = new SparkParticles()
        this.sparks.container.scale.set(0.5)
        this.addChild(this.sparks.container)

        // =============== HELP FINGER ==============

        if (isNeedHelp) {
            const target = POINTS[world.length - 1]
            const helpFinger = new HelpFinger(target.x, target.y)
            this.addChild( helpFinger )
        }

        // ================= EVENTS =================

        this.eventMode = 'static'
        this.on('pointerdown', this.onPointerDown, this)
        this.on('pointermove', this.onPointerMove, this)
        this.on('pointerup', this.onPointerUp, this)
        this.on('pointerupoutside', this.onPointerUp, this)

        EventHub.on( events.setMapCameraInteractive, this.setOnOff, this )

        tickerAdd(this)
    }

    // ================= RESIZE =================

    screenResize({ width, height }) {
        const widthRatio = width / MAP_WIDTH
        const heightRatio = height / MAP_HEIGHT

        const scale = Math.max(widthRatio, heightRatio, 0.75)
        this.scale.set(scale)

        this.dragCoefficient = this.scale.x * DRAG_SENSITIVITY

        this.edgeSpeedX = EDGE_PAN_SPEED / this.scale.x
        this.edgeSpeedY = EDGE_PAN_SPEED / this.scale.y

        this.screenWidth = width
        this.screenHeight = height

        this.calculateBounds()
        this.clampPosition()

        if (this.isDragging) {
            this.isDragging = false
            this.dragStart = null
        }

        // мгновенно центрируем
        this.setFocusPoint(true)
    }

    // ================= TICK =================

    tick({ deltaMS }) {
 
        // ship
        this.ship.swingProgress += this.ship.swingSpeed * deltaMS
        if (this.ship.swingProgress >= 1) {
            this.ship.swingProgress = 0
            this.ship.swingDirection *= -1
        }
        const angle = this.ship.swingAmplitude * this.ship.swingDirection
        this.ship.rotation = Math.sin(this.ship.swingProgress * Math.PI) * angle

        // fly dragon
        if (this.dragon.target) {
            moveToTarget(this.dragon, this.dragon.target, 0.3 * deltaMS)
        }

        // water
        this.waterTime += WATER_SPEED * deltaMS
    
        const geometry = this.actionImage.geometry
        const vertices = geometry.getBuffer('aPosition').data
        const orig = this.originalVertices
        
        // Проходим по сетке вершин и создаем эффект "колыхания"
        for (let i = 0; i < vertices.length; i += 2) {
            const ox = orig[i]
            const oy = orig[i + 1]

            // Чтобы волна шла равномерно по X и Y, используем общую метрику (WAVELENGTH)
            // Но добавляем FREQ для создания интерференции (сложного движения)
            
            // Смещение по X зависит от Y-координаты и времени
            const angleX = this.waterTime * WATER_X_FREQ + (oy * WATER_WAVELENGTH)
            // Смещение по Y зависит от X-координаты и времени
            const angleY = this.waterTime * WATER_Y_FREQ + (ox * WATER_WAVELENGTH)

            // Используем нормализованные смещения
            vertices[i] = ox + Math.sin(angleX) * WATER_AMPLITUDE
            vertices[i + 1] = oy + Math.cos(angleY) * WATER_AMPLITUDE
        }
        geometry.getBuffer('aPosition').update()

        // ================= AUTO FOCUS =================

        if (this.autoFocus) {
            let targetX = (MAP_HALF_WIDTH - this.focusPoint.x) * this.scale.x
            let targetY = (MAP_HALF_HEIGHT - this.focusPoint.y) * this.scale.y

            targetX = Math.max(this.minX, Math.min(this.maxX, targetX))
            targetY = Math.max(this.minY, Math.min(this.maxY, targetY))

            this.position.x += (targetX - this.position.x) * RETURN_LERP
            this.position.y += (targetY - this.position.y) * RETURN_LERP
            
            if ( Math.abs(targetX - this.position.x) < FOCUS_TOLERANCE
            && Math.abs(targetY - this.position.y) < FOCUS_TOLERANCE ) {
                this.position.set(targetX, targetY)
                this.autoFocus = false
            }

            return // 🔒 ПОЛНАЯ БЛОКИРОВКА ВВОДА
        }

        // ================= EDGE PAN =================

        if (!this.isDragging) {
            this.position.x += this.edgePan.x * this.edgeSpeedX
            this.position.y += this.edgePan.y * this.edgeSpeedY
            this.clampPosition()
        }
    }

    // ================= POINTER =================

    onPointerDown(e) {
        if (this.autoFocus || !this.isOn) return

        this.isIgnoringPointerMove = false
        this.isDragging = true
        this.edgePan.x = 0
        this.edgePan.y = 0

        this.dragStartPoint = {x: e.global.x, y: e.global.y}
        this.isChildrenInteractive = false

        this.dragStart = {
            globalX: e.global.x,
            globalY: e.global.y,
            camX: this.position.x,
            camY: this.position.y
        }
    }

    onPointerMove(e) {
        if (this.autoFocus || !this.isOn || this.isIgnoringPointerMove) return

        if (!this.isDragging) this.updateEdgePan(e.global)

        if (this.dragStart) {
            const dx = (e.global.x - this.dragStart.globalX) * this.dragCoefficient
            const dy = (e.global.y - this.dragStart.globalY) * this.dragCoefficient

            this.position.x = this.dragStart.camX + dx
            this.position.y = this.dragStart.camY + dy

            this.clampPosition()
        }
    }

    onPointerUp(e) {
        this.isIgnoringPointerMove = false

        if (this.dragStartPoint) { 
            let dx = this.dragStartPoint.x - e.global.x
            let dy = this.dragStartPoint.y - e.global.y
            console.log(dx * dx + dy * dy, DRAG_DISTANCE * DRAG_DISTANCE)
            if (dx * dx + dy * dy < DRAG_DISTANCE * DRAG_DISTANCE) {
                this.isChildrenInteractive = true
            }
            this.dragStartPoint = null
        }

        if (!this.isDragging) {
            this.edgePan.x = 0
            this.edgePan.y = 0
            return
        }
    
        this.isDragging = false
        this.dragStart = null
        this.edgePan.x = 0
        this.edgePan.y = 0
    }

    // ================= EDGE PAN =================

    updateEdgePan({ x, y }) {
        const z = EDGE_PAN_ZONE
        const w = this.screenWidth
        const h = this.screenHeight

        this.edgePan.x =
            x < z ? (z - x) / z :
            x > w - z ? -(x - (w - z)) / z : 0

        this.edgePan.y =
            y < z ? (z - y) / z :
            y > h - z ? -(y - (h - z)) / z : 0
    }

    // ================= BOUNDS =================

    calculateBounds() {
        const mapWorldW = MAP_WIDTH * this.scale.x
        const mapWorldH = MAP_HEIGHT * this.scale.y

        const halfMapW = mapWorldW / 2
        const halfMapH = mapWorldH / 2

        const halfScreenW = this.screenWidth / 2
        const halfScreenH = this.screenHeight / 2

        this.minX = halfScreenW - halfMapW
        this.maxX = halfMapW - halfScreenW
        this.minY = halfScreenH - halfMapH
        this.maxY = halfMapH - halfScreenH

        if (this.minX > this.maxX) this.minX = this.maxX = 0
        if (this.minY > this.maxY) this.minY = this.maxY = 0
    }

    clampPosition() {
        this.position.x = Math.max(this.minX, Math.min(this.maxX, this.position.x))
        this.position.y = Math.max(this.minY, Math.min(this.maxY, this.position.y))
    }

    // ================= API =================

    setFocusPoint(instant = false) {
        this.focusPoint.x = POINTS[dragonPointIndex].x + MAP_HALF_WIDTH
        this.focusPoint.y = POINTS[dragonPointIndex].y + MAP_HALF_HEIGHT

        if (instant) {
            let targetX = (MAP_HALF_WIDTH - this.focusPoint.x) * this.scale.x
            let targetY = (MAP_HALF_HEIGHT - this.focusPoint.y) * this.scale.y

            targetX = Math.max(this.minX, Math.min(this.maxX, targetX))
            targetY = Math.max(this.minY, Math.min(this.maxY, targetY))

            this.position.set(targetX, targetY)
        } else {
            this.autoFocus = true
        }
    }

    setDragon() {
        this.dragon.position.set(
            POINTS[dragonPointIndex].x,
            POINTS[dragonPointIndex].y
        )
    }

    flyDragonToPoint() {
        this.dragon.target = {
            x: POINTS[dragonPointIndex].x,
            y: POINTS[dragonPointIndex].y
        }
    }

    setOnOff( isOn ) {
        this.isOn = isOn

        if (isOn) {
            this.isDragging = false
            this.dragStart = null
            this.edgePan.x = 0
            this.edgePan.y = 0
            this.isIgnoringPointerMove = true
        }
    }

    kill() {
        this.off('pointerdown', this.onPointerDown, this)
        this.off('pointermove', this.onPointerMove, this)
        this.off('pointerup', this.onPointerUp, this)
        this.off('pointerupoutside', this.onPointerUp, this)

        EventHub.off( events.setMapCameraInteractive, this.setOnOff, this )

        this.sparks.kill()
    }
}