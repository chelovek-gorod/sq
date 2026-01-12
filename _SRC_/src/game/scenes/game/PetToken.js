import { Container, Sprite } from "pixi.js";
import { tickerAdd, tickerRemove, kill } from "../../../app/application";
import { atlases, sounds } from "../../../app/assets";
import { addShineBall, dragging } from "../../../app/events";
import { soundPlay } from "../../../app/sound";
import StarSpark from "../../effects/StarSpark";
import { availablePetLevel } from "../../state";
import { LEVEL_PET, PET_DATA, PET_STATE, PLACE_PETS } from "./constants";

export default class PetToken extends Container {
    constructor(type, ceil) {
        super()

        this.type = type
        this.ceil = ceil
        this.isUpgraded = false
        this.isOtherPetShine = false

        this.isShining = PLACE_PETS[this.ceil.place].includes( LEVEL_PET[this.type] )
        

        this.eventMode = 'static'
        this.cursor = 'pointer'

        this.state = PET_STATE.EMPTY
        this.dragOffset = { x: 0, y: 0 }

        this.idleTimeout = Math.random() * 12000
        
        // Параметры анимации качания
        this.swingStep = 0
        this.swingDirection = 1
        this.swingProgress = 0
        this.swingSteps = 0
        this.swingSpeed = 0.001
        this.swingAmplitude = 0.05
        
        this.image = new Sprite(atlases.pets.textures[LEVEL_PET[this.type]])
        this.image.anchor.set(PET_DATA.anchor.x, PET_DATA.anchor.y)
        this.image.scale.set(PET_DATA.scale)
        this.addChild(this.image)

        this.on('pointerdown', this.onDragStart, this)
        this.on('pointerup', this.onDragEnd, this)
        this.on('pointerupoutside', this.onDragEnd, this)
        this.on('globalpointermove', this.onDragMove, this)

        this.position.set(ceil.x, ceil.y)

        tickerAdd(this)
    }

    startSwing(steps = 1) {
        if (this.state === PET_STATE.DRAGGING) return
        
        this.state = PET_STATE.IDLE
        this.swingStep = 0
        this.swingDirection = 1
        this.swingProgress = 0
        this.swingSteps = steps * 2
    }

    returnToNeutral() {
        if (Math.abs(this.rotation) < 0.001) {
            this.rotation = 0
            this.state = PET_STATE.EMPTY
            this.swingSteps = 0
            return
        }
        
        this.rotation *= 0.9
    }

    onDragStart(event) {
        if (this.state === PET_STATE.DRAGGING) return

        this.state = PET_STATE.DRAGGING
        this.swingSteps = 0
        
        const mousePos = event.getLocalPosition(this.parent)
        this.dragOffset.x = mousePos.x - this.x
        this.dragOffset.y = mousePos.y - this.y
        
        this.parent.addChild(this)

        soundPlay( sounds.se_start_drag )

        dragging({ pet: this, isDone: false })
    }

    onDragMove(event) {
        if (this.state !== PET_STATE.DRAGGING) return
        
        const mousePos = event.getLocalPosition(this.parent)
        this.x = mousePos.x - this.dragOffset.x
        this.y = mousePos.y - this.dragOffset.y

        dragging({ pet: this, isDone: false })
    }

    onDragEnd() {
        if (this.state !== PET_STATE.DRAGGING) return

        this.state = PET_STATE.EMPTY
        dragging({ pet: this, isDone: true })
    }

    returnToStart( isNormalBack = true ) {
        this.position.set(this.ceil.x, this.ceil.y)
        this.isShining = PLACE_PETS[this.ceil.place].includes( LEVEL_PET[this.type] )
        soundPlay( isNormalBack ? sounds.se_end_drag_home : sounds.se_error_move )
    }
    
    moveToCeil(ceil) {
        this.ceil.pet = null
        this.ceil = ceil
        this.ceil.pet = this
        this.position.set(this.ceil.x, this.ceil.y)

        if (this.isUpgraded) {
            addShineBall({
                globalPoint: this.getGlobalPosition(),
                points: 1 + +this.isOtherPetShine + +this.isShining
            })

            this.isUpgraded = false
            this.isOtherPetShine = false

            this.type++
            this.image.texture = atlases.pets.textures[LEVEL_PET[this.type]]

            soundPlay( sounds.se_line )

            if (this.type > availablePetLevel) {
                addShineBall({
                    globalPoint: this.getGlobalPosition(),
                    points: 2
                })
                this.ceil.pet = null
                kill(this)
                return
            }
        }

        this.isShining = PLACE_PETS[this.ceil.place].includes( LEVEL_PET[this.type] )
        if (this.isShining) {
            setTimeout( soundPlay, this.isUpgraded ? 600 : 0, sounds.se_starfall )
        }
    }

    upgrade(isOtherPetShine) {
        this.isUpgraded = true
        this.isOtherPetShine = isOtherPetShine
    }

    updateScale(isAdd, value) {
        if (isAdd) {
            this.image.scale.set(Math.min(PET_DATA.scaleDrag, this.image.scale.x + value))
        } else {
            this.image.scale.set(Math.max(PET_DATA.scale, this.image.scale.x - value))
        }
    }

    tick(time) {
        const delta = time.deltaMS

        if(this.isShining && Math.random() > 0.9) {
            this.addChild( new StarSpark(0, 0, this.ceil.place) )
        }
        
        switch(this.state) {
            case PET_STATE.DRAGGING:
                if (this.image.scale.x < PET_DATA.scaleDrag) {
                    this.updateScale(true, delta * PET_DATA.scaleSpeed)
                }
                this.rotation = 0
                break
            
            case PET_STATE.EMPTY:
                if (this.image.scale.x > PET_DATA.scale) {
                    this.updateScale(false, delta * PET_DATA.scaleSpeed)
                } else {
                    this.idleTimeout -= time.deltaMS
                    if (this.idleTimeout < 0) {
                        this.startSwing(2)
                        this.idleTimeout = 6000 + Math.random() * 6000
                    }
                }
                break
    
            case PET_STATE.IDLE:
                if (this.swingSteps > 0) {
                    this.swingProgress += this.swingSpeed * delta
                    
                    if (this.swingProgress >= 1) {
                        this.swingStep++
                        this.swingProgress = 0
                        this.swingDirection *= -1
                        
                        if (this.swingStep >= this.swingSteps) this.returnToNeutral()
                    }
                    
                    const angle = this.swingAmplitude * this.swingDirection
                    this.rotation = Math.sin(this.swingProgress * Math.PI) * angle
                } else {
                    this.returnToNeutral()
                }
                
                if (this.image.scale.x > PET_DATA.scale) {
                    this.updateScale(false, delta * PET_DATA.scaleSpeed)
                }
                break
        }
    }

    kill() {
        tickerRemove(this)
    }
}