import { Container, Sprite, Texture } from "pixi.js";
import { atlases } from "../../../app/assets";
import { world } from "../../state";
import { POINTS, POINT_COLORS } from "./constants";

export default class MapPoint extends Container {
    constructor( index ) { 
        super()

        this.position.set( POINTS[index].x, POINTS[index].y )
        console.log(this.x, this.y)

        this.index = index
        this.isAvailable = index < world.length

        const pointColor = this.isAvailable ? POINTS[index].color : POINT_COLORS.GRAY
        this.base = new Sprite( atlases.map_points.textures[pointColor] )
        this.base.anchor.set(0.5)
        this.addChild(this.base)

        this.face = new Sprite()
        this.face.anchor.set(0.5)
        this.addChild(this.face)

        if (this.isAvailable) this.updateFace()
    }

    updateFace() {
        if (!this.isAvailable) {
            this.isAvailable = true
            this.base.texture = atlases.map_points.textures[ POINTS[this.index].color ]
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
}