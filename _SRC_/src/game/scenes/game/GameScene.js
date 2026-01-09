import { Container, Graphics, Sprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music } from '../../../app/assets'
import { EventHub, events } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import BackgroundGradient from '../../BG/BackgroundGradient'
import { getLanguage } from '../../localization'
import { CEIL_DATA, FIELD_OFFSET } from './constants'
import GameField from './GameField'

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
            map: [
                '.........<O-01>.........',
                '......<S-01><J-01>......',
                '...<F-01><A-SS><O-01>...',
                '<S-01><J-SS><F-SS><A-01>',
                '...<O-01><S-SS><J-01>...',
                '<S-01><J-SS><F-SS><A-01>',
                '...<O-01><S-SS><J-01>...',
                '......<F-01><A-01>......',
                '.........<O-01>.........',
            ],
            width: 0,
            height:0, /* 1 + 0.5 * 6 */
        }
        this.level.width = +((this.level.map[0].length / 6).toFixed(1))
        this.level.height = (this.level.map.length + 1) * 0.5

        this.bg = new BackgroundGradient([0x00ff00, 0x000000])
        this.addChild(this.bg)

        this.field = new GameField(this.level)
        this.addChild(this.field)

        setMusicList([music.bgm_0, music.bgm_1, music.bgm_2, music.bgm_3, music.bgm_4])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        this.bg.screenResize(screenData)

        const fieldWidth = this.level.width * CEIL_DATA.size + (this.level.width * 2 - 1) * CEIL_DATA.offsetX
        const fieldHeight = this.level.height * CEIL_DATA.size
        const freeWidth = screenData.width - FIELD_OFFSET * 2
        const freeHeight = screenData.height - FIELD_OFFSET * 2
        const fieldScaleX = Math.min(1, freeWidth / fieldWidth)
        const fieldScaleY = Math.min(1, freeHeight / fieldHeight)
        const fieldScale = Math.min(fieldScaleX, fieldScaleY)
        this.field.scale.set(fieldScale)
        const fieldScaledWidth = fieldWidth * fieldScale
        const fieldScaledHeight = fieldHeight * fieldScale
        const fieldX = -fieldScaledWidth * 0.5
        const fieldY = -fieldScaledHeight * 0.5
        this.field.position.set(fieldX, fieldY)
    }

    userDoStep() {
        this.stepsCount++
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
        EventHub.off( events.userDoStep, this.userDoStep, this )
    }
}