import { Container, Sprite, Text } from "pixi.js";
import { tickerAdd } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { addSpark } from "../../../app/events";
import { styles } from "../../../app/styles";
import StarSpark from "../../effects/SparkParticles";
import { levelStateSparkRemove } from "../../state";
import { PLACE } from "./constants";

const types = Object.keys(PLACE)
let index = -1
const maxIndex = types.length
function getSparkType() {
    index++
    if (index === maxIndex) index = 0
    return types[index]
}

export default class ShineBar extends Container {
    constructor( level = 0 ) {
        super()

        this.level = level * 4

        this.base = new Sprite( atlases.shine_ui.textures.base )
        this.yellow = new Sprite( atlases.shine_ui.textures["0"] )
        this.purple = new Sprite( atlases.shine_ui.textures["0"] )
        this.purple.alpha = 0
        this.sparksPosition = null
        this.text = new Text({text: level + '/10', style: styles.shineCounter})
        this.text.position.set(22, 64)
        this.addChild(this.base, this.yellow, this.purple, this.text)

        this.isUpPurple = true
        this.alphaStep = 1 / 2400

        this.isUpFrame = true
        this.restPoints = 0 // 0-40

        this.resultPoints = 0 // 0-10

        // this.scale.set(0.5)

        tickerAdd(this)
    }

    setPointOnField( point ) {
        this.sparksPosition = point
    }

    useMagic( points = 1 ) {
        this.restPoints += points * 4

        this.resultPoints += points
        if (this.resultPoints < 10) {
            levelStateSparkRemove()
        } else {
            this.resultPoints -= 10
            // this sparks fly to field
        }
    }

    convertPoints() {
        this.isUpFrame = !this.isUpFrame
        if (!this.isUpFrame) return

        this.restPoints--
        this.level++
        if (this.level >= 40) {
            this.level -= 40
            this.parent.addShineBall({
                x: this.sparksPosition ? this.sparksPosition.x : 0,
                y: this.sparksPosition ? this.sparksPosition.y : 0
            })
        }

        this.text.text = (this.level / 4).toFixed() + '/10'

        if (this.level === 0) {
            this.yellow.texture = atlases.shine_ui.textures["0"]
            this.purple.texture = atlases.shine_ui.textures["0"]
        } else {
            this.yellow.texture = atlases.shine_ui.textures[this.level + "Y"]
            this.purple.texture = atlases.shine_ui.textures[this.level + "P"]
        }
    }

    tick(time) {
        if (Math.random() > 0.9 && this.sparksPosition) {
            addSpark({
                x: this.sparksPosition.x,
                y: this.sparksPosition.y,
                type: getSparkType()
            })
        }

        if (this.restPoints) this.convertPoints()
        if (this.level === 0) return

        const alphaStep = this.alphaStep * time.deltaMS
        if (this.isUpPurple) {
            this.purple.alpha = Math.min(1, this.purple.alpha + alphaStep)
            if (this.purple.alpha === 1) this.isUpPurple = false
        } else {
            this.purple.alpha = Math.max(0, this.purple.alpha - alphaStep)
            if (this.purple.alpha === 0) this.isUpPurple = true
        }
    }
}