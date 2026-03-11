import { Container, Sprite, Text, Rectangle } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases, sounds } from "../../../app/assets";
import { EventHub, events, blockDragging, levelDone, showPopup, helpHide } from "../../../app/events";
import { soundPlay } from "../../../app/sound";
import { styles } from "../../../app/styles";
import { createEnum, removeCursorPointer, setCursorPointer } from "../../../utils/functions";
import { POPUP_TYPE } from "../../popup/constants";
import { isLevelFree, levelState, addAvailablePetLevel } from "../../state";
import { TASK } from "../world/constants";

const minScale = 1.0
const maxScale = 1.1
const scaleStep = 0.0006

const Y_TASK_CLOUD = 15
const Y_TASK_OTHER = 10
const Y_TURNS = 17
const Y_COUNT = 16

export default class LevelTask extends Container {
    constructor() {
        super()

        this.isDone = false // is complete message shown
        this.isOnAwaitResult = false // used in ticker

        const mainIcon = isLevelFree ? 'task_FREE' : levelState.type.toLowerCase()
        this.taskIcon = new Sprite( atlases.ui.textures[mainIcon] )
        this.taskIcon.anchor.set(levelState.type === TASK.NEW ? 0.5: 1, 0)
        this.taskIcon.scale.set(0.22)
        this.addChild(this.taskIcon)

        this.taskCount = levelState.type === TASK.NEW || isLevelFree
            ? null
            : new Text({text: levelState.targets, style: styles.taskCount})
        if (this.taskCount) this.addChild(this.taskCount)

        this.turnsIcon = levelState.turns === Infinity
            ? null
            : new Sprite( atlases.ui.textures[TASK.TIME.toLowerCase()] )
        if (this.turnsIcon) {
            this.turnsIcon.anchor.set(1, 0)
            this.turnsIcon.scale.set(0.2)
            this.addChild(this.turnsIcon)
        }

        this.turnsCount = levelState.turns === Infinity
            ? null
            : new Text({text: levelState.turns, style: styles.taskCount})
        if (this.turnsCount) this.addChild(this.turnsCount)

        // set positions
        this.taskIcon.y += TASK.CLOUD ? Y_TASK_CLOUD : Y_TASK_OTHER
        if (levelState.turns < Infinity) {
            // turns
            if (levelState.type === TASK.NEW) {
                //  ?   T 12
                this.taskIcon.x -= 35

                this.turnsIcon.x += 50
                this.turnsCount.x += 35

                this.turnsIcon.y += Y_TURNS
                this.turnsCount.y += Y_COUNT
            } else {
                // SS 12  T 12
                this.taskIcon.x -= 20
                this.taskCount.x -= 25

                this.turnsIcon.x += 65
                this.turnsCount.x += 50

                this.turnsIcon.y += Y_TURNS
                this.taskCount.y += Y_COUNT
                this.turnsCount.y += Y_COUNT
            }
        } else if (this.taskCount) {
            // SS 12
            this.taskIcon.x += 20
            this.taskCount.x += 15

            this.taskCount.y += Y_COUNT
        } else {
            //  ?
            this.taskIcon.x += 5
            if (isLevelFree) {
                this.taskIcon.x += 100
                this.taskIcon.y -= 50
                this.hitArea = new Rectangle(-42, 10, 120, 60)
                //this.addChild( new Graphics().rect(-42, 10, 120, 60).fill(0x00ff00) )
            }
        }

        this.isOnHover = false
        this.isHoverUsed = false

        setCursorPointer(this)
        this.on('pointerdown', this.click, this)
        this.on('pointerover', this.onHover, this)
        this.on('pointerout', this.onOut, this)

        if (levelState.type === TASK.NEW) EventHub.on( events.getTargetPet, this.getTargetPet, this )
        if (levelState.type === TASK.LOCK) EventHub.on( events.getTargetLock, this.getTargetLock, this )
        if (levelState.type === TASK.CLOUD) EventHub.on( events.getTargetCloud, this.getTargetCloud, this )
        EventHub.on( events.getPlayerTurn, this.getPlayerTurn, this )

        setTimeout( () => showPopup( {type: POPUP_TYPE.TASK, data: null} ), 0 )
        tickerAdd(this)
    }

