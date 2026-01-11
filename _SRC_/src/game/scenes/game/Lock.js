import { Container, Sprite } from "pixi.js"
import { tickerAdd } from "../../../app/application"
import { images } from "../../../app/assets"
import { OBSTACLE } from "./constants"


export default class Lock extends Container {
    constructor( ceil ) {
        super()

        this.type = OBSTACLE.Lock
        this.ceil = ceil

        this.verticalTime = 0
        this.verticalSpeed = 0.0012
        this.maxY = 20 
        this.minY = 0
        this.centerY = (this.maxY + this.minY) * 0.5
        this.verticalAmplitude = (this.maxY - this.minY) * 0.5
        this.baseX = ceil.x
        this.baseY = ceil.y + this.centerY
        this.position.set(this.baseX, this.baseY)

        this.chainAngleTime = 0
        this.chainAmplitude = 0.5
        this.chainAngleSpeed = 0.0018

        this.chainA = new Sprite( images.lock_chain )
        this.chainA.anchor.set(0.2, 0.5)
        this.chainA.baseAngle = 2.5
        this.chainA.rotation = this.chainA.baseAngle
        this.chainA.position.set(-65, 65)

        this.chainB = new Sprite( images.lock_chain )
        this.chainB.anchor.set(0.2, 0.5)
        this.chainB.baseAngle = 0.5
        this.chainB.rotation = this.chainB.baseAngle
        this.chainB.position.set(50, 70)

        this.chainC = new Sprite( images.lock_chain )
        this.chainC.anchor.set(0.2, 0.5)
        this.chainC.baseAngle = 5.7
        this.chainC.rotation = this.chainC.baseAngle
        this.chainC.position.set(65, -25)

        this.chainD = new Sprite( images.lock_chain )
        this.chainD.anchor.set(0.2, 0.5)
        this.chainD.baseAngle = 4
        this.chainD.rotation = this.chainD.baseAngle
        this.chainD.position.set(-70, -30)

        this.lock = new Sprite( images.lock_place )
        this.lock.anchor.set(0.5)

        this.addChild(this.chainA, this.chainB, this.chainC, this.chainD, this.lock)
        this.position.set(ceil.x, ceil.y)

        tickerAdd(this)
    }

    tick( time ) {
        this.chainAngleTime += this.chainAngleSpeed * time.deltaMS
        const sinChainValue = Math.sin(this.chainAngleTime) * this.chainAmplitude
        
        this.chainA.rotation = this.chainA.baseAngle + sinChainValue
        this.chainB.rotation = this.chainB.baseAngle + sinChainValue
        this.chainC.rotation = this.chainC.baseAngle + sinChainValue
        this.chainD.rotation = this.chainD.baseAngle + sinChainValue
        
        this.verticalTime += this.verticalSpeed * time.deltaMS
        const sinVerticalValue = Math.sin(this.verticalTime)
        
        const verticalOffset = sinVerticalValue * this.verticalAmplitude
        this.position.y = this.baseY + verticalOffset
    }
}