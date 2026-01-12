import { Container } from "pixi.js";
import { kill, tickerAdd, tickerRemove } from "../../../app/application";
import { moveToTarget } from "../../../utils/functions";
import StarSpark from "../../effects/StarSpark";
import { PLACE } from "./constants";

const types = Object.keys(PLACE)
const maxIndex = types.length
let index = 0
function getSparkType() {
    index++
    if (index === maxIndex) index = 0
    return types[index]
}

export default class ShineBall extends Container {
    constructor(startPoint, targetPoint, target, points = 0) {
        super()
        this.position.set(startPoint.x, startPoint.y)
        this.speed = 0.6
        this.acc = 1.012
        this.scale.set(0.5)
        this.points = points
        this.sparks = points > 0 ? points * points : 50
        this.isSparkTime = false
        this.target = target
        this.targetPoint = targetPoint
        tickerAdd(this)
    }

    tick(time) {
        const isReached = moveToTarget(this, this.targetPoint, this.speed * time.deltaMS)
        this.speed *= this.acc
        if (isReached) {
            this.target.useMagic(this.points)
            tickerRemove(this)
            kill(this)
            return
        }

        this.isSparkTime = !this.isSparkTime 
        if(!this.isSparkTime ) return

        for (let i = 0; i < this.sparks; i++) {
            this.parent.addChild( new StarSpark(this.x, this.y, getSparkType(), true) )
        }
    }
}