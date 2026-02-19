import { Container, Sprite } from "pixi.js";
import { getAppScreen, kill, tickerAdd, tickerRemove } from "../../app/application";
import { EventHub, events } from "../../app/events";
import { atlases } from "../../app/assets";

function getRandom(min, max) {
    return min + (max - min) * Math.random()
}

const ffNames = ['blue', 'pink', 'blue']
let ffNameIndex = -1
function getFfName() {
    ffNameIndex = (ffNameIndex + 1) % ffNames.length
    return ffNames[ffNameIndex]
}

const FF_SPEED = 0.0003
const FF_FRICTION = 0.97
const FF_GRAVITY = 0.00003
const FF_MIN_SCALE = 0.2
const FF_MAX_SCALE = 0.5
const FF_MIN_TIMEOUT = 3600
const FF_MAX_TIMEOUT = 6000

// Только необходимые константы для масштабирования
const FF_MAX_EXPECTED_SPEED_SQ = 0.000064  // 0.008 * 0.008
const FF_SCALE_CHANGE_SPEED = 0.1
const SCALE_RANGE = FF_MAX_SCALE - FF_MIN_SCALE

class Firefly extends Sprite {
    constructor(minX, maxX, minY, maxY) {
        super(atlases.ui.textures[getFfName()])
        this.anchor.set(0.5)
        this.alpha = 1
        this.blendMode = 'screen'
        this.velocity = { x: 0, y: 0 }
        this.target = null
        this.targetTimeout = 0
        this.isTargetOtherFirefly = false
        this.centerX = (minX + maxX) * 0.5
        this.centerY = (minY + maxY) * 0.5
        this.resetScreen(minX, maxX, minY, maxY)
    }

    chooseTarget(allFireflies) {
        // Случайно выбираем тип цели (другой светлячок или точка на экране)
        this.isTargetOtherFirefly = Math.random() > 0.5
        
        if (this.isTargetOtherFirefly) {
            // Выбираем случайного светлячка как цель (кроме себя)
            const otherFireflies = allFireflies.filter(ff => ff !== this)
            if (otherFireflies.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherFireflies.length)
                this.target = otherFireflies[randomIndex]
            } else {
                this.target = null
                this.isTargetOtherFirefly = false
            }
        }
        
        if (!this.isTargetOtherFirefly || !this.target) {
            this.target = {
                position: {
                    x: getRandom(this.minX, this.maxX),
                    y: getRandom(this.minY, this.maxY)
                }
            }
        }
        
        this.targetTimeout = getRandom(FF_MIN_TIMEOUT, FF_MAX_TIMEOUT)
    }

    update(deltaMS, allFireflies) {
        this.targetTimeout -= deltaMS
        if (this.targetTimeout <= 0 || !this.target) {
            this.chooseTarget(allFireflies)
        }

        const x = this.position.x
        const y = this.position.y
        
        const isOutOfBounds = x < this.minX || x > this.maxX || y < this.minY || y > this.maxY

        let targetX, targetY
        
        if (isOutOfBounds) {
            targetX = this.centerX
            targetY = this.centerY
        } else if (this.target) {
            targetX = this.target.position.x
            targetY = this.target.position.y
        } else {
            return // Нет цели - не двигаемся
        }

        const dx = targetX - x
        const dy = targetY - y
        

        const distanceSq = dx * dx + dy * dy
    
        if (distanceSq > 1) { // Минимальное расстояние чтобы избежать деления на 0
            const invDistance = 1 / Math.sqrt(distanceSq)
            this.velocity.x += dx * invDistance * FF_SPEED * deltaMS
            this.velocity.y += dy * invDistance * FF_SPEED * deltaMS
        }

        this.velocity.x *= FF_FRICTION
        this.velocity.y *= FF_FRICTION
        this.velocity.y += FF_GRAVITY * deltaMS

        this.position.x += this.velocity.x * deltaMS
        this.position.y += this.velocity.y * deltaMS

        this.updateScale()
    }

    updateScale() {
        const speedSq = this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
        const normalizedSpeedSq = Math.min(speedSq / FF_MAX_EXPECTED_SPEED_SQ, 1)
        const targetScale = FF_MIN_SCALE + (1 - normalizedSpeedSq) * SCALE_RANGE
        
        this.scale.x += (targetScale - this.scale.x) * FF_SCALE_CHANGE_SPEED
        this.scale.y = this.scale.x
    }

    resetScreen(minX, maxX, minY, maxY) {
        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
        this.centerX = (minX + maxX) * 0.5
        this.centerY = (minY + maxY) * 0.5
    }
}

export default class FirefliesContainer extends Container {
    constructor() {
        super()
        this.minX = 0
        this.maxX = 0
        this.minY = 0
        this.maxY = 0
        this.fireflies = []

        this.screenResize(getAppScreen())
        
        const ffCount = Math.max(12, Math.ceil(this.maxX * this.maxY / 30000))
        for(let i = 0; i < ffCount; i++) {
            const ff = new Firefly(this.minX, this.maxX, this.minY, this.maxY)
            ff.position.set(
                getRandom(this.minX, this.maxX),
                getRandom(this.minY, this.maxY)
            )
            this.addChild(ff)
            this.fireflies.push(ff)
        }

        this.fireflies.forEach(ff => ff.chooseTarget(this.fireflies))

        EventHub.on(events.screenResize, this.screenResize, this)
        tickerAdd(this)
    }

    screenResize(screenData) {
        this.position.set(0, 0)
        this.minX = -screenData.centerX
        this.maxX = screenData.centerX
        this.minY = -screenData.centerY
        this.maxY = screenData.centerY
        
        this.fireflies.forEach(ff => ff.resetScreen(this.minX, this.maxX, this.minY, this.maxY))
    }

    tick(time) {
        this.fireflies.forEach(firefly => firefly.update(time.deltaMS, this.fireflies))
    }

    kill() {
        EventHub.off(events.screenResize, this.screenResize, this)

        tickerRemove(this)
    }
}