import { Container } from 'pixi.js'
import { atlases, music } from '../../../app/assets'
import { EventHub, events, startScene } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import { getLanguage } from '../../localization'
import TapIcon from '../../UI/TapIcon'
import Collection from '../../popup/Collection'
import WorldMap from './WorldMap'
import FirefliesContainer from '../../effects/Fireflies'
import LevelCards from '../../popup/LevelCards'
import { SCENE_NAME } from '../constants'
import Popup from '../../popup/Popup'

export default class World extends Container {
    constructor() {
        super()
        this.alpha = 0

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        this.worldMap = new WorldMap()
        this.addChild(this.worldMap)

        this.fireflies = new FirefliesContainer()
        this.addChild(this.fireflies)

        this.collection = new Collection()
        this.collection.visible = false
        this.addChild(this.collection)

        this.searchBtn = new TapIcon( atlases.ui.textures.ui_search, this.clickSearch.bind(this) )
        this.searchBtn.anchor.set(0, 0)
        this.homeBtn = new TapIcon( atlases.ui.textures.ui_home, this.clickHome.bind(this) )
        this.homeBtn.anchor.set(0, 1)
        this.bookBtn = new TapIcon( atlases.ui.textures.ui_book, this.clickBook.bind(this) )
        this.bookBtn.anchor.set(1, 1)
        this.settingsBtn = new TapIcon( atlases.ui.textures.ui_settings, this.clickSettings.bind(this) )
        this.settingsBtn.anchor.set(1, 0)
        
        this.addChild(this.searchBtn, this.homeBtn, this.bookBtn, this.settingsBtn)

        this.levelCards = new LevelCards()
        this.addChild(this.levelCards)

        this.popup = new Popup()
        this.addChild(this.popup)

        setMusicList([ music.bgm_0 ])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        this.worldMap.screenResize(screenData)

        this.levelCards.screenResize(screenData)

        this.collection.screenResize(screenData)

        this.popup.screenResize(screenData)

        this.searchBtn.position.set(-screenData.centerX, -screenData.centerY)
        this.homeBtn.position.set(-screenData.centerX, screenData.centerY)
        this.bookBtn.position.set(screenData.centerX, screenData.centerY)
        this.settingsBtn.position.set(screenData.centerX, -screenData.centerY)
    }

    clickSearch() {
        this.worldMap.setFocusPoint()
    }

    clickBook() {
        this.collection.visible = !this.collection.visible
        if (this.collection.visible) this.bookBtn.texture = atlases.ui.textures.ui_close_book
        else this.bookBtn.texture = atlases.ui.textures.ui_book
    }

    clickHome() {
        if (this.collection.visible) {
            this.clickBook()
            return
        }
        
        startScene( SCENE_NAME.Menu )
    }

    clickSettings() {

    }

    updateLanguage(lang) {
        this.currentLanguage = lang
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
    }
}