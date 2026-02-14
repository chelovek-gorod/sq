import { Container, Graphics, Sprite, Text } from "pixi.js"
import { EventHub, events } from "../../app/events"
import { POPUP_TYPE } from "./constants"
import Button from "../UI/Button"
import TapIcon from "../UI/TapIcon"
import { getAvailableLanguages, getLanguage, getLanguageName, setLanguage } from "../localization"
import { atlases, images } from "../../app/assets"
import { styles } from "../../app/styles"
import { TASK } from "../scenes/world/constants"
import { LEVEL_PET, PLACE_PETS } from "../scenes/game/constants"
import { availablePetLevel } from "../state"
import { kill } from "../../app/application"
import WinDisc from "../effects/WinDisc"
import SparkParticles from "../effects/SparkParticles"
import { TEXT_BUTTON_TYPE, TEXT_PLACE, TEXT_RESULT_LOSE, TEXT_RESULT_NEW, TEXT_RESULT_WIN,
    TEXT_SETTINGS, TEXT_SETTING_TYPE, TEXT_SQUINKI_BIOM, TEXT_SQUINKI_LEVEL, TEXT_SQUINKI_NAME,
    TEXT_TASK_DESCRIPTION, TEXT_TASK_TITLE, TEXT_TASK_TURNS } from "../localText"
import LoseRain from "../effects/LoseRain"
import { musicGetState, musicGetVolume, musicOff, musicOn, musicSetVolume, soundGetState, soundGetVolume, soundOff, soundOn, soundSetVolume } from "../../app/sound"

const BG_SIDE_SIZE = 800
const BG_SIDE_OFFSET = 20
const BG_SIZE = BG_SIDE_SIZE + BG_SIDE_OFFSET * 2

function findPetPlace(petName) {
    for (const [place, pets] of Object.entries(PLACE_PETS)) {
        if (pets.includes(petName)) return place
    }
    return null
}

function findSoundMusic(isMusic = true) {
    const isOn = isMusic ? musicGetState() : soundGetState()
    if (!isOn) return 0

    const volume = isMusic ? musicGetVolume() : soundGetVolume()
    if (volume > 0.7 ) return 3
    if (volume > 0.4 ) return 2
    return 1
}

const dataQueue = []

