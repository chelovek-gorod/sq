import { Container, Graphics, Sprite, Text } from "pixi.js"
import { EventHub, events } from "../../app/events"
import { BUTTON_TEXT } from "../UI/constants"
import { POPUP_TYPE } from "./constants"
import Button from "../UI/Button"
import { getLanguage } from "../localization"
import { images } from "../../app/assets"
import { styles } from "../../app/styles"

export default class Popup extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on(events.updateLanguage, this.updateLanguage, this)

        this.visible = false

        this.shell = new Graphics()
        this.shell.eventMode = 'static'
        this.addChild(this.shell)
        
        this.box = new Container()
        this.addChild(this.box)

        this.bg = new Sprite( images.popup_bg )
        this.bg.anchor.set(0.5)
        this.box.addChild(this.bg)

        this.title = new Text({text: 'Открой нового Сквинки', style: styles.popupTitle})
        this.title.anchor.set(0.5)
        this.title.position.set(0, -280)
        this.box.addChild(this.title)
        
        this.closeButton = new Button(null, 'Хорошо', () => this.close())
        this.closeButton.position.set(0, 325)
        this.box.addChild(this.closeButton)

        EventHub.on(events.showPopup, this.show, this)
    }

    screenResize(screenData) {
        this.shell.clear()
        this.shell.rect(-screenData.centerX, -screenData.centerY, screenData.width, screenData.height)
        this.shell.fill(0x000000)
        this.shell.alpha = 0.5

        const screenSize = screenData.isLandscape ? screenData.height : screenData.width
        const scale = Math.min(1, screenSize / 960)
        this.box.scale.set(scale)
    }

    show(data) {
        // data = {type: POPUP_TYPE.TASK, data: this.task}
        this.visible = true
        /*
        this.addChild(this.shell, this.box)
        if (type && type in this) {
            this.box.addChild(this[type])
            this.type = type
        }
        */
    }

    close() {
        this.closeButton.onOut()
        this.visible = false
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        this.closeButton.setLabel( BUTTON_TEXT.done[ this.currentLanguage ] )
    }

    kill() {
        EventHub.off(events.updateLanguage, this.updateLanguage, this)
        EventHub.off(events.showPopup, this.show, this)
    }
}