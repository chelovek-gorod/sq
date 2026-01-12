import { Container, Graphics, Sprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { atlases, images, music } from '../../../app/assets'
import { EventHub, events } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import BackgroundImage from '../../BG/BackgroundImage'
import { getLanguage } from '../../localization'
import TapIcon from '../../UI/TapIcon'
import { CEIL_DATA, FIELD_OFFSET_X, FIELD_OFFSET_Y, PLACE } from './constants'
import GameField from './GameField'
import ShineBall from './ShineBall'
import ShineBar from './ShineBar'

export default class Game extends Container {
    constructor() {
        super()
        this.alpha = 0

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        this.stepsCount = 0
        EventHub.on( events.userDoStep, this.userDoStep, this )

        this.level = {
            /*
            <A-[]> - 'Arctic', empty
            <F-XX> - 'Farm', closed
            <J-01> - 'Jungle', pet level 1
            <O-24> - 'Ocean', pet level 24
            <S-SS> - 'Savannah', stones
            */
            /*
            map: [
                '.........<O-01>.........',
                '......<S-01><J-01>......',
                '...<F-01><A-XX><O-01>...',
                '<S-01><J-SS><F-SS><A-01>',
                '...<O-01><S-SS><J-01>...',
                '......<F-01><A-01>......',
                '.........<O-01>.........',
            ],
            */
            map: [
                '.........<O-01>.........',
                '......<S-01><J-01>......',
                '...<F-01><A-XX><O-01>...',
                '<S-01><J-XX><F-XX><A-01>',
                '...<O-01><S-SS><J-01>...',
                '<S-01><J-SS><F-SS><A-01>',
                '...<O-01><S-SS><J-01>...',
                '......<F-01><A-01>......',
                '.........<O-01>.........',
            ],
            bg: Object.keys(PLACE)[ Math.floor(Math.random() * 5) ]
        }

        const levelCeilsInWidth = this.level.map[0].length / 6
        const levelCeilsInHeight = (this.level.map.length + 1) / 2
        this.fieldWidth = levelCeilsInWidth * CEIL_DATA.width
        this.fieldHeight = levelCeilsInHeight * CEIL_DATA.height

        this.bg = new BackgroundImage( images[this.level.bg + '_bg'] )
        this.addChild(this.bg)

        this.field = new GameField(this.level)
        this.addChild(this.field)

        this.homeBtn = new TapIcon( atlases.ui.textures.ui_home, () => {} )
        this.homeBtn.anchor.set(0, 1)
        this.bookBtn = new TapIcon( atlases.ui.textures.ui_book, () => {} )
        this.bookBtn.anchor.set(1, 1)
        this.settingsBtn = new TapIcon( atlases.ui.textures.ui_settings, () => {} )
        this.settingsBtn.anchor.set(1, 0)
        this.shineBar = new ShineBar()
        this.addChild(this.homeBtn, this.bookBtn, this.settingsBtn, this.shineBar)

        EventHub.on( events.addShineBall, this.addShineBall, this )

        setMusicList([music.bgm_0, music.bgm_1, music.bgm_2, music.bgm_3, music.bgm_4])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        this.bg.screenResize(screenData)

        this.homeBtn.position.set(-screenData.centerX, screenData.centerY)
        this.bookBtn.position.set(screenData.centerX, screenData.centerY)
        this.settingsBtn.position.set(screenData.centerX, -screenData.centerY)
        this.shineBar.position.set(-screenData.centerX, -screenData.centerY)

        const freeWidth = screenData.width - FIELD_OFFSET_X * 2
        const freeHeight = screenData.height - FIELD_OFFSET_Y * 2
        const fieldScaleX = Math.min(1, freeWidth / this.fieldWidth)
        const fieldScaleY = Math.min(1, freeHeight / this.fieldHeight)
        const fieldScale = Math.min(fieldScaleX, fieldScaleY)
        this.field.scale.set(fieldScale)
        const fieldScaledWidth = this.fieldWidth * fieldScale
        const fieldScaledHeight = this.fieldHeight * fieldScale
        const fieldX = -fieldScaledWidth * 0.5
        const fieldY = -fieldScaledHeight * 0.5
        this.field.position.set(fieldX, fieldY)
    }

    userDoStep() {
        this.stepsCount++
    }

    addShineBall( data ) {
        if (data.points) {
            // from merge to bar
            this.addChild( new ShineBall(
                this.toLocal( data.globalPoint ),
                {x: this.shineBar.position.x + 60, y: this.shineBar.position.y + 120},
                this.shineBar,
                data.points
            ))
        } else {
            // magic from bar
            const targetCeilIndex = this.field.getMagicTargetCeilIndex()
            const targetCeil = this.field.ceils.children[targetCeilIndex]

            this.addChild( new ShineBall(
                {x: this.shineBar.position.x + 60, y: this.shineBar.position.y + 120},
                this.toLocal( targetCeil.getGlobalPosition() ),
                targetCeil,
                10
            ))
        }
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
        EventHub.off( events.userDoStep, this.userDoStep, this )
    }
}