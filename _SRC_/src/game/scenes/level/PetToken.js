import { Container, Sprite, Ellipse, ColorMatrixFilter } from "pixi.js";
import { tickerAdd, tickerRemove, kill } from "../../../app/application";
import { atlases, sounds } from "../../../app/assets";
import { addShineBall, addSpark, addFireworks, addFlyText,
    getTargetPet, getPlayerTurn, EventHub, events, blockDragging } from "../../../app/events";
import { soundPlay } from "../../../app/sound";
import { availablePetLevel, levelState, levelStateSetTurn, levelStateSparkAdd } from "../../state";
import { LEVEL_PET, PET_DATA, PET_STATE, PLACE_PETS } from "./constants";

let isOnDrag = false
EventHub.on(events.unblockDragging, () => isOnDrag = false)

const merge_sounds = [1, 2, 3]
let merge_sound_index = 0
const get_merge_sound = () => {
    merge_sound_index++
    if (merge_sound_index === merge_sounds.length) merge_sound_index = 0
    return 'se_squinki_merge_' + merge_sounds[merge_sound_index]
}

export default class PetToken extends Container {
    constructor(type, ceil, field) {
        super()
        isOnDrag = false
        this.field = field

        // Фильтр яркости
        this.filter = new ColorMatrixFilter()
        this.filterDuration = 300
        this.filterMax = 1.2
        this.filterValue = 1
        this.filterStep = (this.filterMax - 1) / this.filterDuration
        this.filter.brightness(this.filterValue, false)
        this.filterAdd = 0
        this.filters = [this.filter]

        this.type = type
        this.ceil = ceil
        this.isUpgraded = false
        this.isOtherPetShine = false
        this.isShining = PLACE_PETS[this.ceil.place].includes(LEVEL_PET[this.type])

        this.eventMode = 'static'
        this.cursor = 'pointer'
        this.state = PET_STATE.EMPTY
        this.dragOffset = { x: 0, y: 0 }
        this.idleTimeout = Math.random() * 12000

        // Анимация качания
        this.swingStep = 0
        this.swingDirection = 1
        this.swingProgress = 0
        this.swingSteps = 0
        this.swingSpeed = 0.001
        this.swingAmplitude = 0.05

        this.shadow = new Sprite(atlases.units.textures.shadow)
        this.shadow.anchor.set(PET_DATA.anchor.x, PET_DATA.anchor.y)
        this.shadow.scale.set(PET_DATA.scale * 0.8)
        this.addChild(this.shadow)

        this.image = new Sprite(atlases.units.textures[LEVEL_PET[this.type]])
        this.image.anchor.set(PET_DATA.anchor.x, PET_DATA.anchor.y)
        this.image.scale.set(PET_DATA.scale)
        this.addChild(this.image)

        this.hitArea = new Ellipse(0, -42, 100, 125)

        this.on('pointerdown', this.onDragStart, this)
        this.on('pointerup', this.onDragEnd, this)
        this.on('pointerupoutside', this.onDragEnd, this)
        this.on('globalpointermove', this.onDragMove, this)
        window.addEventListener( 'pointerup', () => this.onDragEnd() )

        this.position.set(ceil.x, ceil.y)
        EventHub.on(events.blockDragging, this.blockDragging, this)

        tickerAdd(this)
    }

    filterOn() { this.filterAdd = 1 }
    filterOff() { this.filterAdd = -1 }

    startSwing(steps = 1) {
        if (this.state === PET_STATE.DRAGGING) return
        this.state = PET_STATE.IDLE
        this.swingStep = 0
        this.swingDirection = 1
        this.swingProgress = 0
        this.swingSteps = steps * 2
    }

    stopSwing() {
        if (Math.abs(this.image.rotation) < 0.001) {
            this.image.rotation = 0
            this.state = PET_STATE.EMPTY
            this.swingSteps = 0
            return
        }
        this.image.rotation *= 0.9
    }

    onDragStart(event) {
        if (this.state === PET_STATE.DRAGGING || isOnDrag) return
        isOnDrag = true

        this.state = PET_STATE.DRAGGING
        this.swingSteps = 0

        const mousePos = event.getLocalPosition(this.parent)
        this.dragOffset.x = mousePos.x - this.x
        this.dragOffset.y = mousePos.y - this.y

        this.parent.parent.draggingPets.addChild(this)
        this.shadow.position.set(0, 25)
        this.shadow.scale.set(PET_DATA.scale)
        soundPlay(sounds.se_squinki_start)

        this.field.startDragging(this)
    }

