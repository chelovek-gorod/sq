import { Container, Sprite, Texture } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { showLevelCards } from "../../../app/events";
import { removeCursorPointer, setCursorPointer } from "../../../utils/functions";
import { world } from "../../state";
import { POINTS, POINT_COLORS } from "./constants";

const minScale = 1.0
const maxScale = 1.1
const scaleStep = 0.0006

export default class MapPoint extends Container {
    constructor( index ) { 
        super()

        this.position.set( POINTS[index].x, POINTS[index].y )
        this.scale.set( minScale )

        this.isOnHover = false

        this.index = index
        this.isAvailable = false

        const pointColor = index < world.length ? POINTS[index].color : POINT_COLORS.GRAY
        this.base = new Sprite( atlases.map_points.textures[pointColor] )
        this.base.anchor.set(0.5)
        this.addChild(this.base)

        this.face = new Sprite()
        this.face.anchor.set(0.5)
        this.addChild(this.face)

        if (index < world.length) this.updateFace()
    }

    updateFace() {
        let doneCount = 0
        const tasks = world[this.index]
        for(let i = 0; i < 3; i++) {
            if (tasks[i]) doneCount++
        }

        if (doneCount < 3) {
            this.isAvailable = true
            setCursorPointer(this)
            this.on('pointerdown', this.click, this)
            this.on('pointerover', this.onHover, this)
            this.on('pointerout', this.onOut, this)
        }

        if (doneCount > 0) {
            this.face.texture = atlases.map_points.textures['stars_' + doneCount]
        }
    }

    click() {
        showLevelCards( this.index )
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

        if (this.isAvailable) {
            removeCursorPointer(this)
            this.off('pointerdown', this.click, this)
            this.off('pointerover', this.onHover, this)
            this.off('pointerout', this.onOut, this)
        }
    }
}