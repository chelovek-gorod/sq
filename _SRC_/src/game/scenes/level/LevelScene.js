import { Container } from 'pixi.js'
import { atlases, music } from '../../../app/assets'
import { unblockDragging, EventHub, events, showPopup, startScene } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import BackgroundGradient from '../../BG/BackgroundGradient'
import { getLanguage } from '../../localization'
import TapIcon from '../../UI/TapIcon'
import { BG_GRADIENT_COLORS, CEIL_DATA, FIELD_OFFSET_X, FIELD_OFFSET_Y } from './constants'
import LevelField from './LevelField'
import ShineBall from './ShineBall'
import ShineBar from './ShineBar'
import Collection from '../../popup/Collection'
import FlyText from '../../effects/FlyText'
import { isAdAvailable, isNeedHelp, levelIndex, isLevelFree, levelStateSparkAdd, levelStateSparkRemove, setLevelTask, levelState, availablePetLevel } from '../../state'
import { LEVELS_FREE_LIST, LEVELS_LIST } from './levels'
import { SCENE_NAME } from '../constants'
import LevelTask from './LevelTask'
import Popup from '../../popup/Popup'
import { kill } from '../../../app/application'
import { POPUP_AD_TYPE, POPUP_TYPE } from '../../popup/constants'
import { TASK } from '../world/constants'

