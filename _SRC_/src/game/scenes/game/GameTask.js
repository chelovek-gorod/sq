import { Container, Sprite, Text } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { showPopup } from "../../../app/events";
import { styles } from "../../../app/styles";
import { removeCursorPointer, setCursorPointer } from "../../../utils/functions";
import { POPUP_TYPE } from "../../popup/constants";
import { TASK } from "../world/constants";

const minScale = 1.0
const maxScale = 1.1
const scaleStep = 0.0006

const Y_TASK_CLOUD = 15
const Y_TASK_OTHER = 10
const Y_TURNS = 17
const Y_COUNT = 16

export default class GameTask extends Container {
    constructor(task) {
        super()

        this.task = {...task}

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

        setCursorPointer(this)
        this.on('pointerdown', this.click, this)
        this.on('pointerover', this.onHover, this)
        this.on('pointerout', this.onOut, this)

        setTimeout( () => showPopup( {type: POPUP_TYPE.TASK, data: this.task} ), 0 )
    }

    click() {
        showPopup( {type: POPUP_TYPE.TASK, data: this.task} )
    }

    onHover() {
        if (this.isOnHover) return

        this.isOnHover = true
        tickerAdd(this)
    }

    onOut() {
        if (!this.isOnHover) return

        this.isOnHover = false
        tickerAdd(this)
    }

    tick(time) {
        const scaleAdd = scaleStep * time.deltaMS
        if (this.isOnHover) {
            this.scale.set( Math.min(maxScale, this.scale.x + scaleAdd) )
            if (this.scale.x === maxScale) tickerRemove(this)
        } else {
            this.scale.set( Math.max(minScale, this.scale.x - scaleAdd) )
            if (this.scale.x === minScale) tickerRemove(this)
        }
    }

    kill() {
        tickerRemove(this)
        removeCursorPointer(this)
        this.off('pointerdown', this.click, this)
        this.off('pointerover', this.onHover, this)
        this.off('pointerout', this.onOut, this)
    }
}