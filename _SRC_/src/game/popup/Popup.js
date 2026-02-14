import { Container, Graphics, Sprite, Text } from "pixi.js"
import { EventHub, events } from "../../app/events"
import { POPUP_TYPE } from "./constants"
import Button from "../UI/Button"
import { getLanguage } from "../localization"
import { atlases, images } from "../../app/assets"
import { styles } from "../../app/styles"
import { TASK } from "../scenes/world/constants"
import { LEVEL_PET, PLACE_PETS } from "../scenes/game/constants"
import { availablePetLevel } from "../state"
import { kill } from "../../app/application"
import WinDisc from "../effects/WinDisc"
import SparkParticles from "../effects/SparkParticles"
import { TEXT_BUTTON_TYPE, TEXT_PLACE, TEXT_RESULT_LOSE, TEXT_RESULT_NEW, TEXT_RESULT_WIN, TEXT_SQUINKI_BIOM, TEXT_SQUINKI_LEVEL, TEXT_SQUINKI_NAME, TEXT_TASK_DESCRIPTION, TEXT_TASK_TITLE, TEXT_TASK_TURNS } from "../localText"

const BG_SIDE_SIZE = 800
const BG_SIDE_OFFSET = 20
const BG_SIZE = BG_SIDE_SIZE + BG_SIDE_OFFSET * 2

function findPetPlace(petName) {
    for (const [place, pets] of Object.entries(PLACE_PETS)) {
        if (pets.includes(petName)) return place
    }
    return null
}

const dataQueue = []

