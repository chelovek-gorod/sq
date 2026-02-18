import { Container } from 'pixi.js'
import { atlases, music } from '../../../app/assets'
import { EventHub, events, showPopup, startScene } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import BackgroundGradient from '../../BG/BackgroundGradient'
import { getLanguage } from '../../localization'
import TapIcon from '../../UI/TapIcon'
import { BG_GRADIENT_COLORS, CEIL_DATA, FIELD_OFFSET_X, FIELD_OFFSET_Y } from './constants'
import GameField from './GameField'
import ShineBall from './ShineBall'
import ShineBar from './ShineBar'
import Collection from '../../popup/Collection'
import FlyText from '../../effects/FlyText'
import { levelIndex } from '../../state'
import { LEVELS_LIST } from './levels'
import { SCENE_NAME } from '../constants'
import GameTask from './GameTask'
import Popup from '../../popup/Popup'
import { kill } from '../../../app/application'
import { POPUP_TYPE } from '../../popup/constants'

export default class Game extends Container {
    constructor() {
        super()
        this.alpha = 0

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        this.stepsCount = 0
        EventHub.on( events.userDoStep, this.userDoStep, this )

        this.level = LEVELS_LIST[ levelIndex ]

        const levelCeilsInWidth = this.level.map[0].length / 6
        const levelCeilsInHeight = (this.level.map.length + 1) / 2
        this.fieldWidth = levelCeilsInWidth * CEIL_DATA.width
        this.fieldHeight = levelCeilsInHeight * CEIL_DATA.height

        const bgColors = BG_GRADIENT_COLORS[this.level.bg]
        this.bg = new BackgroundGradient( bgColors )
        this.addChild(this.bg)

        this.shineBar = new ShineBar()
        this.addChild(this.shineBar)

        this.field = new GameField(this.level.map)
        this.addChild(this.field)

        this.task = new GameTask(this.level.task, levelIndex)
        this.addChild(this.task)

        this.collection = new Collection( this.clickBook.bind(this) )
        this.collection.visible = false
        this.addChild(this.collection)

        this.homeBtn = new TapIcon( atlases.ui.textures.ui_home, this.clickHome.bind(this) )
        this.homeBtn.anchor.set(0, 1)
        this.bookBtn = new TapIcon( atlases.ui.textures.ui_book, this.clickBook.bind(this) )
        this.bookBtn.anchor.set(1, 1)
        this.settingsBtn = new TapIcon( atlases.ui.textures.ui_settings, this.clickSettings.bind(this) )
        this.settingsBtn.anchor.set(1, 0)
        
        this.addChild(this.homeBtn, this.bookBtn, this.settingsBtn)

        this.popup = new Popup()
        this.addChild(this.popup)

        EventHub.on( events.addShineBall, this.addShineBall, this )
        EventHub.on( events.addFlyText, this.addFlyText, this )

        setMusicList([
            music.bgm_0, music.bgm_1, music.bgm_2, music.bgm_3, music.bgm_4,
            music.bgm_5, music.bgm_6, music.bgm_7, music.bgm_8, music.bgm_9
        ])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        this.bg.screenResize(screenData)

        this.collection.screenResize(screenData)

        this.homeBtn.position.set(-screenData.centerX, screenData.centerY)
        this.bookBtn.position.set(screenData.centerX, screenData.centerY)
        this.settingsBtn.position.set(screenData.centerX, -screenData.centerY)
        this.shineBar.position.set(-screenData.centerX, -screenData.centerY)

        this.task.position.set(0, -screenData.centerY + 20)

        const freeWidth = screenData.width
        const freeHeight = screenData.height - FIELD_OFFSET_Y
        const fieldScaleX = Math.min(1, freeWidth / this.fieldWidth)
        const fieldScaleY = Math.min(1, freeHeight / this.fieldHeight)
        const fieldScale = Math.min(fieldScaleX, fieldScaleY)
        this.field.scale.set(fieldScale)
        const fieldScaledWidth = this.fieldWidth * fieldScale
        const fieldScaledHeight = this.fieldHeight * fieldScale
        const fieldX = -fieldScaledWidth * 0.5
        const fieldY = -fieldScaledHeight * 0.5 + FIELD_OFFSET_Y * fieldScale * 0.75
        this.field.position.set(fieldX, fieldY)

        // 120 x 150
        const shineBarCenter = {x: this.shineBar.position.x + 55, y: this.shineBar.position.y + 65}
        this.shineBar.setPointOnField( this.field.toLocal(shineBarCenter, this) )

        this.popup.screenResize(screenData)
    }

    userDoStep() {
        this.stepsCount++
    }

    addShineBall( data ) {
        // data = {x, y, points}
        // new ShineBall(startPoint, targetPoint, target, points = 0)
        if (data.points) {
            // from merge to bar
            this.field.addEffect( new ShineBall(
                {x: data.x, y: data.y},
                {x: this.shineBar.sparksPosition.x + 60, y: this.shineBar.sparksPosition.y + 120},
                this.shineBar,
                data.points
            ))
        } else {
            // magic from bar
            const targetCeilIndex = this.field.getMagicTargetCeilIndex()
            const targetCeil = this.field.ceils.children[targetCeilIndex]
            if (targetCeil.pet === null) targetCeil.pet = true

            this.field.addEffect( new ShineBall(
                {x: this.shineBar.sparksPosition.x + 60, y: this.shineBar.sparksPosition.y + 120},
                {x: targetCeil.x, y: targetCeil.y},
                targetCeil,
                5
            ))
        }
    }

    addFlyText(data) {
        const point = this.toLocal({x: data.x, y: data.y}, this.field)
        this.addChild( new FlyText(data.text, point.x, point.y) )
    }

    clickHome() {
        if (this.collection.visible) {
            this.clickBook()
            return
        }

        kill(this.popup)
        startScene( SCENE_NAME.World )
    }

    clickBook() {
        this.collection.visible = !this.collection.visible
        if (this.collection.visible) this.bookBtn.texture = atlases.ui.textures.ui_close_book
        else this.bookBtn.texture = atlases.ui.textures.ui_book
    }

    clickSettings() {
        showPopup({type: POPUP_TYPE.SETTINGS, data: null})
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
    }

    kill() {
        kill(this.popup)

        EventHub.off( events.updateLanguage, this.updateLanguage, this )
        EventHub.off( events.userDoStep, this.userDoStep, this )
        EventHub.off( events.addShineBall, this.addShineBall, this )
        EventHub.off( events.addFlyText, this.addFlyText, this )
    }
}