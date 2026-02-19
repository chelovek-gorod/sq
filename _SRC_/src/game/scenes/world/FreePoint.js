import { Container, Sprite } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases, sounds } from "../../../app/assets";
import { addSpark } from "../../../app/events";
import { soundPlay } from "../../../app/sound";
import { createEnum, removeCursorPointer, setCursorPointer } from "../../../utils/functions";
import { FREE_POINTS } from "./constants";

const minScale = 1.0
const maxScale = 1.1
const scaleStep = 0.0006

const alphaSpeed = 0.0006

const STATE = createEnum(['IN_A', 'OUT_A', 'IN_B', 'OUT_B', 'IN_C', 'OUT_C',])

export default class FreePoint extends Container {
    constructor( index ) { 
        super()

        this.position.set( FREE_POINTS[index].x, FREE_POINTS[index].y )
        this.scale.set( minScale )

        this.isOnHover = false
        this.isHoveredNow = false

        this.index = index
        this.isAvailable = true

        const pointColor = this.isAvailable ? FREE_POINTS[index].color : 'gray'
        this.base = new Sprite( atlases.world.textures['free_' + pointColor] )
        this.base.anchor.set(0.5)
        this.addChild(this.base)

        if (this.isAvailable) {
            this.state = STATE.IN_A
            this.isSparkFrame = false

            const crystalImageA = 'free_' + FREE_POINTS[index].crystals[0]
            this.crystalA = new Sprite( atlases.world.textures[crystalImageA])
            this.crystalA.anchor.set(0.5)
            this.crystalA.alpha = 0
            this.addChild(this.crystalA)

            const crystalImageB = 'free_' + FREE_POINTS[index].crystals[1]
            this.crystalB = new Sprite( atlases.world.textures[crystalImageB])
            this.crystalB.anchor.set(0.5)
            this.crystalB.alpha = 0
            this.addChild(this.crystalB)

            const crystalImageC = 'free_' + FREE_POINTS[index].crystals[2]
            this.crystalC = new Sprite( atlases.world.textures[crystalImageC])
            this.crystalC.anchor.set(0.5)
            this.crystalC.alpha = 0
            this.addChild(this.crystalC)

            setCursorPointer(this)
            this.on('pointerdown', this.click, this)
            this.on('pointerover', this.onHover, this)
            this.on('pointerout', this.onOut, this)

            tickerAdd(this)
        }
    }

    click() {
        console.log('bonus level')
    }

    onHover() {
        if (this.isOnHover) return

        this.isOnHover = true
        this.isHoveredNow = true
        soundPlay(sounds.se_map_hover)
    }

    onOut() {
        if (!this.isOnHover) return

        this.isOnHover = false
        this.isHoveredNow = true
    }

    tick(time) {
        if (this.isAvailable) {
            this.isSparkFrame = !this.isSparkFrame
            if (this.isSparkFrame) addSpark({x: this.x * 2, y: this.y * 2, type: 'multi'})
        }

        const alphaStep = alphaSpeed * time.deltaMS
        switch (this.state) {
            case STATE.IN_A :
                this.crystalA.alpha = Math.min(1, this.crystalA.alpha + alphaStep)
                if (this.crystalA.alpha === 1) this.state = STATE.OUT_A
            break
            case STATE.OUT_A :
                this.crystalA.alpha = Math.max(0, this.crystalA.alpha - alphaStep)
                if (this.crystalA.alpha === 0) this.state = STATE.IN_B
            break

            case STATE.IN_B :
                this.crystalB.alpha = Math.min(1, this.crystalB.alpha + alphaStep)
                if (this.crystalB.alpha === 1) this.state = STATE.OUT_B
            break
            case STATE.OUT_B :
                this.crystalB.alpha = Math.max(0, this.crystalB.alpha - alphaStep)
                if (this.crystalB.alpha === 0) this.state = STATE.IN_C
            break

            case STATE.IN_C :
                this.crystalC.alpha = Math.min(1, this.crystalC.alpha + alphaStep)
                if (this.crystalC.alpha === 1) this.state = STATE.OUT_C
            break
            case STATE.OUT_C :
                this.crystalC.alpha = Math.max(0, this.crystalC.alpha - alphaStep)
                if (this.crystalC.alpha === 0) this.state = STATE.IN_A
            break
        }

        if (!this.isHoveredNow) return

        const scaleAdd = scaleStep * time.deltaMS
        if (this.isOnHover) {
            this.scale.set( Math.min(maxScale, this.scale.x + scaleAdd) )
            if (this.scale.x === maxScale) this.isHoveredNow = false
        } else {
            this.scale.set( Math.max(minScale, this.scale.x - scaleAdd) )
            if (this.scale.x === minScale) this.isHoveredNow = false
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