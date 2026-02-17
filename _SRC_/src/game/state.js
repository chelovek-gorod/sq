import { EventHub, events } from "../app/events"
import { updateStoredData } from "../game/storage"

export let availablePetLevel = 50
export let dragonPointIndex = 0

export function addAvailablePetLevel() {
    if (availablePetLevel < 50) {
        availablePetLevel++
        return availablePetLevel
    } else {
        return 0
    }
}
export function setDragonPointIndex( index ) {
    dragonPointIndex = index
}

// levelTask = {type: TASK.NEW, value: 2, turns: 0}
export let levelIndex = -1
export function setLevelTask(index) {
    levelIndex = index
}

export let world = [
    // only opened tasks
    // [0 / 1 / 2] - index -> point index;
    // 0/1/2 - index -> task index, false - not done; true - done;
    [false, false, false], // first point open; tasks is not completed at first game launch
]

export function getStateData() {
    return ({ availablePetLevel, dragonPointIndex, world: JSON.stringify(world) })
}

export function setStoredState( storedState ) {
    if ('availablePetLevel' in storedState
    && Number.isInteger(storedState.availablePetLevel)
    && storedState.availablePetLevel > 0
    && storedState.availablePetLevel < 51) {
        availablePetLevel = storedState.availablePetLevel
    }

    if ('dragonPointIndex' in storedState
    && Number.isInteger(storedState.dragonPointIndex)
    && storedState.dragonPointIndex > 0
    && storedState.dragonPointIndex < 51) {
        availablePetLevel = storedState.availablePetLevel
    }

    if ('world' in storedState) {
        try {
            const storedWorld = JSON.parse(storedState.world)
            if (!Array.isArray(storedWorld)) {
                console.error('ERROR in JSON storedState.world', storedState.world, e)
                return 
            }

            let isOk = true
            storedWorld.forEach( point => {
                if (!Array.isArray(point) && !point.length != 3) isOk = false
            })
            if (!isOk) {
                console.error('ERROR in JSON storedState.world', storedState.world, e)
                return 
            }

            world = storedWorld
        } catch (e) {
            console.error('ERROR in JSON storedState.world', storedState.world, e)
        }
    }
}

EventHub.on( events.globalGameReset, () => {
    availablePetLevel = 1
    dragonPointIndex = 0
    world = [ [false, false, false], ]

    updateStoredData()
    setTimeout( () => location.reload(), 1000 )
})

EventHub.on( events.levelDone, (isDone) => {
    if (!isDone) return

    const pointIndex = Math.floor(levelIndex / 3)
    const taskIndex = levelIndex % 3

    if(pointIndex + 1 === world.length) world.push( [false, false, false])

    world[pointIndex][taskIndex] = true

    updateStoredData()
})

export function getWorldPointIndexByLevelIndex(levelIndex) {
    return Math.floor(levelIndex / 3)
}

export function getWorldPointDataByLevelIndex(levelIndex) {
    const worldPointIndex = getWorldPointIndexByLevelIndex(levelIndex)
    if (worldPointIndex < world.length) return [...world[worldPointIndex]]
    else return null
}