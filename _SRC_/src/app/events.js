import { EventEmitter } from "pixi.js"

export const EventHub = new EventEmitter()

export const events = {
    screenResize: 'screenResize',
    changeFocus: 'changeFocus',

    gamePause: 'gamePause',
    gameResume: 'gameResume',

    startScene: 'startScene',

    updateLanguage: 'updateLanguage',

    flyDragonToPoint: 'flyDragonToPoint',
    addSpark: 'addSpark',
    showSparksShadow: 'showSparksShadow',
    addFireworks: 'addFireworks',
    addFlyText: 'addFlyText',
    dragging: 'dragging',
    userDoStep: 'userDoStep',
    addShineBall: 'addShineBall',
    showLevelCards: 'showLevelCards',
    showPopup: 'showPopup',
    setMapCameraInteractive: 'setMapCameraInteractive',
    globalGameReset: 'globalGameReset',

    getPlayerTurn: 'getPlayerTurn',
    getTargetPet: 'getTargetPet',
    getTargetLock: 'getTargetLock',
    getTargetCloud: 'getTargetCloud',
    getObstacleRemoved: 'getObstacleRemoved',
    levelDone: 'levelDone',
    blockDragging: 'blockDragging',
    unblockDragging: 'unblockDragging',

    helpShow: 'helpShow',
    helpHide: 'helpHide',

    getRewardFromAd: 'getRewardFromAd',
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

export function flyDragonToPoint() {
    EventHub.emit( events.flyDragonToPoint )
}
export function addSpark( data ) {
    EventHub.emit( events.addSpark, data )
}
export function showSparksShadow( isOn ) {
    EventHub.emit( events.showSparksShadow, isOn )
}
export function addFireworks( data ) {
    EventHub.emit( events.addFireworks, data )
}
export function addFlyText( data ) {
    EventHub.emit( events.addFlyText, data )
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
export function showLevelCards( pointIndex ) {
    EventHub.emit( events.showLevelCards, pointIndex )
}
export function showPopup( data ) {
    EventHub.emit( events.showPopup, data )
}
export function setMapCameraInteractive( isActive ) {
    EventHub.emit( events.setMapCameraInteractive, isActive )
}
export function globalGameReset() {
    EventHub.emit( events.globalGameReset )
}

export function getPlayerTurn() {
    EventHub.emit( events.getPlayerTurn )
}
export function getTargetPet() {
    EventHub.emit( events.getTargetPet )
}
export function getTargetLock() {
    EventHub.emit( events.getTargetLock )
}
export function getTargetCloud() {
    EventHub.emit( events.getTargetCloud )
}

export function blockDragging() {
    EventHub.emit( events.blockDragging )
}
export function unblockDragging() {
    EventHub.emit( events.unblockDragging )
}
export function levelDone( isDone ) {
    EventHub.emit( events.levelDone, isDone )
}

export function helpShow() {
    EventHub.emit( events.helpShow )
}
export function helpHide() {
    EventHub.emit( events.helpHide )
}

export function getRewardFromAd(rewardIndex) {
    EventHub.emit( events.getRewardFromAd, rewardIndex )
}