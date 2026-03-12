import { Particle, ParticleContainer, ColorMatrixFilter } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../app/application";
import { atlases } from "../../app/assets";
import { EventHub, events } from "../../app/events";
import { PLACE } from "../scenes/level/constants";

const CEIL_HALF_SIZE = 120
const CEIL_SIZE = CEIL_HALF_SIZE * 2
const STAR = {
    scaleMin: 0.01,
    scaleMax: 0.75,
    speedX: 0.006,
    speedY: 0.03,
    lifeTimeMin: 900,
    lifeTimeDelta: 900,
    alphaStep: 0.0006,
    scaleStep: 0.0006,
    rotationSpeed: 0.0003,
    alphaMax: 1.0,
}

let sparkIndex = Math.floor( Math.random() * 13 ) // 0...12
const lastSparkIndex = 12
const getSparkIndex = () => {
    sparkIndex++
    if (sparkIndex > lastSparkIndex) sparkIndex = 0
    return sparkIndex
}
let sparkColorIndex = Math.floor( Math.random() * 7 ) // 0...6
const lastSparkColorIndex = 6
const getSparkColor = (type) => {
    sparkColorIndex++
    if (sparkColorIndex > lastSparkColorIndex) sparkColorIndex = 0
    return COLORS[type][sparkColorIndex ? sparkColorIndex : 0]
}

const getSparkPosition = (x, y) => {
    const rx = -CEIL_HALF_SIZE + Math.random() * CEIL_SIZE
    const ry = -CEIL_HALF_SIZE + Math.random() * CEIL_SIZE
    return {x: x + rx, y: y + ry}
}

// aqua, blue, green, purple, red, white, yellow
const COLORS = {
    [PLACE.Arctic]:   ['white', 'aqua', 'white', 'purple', 'white', 'aqua', 'white'],
    [PLACE.Farm]:     ['red', 'green', 'red', 'purple', 'red', 'green', 'red'],
    [PLACE.Jungle]:   ['green', 'blue', 'green', 'purple', 'green', 'blue', 'green'],
    [PLACE.Ocean]:    ['blue', 'aqua', 'blue', 'purple', 'blue', 'aqua', 'blue'],
    [PLACE.Savannah]: ['yellow', 'red', 'yellow', 'purple','yellow', 'red', 'yellow'],
    multi: ['aqua', 'red', 'yellow', 'blue','white', 'green', 'purple']
}

export default class SparkParticles {
    constructor(isAutoFilling = false) {
        this.isAutoFilling = isAutoFilling
        this.fillingTimeout = 30
        this.fillingTime = 0

        this.container = new ParticleContainer({
            dynamicProperties: {
                position: true,
                rotation: true,
                scale: true,
                alpha: true,
                color: false,
            }
        })
        this.container.blendMode = isAutoFilling ? 'normal' : 'add'

        this.pull = []
        this.sparks = []

        for(let i = 1000; i > 0; i--) this.addSpark({x:0, y:0, type: 'multi'}, true)

        EventHub.on( events.addSpark, this.addSpark, this )

        tickerAdd(this)
    }

    addSpark(data, isPreparing = false) {
        const isFast = 'isFast' in data ? data.isFast : false
        if (this.pull.length && !isPreparing) return this.setUpSpark(data.x, data.y, data.type, isFast)

        const point = getSparkPosition(data.x, data.y)
        const spark = new Particle({
            texture: atlases.stars.textures[getSparkColor(data.type) + getSparkIndex()],
            x: point.x,
            y: point.y,
            anchorX: 0.5,
            anchorY: 0.5,
            scaleX: STAR.scaleMin,
            scaleY: STAR.scaleMin,
            rotation: Math.PI * Math.random(),
            alpha: 0,
        })

        spark.lifeData = {
            rotationSpeed: STAR.rotationSpeed + Math.random() * STAR.rotationSpeed,
            alphaStep: isFast ? STAR.alphaStep * 2 : STAR.alphaStep,
            isUp: true,
            scaleStep: isFast ? STAR.scaleStep * 2 : STAR.scaleStep,
            speedX: isFast ? 0 : point.x < data.x ? -STAR.speedX : STAR.speedX,
            speedY: isFast ? 0 : -STAR.speedY,
            time: isFast
                ?  STAR.lifeTimeMin * 0.75
                :  STAR.lifeTimeMin + Math.random() * STAR.lifeTimeDelta
        }

        if (isPreparing) return this.pull.push(spark)

        this.container.addParticle(spark)
        this.sparks.push(spark)
    }

