import { Container } from 'pixi.js'
import { atlases, music } from '../../../app/assets'
import { EventHub, events } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import { getLanguage } from '../../localization'
import TapIcon from '../../UI/TapIcon'
import Collection from '../../popup/Collection'
import WorldMap from './WorldMap'
import FirefliesContainer from '../../effects/Fireflies'

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

        this.homeBtn = new TapIcon( atlases.ui.textures.ui_home, () => {} )
        this.homeBtn.anchor.set(0, 1)
        this.bookBtn = new TapIcon( atlases.ui.textures.ui_book, this.clickBook.bind(this) )
        this.bookBtn.anchor.set(1, 1)
        this.settingsBtn = new TapIcon( atlases.ui.textures.ui_settings, () => {} )
        this.settingsBtn.anchor.set(1, 0)
        
        this.addChild(this.homeBtn, this.bookBtn, this.settingsBtn)

        setMusicList([ music.bgm_0 ])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        this.worldMap.screenResize(screenData)

        this.collection.screenResize(screenData)

        this.homeBtn.position.set(-screenData.centerX, screenData.centerY)
        this.bookBtn.position.set(screenData.centerX, screenData.centerY)
        this.settingsBtn.position.set(screenData.centerX, -screenData.centerY)
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
    }
}