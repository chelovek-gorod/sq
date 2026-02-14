import { Container, Sprite, DisplacementFilter } from "pixi.js";
import { tickerAdd } from "../../app/application";
import { images } from "../../app/assets";

const minScale = 0.5
const maxScale = 1
const scaleSpeed = 0.0003
const startScales = [1, 0.5, 0.75]

export default class WinDisc extends Container {
    constructor() {
        super()

        this.DPFSprite = new Sprite(images.dpf_radial)
        this.DPFSprite.anchor.set(0.5)
        this.DPFSprite.texture.source.style.addressMode = 'repeat'
        this.addChild(this.DPFSprite)

        this.DPFilter = new DisplacementFilter( this.DPFSprite )

        this.filteredContainer = new Container()
        this.filteredContainer.filters = [this.DPFilter]
        this.addChild(this.filteredContainer)

        this.starA = new Sprite(images.star_radial_3)
        this.starA.alpha = 0.7
        this.starA.anchor.set(0.5)
        this.starA.scale.set(startScales[0])
        this.starA.blendMode = 'add'
        this.starA.isScaleUp = false

        this.starB = new Sprite(images.star_radial_2)
        this.starB.alpha = 0.7
        this.starB.anchor.set(0.5)
        this.starB.scale.set(startScales[1])
        this.starB.blendMode = 'add'
        this.starB.isScaleUp = true

        this.starC = new Sprite(images.star_radial_1)
        this.starC.alpha = 0.7
        this.starC.anchor.set(0.5)
        this.starC.scale.set(startScales[2])
        this.starC.blendMode = 'add'
        this.starC.isScaleUp = false

        this.filteredContainer.addChild(this.starA, this.starB, this.starC)

        tickerAdd(this)
    }

    tick(time) {
        this.starA.rotation += time.deltaMS * 0.00012
        this.starB.rotation -= time.deltaMS * 0.00006
        this.DPFSprite.rotation -= time.deltaMS * 0.00003

        const scaleStep = scaleSpeed * time.deltaMS

        if (this.starA.isScaleUp) {
            this.starA.scale.set( Math.min( maxScale, this.starA.scale.x + scaleStep ) )
            if (this.starA.scale.x === maxScale) this.starA.isScaleUp = false
        } else {
            this.starA.scale.set( Math.max( minScale, this.starA.scale.x - scaleStep ) )
            if (this.starA.scale.x === minScale) this.starA.isScaleUp = true
        }
        this.starA.alpha = 1 - this.starA.scale.x * 0.75

        if (this.starB.isScaleUp) {
            this.starB.scale.set( Math.min( maxScale, this.starB.scale.x + scaleStep ) )
            if (this.starB.scale.x === maxScale) this.starB.isScaleUp = false
        } else {
            this.starB.scale.set( Math.max( minScale, this.starB.scale.x - scaleStep ) )
            if (this.starB.scale.x === minScale) this.starB.isScaleUp = true
        }
        this.starB.alpha = 1 - this.starA.scale.x * 0.75

        if (this.starC.isScaleUp) {
            this.starC.scale.set( Math.min( maxScale, this.starC.scale.x + scaleStep ) )
            if (this.starC.scale.x === maxScale) this.starC.isScaleUp = false
        } else {
            this.starC.scale.set( Math.max( minScale, this.starC.scale.x - scaleStep ) )
            if (this.starC.scale.x === minScale) this.starC.isScaleUp = true
        }
        this.starC.alpha = 1 - this.starA.scale.x * 0.75
    }
}