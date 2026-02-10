import { Container, Graphics, Sprite } from "pixi.js";
import { images, atlases } from "../../app/assets";
import { removeCursorPointer, setCursorPointer } from "../../utils/functions";
import { FIELD_OFFSET_Y, LEVEL_PET, PET_DATA, PLACE_PETS } from "../scenes/game/constants";
import { POINTS } from "../scenes/world/constants";

const CARD = {
    width: 280,
    height: 320,
    offset: 20,
}

const DATA = {
    1: [{x: 0, y: 0}],
    2: [{x: -CARD.offset * 0.5 + -CARD.width * 0.5, y: 0}, {x: CARD.offset * 0.5 + CARD.width * 0.5, y: 0}],
    3: [{x: -CARD.width + -CARD.offset, y: 0}, {x: 0, y: 0}, {x: CARD.width + CARD.offset, y: 0}],
    width: [0, CARD.width + CARD.offset * 2, CARD.width * 2 + CARD.offset * 3, CARD.width * 3 + CARD.offset * 4]
}

class Card extends Container {
    constructor(point, task) {
        super()

        setCursorPointer(this)
        this.on('pointerdown', this.click, this)
        this.on('pointerover', this.onHover, this)
        this.on('pointerout', this.onOut, this)

        this.position.set(point.x, point.y)
    }

    click() {

    }
    onHover() {

    }
    onOut() {

    }

    kill() {
        removeCursorPointer(this)
        this.off('pointerdown', this.click, this)
        this.off('pointerover', this.onHover, this)
        this.off('pointerout', this.onOut, this)
    }
}

export default class LevelCards extends Container {
    constructor( mapPointIndex ) {
        super()
        this.overlay = new Graphics()
        this.overlay.eventMode = 'static'
        this.addChild(this.overlay)

        this.container = new Container()
        this.addChild(this.container)

        this.tasksCount = POINTS[mapPointIndex].tasks.length

        for(let i = 1; i <= this.tasksCount; i++) {
            this.container.addChild( new Card(DATA[this.tasksCount][i], POINTS[mapPointIndex].tasks[i]) )
        }
    }

    screenResize(screenData) {
        this.container.position.set( screenData.centerX, screenData.centerY )

        this.overlay.clear()
        this.overlay.rect(
            -screenData.centerX - FIELD_OFFSET_Y,
            -screenData.centerY - FIELD_OFFSET_Y,
            screenData.width + FIELD_OFFSET_Y * 2,
            screenData.height + FIELD_OFFSET_Y * 2
        )
        this.overlay.fill({ color: 0x000000, alpha: 0.5 })

        const scaleX = (screenData.width - 20) / DATA.width[this.tasksCount]
        const scaleY = (screenData.height - 20) / (CARD.height + CARD.offset)
        const scale = Math.min(scaleX, scaleY)
        this.container.scale.set(scale)
    }
}