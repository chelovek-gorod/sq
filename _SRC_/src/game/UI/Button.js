import { Container, Text, Sprite } from "pixi.js"
import { atlases, images, sounds } from "../../app/assets"
import { removeCursorPointer, setCursorPointer } from "../../utils/functions"
import { styles } from "../../app/styles"
import { soundPlay } from "../../app/sound"

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

        this.value = icon ? new Sprite(icon) : new Text({ text: text, style: styles.button })
        this.value.anchor.set(0.5)
        
        this.addChild(this.backImage, this.frontImage, this.value)

        setCursorPointer(this)
        this.on('pointerdown', this.click, this)
        this.on('pointerover', this.onHover, this)
        this.on('pointerout', this.onOut, this)

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
        if (!this.isActive) return

        if (this.isText) this.value.style = styles.buttonHover
        soundPlay(sounds.se_swipe)
    }
    onOut() {
        if (this.isText) this.value.style = styles.button
    }

    deactivate() {
        this.image.off('pointerdown', this.click, this)
        this.image.off('pointerover', this.onHover, this)
        this.image.off('pointerout', this.onOut, this)
        if (this.isText) this.value = styles.button
    }

    kill() {
        removeCursorPointer(this.image)
        this.deactivate()
    }
}