import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { kill, tickerAdd, tickerRemove } from "../../app/application";
import { images, atlases } from "../../app/assets";
import { EventHub, events, setMapCameraInteractive, startScene } from "../../app/events";
import { styles } from "../../app/styles";
import { removeCursorPointer, setCursorPointer } from "../../utils/functions";
import { SCENE_NAME } from "../scenes/constants";
import { FIELD_OFFSET_Y, FIELD_OFFSET_X } from "../scenes/game/constants";
import { POINTS, TASK } from "../scenes/world/constants";
import { setLevelTask, world } from "../state";
import Button from "../UI/Button";

const CARD = {
    width: 280,
    height: 320,
    offset: 0,

    minScale: 0.9,
    maxScale: 1,
    scaleStep: 0.0006,
}

const BUTTON_SIZE = 100

const DATA = {
    1: [{x: 0, y: 0}],
    2: [{x: -CARD.offset * 0.5 + -CARD.width * 0.5, y: 0}, {x: CARD.offset * 0.5 + CARD.width * 0.5, y: 0}],
    3: [{x: -CARD.width + -CARD.offset, y: 0}, {x: 0, y: 0}, {x: CARD.width + CARD.offset, y: 0}],
    width: CARD.width * 3 + CARD.offset * 6 + BUTTON_SIZE * 2,
    height: CARD.height + CARD.offset * 4 + BUTTON_SIZE,
}

class Card extends Container {
    constructor(index, point, task, state) {
        super()

        this.scale.set( CARD.minScale )
        this.position.set(point.x, point.y)

        this.bg = new Sprite( atlases.task.textures[index] )
        this.bg.anchor.set(0.5)
        this.addChild(this.bg)

        // task = {type: TASK.NEW, value: 2, turns: 0, levelIndex: 0}
        this.levelTask = task

        const taskSprite = task.type + (task.turns ? '_' + TASK.TIME : '')
        this.image = new Sprite( atlases.task.textures[taskSprite] )
        this.image.anchor.set(0.5)
        this.addChild(this.image)

        const isDone = state && state[index] > 0
        this.doneImage = new Sprite( isDone ? atlases.task.textures.done : Texture.EMPTY )
        this.doneImage.anchor.set(0.5)
        this.addChild(this.doneImage)

        const taskCountText = task.type === TASK.NEW
            ? '+1'
            : task.value + (task.turns ? '/' + task.turns : '')
        this.countText = new Text({text: taskCountText, style: styles.cardCount})
        this.countText.anchor.set(0.5)
        this.countText.position.set(0, 110)
        this.addChild(this.countText)

        setCursorPointer(this)
        this.on('pointerdown', this.click, this)
        this.on('pointerover', this.onHover, this)
        this.on('pointerout', this.onOut, this)

        this.isOnHover = false
    }

    click() {
        setLevelTask( this.levelTask )
        startScene( SCENE_NAME.Game )
    }

    onHover() {
        if (this.isOnHover) return

        this.isOnHover = true
        tickerAdd(this)
    }

    onOut() {
        if (!this.isOnHover) return

        this.isOnHover = false
        tickerAdd(this)
    }

    tick(time) {
        const scaleAdd = CARD.scaleStep * time.deltaMS
        if (this.isOnHover) {
            this.scale.set( Math.min(CARD.maxScale, this.scale.x + scaleAdd) )
            if (this.scale.x === CARD.maxScale) tickerRemove(this)
        } else {
            this.scale.set( Math.max(CARD.minScale, this.scale.x - scaleAdd) )
            if (this.scale.x === CARD.minScale) tickerRemove(this)
        }
    }

    kill() {
        tickerRemove(this)
        removeCursorPointer(this)
        this.off('pointerdown', this.click, this)
        this.off('pointerover', this.onHover, this)
        this.off('pointerout', this.onOut, this)
    }
}

export default class LevelCards extends Container {
    constructor() {
        super()

        this.visible = false

        this.overlay = new Graphics()
        this.overlay.eventMode = 'static'
        this.addChild(this.overlay)

        this.container = new Container()
        this.addChild(this.container)

        this.cards = new Container()
        this.container.addChild(this.cards)

        this.closeBtn = new Button( images.button_icon_close, '', this.closeCards.bind(this) )
        this.closeBtn.scale.set(0.75)
        this.container.addChild(this.closeBtn)

        EventHub.on( events.showLevelCards, this.showLevelCards, this )
    }

    screenResize(screenData) {
        this.overlay.clear()
        this.overlay.rect(
            -screenData.centerX - FIELD_OFFSET_X,
            -screenData.centerY - FIELD_OFFSET_Y,
            screenData.width + FIELD_OFFSET_X * 2,
            screenData.height + FIELD_OFFSET_Y * 2
        )
        this.overlay.fill({ color: 0x000000, alpha: 0.5 })

        const scaleX = screenData.width / DATA.width
        const scaleY = screenData.height / DATA.height
        const scale = Math.min(1, scaleX, scaleY)
        this.container.scale.set(scale)
    }

    showLevelCards(mapPointIndex) {
        setMapCameraInteractive( false )
        const tasksCount = POINTS[mapPointIndex].tasks.length

        for(let i = 0; i < tasksCount; i++) {
            this.cards.addChild( new Card(
                i,
                DATA[tasksCount][i],
                POINTS[mapPointIndex].tasks[i],
                world[mapPointIndex],
            ))
        }

        const x = DATA[tasksCount][tasksCount - 1].x + CARD.width * 0.5 + BUTTON_SIZE * 0.25
        const y = -CARD.height * 0.5
        this.closeBtn.position.set( x, y )

        this.visible = true
    }

    closeCards() {
        this.cards.children.forEach( card => kill(card) )
        this.visible = false
        setMapCameraInteractive( true )
    }

    kill() {
        EventHub.off( events.showLevelCards, this.showLevelCards, this )
    }
}