    setUpSpark(x, y, type, isFast) {
        const point = getSparkPosition(x, y)
        const spark = this.pull.pop()
        spark.texture = atlases.stars.textures[getSparkColor(type) + getSparkIndex()]
        spark.x = point.x
        spark.y = point.y
        spark.scaleX = STAR.scaleMin
        spark.scaleY = STAR.scaleMin
        spark.rotation = Math.PI * Math.random()
        spark.alpha = 0

        spark.lifeData.rotationSpeed = STAR.rotationSpeed + Math.random() * STAR.rotationSpeed
        spark.lifeData.alphaStep = isFast ? STAR.alphaStep * 2 : STAR.alphaStep
        spark.lifeData.isUp = true
        spark.lifeData.scaleStep = isFast ? STAR.scaleStep * 2 : STAR.scaleStep
        spark.lifeData.speedX = isFast ? 0 : point.x < x ? -STAR.speedX : STAR.speedX
        spark.lifeData.speedY = isFast ? 0 : -STAR.speedY

        spark.lifeData.time = isFast
            ?  STAR.lifeTimeMin * 0.75
            :  STAR.lifeTimeMin + Math.random() * STAR.lifeTimeDelta

        this.container.addParticle(spark)
        this.sparks.push(spark)
    }

    tick(time) {
        const sparks = this.sparks
        for (let i = sparks.length - 1; i >= 0; i--) {
            const sp = sparks[i]
            const sd = sp.lifeData

            sp.x += time.deltaMS * sd.speedX
            sp.y += time.deltaMS * sd.speedY
            sd.time -= time.deltaMS

            sp.rotation += time.deltaMS * sd.rotationSpeed

            const scaleStep = sd.scaleStep * time.deltaMS
            const alphaStep = sd.alphaStep * time.deltaMS
            
            if (sd.time < 0) {
                if (sp.alpha > 0) {
                    sp.alpha = Math.max(0, sp.alpha - alphaStep) 
                    const scale = Math.max(STAR.scaleMin, sp.scaleX - scaleStep)
                    sp.scaleX = scale
                    sp.scaleY = scale
                } else {
                    this.container.removeParticle( sp )
                    this.pull.push( sp )

                    if (i !== sparks.length - 1) {
                        sparks[i] = sparks[sparks.length - 1]
                    }
                    sparks.pop()
                }
            } else {
                if (sd.isUp) {
                    sp.alpha = Math.min(STAR.alphaMax, sp.alpha + alphaStep) 
                    const scale = Math.min(STAR.scaleMax, sp.scaleX + scaleStep)
                    sp.scaleX = scale
                    sp.scaleY = scale
                    if (sp.alpha === STAR.alphaMax) sd.isUp = false
                } else {
                    sp.alpha = Math.max(0, sp.alpha - alphaStep) 
                    const scale = Math.max(STAR.scaleMin, sp.scaleX - scaleStep)
                    sp.scaleX = scale
                    sp.scaleY = scale
                    if (sp.alpha === 0) sd.isUp = true
                }
            }
        }

        if (!this.isAutoFilling) return

        //this.fillingTime -= time.deltaMS
        //if (this.fillingTime > 0) return

        this.fillingTime += this.fillingTimeout
        const x = -500 + Math.random() * 1000
        const y = -500 + Math.random() * 1000
        this.addSpark({x: x, y: y, type: 'multi'})
    }

    kill() {
        EventHub.off( events.addSpark, this.addSpark, this )

        this.isAutoFilling = false
        tickerRemove(this)

        if (this.container) {
            this.container.destroy({ children: true })
            this.container = null
        }

        this.sparks.length = 0
        this.pull.length = 0
    }
}