export default class Popup extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()

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

        this.settingsUI = null

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
        else if (data.type === POPUP_TYPE.SETTINGS) this.fillSettings()

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

        if (this.settingsUI) this.settingsUI = null
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
            this.content.addChild( new LoseRain() )
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

    fillSettings() {
        this.title.text = TEXT_SETTINGS[TEXT_SETTING_TYPE.TITLE][this.currentLanguage]

        this.settingsUI = {}
        // music
        const musicLabelText = TEXT_SETTINGS[TEXT_SETTING_TYPE.MUSIC][this.currentLanguage]
        this.settingsUI.musicLabel = new Text({text: musicLabelText, style: styles.popupDescription})
        this.settingsUI.musicLabel.anchor.set(0.5)
        this.settingsUI.musicLabel.position.set(-200, -170)
        this.content.addChild( this.settingsUI.musicLabel )

        const musicTexture = atlases.sound_music.textures[ 'music_' + findSoundMusic(true) ]
        this.settingsUI.musicBtn = new TapIcon( musicTexture, this.changeMusic.bind(this) )
        this.settingsUI.musicBtn.anchor.set(0.5)
        this.settingsUI.musicBtn.position.set(-200, -80)
        this.content.addChild( this.settingsUI.musicBtn )

        // sound
        const soundLabelText = TEXT_SETTINGS[TEXT_SETTING_TYPE.SOUND][this.currentLanguage]
        this.settingsUI.soundLabel = new Text({text: soundLabelText, style: styles.popupDescription})
        this.settingsUI.soundLabel.anchor.set(0.5)
        this.settingsUI.soundLabel.position.set(200, -170)
        this.content.addChild( this.settingsUI.soundLabel )

        const soundTexture = atlases.sound_music.textures[ 'sound_' + findSoundMusic(false) ]
        this.settingsUI.soundBtn = new TapIcon( soundTexture, this.changeSound.bind(this) )
        this.settingsUI.soundBtn.anchor.set(0.5)
        this.settingsUI.soundBtn.position.set(200, -80)
        this.content.addChild( this.settingsUI.soundBtn )

        // language
        this.settingsUI.langСodes = getAvailableLanguages().map(item => item.code)
        this.settingsUI.langIndex = this.settingsUI.langСodes.indexOf(this.currentLanguage)

        const langLabelText = TEXT_SETTINGS[TEXT_SETTING_TYPE.LANGUAGE][this.currentLanguage]
            + ' ' + getLanguageName()
        this.settingsUI.langLabel = new Text({text: langLabelText, style: styles.popupDescription})
        this.settingsUI.langLabel.anchor.set(0.5)
        this.settingsUI.langLabel.position.set(0, 50)
        this.content.addChild( this.settingsUI.langLabel )

        this.settingsUI.leftBtn = new Button( images.button_icon_left, null, this.prevLang.bind(this) )
        this.settingsUI.leftBtn.scale.set(0.75)
        this.settingsUI.leftBtn.position.set(-120, 120)
        this.content.addChild( this.settingsUI.leftBtn )

        const langCodeText = this.currentLanguage.toUpperCase()
        this.settingsUI.langCode = new Text({text: langCodeText, style: styles.popupTitle})
        this.settingsUI.langCode.anchor.set(0.5)
        this.settingsUI.langCode.position.set(0, 120)
        this.content.addChild( this.settingsUI.langCode )

        this.settingsUI.rightBtn = new Button( images.button_icon_right, null, this.nextLang.bind(this) )
        this.settingsUI.rightBtn.scale.set(0.75)
        this.settingsUI.rightBtn.position.set(120, 120)
        this.content.addChild( this.settingsUI.rightBtn )
    }

    changeMusic() {
        const volume = musicGetVolume()
        let iconIndex = 0
        if (volume > 0.7) {
            musicSetVolume(0)
            musicOff()
        } else if (volume > 0.4) {
            musicSetVolume(1)
            iconIndex = 3
        } else if (volume > 0.1) {
            musicSetVolume(0.5)
            iconIndex = 2
        } else {
            musicSetVolume(0.25)
            musicOn()
            iconIndex = 1
        }
        const musicTexture = atlases.sound_music.textures[ 'music_' + iconIndex ]
        this.settingsUI.musicBtn.setIcon( musicTexture )
    }

    changeSound() {
        const volume = soundGetVolume()
        let iconIndex = 0
        if (volume > 0.7) {
            soundSetVolume(0)
            soundOff()
        } else if (volume > 0.4) {
            soundSetVolume(1)
            iconIndex = 3
        } else if (volume > 0.1) {
            soundSetVolume(0.5)
            iconIndex = 2
        } else {
            soundSetVolume(0.25)
            soundOn()
            iconIndex = 1
        }
        const soundTexture = atlases.sound_music.textures[ 'sound_' + iconIndex ]
        this.settingsUI.soundBtn.setIcon( soundTexture )
    }

    prevLang() {
        this.settingsUI.langIndex--
        if (this.settingsUI.langIndex < 0) {
            this.settingsUI.langIndex = this.settingsUI.langСodes.length - 1
        }
        this.currentLanguage = this.settingsUI.langСodes[this.settingsUI.langIndex]
        setLanguage(this.currentLanguage)

        this.updateSettingsLabels()
    }

    nextLang() {
        this.settingsUI.langIndex++
        if (this.settingsUI.langIndex === this.settingsUI.langСodes.length) {
            this.settingsUI.langIndex = 0
        }
        this.currentLanguage = this.settingsUI.langСodes[this.settingsUI.langIndex]
        setLanguage(this.currentLanguage)

        this.updateSettingsLabels()
    }

    updateSettingsLabels() {
        this.title.text = TEXT_SETTINGS[TEXT_SETTING_TYPE.TITLE][this.currentLanguage]

        const musicLabelText = TEXT_SETTINGS[TEXT_SETTING_TYPE.MUSIC][this.currentLanguage]
        this.settingsUI.musicLabel.text = musicLabelText

        const soundLabelText = TEXT_SETTINGS[TEXT_SETTING_TYPE.SOUND][this.currentLanguage]
        this.settingsUI.soundLabel.text = soundLabelText

        const langLabelText = TEXT_SETTINGS[TEXT_SETTING_TYPE.LANGUAGE][this.currentLanguage]
            + ' ' + getLanguageName()
        this.settingsUI.langLabel.text = langLabelText

        this.settingsUI.langCode.text = this.currentLanguage.toUpperCase()
    }

    kill() {
        if (this.sparks) this.sparks.kill()
        EventHub.off(events.startScene, this.kill, this)
        EventHub.off(events.showPopup, this.show, this)
    }
}