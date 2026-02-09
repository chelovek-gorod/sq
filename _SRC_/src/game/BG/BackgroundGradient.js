import { Sprite, Texture } from "pixi.js"
import { getAppScreen } from "../../app/application"
import { getRecTexture } from "../../utils/textureGenerator"
import { BG_GRADIENT_COLORS, BG_GRADIENT_NAME } from "../scenes/game/constants"

let bg = null
let dx = null
let bgColorsIndex = 0
const colorKeys = Object.keys( BG_GRADIENT_NAME )

export default class BackgroundGradient extends Sprite {
    constructor(colors) {
        super()
        this.colors = BG_GRADIENT_COLORS[ colorKeys[bgColorsIndex] ] // colors
        this.anchor.set(0.5)

        /* color piker */
        bg = this
        dx = document.createElement('div')
        dx.style = `position: absolute; top: 10px; left: 10px; width: 100%; text-align: center;`
        bg.cList = []
        for(let i = 0; i < 3; i++) {
            bg.cList[i] = document.createElement('input')
            bg.cList[i].type = 'color'
            bg.cList[i].value = '#' + this.colors[i].toString(16).padStart(6, '0')
            bg.cList[i].onchange = (e) => updateColor(e.target.value, i)
            dx.append(bg.cList[i])
        }
        const btn = document.createElement('input')
        btn.type = 'button'
        btn.style = 'padding: 1.5px 12px; font-size: 18px; font-weight: bold; vertical-align: top;'
        btn.value = 'BG'
        btn.onclick = () => {
            bgColorsIndex++
            if (bgColorsIndex === colorKeys.length) bgColorsIndex = 0
            bg.setColors( BG_GRADIENT_COLORS[ colorKeys[bgColorsIndex] ] )
            bg.cList.forEach((c, i) => c.value = '#' +  this.colors[i].toString(16).padStart(6, '0'))
            console.log(colorKeys[bgColorsIndex])
        }
        dx.append(btn)
        document.body.append(dx)

        function updateColor(color, index) {
            const colors = [...bg.colors]
            colors[index] = color
            bg.setColors(colors)
        }
        /* */
    }

    screenResize(screenData) {
        // перед заменой текстуры — уничтожаем старую (если она была создана здесь)
        if (this.texture) {
            this.texture.destroy(true)
            this.texture = Texture.EMPTY
        }

        this.fill = this.getFillFromColors(screenData.width, screenData.height, this.colors)
        this.texture = getRecTexture(
            Math.ceil(screenData.width), Math.ceil(screenData.height), this.fill
        )
        // позиционирование/размер, т.к. мы центральный спрайт:
        this.width = screenData.width
        this.height = screenData.height
        this.anchor.set(0.5)
    }

    setColors(colors) {
        this.colors = colors
        this.screenResize(getAppScreen())
    }

    getFillFromColors(width, height, colors) {
        const centerX = width / 2
        const centerY = height / 2
        const maxRadius = Math.max(width, height) / 2

        return {
            type: 'radial-gradient',
            stops: colors.map((color, index) => ({
                offset: index / (colors.length - 1),
                color: color
            })),
            x0: centerX,
            y0: centerY,
            radius0: 0,
            x1: centerX,
            y1: centerY,
            radius1: maxRadius
        }
    }

    kill() {
        if (this.texture) this.texture.destroy(true)
        if (dx) dx.remove()
    }
}