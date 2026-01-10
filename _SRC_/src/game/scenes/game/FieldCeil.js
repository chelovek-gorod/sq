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

        this.targetScale = CEIL_DATA.scale
        this.targetAlpha = CEIL_DATA.alpha
        this.isAnimating = false
        this.isHighlighted = false
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
        if (this.isHighlighted) return
        
        this.isHighlighted = true
        this.targetScale = CEIL_DATA.highlightScale
        this.targetAlpha = CEIL_DATA.highlightAlpha
        
        if (!this.isAnimating) {
            this.isAnimating = true
            tickerAdd(this)
        }
    }

    highlightOff() {
        if (!this.isHighlighted) return
        
        this.isHighlighted = false
        this.targetScale = CEIL_DATA.scale
        this.targetAlpha = CEIL_DATA.alpha
        
        if (!this.isAnimating) {
            this.isAnimating = true
            tickerAdd(this)
        }
    }

    tick(time){
        const scaleDone = this.scale.x === this.targetScale
        const alphaDone = this.alpha === this.targetAlpha

        if (scaleDone && alphaDone) {
            this.scale.set(this.targetScale)
            this.alpha = this.targetAlpha
            this.isAnimating = false
            tickerRemove(this)
            return
        }

        if (!scaleDone) {
            const scaleStep = CEIL_DATA.highlightScaleStep * time.deltaMS
            if (this.scale.x < this.targetScale) {
                this.scale.set(Math.min(this.targetScale, this.scale.x + scaleStep))
            } else {
                this.scale.set(Math.max(this.targetScale, this.scale.x - scaleStep))
            }
        }
        
        if (!alphaDone) {
            const alphaStep = CEIL_DATA.highlightAlphaStep * time.deltaMS
            if (this.alpha < this.targetAlpha) {
                this.alpha = Math.min(this.targetAlpha, this.alpha + alphaStep)
            } else {
                this.alpha = Math.max(this.targetAlpha, this.alpha - alphaStep)
            }
        }
    }
}