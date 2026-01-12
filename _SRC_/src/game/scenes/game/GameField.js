import { Container } from "pixi.js";
import { tickerAdd, tickerRemove, kill } from "../../../app/application";
import { EventHub, events, userDoStep } from "../../../app/events";
import Clouds from "./Clouds";
import { CEIL_DATA, CLOUDS_STATE, LOCKS_STATE, OBSTACLE, PLACE_MAP } from "./constants";
import FieldCeil from "./FieldCeil";
import PetToken from "./PetToken";
import Splash from "../../effects/Splash";
import Lock from "./Lock";

function getMapObject( code ) {
    switch(code) {
        case '[]' : return null
        case 'SS' : return OBSTACLE.Clouds
        case 'XX' : return OBSTACLE.Lock
        default : return parseInt(code)
    }
}

export default class GameField extends Container {
    constructor(level) {
        super()

        this.ceils = new Container()
        this.pets = new Container()
        this.sky = new Container()
        this.effects = new Container()
        this.addChild(this.ceils, this.pets, this.sky, this.effects)

        this.dragData = { pet: null, isDone: false }
        this.closestDragCeil = null

        this.fill(level)

        EventHub.on( events.dragging, this.dragging.bind(this) )
        tickerAdd(this)
    }

    fill(level) {
        const ceilsMap = new Map()
    
        const halfWidth = CEIL_DATA.width * 0.5
        const halfHeight = CEIL_DATA.height * 0.5
        const xSteps = Math.ceil(level.map[0].length / 3)
        
        let yy = 0 // пол клетки добавится в начале цикла
        for(let y = 0; y < level.map.length; y++) {
            yy += halfHeight 
            const line = level.map[y]
            let xx = 0 // пол клетки добавится в начале цикла
            for(let x = 0; x < xSteps; x++) {
                xx += halfWidth 
                const i = x * 3
                // check ceil start
                if (line[i] === '<') {
                    const place = PLACE_MAP[ line[i + 1] ]
                    const object = getMapObject( line[i + 3] + line[i + 4] )
                    const ceil = new FieldCeil(xx, yy, place)
                    if (object === OBSTACLE.Clouds) {
                        ceil.pet = new Clouds( ceil )
                        this.sky.addChild( ceil.pet )
                    }
                    if (object === OBSTACLE.Lock) {
                        ceil.pet = new Lock( ceil )
                        this.sky.addChild( ceil.pet )
                    }
                    if (typeof object === 'number') {
                        ceil.pet = new PetToken( object , ceil )
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

    dragging( dragData ) {
        this.dragData.pet = dragData.pet
        this.dragData.isDone = dragData.isDone
    }

    getClosestDragCeil() {
        let closestCell = null
        let minDistanceSq = Infinity
        const petX = this.dragData.pet.x
        const petY = this.dragData.pet.y
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
        || !closestCell.checkAvailable(this.dragData.pet.type)) return null
        
        return closestCell
    }

    setDraggingPet() {
        const dragPet = this.dragData.pet
        const targetCeil = this.closestDragCeil
        
        this.dragData.pet = null
        this.closestDragCeil = null
        
        if (!dragPet) return
        
        if (targetCeil) targetCeil.highlightOff()

        if (targetCeil === null) return dragPet.returnToStart(false)
        if (targetCeil.pet === dragPet) return dragPet.returnToStart(true)
        if (targetCeil.pet) {
            targetCeil.nearestCeils.forEach(c => c.checkClouds())
            dragPet.upgrade(targetCeil.pet.isShining)
            kill(targetCeil.pet)
            this.addSplash(targetCeil)
        }
        
        dragPet.moveToCeil(targetCeil)
        setTimeout(userDoStep, 0)
    }

    addSplash( ceil ) {
        this.effects.addChild( new Splash(ceil.x, ceil.y) )
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
        return free[ Math.floor(Math.random() * free.length) ]
    }

    tick( time ) {
        if (!this.dragData.pet) return

        const newClosestCeil = this.getClosestDragCeil()
        if (newClosestCeil !== this.closestDragCeil) {
            if (this.closestDragCeil) this.closestDragCeil.highlightOff()
            if (newClosestCeil) newClosestCeil.highlightOn()
            
            this.closestDragCeil = newClosestCeil
        }

        if (this.dragData.isDone) this.setDraggingPet()
    }

    kill() {
        tickerRemove(this)
        EventHub.off( events.dragging, this.dragging.bind(this) )
    }
}