import { Container, Sprite } from "pixi.js";
import { kill, tickerAdd } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { EventHub, events } from "../../../app/events";
import { CLOUDS_STATE, OBSTACLE } from "./constants";


export default class Clouds extends Container {
    constructor(ceil, turnsToStartStorm = 3) {
        super()

        this.type = OBSTACLE.Clouds
        this.ceil = ceil

        this.state = turnsToStartStorm > 0 ? CLOUDS_STATE.Clouds : CLOUDS_STATE.Storm
        this.turnsToStartStorm = turnsToStartStorm
        this.lightningTimeout = 1200
        this.lightningTimes = [1500, 1200, 900]

        EventHub.on( events.userDoStep, this.userDoStep, this )

        // === НАСТРОЙКИ ПУЛЬСАЦИИ МАСШТАБА ===
        this.pulseMin = 1.1
        this.pulseMax = 1.2
        this.pulseRange = this.pulseMax - this.pulseMin
        this.pulseSpeed = 0.001
        
        // === НАСТРОЙКИ ПОЛЁТА (Y ДВИЖЕНИЕ) ===
        this.flyOffset = 15            // амплитуда движения Y
        this.flySpeed = 0.0005         // скорость полёта
        
        // === НАЧАЛЬНЫЕ СОСТОЯНИЯ КАЖДОГО ОБЛАКА ===
        // 3 облака, для каждого:
        // - startScale: начальный масштаб (1.0, 1.1, 1.1)
        // - startPhasePulse: начальная фаза пульсации
        // - startPhaseFly: начальная фаза полёта
        // - startY: начальное положение Y
        
        // Базовые смещения из fillClouds
        const baseYPositions = [-23, 12, 53]
        
        this.cloudConfigs = [
            { // Облако A
                startScale: 1.0,
                startPhasePulse: 0,                    // 0°
                startPhaseFly: 0,                      // 0°
                baseY: baseYPositions[0],
                startY: baseYPositions[0]
            },
            { // Облако B
                startScale: 1.1,
                startPhasePulse: 2 * Math.PI / 3,      // 120°
                startPhaseFly: 2 * Math.PI / 3,        // 120°
                baseY: baseYPositions[1],
                startY: baseYPositions[1]
            },
            { // Облако C
                startScale: 1.1,
                startPhasePulse: 4 * Math.PI / 3,      // 240°
                startPhaseFly: 4 * Math.PI / 3,        // 240°
                baseY: baseYPositions[2],
                startY: baseYPositions[2]
            }
        ]

        this.cloudA = new Container()
        this.cloudB = new Container()
        this.cloudC = new Container()
        this.addChild(this.cloudA, this.cloudB, this.cloudC)

        this.fillClouds()
        
        // Устанавливаем начальные состояния
        this.clouds = [this.cloudA, this.cloudB, this.cloudC]
        this.clouds.forEach((cloud, index) => {
            const config = this.cloudConfigs[index]
            
            // Начальный масштаб
            cloud.scale.set(config.startScale)
            
            // Начальная позиция Y
            cloud.y = config.startY
            
            // Сохраняем базовые позиции
            cloud.baseY = config.baseY
            cloud.timerPulse = config.startPhasePulse
            cloud.timerFly = config.startPhaseFly

            // таймер молний
            cloud.lightningTime = this.lightningTimes[index]
        })

        this.position.set(ceil.x, ceil.y)
        tickerAdd(this)
    }

    fillClouds() {
        this.children.forEach( (container, index) => {
            container.lightning = new Sprite()
            container.lightningTextureIndex = index
            container.lightning.texture = atlases.clouds.textures["lightning_" + container.lightningTextureIndex]
            container.lightning.anchor.set(0.5)
            container.lightning.alpha = 0
            container.addChild(container.lightning)

            container.cloudDark = new Sprite( atlases.clouds.textures.cloud_dark )
            container.cloudDark.alpha = this.state === CLOUDS_STATE.Storm ? 1 : 0
            container.cloudDark.anchor.set(0.5)
            container.cloudDark.scale.x = index < 2 ? -1 : 1
            container.addChild(container.cloudDark)

            container.cloudWhite = new Sprite( atlases.clouds.textures.cloud_white )
            container.cloudWhite.alpha = this.state === CLOUDS_STATE.Storm ? 0 : 1
            container.cloudWhite.anchor.set(0.5)
            container.cloudWhite.scale.x = index < 2 ? -1 : 1
            container.addChild(container.cloudWhite)

            const x = index === 0 ?  68 : index === 1 ? -74 : 0
            const y = index === 0 ? -24 : index === 1 ?  12 : 68
            container.position.set(x, y)
        })
    }

    userDoStep() {
        if (this.state !== CLOUDS_STATE.Clouds) return

        this.turnsToStartStorm--
        if (this.turnsToStartStorm > 0) return

        this.state = CLOUDS_STATE.Storm
        this.children.forEach( container => {
            container.cloudDark.texture = atlases.clouds.textures.cloud_dark
            container.cloudDark.alpha = 1
            container.cloudWhite.alpha = 0
        })

        this.turnsToStartStorm = 3
    }
    
    clearClouds( isFull = false ) {
        if (isFull || this.state === CLOUDS_STATE.Clouds) {
            this.state = CLOUDS_STATE.Open
            this.ceil.pet = null
            return
        }
        
        if (this.state === CLOUDS_STATE.Storm) {
            this.state = CLOUDS_STATE.Clouds

            this.children.forEach( container => {
                container.cloudDark.texture = atlases.clouds.textures.cloud_dark
                container.cloudDark.alpha = 0
                container.lightning.alpha = 0
                container.cloudWhite.alpha = 1
            })
        }
    }

    tick(time) {
        const delta = time.deltaMS
        
        this.clouds.forEach((cloud) => {
            // === ПУЛЬСАЦИЯ МАСШТАБА ===
            cloud.timerPulse += delta * this.pulseSpeed
            const sinPulse = Math.sin(cloud.timerPulse)
            const progressPulse = (sinPulse + 1) / 2
            const currentScale = this.pulseMin + this.pulseRange * progressPulse
            cloud.scale.set(currentScale)
            
            // === ДВИЖЕНИЕ ПО Y ===
            cloud.timerFly += delta * this.flySpeed
            const sinFly = Math.sin(cloud.timerFly)
            const offsetY = sinFly * this.flyOffset
            cloud.y = cloud.baseY + offsetY

            // === МОЛНИИ ===
            if (this.state === CLOUDS_STATE.Storm) {
                if (cloud.lightningTime === 0) {
                    cloud.lightningTime = this.lightningTimeout + Math.random() * this.lightningTimeout
                    cloud.lightning.alpha = 0
                    cloud.cloudDark.texture = atlases.clouds.textures.cloud_dark
                } else if (cloud.lightningTime > 0) {
                    cloud.lightningTime -= delta
                } else {
                    cloud.lightningTime = 0
                    cloud.lightningTextureIndex++
                    if (cloud.lightningTextureIndex > 3) cloud.lightningTextureIndex = 1
                    cloud.lightning.texture = atlases.clouds.textures["lightning_" + cloud.lightningTextureIndex]
                    cloud.lightning.alpha = 1
                    cloud.cloudDark.texture = atlases.clouds.textures.cloud_lightning
                }
            }
        })

        // === исчезновение ===
        if (this.state === CLOUDS_STATE.Open) {
            this.alpha -= delta * 0.0006
            if (this.alpha < 0) kill(this)
        }
    }
}