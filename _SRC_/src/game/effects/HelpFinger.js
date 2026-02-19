import { Sprite } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../app/application";
import { images } from "../../app/assets";
import { EventHub, events } from "../../app/events";
import { createEnum, moveToTarget } from "../../utils/functions";

const FINGER_STATE = createEnum(['DOWN', 'TO_TARGET', 'UP', 'TO_START', 'HIDDEN'])

const SCALE_UP_SPEED = 0.0003
const SCALE_DOWN_SPEED = 0.0006
const SCALE_LEVEL_MIN = 0.8
const SCALE_LEVEL_MAX = 1.0
const SCALE_WORLD_MIN = 0.4
const SCALE_WORLD_MAX = 0.5
const MOVE_SPEED = 0.5
const BACK_SPEED = 0.9

export default class HelpFinger extends Sprite {
    constructor(x = null, y = null) {
        super( images.finger )
        this.anchor.set(0.12, 0.13)
        this.startPoint = {x: 0, y: 0}
        this.targetPoint = null

        this.eventMode = 'none'

        this.state = FINGER_STATE.HIDDEN
        this.visible = false

        EventHub.on( events.helpShow, this.show, this )
        EventHub.on( events.helpHide, this.hide, this )

        if (x && y) setTimeout( () => this.help(x, y), 0 )
    }

    help(x, y, merge_x = null, merge_y = null) {
        this.startPoint = {x: x, y: y}
        this.targetPoint = merge_x && merge_y ? {x: merge_x, y: merge_y} : null
        this.scale.set(1)
        this.position.set(x, y)
        this.state = FINGER_STATE.DOWN
        this.scaleMin = this.targetPoint ? SCALE_LEVEL_MIN : SCALE_WORLD_MIN
        this.scaleMax = this.targetPoint ? SCALE_LEVEL_MAX : SCALE_WORLD_MAX
        this.scale.set(this.scaleMax)
        tickerAdd(this)
        this.visible = true
    }

    hide() {
        tickerRemove(this)
        this.state = FINGER_STATE.HIDDEN
        this.visible = false
    }

    show() {
        const x = this.startPoint.x
        const y = this.startPoint.y
        const merge_x = this.targetPoint ? this.targetPoint.x : null
        const merge_y = this.targetPoint ? this.targetPoint.y : null
        this.help(x, y, merge_x, merge_y)
    }

    tick(time) {
        if (this.state === FINGER_STATE.DOWN) {
            this.scale.set(
                Math.max(this.scaleMin, this.scale.x - SCALE_DOWN_SPEED * time.deltaMS )
            )
            if (this.scale.x === this.scaleMin) {
                this.state = this.targetPoint ? FINGER_STATE.TO_TARGET : FINGER_STATE.UP
            }
            return
        }

        if (this.state === FINGER_STATE.TO_TARGET) {
            if ( moveToTarget(this, this.targetPoint, MOVE_SPEED * time.deltaMS) ) {
                this.state = FINGER_STATE.UP
            }
            return
        }

        if (this.state === FINGER_STATE.UP) {
            this.scale.set(
                Math.min(this.scaleMax, this.scale.x + SCALE_UP_SPEED * time.deltaMS )
            )
            if (this.scale.x === this.scaleMax) {
                this.state = this.targetPoint ? FINGER_STATE.TO_START : FINGER_STATE.DOWN
            }
            return
        }

        if (this.state === FINGER_STATE.TO_START) {
            if ( moveToTarget(this, this.startPoint, BACK_SPEED * time.deltaMS) ) {
                this.state = FINGER_STATE.DOWN
            }
            return
        }
    }

    kill() {
        EventHub.off( events.helpShow, this.show, this )
        EventHub.off( events.helpHide, this.hide, this )
    }
}