import { Container, Sprite } from "pixi.js"
import { kill, tickerAdd } from "../../../app/application"
import { atlases, sounds } from "../../../app/assets"
import { getTargetLock } from "../../../app/events"
import { soundPlay } from "../../../app/sound"
import { levelState, levelStateSetTarget, levelStateTargetAnimationAdd, levelStateTargetAnimationRemove } from "../../state";
import { TASK } from "../world/constants"
import { LOCKS_STATE, OBSTACLE } from "./constants"

export default class Lock extends Container {
    constructor( ceil ) {
        super()

        this.position.set(ceil.x, ceil.y)

        this.type = OBSTACLE.Lock
        this.ceil = ceil
        this.state = LOCKS_STATE.Lock

        this.verticalTime = 0
        this.verticalSpeed = 0.0012
        this.maxY = 0 
        this.minY = -20
        this.centerY = (this.maxY + this.minY) * 0.5
        this.verticalAmplitude = (this.maxY - this.minY) * 0.5
        this.baseX = 0
        this.baseY = this.centerY

        this.chainAngleTime = 0
        this.chainAmplitude = 0.5
        this.chainAngleSpeed = 0.0018

        this.shadow = new Sprite( atlases.units.textures.shadow )
        this.shadow.anchor.set(0.5, 0.85)
        this.shadow.scale.set(0.5)
        this.shadow.position.set(0, 55)
        this.addChild(this.shadow)

        this.imagesContainer = new Container()
        this.imagesContainer.position.set(this.baseX, this.baseY)
        this.addChild(this.imagesContainer)

        this.chainA = new Sprite( atlases.units.textures.lock_chain )
        this.chainA.anchor.set(0.2, 0.5)
        this.chainA.baseAngle = 2.5
        this.chainA.rotation = this.chainA.baseAngle
        this.chainA.position.set(-65, 65)

        this.chainB = new Sprite( atlases.units.textures.lock_chain )
        this.chainB.anchor.set(0.2, 0.5)
        this.chainB.baseAngle = 0.5
        this.chainB.rotation = this.chainB.baseAngle
        this.chainB.position.set(50, 70)

        this.chainC = new Sprite( atlases.units.textures.lock_chain )
        this.chainC.anchor.set(0.2, 0.5)
        this.chainC.baseAngle = 5.7
        this.chainC.rotation = this.chainC.baseAngle
        this.chainC.position.set(65, -25)

        this.chainD = new Sprite( atlases.units.textures.lock_chain )
        this.chainD.anchor.set(0.2, 0.5)
        this.chainD.baseAngle = 4
        this.chainD.rotation = this.chainD.baseAngle
        this.chainD.position.set(-70, -30)

        this.lock = new Sprite( atlases.units.textures.lock_place )
        this.lock.anchor.set(0.5)

        this.imagesContainer.addChild(this.chainA, this.chainB, this.chainC, this.chainD, this.lock)
        this.position.set(ceil.x, ceil.y)

        tickerAdd(this)
    }

    open() {
        this.state = LOCKS_STATE.Open
        if (levelState.type === TASK.LOCK) {
            levelStateTargetAnimationAdd()
            levelStateSetTarget()
            getTargetLock()
        }
        this.ceil.pet = null
        soundPlay(sounds.se_lock)
    }

    tick( time ) {
        this.chainAngleTime += this.chainAngleSpeed * time.deltaMS
        const sinChainValue = Math.sin(this.chainAngleTime) * this.chainAmplitude
        
        this.chainA.rotation = this.chainA.baseAngle + sinChainValue
        this.chainB.rotation = this.chainB.baseAngle + sinChainValue
        this.chainC.rotation = this.chainC.baseAngle + sinChainValue
        this.chainD.rotation = this.chainD.baseAngle + sinChainValue
        
        this.verticalTime += this.verticalSpeed * time.deltaMS
        const sinVerticalValue = Math.sin(this.verticalTime) // -1...1
        
        const verticalOffset = sinVerticalValue * this.verticalAmplitude
        this.imagesContainer.position.y = this.baseY + verticalOffset


        this.shadow.scale.set(0.6 - 0.1 * sinVerticalValue) // 0.5...0.7

        if (this.state === LOCKS_STATE.Open) {
            const disappearStep = time.deltaMS * 0.0006
            this.alpha -= disappearStep
            this.scale.set( this.scale.x + disappearStep )
            if (this.alpha < 0) {
                if (levelState.type === TASK.LOCK) levelStateTargetAnimationRemove()
                kill(this)
            }
        }
    }
}