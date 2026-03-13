import { Container } from "pixi.js";
import { tickerAdd, tickerRemove, kill } from "../../../app/application";
import { EventHub, events, userDoStep } from "../../../app/events";
import Clouds from "./Clouds";
import { CEIL_DATA, CLOUDS_STATE, LOCKS_STATE, OBSTACLE, PLACE_MAP } from "./constants";
import FieldCeil from "./FieldCeil";
import PetToken from "./PetToken";
import Splash from "../../effects/Splash";
import Lock from "./Lock";
import SparkParticles from "../../effects/SparkParticles";
import Fireworks from "../../effects/Fireworks";
import { availablePetLevel, isNeedHelp } from "../../state";
import HelpFinger from "../../effects/HelpFinger";

function getMapObject( code ) {
    switch(code) {
        case '[]' : return null
        case 'SS' : return OBSTACLE.Clouds
        case 'XX' : return OBSTACLE.Lock
        default : return parseInt(code)
    }
}

export default class LevelField extends Container {
    constructor(levelMap, addPetLevel) {
        super()

        this.ceils = new Container()
        this.pets = new Container()
        this.sky = new Container()
        this.effects = new Container()
        this.sparks = new SparkParticles()
        this.draggingPets = new Container()

        this.addChild(
            this.ceils, this.pets, this.sky, 
            this.sparks.container, this.effects,
            this.draggingPets
        )

        this.dragPet = null
        this.closestDragCeil = null

        this.fill(levelMap, addPetLevel)

        EventHub.on( events.addFireworks, this.addFireworks, this )
        tickerAdd(this)

        this.helpFinger = null
        if (isNeedHelp) {
            this.helpFinger = new HelpFinger()
            this.addChild( this.helpFinger )
            this.setHelp()

            EventHub.on( events.levelDone, this.stopHelp, this )
            EventHub.on( events.blockDragging, this.stopHelp, this )
        }
    }

    fill(levelMap, addPetLevel) {
        const ceilsMap = new Map()
    
        const halfWidth = CEIL_DATA.width * 0.5
        const halfHeight = CEIL_DATA.height * 0.5
        const xSteps = Math.ceil(levelMap[0].length / 3)
        
        let yy = 0 // пол клетки добавится в начале цикла
        for(let y = 0; y < levelMap.length; y++) {
            yy += halfHeight 
            const line = levelMap[y]
            let xx = 0 // пол клетки добавится в начале цикла
            for(let x = 0; x < xSteps; x++) {
                xx += halfWidth 
                const i = x * 3
                // check ceil start
                if (line[i] === '<') {
                    const place = PLACE_MAP[ line[i + 1] ]
                    const object = getMapObject( line[i + 3] + line[i + 4] )
                    const ceil = new FieldCeil(xx, yy, place, this)
                    if (object === OBSTACLE.Clouds) {
                        ceil.pet = new Clouds( ceil )
                        this.sky.addChild( ceil.pet )
                    }
                    if (object === OBSTACLE.Lock) {
                        ceil.pet = new Lock( ceil )
                        this.sky.addChild( ceil.pet )
                    }
                    if (typeof object === 'number') {
                        let level = object
                        if (addPetLevel !== null && object !== 51) {
                            level = Math.min(availablePetLevel, object + addPetLevel)
                        }
                        ceil.pet = new PetToken( level , ceil, this )
                        this.pets.addChild( ceil.pet )
                    }
                    this.ceils.addChild( ceil )
    
                    // добавляем себя (чтобы соседи быстро нашли)
                    ceilsMap.set(Math.round(xx) + "-" + Math.round(yy), ceil)
                    
                    ceil.nearestCeils = [
                        Math.round(xx - halfWidth) + "-" + Math.round(yy - halfHeight),
                        Math.round(xx + halfWidth) + "-" + Math.round(yy - halfHeight),
                        Math.round(xx - halfWidth) + "-" + Math.round(yy + halfHeight),
                        Math.round(xx + halfWidth) + "-" + Math.round(yy + halfHeight),
                    ]
                }
            }
        }
    
        this.ceils.children.forEach( ceil => {
            for(let i = 0; i < ceil.nearestCeils.length; i++) {
                if ( ceilsMap.has( ceil.nearestCeils[i] ) ) {
                    ceil.nearestCeils[i] = ceilsMap.get( ceil.nearestCeils[i] )
                } else {
                    ceil.nearestCeils[i] = null
                }
            }
    
            ceil.nearestCeils = ceil.nearestCeils.filter( point => point != null )
        })
    
        ceilsMap.clear()
    }

    setHelp() {
        if (!this.helpFinger) return
        if (this.pets.children.length < 2) return this.helpFinger.hide()

        const sameIndexes = []
        const seenTypes = new Map() // key: TYPE, value: INDEX
        for (let i = this.pets.children.length - 1; i >= 0; i--) {
            const currentType = this.pets.children[i].type
            if (currentType === 51) {
                sameIndexes.push(i)
                sameIndexes.push(i - 1 < 0 ? i + 1 : i - 1)
                break
            }

            if (seenTypes.has(currentType)) {
                sameIndexes.push(seenTypes.get(currentType), i)
                break
            }
            
            seenTypes.set(currentType, i)
        }

        if (sameIndexes.length < 2) return this.helpFinger.hide()

        const p1 = {...this.pets.children[ sameIndexes[0] ].position}
        const p2 = {...this.pets.children[ sameIndexes[1] ].position}
        this.helpFinger.help(p1._x, p1._y, p2._x, p2._y)
    }
    stopHelp() {
        if (this.helpFinger) {
            kill(this.helpFinger)
            this.helpFinger = null
        }
    }

