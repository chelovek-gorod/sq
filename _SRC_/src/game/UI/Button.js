import { Container, Text, Sprite } from "pixi.js"
import { atlases, sounds } from "../../app/assets"
import { removeCursorPointer, setCursorPointer } from "../../utils/functions"
import { styles } from "../../app/styles"
import { soundPlay } from "../../app/sound"
import { tickerAdd, tickerRemove } from "../../app/application"

const ALPHA_DURATION = 120
const ALPHA_STEP = 1 / ALPHA_DURATION

export default class Button extends Container {
    constructor(icon, text, callback, isActive = true ) {
        super()

        this.callback = callback
        this.isText = !!text

        this.backImage = new Sprite(
            atlases.buttons.textures[ icon ? 'button_icon' : 'button' ]
        )
        this.backImage.anchor.set(0.5)
        this.frontImage = new Sprite(
            atlases.buttons.textures[ icon ? 'button_icon_hover' : 'button_hover' ]
        )
        this.frontImage.anchor.set(0.5)
        this.frontImage.alpha = 0
        this.isOnHover = false

        this.value = icon ? new Sprite(icon) : new Text({ text: text, style: styles.button })
        this.value.anchor.set(0.5)
        
        this.addChild(this.backImage, this.frontImage, this.value)

        setCursorPointer(this.backImage)
        this.backImage.on('pointerdown', this.click, this)
        this.backImage.on('pointerover', this.onHover, this)
        this.backImage.on('pointerout', this.onOut, this)

        this.isActive = isActive
        this.setActive(this.isActive)
    }

    setLabel(text) {
        if (!this.isText) return

        this.value.text = text
    }

    setIcon(icon) {
        if (this.isText) return

        this.value.texture = icon
    }

    setActive(isActive = true) {
        this.isActive = isActive
        if (this.isActive) {
            this.alpha = 1
        } else {
            this.alpha = 0.5
            if (this.isText) this.value.style = styles.button
        }
    }

    click() {
        if (!this.isActive) return

        soundPlay(sounds.se_click)
        this.callback()
    }

    onHover() {
        if (!this.isActive || this.isOnHover) return

        this.isOnHover = true
        if (this.isText) this.value.style = styles.buttonHover
        soundPlay(sounds.se_swipe)
        tickerAdd(this)
    }
    onOut() {
        if (!this.isOnHover) return

        this.isOnHover = false
        if (this.isText) this.value.style = styles.button
        tickerAdd(this)
    }

    deactivate() {
        this.backImage.off('pointerdown', this.click, this)
        this.backImage.off('pointerover', this.onHover, this)
        this.backImage.off('pointerout', this.onOut, this)
        if (this.isText) this.value = styles.button
    }

    tick(time) {
        if (this.isOnHover) {
            this.frontImage.alpha = Math.min(1, this.frontImage.alpha + ALPHA_STEP * time.deltaMS)
            if (this.frontImage.alpha === 1) tickerRemove(this)
        } else {
            this.frontImage.alpha = Math.max(0, this.frontImage.alpha - ALPHA_STEP * time.deltaMS)
            if (this.frontImage.alpha === 0) tickerRemove(this)
        }
    }

    kill() {
        removeCursorPointer(this.backImage)
        this.deactivate()
    }
}