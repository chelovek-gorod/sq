import { Sprite } from "pixi.js";
import { atlases } from "../../../app/assets";

export default class MapDot extends Sprite {
    constructor(i) {
        super( atlases.map_dots.textures[i] )
        this.anchor.set(0.5)
    }
}