import { Container } from "pixi.js";
import { kill, tickerAdd, tickerRemove } from "../../../app/application";
import { sounds } from "../../../app/assets";
import { addSpark, showSparksShadow } from "../../../app/events";
import { soundPlay } from "../../../app/sound";
import { moveToTarget } from "../../../utils/functions";

const getSparksByPoints = ( points ) => {
    switch (points) {
        case 1 : return 2 /* dif biomes */
        case 2 : return 5 /* one on own biome */
        case 3 : return 12 /* both on own biomes */
        case 5 : return 30 /* magic used */
        default : return 1
    }
}

export default class ShineBall extends Container {
    constructor(startPoint, targetPoint, target, points = 0) {
        super()
        this.position.set(startPoint.x, startPoint.y)
        this.speed = 0.6
        this.acc = 1.012
        this.points = points
        this.sparks = getSparksByPoints(points)
        this.isSparkTime = false
        this.target = target
        this.targetPoint = targetPoint
        tickerAdd(this)

        soundPlay( points < 5 ? sounds.se_sparks_small : sounds.se_sparks_max )
        showSparksShadow(true)
    }

    tick(time) {
        const isReached = moveToTarget(this, this.targetPoint, this.speed * time.deltaMS)
        
        if (isReached) {
            this.target.useMagic(this.points)
            tickerRemove(this)
            showSparksShadow(false)
            kill(this)
            return
        }

        this.speed *= this.acc

        this.isSparkTime = !this.isSparkTime 
        if(!this.isSparkTime ) return

        for (let i = 0; i < this.sparks; i++) {
            addSpark({x: this.x, y: this.y, type: 'multi', isFast: true})
        }
    }
}