    onDragMove(event) {
        if (this.state !== PET_STATE.DRAGGING) return
        const mousePos = event.getLocalPosition(this.parent)
        this.x = mousePos.x - this.dragOffset.x
        this.y = mousePos.y - this.dragOffset.y
    }

    onDragEnd() {
        if (this.state !== PET_STATE.DRAGGING) return
        isOnDrag = false

        this.parent.parent.pets.addChild(this)
        this.state = PET_STATE.EMPTY
        this.shadow.position.set(0, 0)
        this.shadow.scale.set(PET_DATA.scale * 0.8)

        this.field.endDragging(this)
    }

    returnToStart(isNormalBack = true) {
        this.position.set(this.ceil.x, this.ceil.y)
        this.isShining = PLACE_PETS[this.ceil.place].includes(LEVEL_PET[this.type])
        this.state = PET_STATE.EMPTY
        this.image.scale.set(PET_DATA.scale)
        this.shadow.position.set(0, 0)
        this.shadow.scale.set(PET_DATA.scale * 0.8)
        soundPlay(isNormalBack ? sounds.se_squinki_back : sounds.se_squinki_error)
    }

    moveToCeil(ceil) {
        if (this.ceil !== ceil) {
            levelStateSetTurn()
            if (levelState.turns === 0) blockDragging()
            setTimeout(getPlayerTurn, 0)
        }

        const isDragonsMerge = ceil.pet && ceil.pet.type === 51 && this.type === 51

        if (ceil.pet) {
            kill(ceil.pet)
            ceil.pet = null
        }

        this.ceil.pet = null
        this.ceil = ceil
        this.ceil.pet = this
        this.position.set(this.ceil.x, this.ceil.y)

        let score = 1 + +this.isOtherPetShine + +this.isShining

        if (this.isUpgraded) {
            levelStateSparkAdd()
            addShineBall({
                x: this.x,
                y: this.y,
                points: score
            })

            this.isUpgraded = false
            this.isOtherPetShine = false

            if (!isDragonsMerge) {
                this.type++
                this.image.texture = atlases.units.textures[LEVEL_PET[this.type]]
            }

            score += this.type > availablePetLevel ? 2 : 0
            addFlyText({text: "+" + score, x: this.x, y: this.y})

            if (this.type > availablePetLevel) {
                levelStateSparkAdd()
                addShineBall({
                    x: this.x,
                    y: this.y,
                    points: 2
                })
                soundPlay( sounds.se_squinki_max )
                this.ceil.pet = null
                addFireworks({x: this.x, y: this.y})
                if (!isDragonsMerge) getTargetPet()
                kill(this)
                return
            }
            soundPlay( sounds[get_merge_sound()] )
        }

        soundPlay( sounds.se_squinki_back )

        this.isShining = PLACE_PETS[this.ceil.place].includes( LEVEL_PET[this.type] )
        if (this.isShining) {
            setTimeout( soundPlay, this.isUpgraded ? 300 : 0, sounds.se_squinki_sparks )
        }

        /*
        const isDragonsMerge = ceil.pet && ceil.pet.type === 51 && this.type === 51

        // 1. вернуть из draggingPets
        if (this.parent === this.field.draggingPets) {
            this.field.draggingPets.removeChild(this)
            this.field.pets.addChild(this)
        }

        // 2. убить pet на целевой клетке, если есть
        if (ceil.pet && ceil.pet !== this) {
            if (isDragonsMerge) {
                levelStateSparkAdd()
                addShineBall({ x: this.x, y: this.y, points: 5 })
                addFlyText({ text: "+5", x: this.x, y: this.y })
                addFireworks({ x: this.x, y: this.y })
                kill(ceil.pet)
                kill(this)
                ceil.pet = null
                return
            } else {
                kill(ceil.pet)
                ceil.pet = null
            }
        }

        // 3. отвязать от старой клетки
        if (this.ceil && this.ceil.pet === this) this.ceil.pet = null

        // 4. привязка к новой клетке
        this.ceil = ceil
        this.ceil.pet = this
        this.position.set(this.ceil.x, this.ceil.y)

        // 5. события хода
        levelStateSetTurn()
        if (levelState.turns === 0) blockDragging()
        setTimeout(getPlayerTurn, 0)

        // 6. апгрейд
        let score = 1 + +this.isOtherPetShine + +this.isShining
        if (this.isUpgraded) {
            levelStateSparkAdd()
            addShineBall({ x: this.x, y: this.y, points: score })

            this.isUpgraded = false
            this.isOtherPetShine = false

            if (!isDragonsMerge) {
                this.type++
                this.image.texture = atlases.units.textures[LEVEL_PET[this.type]]
            }

            score += this.type > availablePetLevel ? 2 : 0
            addFlyText({ text: "+" + score, x: this.x, y: this.y })

            if (this.type > availablePetLevel) {
                levelStateSparkAdd()
                addShineBall({ x: this.x, y: this.y, points: 2 })
                soundPlay(sounds.se_squinki_max)
                addFireworks({ x: this.x, y: this.y })

                getTargetPet()
                kill(this)
                return
            }

            soundPlay(sounds[get_merge_sound()])
        }

        soundPlay(sounds.se_squinki_back)

        // 7. свечения
        this.isShining = PLACE_PETS[this.ceil.place].includes(LEVEL_PET[this.type])
        if (this.isShining) soundPlay(sounds.se_squinki_sparks) // setTimeout(soundPlay, 300, sounds.se_squinki_sparks)
        */
    }

