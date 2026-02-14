export let availablePetLevel = 50
export let dragonPointIndex = 0

export let levelTask = null
export function setLevelTask(task) {
    levelTask = task
}

export let world = [
    // only opened tasks
    // [0 / 1 / 2] - index -> point index;
    // 0/1/2 - index -> task index, 0 - not done; 1 - done; 2 - done with full collection
    [0,0,0], // first point open; 1 task in point; task is not completed at first game launch
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