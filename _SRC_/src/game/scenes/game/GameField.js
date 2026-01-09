import { Container } from "pixi.js";
import { tickerAdd, tickerRemove, kill } from "../../../app/application";
import { EventHub, events, userDoStep } from "../../../app/events";
import Clouds from "./Clouds";
import { CEIL_DATA, OBSTACLE, PLACE, PLACE_MAP } from "./constants";
import FieldCeil from "./FieldCeil";
import PetToken from "./PetToken";
import Splash from "../../effects/Splash";

function getMapObject( code ) {
    switch(code) {
        case '[]' : return null
        case 'SS' : return OBSTACLE.Clouds
        case 'XX' : return null
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
        this.lastHighlightCell = null

        this.fill(level)

        EventHub.on( events.dragging, this.dragging.bind(this) )
        tickerAdd(this)
    }

    fill(level) {
        const ceilsMap = new Map()
    
        const xSteps = Math.ceil(level.map[0].length / 3)
        const halfCeil = CEIL_DATA.size * 0.5
        
        const stepX = halfCeil + CEIL_DATA.offsetX  // расстояние по X между центрами
        const stepY = halfCeil                      // расстояние по Y между центрами
        
        let yy = 0
        for(let y = 0; y < level.map.length; y++) {
            yy += stepY 
            const line = level.map[y]
            let xx = 0
            for(let x = 0; x < xSteps; x++) {
                xx += stepX
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
                        ceil.pet = new Clouds( ceil )
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
                        Math.round(xx - stepX) + "-" + Math.round(yy - stepY),
                        Math.round(xx + stepX) + "-" + Math.round(yy - stepY),
                        Math.round(xx - stepX) + "-" + Math.round(yy + stepY),
                        Math.round(xx + stepX) + "-" + Math.round(yy + stepY),
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
        if (this.closestDragCeil === null || this.closestDragCeil.pet === this.dragData.pet) {
            this.dragData.pet.returnToStart()
            this.dragData.pet = null
            this.closestDragCeil = null
            return
        }
        
        if (this.closestDragCeil.pet) {
            this.closestDragCeil.nearestCeils.forEach( c => c.checkClouds() )
            kill(this.closestDragCeil.pet)
            this.dragData.pet.upgrade()
            this.effects.addChild( new Splash(this.closestDragCeil.pet.x, this.closestDragCeil.pet.y) )
        }

        this.dragData.pet.moveToCeil(this.closestDragCeil)
        this.closestDragCeil = null
        this.dragData.pet = null

        setTimeout( userDoStep, 0 )
    }

    tick( time ) {
        if (!this.dragData.pet) return

        this.closestDragCeil = this.getClosestDragCeil()

        if (this.closestDragCeil) this.closestDragCeil.highlightOn()

        if (this.dragData.isDone) this.setDraggingPet()
    }

    kill() {
        tickerRemove(this)
        EventHub.off( events.dragging, this.dragging.bind(this) )
    }
}