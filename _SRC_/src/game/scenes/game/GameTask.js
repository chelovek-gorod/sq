import { Container, Sprite, Text } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases, sounds } from "../../../app/assets";
import { EventHub, events, levelDone, showPopup } from "../../../app/events";
import { soundPlay } from "../../../app/sound";
import { styles } from "../../../app/styles";
import { removeCursorPointer, setCursorPointer } from "../../../utils/functions";
import { POPUP_TYPE } from "../../popup/constants";
import { addAvailablePetLevel, getWorldPointDataByLevelIndex } from "../../state";
import { TASK } from "../world/constants";
import { DONE_AWAIT_TIMEOUT } from "./constants";

const minScale = 1.0
const maxScale = 1.1
const scaleStep = 0.0006

const Y_TASK_CLOUD = 15
const Y_TASK_OTHER = 10
const Y_TURNS = 17
const Y_COUNT = 16

export default class GameTask extends Container {
    constructor(task, levelIndex) {
        super()

        this.isDone = false
        this.isTurns = true
        this.isNeedCheckDoneAgain = true
        this.doneCheckTime = DONE_AWAIT_TIMEOUT

        const pointLevels = getWorldPointDataByLevelIndex(levelIndex)
        const isLastLevel = +pointLevels[0] + +pointLevels[1] + +pointLevels[2] === 2
        // {type: TASK.NEW, value: 0, turns: 0}
        this.task = {...task, isLastLevel: isLastLevel}

        this.taskIcon = new Sprite( atlases.task.textures[task.type] )
        this.taskIcon.anchor.set(task.type === TASK.NEW ? 0.5: 1, 0)
        this.taskIcon.scale.set(0.22)
        this.addChild(this.taskIcon)

        this.taskCount = task.type === TASK.NEW
            ? null
            : new Text({text: task.value, style: styles.taskCount})
        if (this.taskCount) this.addChild(this.taskCount)

        this.turnsIcon = task.turns === 0
            ? null
            : new Sprite( atlases.task.textures[TASK.TIME] )
        if (this.turnsIcon) {
            this.turnsIcon.anchor.set(1, 0)
            this.turnsIcon.scale.set(0.2)
            this.addChild(this.turnsIcon)
        }

        this.turnsCount = task.turns === 0
            ? null
            : new Text({text: task.turns, style: styles.taskCount})
        if (this.turnsCount) this.addChild(this.turnsCount)

        // set positions
        this.taskIcon.y += TASK.CLOUD ? Y_TASK_CLOUD : Y_TASK_OTHER
        if (task.turns) {
            // turns
            if (task.type === TASK.NEW) {
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
        }

        this.isOnHover = false
        this.isHoverUsed = false

        setCursorPointer(this)
        this.on('pointerdown', this.click, this)
        this.on('pointerover', this.onHover, this)
        this.on('pointerout', this.onOut, this)

        // {type: TASK.NEW, value: 2, turns: 12, levelIndex: 0, doneTasksCount, isLastLevel}
        if (this.task.type === TASK.NEW) EventHub.on( events.getTargetPet, this.getTargetPet, this )
        if (this.task.type === TASK.LOCK) EventHub.on( events.getTargetLock, this.getTargetLock, this )
        if (this.task.type === TASK.CLOUD) EventHub.on( events.getTargetCloud, this.getTargetCloud, this )
        EventHub.on( events.getTargetTurn, this.getTargetTurn, this )

        setTimeout( () => showPopup( {type: POPUP_TYPE.TASK, data: this.task} ), 0 )
        tickerAdd(this)
    }

    click() {
        soundPlay(sounds.se_click)
        showPopup( {type: POPUP_TYPE.TASK, data: this.task} )
    }

    onHover() {
        if (this.isOnHover) return

        this.isOnHover = true
        this.isHoverUsed = true
        soundPlay(sounds.se_task_hover)
    }

    onOut() {
        if (!this.isOnHover) return

        this.isOnHover = false
        this.isHoverUsed = true
    }

    // {type: TASK.NEW, value: 2, turns: 12, levelIndex: 0, doneTasksCount, isLastLevel}
    getTargetPet() {
        let petLevel = addAvailablePetLevel()
        if ( petLevel > 0 ) showPopup( {type: POPUP_TYPE.NEW, data: petLevel} )
        if ( this.task.isLastLevel ) {
            petLevel = addAvailablePetLevel()
            if ( petLevel > 0 ) showPopup( {type: POPUP_TYPE.NEW, data: petLevel} )
        }

        levelDone( true )
        this.isDone = true
    }
    getTargetLock() {
        this.task.value--
        this.taskCount.text = this.task.value
        if (this.task.value > 0) return

        if ( this.task.isLastLevel ) {
            petLevel = addAvailablePetLevel()
            if ( petLevel > 0 ) showPopup( {type: POPUP_TYPE.NEW, data: petLevel} )
        }

        levelDone( true )
        this.isDone = true
    }
    getTargetCloud() {
        this.task.value--
        this.taskCount.text = this.task.value
        if (this.task.value > 0) return

        if ( this.task.isLastLevel ) {
            petLevel = addAvailablePetLevel()
            if ( petLevel > 0 ) showPopup( {type: POPUP_TYPE.NEW, data: petLevel} )
        }

        levelDone( true )
        this.isDone = true
    }
    getTargetTurn() {
        if (!this.turnsCount) return

        this.task.turns--
        this.turnsCount.text = this.task.turns
        if (this.task.turns > 0) return

        levelDone( false )
        this.isTurns = false
    }

    checkDone() { 
        if (this.parent.field.effects.children.length) return

        if (this.isDone) {
            showPopup({type: POPUP_TYPE.RESULT, data: this.isDone})
            tickerRemove(this)
            return
        }


        if (this.isTurns && this.parent.field.checkAvailablePetsMerge()) return

        if (this.isNeedCheckDoneAgain) {
            this.isNeedCheckDoneAgain = false
            return
        }

        levelDone(false)
        this.checkDoneTimeout = setTimeout( () => 
            showPopup({type: POPUP_TYPE.RESULT, data: this.task.isDone}),
            tickerRemove(this)
        )
    }

    tick(time) {
        this.doneCheckTime -= time.deltaMS
        if (this.doneCheckTime < 0) {
            this.doneCheckTime = DONE_AWAIT_TIMEOUT
            this.checkDone()
        }

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

        if (this.task.type === TASK.NEW) EventHub.off( events.getTargetPet, this.getTargetPet, this )
        if (this.task.type === TASK.LOCK) EventHub.off( events.getTargetLock, this.getTargetLock, this )
        if (this.task.type === TASK.CLOUD) EventHub.off( events.getTargetCloud, this.getTargetCloud, this )
        EventHub.off( events.getTargetTurn, this.getTargetTurn, this )
    }
}