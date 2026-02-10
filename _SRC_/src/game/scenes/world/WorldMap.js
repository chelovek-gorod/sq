import { Container, Sprite, DisplacementFilter } from 'pixi.js'
import { tickerAdd } from '../../../app/application'
import { atlases, images } from '../../../app/assets'
import { dragonPointIndex } from '../../state'
import { PET } from '../game/constants'
import { MAP_WIDTH, MAP_HEIGHT, POINTS, MAP_HALF_WIDTH, MAP_HALF_HEIGHT } from './constants'
import MapDot from './MapDot'
import MapPoint from './MapPoint'

const DP_FILTER_SPEED = 0.03

const DRAG_SENSITIVITY = 0.7
const EDGE_PAN_SPEED = 700
const EDGE_PAN_ZONE = 150
const RETURN_LERP = 0.03
const FOCUS_EPSILON = 0.06

export default class WorldMap extends Container {
    constructor() {
        super()

        // ================= MAP =================

        this.staticImage = new Sprite(images.map_static)
        this.staticImage.anchor.set(0.5)
        this.addChild(this.staticImage)

        this.actionContainer = new Container()
        this.addChild(this.actionContainer)

        this.actionImage = new Sprite(images.map_action)
        this.actionImage.anchor.set(0.5)

        this.DPFilterSprite = new Sprite(images.dpf_1)
        this.DPFilterSprite.texture.source.style.addressMode = 'repeat'
        this.actionContainer.addChild(this.DPFilterSprite)

        this.DPFilter = new DisplacementFilter(this.DPFilterSprite)
        this.actionImage.filters = [this.DPFilter]
        this.actionContainer.addChild(this.actionImage)

        // ================= STATE =================

        this.isDragging = false
        this.dragStart = null

        this.edgePan = { x: 0, y: 0 }

        this.focusPoint = { x: 0, y: 0 }

        this.autoFocus = false

        this.mapWidth = MAP_WIDTH
        this.mapHeight = MAP_HEIGHT

        this.screenWidth = 0
        this.screenHeight = 0

        this.minX = 0
        this.maxX = 0
        this.minY = 0
        this.maxY = 0

        // ================= CONTENT =================

        this.points = new Container()
        this.addChild(this.points)

        for (let d = 1; d < 83; d++) this.points.addChild(new MapDot(d))
        for (let i = 0; i < POINTS.length; i++) this.points.addChild(new MapPoint(i))

        this.dragon = new Sprite(atlases.pets.textures[PET.Dragon])
        this.dragon.scale.set(0.4)
        this.dragon.anchor.set(0.5, 0.75)
        this.dragon.eventMode = 'none'
        this.addChild(this.dragon)
        this.setDragon()

        // ================= EVENTS =================

        this.eventMode = 'static'
        this.on('pointerdown', this.onPointerDown.bind(this))
        this.on('pointermove', this.onPointerMove.bind(this))
        this.on('pointerup', this.onPointerUp.bind(this))
        this.on('pointerupoutside', this.onPointerUp.bind(this))

        tickerAdd(this)
    }

    // ================= RESIZE =================

    screenResize({ width, height }) {
        const widthRatio = width / this.mapWidth
        const heightRatio = height / this.mapHeight

        const scale = Math.max(widthRatio, heightRatio, 0.75)
        this.scale.set(scale)

        this.screenWidth = width
        this.screenHeight = height

        this.calculateBounds()
        this.clampPosition()

        // мгновенно центрируем
        this.setFocusPoint(true)
    }

    // ================= TICK =================

    tick({ deltaMS }) {
        const dt = deltaMS / 1000

        // displacement
        this.DPFilterSprite.x += deltaMS * DP_FILTER_SPEED
        this.DPFilterSprite.y += deltaMS * DP_FILTER_SPEED

        // ================= AUTO FOCUS =================

        if (this.autoFocus) {
            let targetX = (this.mapWidth * 0.5 - this.focusPoint.x) * this.scale.x
            let targetY = (this.mapHeight * 0.5 - this.focusPoint.y) * this.scale.y

            targetX = Math.max(this.minX, Math.min(this.maxX, targetX))
            targetY = Math.max(this.minY, Math.min(this.maxY, targetY))

            this.position.x += (targetX - this.position.x) * RETURN_LERP
            this.position.y += (targetY - this.position.y) * RETURN_LERP

            if (
                Math.abs(targetX - this.position.x) < FOCUS_EPSILON &&
                Math.abs(targetY - this.position.y) < FOCUS_EPSILON
            ) {
                this.position.set(targetX, targetY)
                this.autoFocus = false
            }

            return // 🔒 ПОЛНАЯ БЛОКИРОВКА ВВОДА
        }

        // ================= EDGE PAN =================

        if (!this.isDragging) {
            this.position.x += this.edgePan.x * EDGE_PAN_SPEED * dt / this.scale.x
            this.position.y += this.edgePan.y * EDGE_PAN_SPEED * dt / this.scale.y
            this.clampPosition()
        }
    }

    // ================= POINTER =================

    onPointerDown(e) {
        if (this.autoFocus) return

        this.isDragging = true

        const p = this.toLocal(e.global)
        this.dragStart = {
            x: p.x,
            y: p.y,
            camX: this.position.x,
            camY: this.position.y
        }
    }

    onPointerMove(e) {
        if (this.autoFocus) return

        if (this.isDragging && this.dragStart) {
            const p = this.toLocal(e.global)

            const dx = (p.x - this.dragStart.x) * DRAG_SENSITIVITY
            const dy = (p.y - this.dragStart.y) * DRAG_SENSITIVITY

            this.position.x = this.dragStart.camX + dx
            this.position.y = this.dragStart.camY + dy

            this.clampPosition()
            return
        }

        this.updateEdgePan(e.global)
    }

    onPointerUp() {
        this.isDragging = false
        this.dragStart = null
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
        const mapWorldW = this.mapWidth * this.scale.x
        const mapWorldH = this.mapHeight * this.scale.y

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
            let targetX = (this.mapWidth * 0.5 - this.focusPoint.x) * this.scale.x
            let targetY = (this.mapHeight * 0.5 - this.focusPoint.y) * this.scale.y

            targetX = Math.max(this.minX, Math.min(this.maxX, targetX))
            targetY = Math.max(this.minY, Math.min(this.maxY, targetY))

            this.position.set(targetX, targetY)
            this.isReturning = false
            this.idleTimer = 0
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
}