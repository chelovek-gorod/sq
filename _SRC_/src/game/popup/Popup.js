import { Container, Graphics, Sprite, Text } from "pixi.js"
import { EventHub, events } from "../../app/events"
import { BUTTON_TEXT } from "../UI/constants"
import { POPUP_TYPE } from "./constants"
import Button from "../UI/Button"
import { getLanguage } from "../localization"
import { atlases, images } from "../../app/assets"
import { styles } from "../../app/styles"
import { TASK } from "../scenes/world/constants"
import { LEVEL_PET } from "../scenes/game/constants"
import { availablePetLevel } from "../state"

const BG_SIDE_SIZE = 800
const BG_SIDE_OFFSET = 20
const BG_SIZE = BG_SIDE_SIZE + BG_SIDE_OFFSET * 2

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

        this.content = new Container()
        this.box.addChild(this.content)

        this.title = new Text({text: '???', style: styles.popupTitle})
        this.title.anchor.set(0.5)
        this.title.position.set(0, -240)
        this.box.addChild(this.title)
        
        this.closeButton = new Button(null, 'Хорошо', () => this.close())
        this.closeButton.position.set(0, 285)
        this.closeButton.scale.set(0.75)
        this.box.addChild(this.closeButton)

        EventHub.on(events.showPopup, this.show, this)
    }

    screenResize(screenData) {
        this.shell.clear()
        this.shell.rect(-screenData.centerX, -screenData.centerY, screenData.width, screenData.height)
        this.shell.fill(0x000000)
        this.shell.alpha = 0.5

        const screenSize = screenData.isLandscape ? screenData.height : screenData.width
        const scale = Math.min(1, screenSize / BG_SIZE)
        this.box.scale.set(scale)
    }

    show(data) {
        // data = {type: POPUP_TYPE.TASK, data: this.task}

        if (data.type === POPUP_TYPE.TASK) this.fillTask(data.data)

        this.visible = true
    }

    close() {
        this.closeButton.onOut()
        this.visible = false

        this.content.children.forEach( c => kill(c) )
    }

    fillTask(data) {
        // data = {type: TASK.NEW, value: 2, turns: 0, levelIndex: 0}

        if (data.type === TASK.NEW) {
            this.title.text = 'Открой нового Сквинки'

            this.setTaskImageNEW()

            const description = 'Соедини Сквинки последнего уровня для открытия нового Сквинки'
            const descriptionText = new Text({text: description, style: styles.popupDescription})
            descriptionText.anchor.set(0.5, 0)
            descriptionText.position.set(0, 50)
            this.content.addChild(descriptionText)
        } else if (data.type === TASK.CLOUD) {
            this.title.text = 'Разгони все тучи'

            const image = new Sprite( atlases.popup_images.textures[TASK.CLOUD] )
            image.anchor.set(0.5)
            image.position.set(0, -50)
            this.content.addChild(image)

            const description = 'Соединяй Сквинки в соседней клетки с Облоками, что бы облока исчезли'
            const descriptionText = new Text({text: description, style: styles.popupDescription})
            descriptionText.anchor.set(0.5, 0)
            descriptionText.position.set(0, 50)
            this.content.addChild(descriptionText)
        } else {
            this.title.text = 'Открой все замки'

            const image = new Sprite( atlases.popup_images.textures[TASK.LOCK] )
            image.anchor.set(0.5)
            image.position.set(0, -50)
            this.content.addChild(image)

            const description = 'За каждые 10 собранных Сияний открывается 1 случайный замок'
            const descriptionText = new Text({text: description, style: styles.popupDescription})
            descriptionText.anchor.set(0.5, 0)
            descriptionText.position.set(0, 50)
            this.content.addChild(descriptionText)
        }

        if (data.turns > 0) {
            const turnsDescription = `За ${data.turns} ходов!`
            const turnsText = new Text({text: turnsDescription, style: styles.popupTurnsText})
            this.content.addChild(turnsText)

            const turnsIcon = new Sprite( atlases.task.textures[TASK.TIME] )
            turnsIcon.scale.set(0.4) // 60px
            this.content.addChild(turnsIcon)

            const turnsInfoWidth = (60 + turnsText.width) * 0.5
            turnsIcon.position.set(-turnsInfoWidth - 40, 140)
            turnsText.position.set(-turnsInfoWidth + 50, 170)
        }
    }

    setTaskImageNEW() {
        const imageA = new Sprite( atlases.pets.textures[LEVEL_PET[availablePetLevel]] )
        imageA.anchor.set(0.5)
        imageA.scale.set(0.55)
        imageA.position.set(-265, -60)
        const imageB = new Sprite( atlases.pets.textures[LEVEL_PET[availablePetLevel]] )
        imageB.anchor.set(0.5)
        imageB.scale.set(0.55)
        imageB.position.set(0, -60)
        const imageC = new Sprite( atlases.popup_images.textures[TASK.NEW] )
        imageC.anchor.set(0.5)
        imageC.position.set(0, -50)
        this.content.addChild(imageA, imageB, imageC)
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