    upgrade(isOtherPetShine, otherType) {
        if (this.type === 51) this.type = otherType
        this.isUpgraded = true
        this.isOtherPetShine = isOtherPetShine
    }

    updateScale(isAdd, value) {
        if (isAdd) this.image.scale.set(Math.min(PET_DATA.scaleDrag, this.image.scale.x + value))
        else this.image.scale.set(Math.max(PET_DATA.scale, this.image.scale.x - value))
    }

    blockDragging() {
        this.onDragEnd()
        isOnDrag = true
    }

    tick(time) {
        const delta = time.deltaMS
        if (this.isShining && Math.random() > 0.9) addSpark({ x: this.x, y: this.y, type: this.ceil.place })

        if (this.filterAdd !== 0) {
            const fStep = this.filterStep * delta
            if (this.filterAdd > 0) {
                this.filterValue = Math.min(this.filterMax, this.filterValue + fStep)
                if (this.filterValue === this.filterMax) this.filterAdd = 0
            } else {
                this.filterValue = Math.max(1, this.filterValue - fStep)
                if (this.scale.x === 1) this.filterAdd = 0
            }
            this.filter.brightness(this.filterValue, false)
            this.scale.set(1 + (this.filterValue - 1) * 0.5)
        }

        switch (this.state) {
            case PET_STATE.DRAGGING:
                if (this.image.scale.x < PET_DATA.scaleDrag) this.updateScale(true, delta * PET_DATA.scaleSpeed)
                this.image.rotation = 0
                break

            case PET_STATE.EMPTY:
                if (this.image.scale.x > PET_DATA.scale) this.updateScale(false, delta * PET_DATA.scaleSpeed)
                else {
                    this.idleTimeout -= delta
                    if (this.idleTimeout < 0) {
                        this.startSwing(2)
                        this.idleTimeout = 6000 + Math.random() * 6000
                    }
                }
                break

            case PET_STATE.IDLE:
                if (this.swingSteps > 0) {
                    this.swingProgress += this.swingSpeed * delta
                    if (this.swingProgress >= 1) {
                        this.swingStep++
                        this.swingProgress = 0
                        this.swingDirection *= -1
                        if (this.swingStep >= this.swingSteps) this.stopSwing()
                    }
                    const angle = this.swingAmplitude * this.swingDirection
                    this.image.rotation = Math.sin(this.swingProgress * Math.PI) * angle
                } else this.stopSwing()

                if (this.image.scale.x > PET_DATA.scale) this.updateScale(false, delta * PET_DATA.scaleSpeed)
                break
        }
    }

    kill() {
        tickerRemove(this)
        window.removeEventListener( 'pointerup', () => this.onDragEnd() )
        EventHub.off(events.blockDragging, this.blockDragging, this)
        this.destroy({ children: true })
    }
}