import { Container, Sprite, Texture } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { showLevelCards, startScene } from "../../../app/events";
import { removeCursorPointer, setCursorPointer } from "../../../utils/functions";
import { world } from "../../state";
import { SCENE_NAME } from "../constants";
import { POINTS, POINT_COLORS } from "./constants";

const minScale = 1.0
const maxScale = 1.1
const scaleStep = 0.0006

export default class MapPoint extends Container {
    constructor( index ) { 
        super()

        this.position.set( POINTS[index].x, POINTS[index].y )
        this.scale.set(minScale)

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
        if (!this.isAvailable) {
            this.isAvailable = true
            this.base.texture = atlases.map_points.textures[ POINTS[this.index].color ]

            setCursorPointer(this)
            this.on('pointerdown', this.click, this)
            this.on('pointerover', this.onHover, this)
            this.on('pointerout', this.onOut, this)
        }

        //  don counters 0  1  2  - сколько не выполненных, сколько выполненных, сколько выпон. с полн. колексц.
        const doneArr = [0, 0, 0]
        const tasks = world[this.index].length
        for(let i = tasks - 1; i >= 0; i--) doneArr[ world[this.index][i] ]++

        if (doneArr[0] === tasks) this.face.texture = Texture.EMPTY
        else if (doneArr[2] === tasks) this.face.texture = atlases.map_points.textures.stars_3
        else if (doneArr[1] + doneArr[2] === tasks) this.face.texture = atlases.map_points.textures.stars_2
        else this.face.texture = atlases.map_points.textures.stars_1
    }

    click() {
        showLevelCards( this.index )
        // startScene( SCENE_NAME.Game )
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