export default class Level extends Container {
    constructor() {
        super()
        this.alpha = 0

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        // update levelData if level restarted
        setLevelTask(levelIndex, isLevelFree)

        // нужна свободная клетка
        this.isAdDragon = isAdAvailable
        // нужен замок / туча / свободная клетка
        this.iaAdSparks = isAdAvailable ? 3 : 0

        const level = isLevelFree ? LEVELS_FREE_LIST[ levelIndex ] : LEVELS_LIST[ levelIndex ]

        const levelCeilsInWidth = level.map[0].length / 6
        const levelCeilsInHeight = ( level.map.length + 1) / 2
        this.fieldWidth = levelCeilsInWidth * CEIL_DATA.width
        this.fieldHeight = levelCeilsInHeight * CEIL_DATA.height

        const bgColors = BG_GRADIENT_COLORS[ level.bg]
        this.bg = new BackgroundGradient( bgColors )
        this.addChild(this.bg)

        this.shineBar = new ShineBar()
        this.addChild(this.shineBar)
        
        const addPetLevel = isLevelFree || level.task.type !== TASK.NEW
            ? null
            : Math.max(0, (availablePetLevel + 1) - level.task.value)
        this.field = new LevelField( level.map, addPetLevel )
        this.addChild(this.field)

        this.task = new LevelTask()
        this.addChild(this.task)

        this.collection = new Collection( this.clickBook.bind(this) )
        this.collection.visible = false
        this.addChild(this.collection)

        this.settingsBtn = new TapIcon( atlases.ui.textures.ui_settings, this.clickSettings.bind(this) )
        this.settingsBtn.anchor.set(1, 0)
        this.bookBtn = new TapIcon( atlases.ui.textures.ui_book, this.clickBook.bind(this) )
        this.bookBtn.anchor.set(1, 1)
        this.homeBtn = new TapIcon( atlases.ui.textures.ui_home, this.clickHome.bind(this) )
        this.homeBtn.anchor.set(0, 1)
        this.restartBtn = new TapIcon( atlases.ui.textures.ui_restart, this.clickRestart.bind(this) )
        this.restartBtn.anchor.set(0, 1)
        
        this.addChild(this.settingsBtn, this.bookBtn, this.homeBtn, this.restartBtn)

        this.isAdInLevel = isAdAvailable && !isNeedHelp
        if (this.isAdInLevel) {
            this.sparksBtn = new TapIcon( atlases.ui.textures.ui_ad7, this.clickSparksAd.bind(this) )
            this.sparksBtn.anchor.set(0, 0)
            this.sparksBtn.setActive(false)

            this.dragonBtn = new TapIcon( atlases.ui.textures.ui_dragon, this.clickDragonAd.bind(this) )
            this.dragonBtn.anchor.set(1, 1)
            this.dragonBtn.setActive(false)
            
            this.addChild(this.sparksBtn, this.dragonBtn)

            EventHub.on( events.userDoStep, this.userDoStep, this )
            EventHub.on( events.getRewardFromAd, this.getRewardFromAd, this )

            this.checkAdTimeout = null
            this.userDoStep()
        }

        this.popup = new Popup()
        this.addChild(this.popup)

        unblockDragging() // unblock pets

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

        this.shineBar.position.set(-screenData.centerX, -screenData.centerY)
        this.settingsBtn.position.set(screenData.centerX, -screenData.centerY)
        this.bookBtn.position.set(screenData.centerX, screenData.centerY)
        this.homeBtn.position.set(-screenData.centerX, screenData.centerY)
        this.restartBtn.position.set(-screenData.centerX, screenData.centerY - 100)
        if (this.isAdInLevel) {
            this.sparksBtn.position.set(-screenData.centerX, -screenData.centerY + 110)
            this.dragonBtn.position.set(screenData.centerX, screenData.centerY - 100)
        }

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
        if (!this.isAdInLevel) return

        if (!this.isAdDragon && this.iaAdSparks === 0) return

        if (levelState.sparks) return this.checkAdTimeout = setTimeout( () => this.userDoStep(), 600 )

        const isFreeCeil = this.field.getFreeCeil() !== null
        const isSparksAd = isFreeCeil || levelState.targets
        this.sparksBtn.setActive( this.iaAdSparks > 0 && isSparksAd)
        this.dragonBtn.setActive( this.isAdDragon && isFreeCeil )
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
            if (targetCeilIndex === null) return levelStateSparkRemove()

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
    clickRestart() {
        startScene( SCENE_NAME.Level )
    }

    clickBook() {
        this.collection.visible = !this.collection.visible
        if (this.collection.visible) this.bookBtn.texture = atlases.ui.textures.ui_close_book
        else this.bookBtn.texture = atlases.ui.textures.ui_book
    }

    clickSettings() {
        showPopup({type: POPUP_TYPE.SETTINGS, data: null})
    }

    clickSparksAd() {
        const spCount = this.iaAdSparks === 3 ? 7 : this.iaAdSparks === 2 ? 5 : 3
        showPopup({type: POPUP_TYPE.AD, data: spCount})
    }
    clickDragonAd() {
        showPopup({type: POPUP_TYPE.AD, data: POPUP_AD_TYPE.DRAGON})
    }
    getRewardFromAd( rewardIndex ) {
        if (rewardIndex === 0) return showPopup({type: POPUP_TYPE.ERROR, data: null})

        levelStateSparkAdd()

        if (rewardIndex === 1) {
            this.isAdDragon = false
            kill(this.dragonBtn)
            const freeCeil = this.field.getFreeCeil()
            if (freeCeil) {
                const targetCeil = this.field.ceils.children[freeCeil.index]
                targetCeil.pet = true

                this.field.addEffect( new ShineBall(
                    {x: this.shineBar.sparksPosition.x + 60, y: this.shineBar.sparksPosition.y + 120},
                    {x: freeCeil.x, y: freeCeil.y},
                    targetCeil,
                    5
                ))

                this.userDoStep()
            }
        } else {
            let points = 0
            this.iaAdSparks--
            const freeCeil = {
                x: this.field.x + this.field.width,
                y: this.field.y + this.field.height
            }
            if (this.iaAdSparks === 2) {
                this.sparksBtn.setActive( false )
                this.sparksBtn.setIcon(atlases.ui.textures.ui_ad5)
                points = 7
                this.addShineBall( {x: freeCeil.x, y: freeCeil.y, points: 2} )
                this.addShineBall( {x: freeCeil.x, y: freeCeil.y, points: 3} )
                this.addShineBall( {x: freeCeil.x, y: freeCeil.y, points: 2} )
            } else if (this.iaAdSparks === 1) {
                this.sparksBtn.setActive( false )
                this.sparksBtn.setIcon(atlases.ui.textures.ui_ad3)
                points = 5
                this.addShineBall( {x: freeCeil.x, y: freeCeil.y, points: 3} )
                this.addShineBall( {x: freeCeil.x, y: freeCeil.y, points: 2} )
            } else {
                kill(this.sparksBtn)
                points = 3
                this.addShineBall( {x: freeCeil.x, y: freeCeil.y, points: 3} )
            }
            this.addChild( new FlyText('+' + points, 0, 0) )
            this.userDoStep()
        }
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
    }

    kill() {
        kill(this.popup)

        if (this.isAdInLevel) {
            EventHub.off( events.userDoStep, this.userDoStep, this )
            EventHub.off( events.getRewardFromAd, this.getRewardFromAd, this )
            clearTimeout(this.checkAdTimeout)
        }
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
        EventHub.off( events.addShineBall, this.addShineBall, this )
        EventHub.off( events.addFlyText, this.addFlyText, this )
    }
}