export default class Popup extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on(events.updateLanguage, this.updateLanguage, this)

        this.visible = false

        this.sparks = null

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

        this.title = new Text({text: '', style: styles.popupTitle})
        this.title.anchor.set(0.5)
        this.title.position.set(0, -240)
        this.box.addChild(this.title)
        
        this.closeButton = new Button(null, TEXT_BUTTON_TYPE.OK, () => this.close())
        this.closeButton.position.set(0, 285)
        this.closeButton.scale.set(0.75)
        this.box.addChild(this.closeButton)

        EventHub.on(events.showPopup, this.show, this)
        EventHub.on(events.startScene, this.kill, this)

        // if (dataQueue.length) this.show( dataQueue.pop() )
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

        if (this.visible) return dataQueue.push(data)

        if (data.type === POPUP_TYPE.TASK) this.fillTask(data.data)
        else if (data.type === POPUP_TYPE.INFO) this.fillInfo(data.data)
        else if (data.type === POPUP_TYPE.RESULT) this.fillResult(data.data)
        else if (data.type === POPUP_TYPE.NEW) this.fillNew(data.data)

        this.visible = true
    }

    close() {
        this.clear()
        this.visible = false
        if ( dataQueue.length ) this.show( dataQueue.shift() )
    }

    clear() {
        this.closeButton.onOut()

        if (this.sparks) {
            this.content.removeChild(this.sparks.container)
            this.sparks.kill()
            this.sparks = null
        }

        while (this.content.children.length) {
            const obj = this.content.children[0]
            this.content.removeChild( obj )
            kill( obj )
        }
    }

    fillTask(data) {
        // data = {type: TASK.NEW, value: 2, turns: 0, levelIndex: 0}

        this.title.text = TEXT_TASK_TITLE[data.type][this.currentLanguage]

        if (data.type === TASK.NEW) {
            this.setTaskImageNEW()

            const description = TEXT_TASK_DESCRIPTION[TASK.NEW][this.currentLanguage]
            const descriptionText = new Text({text: description, style: styles.popupDescription})
            descriptionText.anchor.set(0.5, 0)
            descriptionText.position.set(0, 50)
            this.content.addChild(descriptionText)
        } else if (data.type === TASK.CLOUD) {
            const image = new Sprite( atlases.popup_images.textures[TASK.CLOUD] )
            image.anchor.set(0.5)
            image.position.set(0, -50)
            this.content.addChild(image)

            const description = TEXT_TASK_DESCRIPTION[TASK.CLOUD][this.currentLanguage]
            const descriptionText = new Text({text: description, style: styles.popupDescription})
            descriptionText.anchor.set(0.5, 0)
            descriptionText.position.set(0, 50)
            this.content.addChild(descriptionText)
        } else {
            const image = new Sprite( atlases.popup_images.textures[TASK.LOCK] )
            image.anchor.set(0.5)
            image.position.set(0, -50)
            this.content.addChild(image)

            const description = TEXT_TASK_DESCRIPTION[TASK.LOCK][this.currentLanguage]
            const descriptionText = new Text({text: description, style: styles.popupDescription})
            descriptionText.anchor.set(0.5, 0)
            descriptionText.position.set(0, 50)
            this.content.addChild(descriptionText)
        }

        if (data.turns > 0) {
            const turnsDescription = TEXT_TASK_TURNS[this.currentLanguage](data.turns)
            const turnsText = new Text({text: turnsDescription, style: styles.popupTurnsText})
            this.content.addChild(turnsText)

            const turnsIcon = new Sprite( atlases.task.textures[TASK.TIME] )
            turnsIcon.scale.set(0.4) // 60px
            this.content.addChild(turnsIcon)

            const turnsInfoWidth = (60 + turnsText.width) * 0.5
            turnsIcon.position.set(-turnsInfoWidth - 40, 140)
            turnsText.position.set(-turnsInfoWidth + 50, 170)
        }

        this.closeButton.setTextKey( TEXT_BUTTON_TYPE.OK )
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

    fillInfo(type) {
        this.title.text = TEXT_SQUINKI_NAME[ LEVEL_PET[type] ][ this.currentLanguage ]

        const level = TEXT_SQUINKI_LEVEL[this.currentLanguage] + ' ' + type
        const levelText = new Text({text: level, style: styles.popupTurnsText})
        levelText.anchor.set(0.5)
        levelText.position.set(0, -180)
        this.content.addChild(levelText)

        const place = findPetPlace( LEVEL_PET[type] )
        const placeImage = new Sprite( atlases.places.textures[place] )
        placeImage.scale.set(0.7)
        placeImage.anchor.set(0.5)
        placeImage.position.set(0, 10)
        this.content.addChild(placeImage)

        const petImage = new Sprite( atlases.pets.textures[ LEVEL_PET[type] ] )
        petImage.scale.set(0.8)
        petImage.anchor.set(0.5)
        petImage.position.set(0, -30)
        this.content.addChild(petImage)

        const description = TEXT_SQUINKI_BIOM[this.currentLanguage] 
            + ' ' + TEXT_PLACE[place][this.currentLanguage]
        const descriptionText = new Text({text: description, style: styles.popupDescription})
        descriptionText.anchor.set(0.5)
        descriptionText.position.set(0, 185)
        this.content.addChild(descriptionText)

        this.closeButton.setTextKey( TEXT_BUTTON_TYPE.OK )
    }

    fillResult( isWin ) {
        this.title.text = isWin
            ? TEXT_RESULT_WIN[this.currentLanguage]
            : TEXT_RESULT_LOSE[this.currentLanguage]

        const image = new Sprite( isWin ? images.result_WIN : images.result_LOSE )
        image.scale.set(0.8)
        image.anchor.set(0.5)
        image.position.set(0, 30)
        this.content.addChild(image)

        if (isWin) {
            this.sparks = new SparkParticles(true)
            this.sparks.container.scale.set(0.5)
            this.content.addChild( this.sparks.container )
            this.closeButton.setTextKey( TEXT_BUTTON_TYPE.OK )
        } else {
            this.closeButton.setTextKey( TEXT_BUTTON_TYPE.RETRY )
        }
    }

    fillNew( type = 1 ) {
        this.title.text = TEXT_RESULT_NEW[this.currentLanguage]

        const effect = new WinDisc()
        this.content.addChild( effect )

        const petImage = new Sprite( atlases.pets.textures[ LEVEL_PET[type]] )
        petImage.scale.set(0.8)
        petImage.anchor.set(0.5)
        petImage.position.set(0, -30)
        this.content.addChild(petImage)

        const petName = TEXT_SQUINKI_NAME[ LEVEL_PET[type] ][ this.currentLanguage ]
        const petNameText = new Text({text: petName, style: styles.popupTitle})
        petNameText.anchor.set(0.5)
        petNameText.position.set(0, 140)
        this.content.addChild(petNameText)

        const level = TEXT_SQUINKI_LEVEL[this.currentLanguage] + ' ' + type
        const levelText = new Text({text: level, style: styles.popupTurnsText})
        levelText.anchor.set(0.5)
        levelText.position.set(0, 200)
        this.content.addChild(levelText)

        this.sparks = new SparkParticles(true)
        this.sparks.container.scale.set(0.5)
        this.content.addChild( this.sparks.container )

        this.closeButton.setTextKey( TEXT_BUTTON_TYPE.OK )
    }

    updateLanguage(lang) {
        // only in SETTINGS popup
        this.currentLanguage = lang
    }

    kill() {
        if (this.sparks) this.sparks.kill()
        EventHub.off(events.startScene, this.kill, this)
        EventHub.off(events.updateLanguage, this.updateLanguage, this)
        EventHub.off(events.showPopup, this.show, this)
    }
}