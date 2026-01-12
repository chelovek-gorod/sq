import { Container, Sprite } from "pixi.js";
import { tickerAdd } from "../../../app/application";
import { atlases } from "../../../app/assets";
import StarSpark from "../../effects/StarSpark";
import { PLACE } from "./constants";

const types = Object.keys(PLACE)
let index = -1
const maxIndex = types.length
function getSparkType() {
    index++
    if (index === maxIndex) index = 0
    return types[index]
}

export default class ShineBar extends Container {
    constructor( level = 0 ) {
        super()

        this.level = level

        this.base = new Sprite( atlases.shine_ui.textures.base )
        this.yellow = new Sprite( atlases.shine_ui.textures["0"] )
        this.purple = new Sprite( atlases.shine_ui.textures["0"] )
        this.purple.alpha = 0
        this.sparks = new Container()
        this.sparks.scale.set(0.5)
        this.sparks.position.set(60, 90)
        this.addChild(this.base, this.yellow, this.purple, this.sparks)

        this.isUpPurple = true
        this.alphaStep = 1 / 2400

        tickerAdd(this)
    }

    useMagic( points = 1 ) {
        this.level += points
        if (this.level >= 10) {
            this.level -= 10
            this.parent.addShineBall({color: null})
        }

        if (this.level === 0) {
            this.yellow.texture = atlases.shine_ui.textures["0"]
            this.purple.texture = atlases.shine_ui.textures["0"]
        } else {
            this.yellow.texture = atlases.shine_ui.textures[this.level + "Y"]
            this.purple.texture = atlases.shine_ui.textures[this.level + "P"]
        }
    }

    tick(time) {
        if (Math.random() > 0.9) this.sparks.addChild( new StarSpark(0, 0, getSparkType()) )

        if (this.level === 0) return

        const alphaStep = this.alphaStep * time.deltaMS
        if (this.isUpPurple) {
            this.purple.alpha = Math.min(1, this.purple.alpha + alphaStep)
            if (this.purple.alpha === 1) this.isUpPurple = false
        } else {
            this.purple.alpha = Math.max(0, this.purple.alpha - alphaStep)
            if (this.purple.alpha === 0) this.isUpPurple = true
        }
    }
}