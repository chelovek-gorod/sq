import { EventHub, events } from "../app/events"
import { updateStoredData } from "../game/storage"
import { POINTS } from "./scenes/world/constants"

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

// levelTask = {type: TASK.NEW, value: 2, turns: 0, levelIndex: 0}
export let levelTask = null
export function setLevelTask(task) {
    levelTask = task
    levelTask.pointIndex = Math.floor(levelTask.levelIndex / 3)
    levelTask.taskIndex = levelTask.levelIndex % 3
    const taskA = +world[levelTask.pointIndex][0]
    const taskB = +world[levelTask.pointIndex][1]
    const taskC = +world[levelTask.pointIndex][2]
    levelTask.doneTasksCount = taskA + taskB + taskC
    levelTask.isLastLevel = levelTask.levelIndex === POINTS.length
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
}

EventHub.on( events.globalGameReset, () => {
    availablePetLevel = 1
    dragonPointIndex = 0
    world = [ [0,0,0], ]

    updateStoredData()
    setTimeout( () => location.reload(), 1000 )
})

EventHub.on( events.levelDone, () => {
    const pointIndex = Math.floor(levelTask.levelIndex / 3)
    const taskIndex = levelTask.levelIndex % 3

    world[pointIndex][taskIndex] = true

    // check place done
    if(dragonPointIndex < 19) {
        dragonPointIndex++
        world.push( [false, false, false])
    }

    updateStoredData()
})