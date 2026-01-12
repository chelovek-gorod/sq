import { EventEmitter } from "pixi.js"

export const EventHub = new EventEmitter()

export const events = {
    screenResize: 'screenResize',
    changeFocus: 'changeFocus',

    gamePause: 'gamePause',
    gameResume: 'gameResume',

    startScene: 'startScene',

    updateLanguage: 'updateLanguage',

    dragging: 'dragging',
    userDoStep: 'userDoStep',
    addShineBall: 'addShineBall',
}

export function screenResize( data ) {
    EventHub.emit( events.screenResize, data )
}
export function changeFocus( isOnFocus ) {
    EventHub.emit( events.changeFocus, isOnFocus )
}
export function gamePause() {
    EventHub.emit( events.gamePause )
}
export function gameResume() {
    EventHub.emit( events.gameResume )
}

export function startScene( sceneName ) {
    EventHub.emit( events.startScene, sceneName )
}

export function updateLanguage( currentLanguage ) {
    EventHub.emit( events.updateLanguage, currentLanguage )
}

export function dragging( dragData ) {
    EventHub.emit( events.dragging, dragData )
}
export function userDoStep() {
    EventHub.emit( events.userDoStep )
}
export function addShineBall( data ) {
    EventHub.emit( events.addShineBall, data )
}