    click() {
        if (this.isDone) return
        soundPlay(sounds.se_click)
        showPopup( {type: POPUP_TYPE.TASK, data: null} )
    }

    onHover() {
        if (this.isOnHover || this.isDone) return

        this.isOnHover = true
        this.isHoverUsed = true
        soundPlay(sounds.se_task_hover)
    }

    onOut() {
        if (!this.isOnHover) return

        this.isOnHover = false
        this.isHoverUsed = true
    }

    targetDone() {
        this.isOnAwaitResult = false
        tickerRemove(this)
        if (this.isDone && levelState.isLastLevel) this.messageNewPet()
        showPopup({type: POPUP_TYPE.RESULT, data: this.isDone})
        levelDone( this.isDone )
    }

    messageNewPet() {
        const petLevel = addAvailablePetLevel()
        if ( petLevel > 0 ) showPopup( {type: POPUP_TYPE.NEW, data: petLevel} )
    }

    getTargetPet() {
        if(this.isDone) return

        this.isDone = true
        helpHide()
        blockDragging()
        this.messageNewPet()
        this.targetDone()
    }
    
    getTargetLock() {
        if(this.isDone) return

        this.taskCount.text = levelState.targets
        if (levelState.targets === 0) {
            blockDragging()
            this.isDone = true
            helpHide()
            this.isOnAwaitResult = true
        }
    }

    getTargetCloud() {
        if(this.isDone) return
        
        this.taskCount.text = levelState.targets
        if (levelState.targets === 0) {
            blockDragging()
            this.isDone = true
            this.isOnAwaitResult = true
        }
    }
    
    getPlayerTurn() {
        if(this.isDone) return

        if (this.turnsCount) this.turnsCount.text = levelState.turns

        this.isOnAwaitResult = true
    }

    checkResult() {
        /* levelState = {
            type: null, // "CLOUD", "LOCK", "NEW", "FREE"
            turns: Infinity, // 0-999
            targets: 0, // "CLOUD" or "LOCK" target
            targetAnimations: 0, // "CLOUD" or "LOCK"
            sparks: 0, // count of sparks launched
            isLastLevel: false,
            isTaskDone: false,
        } */

        // await when all effects completed
        if (levelState.targetAnimations || levelState.sparks) return

        // target is already reached
        if (this.isDone || levelState.turns === 0) return this.targetDone()

        // FREE
        if (this.parent.field.checkLevelCleared()) this.isDone = true

        // if player can't merge
        const isMergeAvailable = this.parent.field.checkAvailablePetsMerge()
        if ( !isMergeAvailable ) return this.targetDone()
        
        // stop checking
        this.isOnAwaitResult = false
    }

    tick(time) {
        if (this.isOnAwaitResult) this.checkResult()

        if (!this.isHoverUsed) return

        const scaleAdd = scaleStep * time.deltaMS
        if (this.isOnHover) {
            this.scale.set( Math.min(maxScale, this.scale.x + scaleAdd) )
            if (this.scale.x === maxScale) this.isHoverUsed = false
        } else {
            this.scale.set( Math.max(minScale, this.scale.x - scaleAdd) )
            if (this.scale.x === minScale) this.isHoverUsed = false
        }
    }

    kill() {
        tickerRemove(this)

        removeCursorPointer(this)
        this.off('pointerdown', this.click, this)
        this.off('pointerover', this.onHover, this)
        this.off('pointerout', this.onOut, this)

        if (levelState.type === TASK.NEW) EventHub.off( events.getTargetPet, this.getTargetPet, this )
        if (levelState.type === TASK.LOCK) EventHub.off( events.getTargetLock, this.getTargetLock, this )
        if (levelState.type === TASK.CLOUD) EventHub.off( events.getTargetCloud, this.getTargetCloud, this )
        EventHub.off( events.getPlayerTurn, this.getPlayerTurn, this )
    }
}