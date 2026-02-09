import { Container, Sprite, DisplacementFilter } from 'pixi.js'
import { tickerAdd } from '../../../app/application'
import { images } from '../../../app/assets'

// ==================== CONSTANTS ====================

const DP_FILTER_SPEED = 0.03

const DRAG_SENSITIVITY = 0.45
const EDGE_PAN_SPEED = 700
const EDGE_PAN_ZONE = 200
const RETURN_LERP = 0.03
const IDLE_RETURN_DELAY = 2000

const MAP_WIDTH = 2048
const MAP_HEIGHT = 1366

const FOCUS_EPSILON = 0.06

export default class WorldMap extends Container {
    constructor() {
        super()

        // ==================== MAP ====================

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

        // ==================== CAMERA STATE ====================

        this.isDragging = false
        this.dragStart = null

        this.edgePan = { x: 0, y: 0 }

        // focusPoint В КООРДИНАТАХ КАРТЫ
        this.focusPoint = { x: MAP_WIDTH, y: MAP_HEIGHT }

        this.isReturning = false
        this.idleTimer = 0

        // флаг активности ввода (КЛЮЧЕВОЙ момент)
        this.inputActive = false

        // ==================== BOUNDS ====================

        this.mapWidth = MAP_WIDTH
        this.mapHeight = MAP_HEIGHT

        this.screenWidth = 0
        this.screenHeight = 0

        this.minX = 0
        this.maxX = 0
        this.minY = 0
        this.maxY = 0

        // ==================== EVENTS ====================

        this.eventMode = 'static'
        this.on('pointerdown', this.onPointerDown.bind(this))
        this.on('pointermove', this.onPointerMove.bind(this))
        this.on('pointerup', this.onPointerUp.bind(this))
        this.on('pointerupoutside', this.onPointerUp.bind(this))

        tickerAdd(this)
    }

    // ==================== RESIZE ====================

    screenResize({ width, height }) {
        const scale = Math.max(width / this.mapWidth, height / this.mapHeight, 1)
        this.scale.set(scale)

        this.screenWidth = width
        this.screenHeight = height

        this.calculateBounds()
        this.clampPosition()
    }

    // ==================== TICK ====================

    tick({ deltaMS }) {
        const dt = deltaMS / 1000

        // displacement
        this.DPFilterSprite.x += deltaMS * DP_FILTER_SPEED
        this.DPFilterSprite.y += deltaMS * DP_FILTER_SPEED

        // ==================== EDGE PAN ====================

        if (!this.isDragging && !this.isReturning) {
            this.position.x += this.edgePan.x * EDGE_PAN_SPEED * dt / this.scale.x
            this.position.y += this.edgePan.y * EDGE_PAN_SPEED * dt / this.scale.y

            this.clampPosition()
        }

        // ==================== IDLE TIMER ====================

        if (this.inputActive || this.isDragging) {
            this.idleTimer = 0
            this.isReturning = false
        } else {
            this.idleTimer += deltaMS
        }

        if (!this.isReturning && this.idleTimer > IDLE_RETURN_DELAY) {
            this.isReturning = true
        }

        // ==================== RETURN TO FOCUS ====================

        if (this.isReturning) {
            // целевая позиция камеры из focusPoint
            let targetX = this.mapWidth / 2 - this.focusPoint.x
            let targetY = this.mapHeight / 2 - this.focusPoint.y

            // clamp ЦЕЛИ (ВАЖНО!)
            targetX = Math.max(this.minX, Math.min(this.maxX, targetX))
            targetY = Math.max(this.minY, Math.min(this.maxY, targetY))

            // движение строго по вектору (dx, dy)
            this.position.x += (targetX - this.position.x) * RETURN_LERP
            this.position.y += (targetY - this.position.y) * RETURN_LERP

            if (
                Math.abs(targetX - this.position.x) < FOCUS_EPSILON &&
                Math.abs(targetY - this.position.y) < FOCUS_EPSILON
            ) {
                this.position.set(targetX, targetY)
                this.isReturning = false
                this.idleTimer = 0
            }
        }

        // сбрасываем флаг активности каждый кадр
        this.inputActive = false
    }

    // ==================== POINTER ====================

    onPointerDown(e) {
        this.inputActive = true
        this.isDragging = true
        this.isReturning = false
        this.idleTimer = 0

        const p = this.toLocal(e.global)

        this.dragStart = {
            x: p.x,
            y: p.y,
            camX: this.position.x,
            camY: this.position.y
        }
    }

    onPointerMove(e) {
        this.inputActive = true

        if (this.isDragging && this.dragStart) {
            const p = this.toLocal(e.global)

            const dx = (p.x - this.dragStart.x) * DRAG_SENSITIVITY
            const dy = (p.y - this.dragStart.y) * DRAG_SENSITIVITY

            this.position.x = this.dragStart.camX - dx
            this.position.y = this.dragStart.camY - dy

            this.clampPosition()
            return
        }

        this.updateEdgePan(e.global)
    }

    onPointerUp() {
        this.isDragging = false
        this.dragStart = null
    }

    // ==================== EDGE PAN ====================

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

    // ==================== BOUNDS ====================

    calculateBounds() {
        const vw = this.screenWidth / this.scale.x
        const vh = this.screenHeight / this.scale.y

        const hw = this.mapWidth / 2
        const hh = this.mapHeight / 2

        this.minX = vw >= this.mapWidth ? 0 : vw / 2 - hw
        this.maxX = vw >= this.mapWidth ? 0 : hw - vw / 2

        this.minY = vh >= this.mapHeight ? 0 : vh / 2 - hh
        this.maxY = vh >= this.mapHeight ? 0 : hh - vh / 2
    }

    clampPosition() {
        this.position.x = Math.max(this.minX, Math.min(this.maxX, this.position.x))
        this.position.y = Math.max(this.minY, Math.min(this.maxY, this.position.y))
    }

    // ==================== API ====================

    setFocusPoint(x, y) {
        this.focusPoint.x = x
        this.focusPoint.y = y
    }
}