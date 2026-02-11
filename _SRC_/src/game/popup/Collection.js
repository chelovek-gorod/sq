import { Container, Graphics, Sprite } from "pixi.js";
import { images, atlases } from "../../app/assets";
import { FIELD_OFFSET_Y, FIELD_OFFSET_X, LEVEL_PET, PET_DATA, PLACE_PETS } from "../scenes/game/constants";
import { availablePetLevel } from "../state";

const BG = {
    width: 1400,
    height: 1280,
    offset: 36,
}

const psx = 30 // pet start x
const pdx = 126 // pet offset x
const psy = 1020 // pets start y
const pdy = 244 // pets offset y
const POINTS = [
    {x: psx + pdx * 0, y: psy - pdy * 0},
    {x: psx + pdx * 1, y: psy - pdy * 0},
    {x: psx + pdx * 2, y: psy - pdy * 0},
    {x: psx + pdx * 3, y: psy - pdy * 0},
    {x: psx + pdx * 4, y: psy - pdy * 0},
    {x: psx + pdx * 5, y: psy - pdy * 0},
    {x: psx + pdx * 6, y: psy - pdy * 0},
    {x: psx + pdx * 7, y: psy - pdy * 0},
    {x: psx + pdx * 8, y: psy - pdy * 0},
    {x: psx + pdx * 9, y: psy - pdy * 0},

    {x: psx + pdx * 0, y: psy - pdy * 1},
    {x: psx + pdx * 1, y: psy - pdy * 1},
    {x: psx + pdx * 2, y: psy - pdy * 1},
    {x: psx + pdx * 3, y: psy - pdy * 1},
    {x: psx + pdx * 4, y: psy - pdy * 1},
    {x: psx + pdx * 5, y: psy - pdy * 1},
    {x: psx + pdx * 6, y: psy - pdy * 1},
    {x: psx + pdx * 7, y: psy - pdy * 1},
    {x: psx + pdx * 8, y: psy - pdy * 1},
    {x: psx + pdx * 9, y: psy - pdy * 1},

    {x: psx + pdx * 0, y: psy - pdy * 2},
    {x: psx + pdx * 1, y: psy - pdy * 2},
    {x: psx + pdx * 2, y: psy - pdy * 2},
    {x: psx + pdx * 3, y: psy - pdy * 2},
    {x: psx + pdx * 4, y: psy - pdy * 2},
    {x: psx + pdx * 5, y: psy - pdy * 2},
    {x: psx + pdx * 6, y: psy - pdy * 2},
    {x: psx + pdx * 7, y: psy - pdy * 2},
    {x: psx + pdx * 8, y: psy - pdy * 2},
    {x: psx + pdx * 9, y: psy - pdy * 2},

    {x: psx + pdx * 0, y: psy - pdy * 3},
    {x: psx + pdx * 1, y: psy - pdy * 3},
    {x: psx + pdx * 2, y: psy - pdy * 3},
    {x: psx + pdx * 3, y: psy - pdy * 3},
    {x: psx + pdx * 4, y: psy - pdy * 3},
    {x: psx + pdx * 5, y: psy - pdy * 3},
    {x: psx + pdx * 6, y: psy - pdy * 3},
    {x: psx + pdx * 7, y: psy - pdy * 3},
    {x: psx + pdx * 8, y: psy - pdy * 3},
    {x: psx + pdx * 9, y: psy - pdy * 3},

    {x: psx + pdx * 0, y: psy - pdy * 4},
    {x: psx + pdx * 1, y: psy - pdy * 4},
    {x: psx + pdx * 2, y: psy - pdy * 4},
    {x: psx + pdx * 3, y: psy - pdy * 4},
    {x: psx + pdx * 4, y: psy - pdy * 4},
    {x: psx + pdx * 5, y: psy - pdy * 4},
    {x: psx + pdx * 6, y: psy - pdy * 4},
    {x: psx + pdx * 7, y: psy - pdy * 4},
    {x: psx + pdx * 8, y: psy - pdy * 4},
    {x: psx + pdx * 9, y: psy - pdy * 4},
]

class Pet extends Sprite {
    constructor(type) {
        super( atlases.pets.textures[LEVEL_PET[type]] )

        this.scale.set(0.7)

        this.type = type
        this.name = LEVEL_PET[this.type]
        this.place = Object.entries(PLACE_PETS).find(([place, pets]) => pets.includes(this.name))
        
        this.eventMode = 'static'
        this.cursor = 'pointer'

        this.on('pointerdown', this.onClick, this)
        this.on('pointerup', this.onClickEnd, this)

        const x = POINTS[type - 1] ? POINTS[type - 1].x : 0
        const y = POINTS[type - 1] ? POINTS[type - 1].y : 0
        this.position.set(x, y)
    }

    onClick() {

    }
    onClickEnd() {

    }

    kill() {
        this.cursor = 'none'
        this.off('pointerdown', this.onClick, this)
        this.off('pointerup', this.onClickEnd, this)
    }
}

export default class Collection extends Container {
    constructor() {
        super()
        this.overlay = new Graphics()
        this.overlay.eventMode = 'static'
        this.addChild(this.overlay)

        this.container = new Container()
        this.addChild(this.container)

        this.bg = new Sprite(images.collection_bg)
        this.container.addChild(this.bg)

        this.pets = new Container()
        this.container.addChild(this.pets)

        for(let i = 1; i <= availablePetLevel; i++) this.addPet(i)
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

        const scaleX = (screenData.width - BG.offset * 2) / BG.width
        const scaleY = (screenData.height - BG.offset * 2) / BG.height
        const scale = Math.min(scaleX, scaleY)
        this.container.scale.set(scale)

        const x = -BG.width * scale * 0.5
        const y = -BG.height * scale * 0.5
        this.container.position.set( x, y)
    }

    addPet(i) {
        this.pets.addChild( new Pet(i) )
    }
}