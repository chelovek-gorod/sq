import { Container } from 'pixi.js'
import { atlases, music } from '../../../app/assets'
import { EventHub, events } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import BackgroundImage from '../../BG/BackgroundImage'
import BackgroundGradient from '../../BG/BackgroundGradient'
import { getLanguage } from '../../localization'
import TapIcon from '../../UI/TapIcon'
import { CEIL_DATA, FIELD_OFFSET_X, FIELD_OFFSET_Y, PLACE } from './constants'
import GameField from './GameField'
import ShineBall from './ShineBall'
import ShineBar from './ShineBar'
import Collection from '../../popup/Collection'
import FlyText from '../../effects/FlyText'

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
            /*
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
            */
            /*
            map: [
                '............<O-01>............',
                '.........<F-02><A-03>.........',
                '......<O-04><S-05><J-06>......',
                '...<S-07><J-08><F-09><A-10>...',
                '<O-11><S-12><S-13><S-14><J-15>',
                '...<S-16><J-17><F-18><A-19>...',
                '<O-20><S-21><S-22><S-24><J-24>',
                '...<S-25><J-26><F-27><A-28>...',
                '......<O-29><S-30><J-31>......',
                '.........<F-32><A-33>.........',
                '............<O-01>............',
            ],

            */

            map: [
                '........................',
                '........................',
                '.........<S-01>.........',
                '......<J-01><F-01>......',
                '.........<S-01>.........',
                '........................',
                '........................',
            ],
            
            bg: Object.keys(PLACE)[ Math.floor(Math.random() * 5) ]
        }

        const levelCeilsInWidth = this.level.map[0].length / 6
        const levelCeilsInHeight = (this.level.map.length + 1) / 2
        this.fieldWidth = levelCeilsInWidth * CEIL_DATA.width
        this.fieldHeight = levelCeilsInHeight * CEIL_DATA.height

        //this.bg = new BackgroundImage( images[this.level.bg + '_bg'] )
        // [центр, края]
        // [0x408b96, 0x421155]
        // [0xac3bc4, 0x28aeb1]
        // [0xc56073, 0x321a23]
        this.bg = new BackgroundGradient( [0xac3bc4, 0x28aeb1, 0x28aeb1] ) // [0x767275, 0xff9600] [0x767275, 0xb0027d]
        this.addChild(this.bg)

        this.shineBar = new ShineBar()
        this.addChild(this.shineBar)

        this.field = new GameField(this.level)
        this.addChild(this.field)

        this.collection = new Collection()
        this.collection.visible = false
        this.addChild(this.collection)

        this.homeBtn = new TapIcon( atlases.ui.textures.ui_home, () => {} )
        this.homeBtn.anchor.set(0, 1)
        this.bookBtn = new TapIcon( atlases.ui.textures.ui_book, this.clickBook.bind(this) )
        this.bookBtn.anchor.set(1, 1)
        this.settingsBtn = new TapIcon( atlases.ui.textures.ui_settings, () => {} )
        this.settingsBtn.anchor.set(1, 0)
        
        this.addChild(this.homeBtn, this.bookBtn, this.settingsBtn)

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

        // 120 x 150
        const shineBarCenter = {x: this.shineBar.position.x + 55, y: this.shineBar.position.y + 65}
        this.shineBar.setPointOnField( this.field.toLocal(shineBarCenter, this) )
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
            targetCeil.pet = true

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

    clickBook() {
        this.collection.visible = !this.collection.visible
        if (this.collection.visible) this.bookBtn.texture = atlases.ui.textures.ui_close_book
        else this.bookBtn.texture = atlases.ui.textures.ui_book
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
        EventHub.off( events.userDoStep, this.userDoStep, this )
        EventHub.off( events.addFlyText, this.addFlyText, this )
    }
}