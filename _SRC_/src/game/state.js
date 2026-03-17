import { EventHub, events, showPopup } from "../app/events"
import { updateStoredData } from "../game/storage"
import { POPUP_TYPE } from "./popup/constants"
import { LEVELS_FREE_LIST, LEVELS_LIST } from "./scenes/level/levels"

export let isAdAvailable = true

export let availablePetLevel = 7 // 1
export let dragonPointIndex = 0
export let isNeedHelp = true
export let collectionHelpCount = 2
export function collectionHelpDone() {
    collectionHelpCount = Math.max(0, collectionHelpCount - 1)
}

export let levelState = {
    type: null, // "CLOUD", "LOCK", "NEW", "FREE"
    turns: Infinity, // 0-999
    targets: 0, // "CLOUD" or "LOCK" target
    targetAnimations: 0, // "CLOUD" or "LOCK"
    sparks: 0, // count of sparks launched
    isLastLevel: false,
    isTaskDone: false,
}

export function levelStateSetTurn() { levelState.turns = Math.max(0, levelState.turns - 1) }
export function levelStateSetTarget() { levelState.targets = Math.max(0, levelState.targets - 1) }
export function levelStateTargetAnimationAdd() { levelState.targetAnimations++ }
export function levelStateTargetAnimationRemove() { levelState.targetAnimations = Math.max(0, levelState.targetAnimations - 1) }
export function levelStateSparkAdd() { levelState.sparks++ }
export function levelStateSparkRemove() { levelState.sparks = Math.max(0, levelState.sparks - 1) }
export function levelStateSetTaskDone( isDone ) { levelState.isTaskDone = isDone }

export function addAvailablePetLevel() {
    if (availablePetLevel < 50) {
        availablePetLevel++
        updateStoredData()
        if (availablePetLevel === 50) setTimeout( () => showPopup({type: POPUP_TYPE.ALL_PETS}), 0 )
        return availablePetLevel
    } else {
        return 0
    }
}
export function setDragonPointIndex( index ) {
    dragonPointIndex = index
    updateStoredData()
}

// levelTask = {type: TASK.NEW, value: 2, turns: 0}
export let levelIndex = -1
export let isLevelFree = false
export function setLevelTask(index, isFree = false) {
    levelIndex = index
    isLevelFree = isFree

    const level = isLevelFree ? LEVELS_FREE_LIST[ levelIndex ] : LEVELS_LIST[ levelIndex ]
    levelState.type = level.task.type
    levelState.turns = level.task.turns === 0 ? Infinity : level.task.turns
    levelState.targets = level.task.value
    levelState.targetAnimations = 0
    levelState.sparks = 0
    levelState.isLastLevel = isLevelFree ? false : isLastLevel(),
    levelState.isTaskDone = false
}

export let world = [
    // only opened tasks
    // [0 / 1 / 2] - index -> point index;
    // 0/1/2 - index -> task index, false - not done; true - done;
    [true, true, false], // first point open; tasks is not completed at first game launch

    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [false, false, false],
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
    && storedState.dragonPointIndex < 20) {
        dragonPointIndex = storedState.dragonPointIndex
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

    isNeedHelp = checkNeedHelp()
}

EventHub.on( events.globalGameReset, () => {
    availablePetLevel = 1
    dragonPointIndex = 0
    world = [ [false, false, false], ]

    updateStoredData()
    setTimeout( () => location.reload(), 3000 )
})

EventHub.on( events.levelDone, (isDone) => {
    if (!isDone) return

    const pointIndex = Math.floor(levelIndex / 3)
    const taskIndex = levelIndex % 3

    const levels = world[pointIndex]
    const doneCount = +levels[0] + +levels[1] + +levels[2]

    if(doneCount === 1) {
        world.push( [false, false, false] )
    }
    isNeedHelp = checkNeedHelp()

    world[pointIndex][taskIndex] = true

    updateStoredData()
})

function isLastLevel() {
    const worldPointIndex = Math.floor(levelIndex / 3)
    if (worldPointIndex < world.length) {
        let doneCount = 0
        for(let i = world[worldPointIndex].length - 1; i >= 0; i--) {
            doneCount += +world[worldPointIndex][i]
        }
        return doneCount === 2
    }
    return false
}

function checkNeedHelp() {
    if (world.length > 2) return false
    let count = 0
    for(let i = world.length - 1; i >= 0; i--) {
        for(let t = world[i].length - 1; t >= 0; t--) {
            count += +world[i][t]
        }
    }
    // help if 1...4
    return count < 5
}