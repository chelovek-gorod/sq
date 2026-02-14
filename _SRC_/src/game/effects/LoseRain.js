import { Container, Sprite } from "pixi.js";
import { tickerAdd } from "../../app/application";
import { images } from "../../app/assets";
import { getRandom } from "../../utils/functions";

const minX = -130
const maxX = 140
const minY = -100
const maxY = 120
const offsetRangeY = 60
const minScale = 0.5
const maxScale = 1
const speed = 0.06

class Drop extends Sprite {
    constructor(x, y, stopY, scale) {
        super(images.result_drop)
        this.anchor.set(0.5)
        this.scale.set(scale)
        this.speed = speed + speed * 0.5 * scale
        this.position.set(x, y)
        this.stopY = stopY
    }

    reset() {
        this.scale.set( getRandom(minScale, maxScale) )
        this.speed = speed + speed * 0.5 * this.scale.x
        this.stopY = maxY + offsetRangeY * this.scale.x
        this.position.set(getRandom(minX, maxX), minY)
    }
}

export default class LoseRain extends Container {
    constructor() {
        super()

        this.drops = 16
        for(let i = this.drops; i > 0; i--) this.addDrop()

        tickerAdd(this)
    }

    addDrop() {
        const scale = getRandom(minScale, maxScale)
        const stopY = maxY + offsetRangeY * scale
        const x = getRandom(minX, maxX)
        const y = getRandom(minY, stopY)

        this.addChild( new Drop(x, y, stopY, scale) )
    }

    tick(time) {
        for (let i = this.drops - 1; i >= 0; i--) {
            const drop = this.children[i]
            drop.y += drop.speed * time.deltaMS
            if (drop.y > drop.stopY) drop.reset()
        }
    }
}