    checkAvailablePetsMerge() {
        const pets = []

        for(let d = this.draggingPets.children.length - 1; d >= 0; d--) {
            pets.push(this.draggingPets.children[d].type)
        }

        for(let p = this.pets.children.length - 1; p >= 0; p--) {
            if (pets.length) {
                if ( pets.indexOf(this.pets.children[p].type) > -1 ) return true
                if ( pets.indexOf(51) > -1 ) return true
                if ( this.pets.children[p].type === 51 ) return true
            }
            pets.push(this.pets.children[p].type)
        }

        return false
    }

    startDragging(pet) {
        if (this.dragPet && this.dragPet !== pet) {
            this.finishDragging(this.dragPet)
        }
        this.dragPet = pet
    }
    endDragging(pet) {
        if (this.dragPet !== pet) return

        const closest = this.getClosestDragCeil()
        if (this.closestDragCeil) this.closestDragCeil.highlightOff()
        this.closestDragCeil = closest

        this.finishDragging(pet)
    }

    getClosestDragCeil() {
        let closestCell = null
        let minDistanceSq = Infinity
        const petX = this.dragPet.x
        const petY = this.dragPet.y
        for (let i = 0, len = this.ceils.children.length; i < len; i++) {
            const dx = petX - this.ceils.children[i].x
            const dy = petY - this.ceils.children[i].y
            const distanceSq = dx * dx + dy * dy
            
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq
                closestCell = this.ceils.children[i]
            }
        }

        if (minDistanceSq > CEIL_DATA.collideRadiusSq
        || !closestCell.checkAvailable(this.dragPet.type)) return null
        
        return closestCell
    }

    finishDragging(dragPet) {
        if (isNeedHelp && this.helpFinger) setTimeout( () => this.setHelp(), 0 )

        if (!dragPet || !dragPet.parent) return

        // пересчёт closestCeil прямо здесь
        const targetCeil = this.getClosestDragCeil() || null

        this.dragPet = null
        this.closestDragCeil = null

        if (targetCeil) targetCeil.highlightOff()

        if (targetCeil === null) {
            dragPet.returnToStart(false)
            return
        }
        if (targetCeil.pet === dragPet) {
            dragPet.returnToStart(true)
            return
        }

        if (targetCeil.pet) {
            targetCeil.nearestCeils.forEach(c => c.checkClouds())
            dragPet.upgrade(targetCeil.pet.isShining, targetCeil.pet.type)
            this.addSplash(targetCeil)
        }

        dragPet.moveToCeil(targetCeil)
        setTimeout(userDoStep, 0)
    }

    addSplash( ceil ) {
        this.effects.addChild( new Splash(ceil.x, ceil.y) )
    }

    addEffect( effect ) {
        if (!this.effects) return // console.error(`this.effects = ${this}`)
        this.effects.addChild( effect )
    }

    addFireworks( data ) {
        if (!this.effects) return // console.error(`this.effects = ${this}`)
        this.effects.addChild( new Fireworks( data.x, data.y ) )
    }

    getMagicTargetCeilIndex() {
        const locks = []
        const storms = []
        const clouds = []
        const free = []

        this.ceils.children.forEach( (ceil, i) => {
            if (ceil.pet === null) {
                free.push(i)
            } else if (ceil.pet.type === OBSTACLE.Lock && ceil.pet.state !== LOCKS_STATE.Open) {
                locks.push(i)
            } else if (ceil.pet.type === OBSTACLE.Clouds && ceil.pet.state !== CLOUDS_STATE.Open) {
                if (ceil.pet.state === CLOUDS_STATE.Storm) storms.push(i)
                else clouds.push(i)
            }
        })

        if (locks.length) return locks[ Math.floor(Math.random() * locks.length) ]
        if (storms.length) return storms[ Math.floor(Math.random() * storms.length) ]
        if (clouds.length) return clouds[ Math.floor(Math.random() * clouds.length) ]
        if (free.length) return free[ Math.floor(Math.random() * free.length) ]
        return null
    }

    getFreeCeil() {
        for (let i = this.ceils.children.length - 1; i >= 0; i--) {
            if (!this.ceils.children[i].pet) {
                return {x: this.ceils.children[i].x, y: this.ceils.children[i].y, index: i}
            }
        }
        
        return null
    }

    checkLevelCleared() {
        let isFree = true

        const ceils = this.ceils.children
        for (let i = ceils.length - 1; i >= 0; i--) {
            if (ceils[i].pet) {
                isFree = false
                break
            }
        }
        
        return isFree
    }

    tick() {
        if (!this.dragPet) return

        const newClosestCeil = this.getClosestDragCeil()
        if (newClosestCeil !== this.closestDragCeil) {
            if (this.closestDragCeil) this.closestDragCeil.highlightOff()
            if (newClosestCeil) newClosestCeil.highlightOn()
            
            this.closestDragCeil = newClosestCeil
        }
    }

    kill() {
        this.sparks.kill()
        tickerRemove(this)
        EventHub.off( events.addFireworks, this.addFireworks, this )
        if (isNeedHelp) {
            EventHub.off( events.levelDone, this.stopHelp, this )
            EventHub.off( events.blockDragging, this.stopHelp, this )
        }
    }
}