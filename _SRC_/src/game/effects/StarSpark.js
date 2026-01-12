import { Sprite } from "pixi.js";
import { tickerAdd, kill } from "../../app/application";
import { atlases } from "../../app/assets";

const CEIL_HALF_SIZE = 120
const CEIL_SIZE = CEIL_HALF_SIZE * 2
const STAR = {
    scaleMin: 0.01,
    speedX: 0.01,
    speedY: 0.05,
    lifeTimeMin: 900,
    lifeTimeDelta: 900,
    alphaStep: 0.0006,
    scaleStep: 0.0003,
    rotationSpeed: 0.0003,
}

export default class StarSpark extends Sprite {
    constructor(x, y, type, isFast = false) {
        super( atlases.stars.textures[type] )
        this.anchor.set(0.5)
        const rx = -CEIL_HALF_SIZE + Math.random() * CEIL_SIZE
        const ry = -CEIL_HALF_SIZE + Math.random() * CEIL_SIZE
        this.position.set(x + (isFast ? rx * 0.5 : rx), y + (isFast ? ry * 0.5 : ry))

        this.scale.set( isFast ? STAR.scaleMin * 0.5 : STAR.scaleMin )
        this.rotation = Math.PI * Math.random()
        this.rotationSpeed = STAR.rotationSpeed + Math.random() * STAR.rotationSpeed

        this.alpha = 0
        this.alphaStep = isFast ? STAR.alphaStep * 3 : STAR.alphaStep
        this.isUp = true
        this.scaleStep = isFast ? STAR.scaleStep * 1.2 : STAR.scaleStep

        this.speedX = isFast ? 0 : this.position.x < x ? -STAR.speedX : STAR.speedX
        this.speedY = isFast ? 0 : -STAR.speedY

        this.lifeTime = isFast ? STAR.lifeTimeMin * 0.7 : STAR.lifeTimeMin + Math.random() * STAR.lifeTimeDelta

        tickerAdd(this)
    }

    tick(time) {
        this.x += time.deltaMS * this.speedX
        this.y += time.deltaMS * this.speedY
        this.lifeTime -= time.deltaMS

        this.rotation += time.deltaMS * this.rotationSpeed
        
        if (this.lifeTime < 0) {
            if (this.alpha > 0) {
                this.alpha -= this.alphaStep * time.deltaMS
                this.scale.set( this.scale.x -= this.scaleStep * time.deltaMS )
            } else {
                kill(this)
            }
            return
        }

        if (this.isUp) {
            this.alpha += this.alphaStep * time.deltaMS
            this.scale.set( this.scale.x += this.scaleStep * time.deltaMS )
            if (this.alpha >= STAR.alphaMax) this.isUp = false
        } else {
            this.alpha -= this.alphaStep * time.deltaMS
            this.scale.set( this.scale.x -= this.scaleStep * time.deltaMS )
            if (this.alpha <= 0) this.isUp = true
        }
    }
}