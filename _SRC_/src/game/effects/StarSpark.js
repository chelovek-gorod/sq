import { Sprite } from "pixi.js";
import { tickerAdd, kill } from "../../app/application";
import { atlases } from "../../app/assets";

const CEIL_HALF_SIZE = 120
const CEIL_SIZE = CEIL_HALF_SIZE * 2
const STAR = {
    scaleMin: 0.01,
    speedX: 0.02,
    speedY: 0.05,
    lifeTimeMin: 900,
    lifeTimeDelta: 900,
    alphaStep: 0.0006,
    scaleStep: 0.0003,
    rotationSpeed: 0.0003,
}

export default class StarSpark extends Sprite {
    constructor(x, y, type) {
        super( atlases.stars.textures[type] )
        this.anchor.set(0.5)
        const rx = -CEIL_HALF_SIZE + Math.random() * CEIL_SIZE
        const ry = -CEIL_HALF_SIZE + Math.random() * CEIL_SIZE
        this.position.set(x + rx , y + ry)

        this.scale.set( STAR.scaleMin )
        this.rotation = Math.PI * Math.random()
        this.rotationSpeed = STAR.rotationSpeed + Math.random() * STAR.rotationSpeed

        this.alpha = 0
        this.isUp = true

        this.speedX = this.position.x < x ? -STAR.speedX : STAR.speedX
        this.speedY = -STAR.speedY

        this.lifeTime = STAR.lifeTimeMin + Math.random() * STAR.lifeTimeDelta

        tickerAdd(this)
    }

    tick(time) {
        this.x += time.deltaMS * this.speedX
        this.y += time.deltaMS * this.speedY
        this.lifeTime -= time.deltaMS

        this.rotation += time.deltaMS * this.rotationSpeed
        
        if (this.lifeTime < 0) {
            if (this.alpha > 0) {
                this.alpha -= STAR.alphaStep * time.deltaMS
                this.scale.set( this.scale.x -= STAR.scaleStep * time.deltaMS )
            } else {
                kill(this)
            }
            return
        }

        if (this.isUp) {
            this.alpha += STAR.alphaStep * time.deltaMS
            this.scale.set( this.scale.x += STAR.scaleStep * time.deltaMS )
            if (this.alpha >= STAR.alphaMax) this.isUp = false
        } else {
            this.alpha -= STAR.alphaStep * time.deltaMS
            this.scale.set( this.scale.x -= STAR.scaleStep * time.deltaMS )
            if (this.alpha <= 0) this.isUp = true
        }
    }
}