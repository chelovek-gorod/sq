import { Sprite } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { getRRTexture } from "../../../utils/textureGenerator";
import { CEIL_DATA, OBSTACLE } from "./constants";

export default class FieldCeil extends Sprite {
    constructor(x, y, place) {
        super( atlases.places.textures[place] )
        this.anchor.set(0.5)
        this.position.set(x, y)
        this.alpha = CEIL_DATA.alpha
        this.scale.set(CEIL_DATA.scale)

        this.place = place

        // nearestCeils add in GameField.js
        // this.nearestCeils = [] 

        this.pet = null
    }

    checkAvailable(type) {
        return (this.pet === null || type === this.pet.type)
    }

    checkClouds() {
        if (!this.pet || this.pet.type !== OBSTACLE.Clouds) return

        // разгоняем облака
        this.pet.clearClouds()
    }

    highlightOn() {
        tickerAdd(this)
    }

    tick(time){
        const scaleStep = CEIL_DATA.highlightScaleStep * time.deltaMS
        const alphaStep = CEIL_DATA.highlightAlphaStep * time.deltaMS

        const isHighlight = this.parent.parent.closestDragCeil === this

        if (isHighlight) {
            if (this.scale.x === CEIL_DATA.highlightScale) return

            this.scale.set( Math.min(CEIL_DATA.highlightScale, this.scale.x + scaleStep) )
            this.alpha = Math.min(CEIL_DATA.highlightAlpha, this.alpha + alphaStep)
            if (this.scale.x === CEIL_DATA.highlightScale) this.alpha = CEIL_DATA.highlightAlpha
        } else {
            this.scale.set( Math.max(CEIL_DATA.scale, this.scale.x - scaleStep) )
            this.alpha = Math.max(CEIL_DATA.alpha, this.alpha - alphaStep)
            if (this.scale.x === CEIL_DATA.scale) {
                this.alpha = CEIL_DATA.alpha
                tickerRemove(this)
            }
        }
    }
}