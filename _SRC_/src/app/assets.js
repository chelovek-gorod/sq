export const assetType = {
    images : 'images',
    atlases: 'atlases',
    sounds : 'sounds',
    music : 'music',
    fonts : 'fonts',
}

export const path = {
    images : './images/',
    atlases: './atlases/',
    sounds : './sounds/',
    music : './music/',
    fonts : './fonts/',
}
export const fonts = {
    RubikDirt: 'RubikDirt-Regular.ttf',
    RubikGemstones: 'RubikGemstones-Regular.ttf',
    
    BSBold: 'BalsamiqSans-Bold.ttf',
    BSBoldItalic: 'BalsamiqSans-BoldItalic.ttf',
    BSItalic: 'BalsamiqSans-Italic.ttf',
    BSRegular: 'BalsamiqSans-Regular.ttf',
}

export const images = {
    img_finger: 'finger.png',
    img_logo: 'logo.png',
    bg_main: 'main_bg.png',
    game_title: 'game_title_width_shadow.png',
    collection_bg: 'collection_bg.png',
    lock_chain: 'lock_chain.png',
    lock_place: 'lock_place.png',
    pet_shadow: 'shadow.png',

    button_icon_close: 'button_icon_close.png',

    popup_bg: 'popup_bg.png',

    map_static: 'map_static.png',
    map_action: 'map_action.png',
    map_point_blue: 'map_point_blue.png',
    map_point_orange: 'map_point_orange.png',
    map_point_purple: 'map_point_purple.png',
    map_point_dot: 'map_point_dot.png',

    dpf_1: 'dpf_1.png',
    dpf_2: 'dpf_2.png',
    dpf_3: 'dpf_3.png',
    dpf_4: 'dpf_4.png',
    dpf_5: 'dpf_5.png',
    dpf_6: 'dpf_6.png',
    dpf_7: 'dpf_7.png',
}
export const atlases = {
    buttons: 'buttons.json',
    pets: 'pets.json',
    places: 'place.json',
    clouds: 'clouds.json',
    splash: 'splash.json',
    fireworks: 'fireworks.json',
    splash_2: 'splash_2.json',
    stars: 'color_stars.json',
    fireflies: 'fireflies.json',
    ui: 'ui.json',
    shine_ui: 'shine_ui.json',
    map_points: 'map_points.json',
    map_dots: 'map_dots.json',
    task: 'task.json',
}
export const sounds = {
    se_swipe: 'se_swipe.mp3',
    se_click: 'se_click.mp3',
    se_bonus: 'se_bonus.mp3',
    se_error_move: 'se_error_move.mp3',
    se_start_drag: 'se_start_drag.mp3',
    se_end_drag_home: 'se_end_drag_home.mp3',
    se_starfall: 'se_starfall.mp3',
    se_line: 'se_line.mp3',
}
export const music = {
    bgm_0: 'bgm_0.mp3',
    bgm_1: 'bgm_1.mp3',
    bgm_2: 'bgm_2.mp3',
    bgm_3: 'bgm_3.mp3',
    bgm_4: 'bgm_4.mp3',
    bgm_5: 'bgm_5.mp3',
    bgm_6: 'bgm_6.mp3',
    bgm_7: 'bgm_7.mp3',
    bgm_8: 'bgm_8.mp3',
    bgm_9: 'bgm_9.mp3',
}

export const assets = {fonts, images, atlases, sounds, music}
for (let assetType in assets) {
    for (let key in assets[assetType]) {
        assets[assetType][key] = path[assetType] + assets[assetType][key]
    }
}

// check duplicated keys
const allKeys = new Map()
const duplicates = new Set()

for (const [assetTypeName, assetCollection] of Object.entries(assets)) {
    for (const key of Object.keys(assetCollection)) {
        if (allKeys.has(key)) duplicates.add(key)
        allKeys.set(key, assetTypeName)
    }
}

if (duplicates.size > 0) {
    const duplicateDetails = Array.from(duplicates).map(key => {
        const types = []
        for (const [typeName, assetCollection] of Object.entries(assets)) {
            if (Object.prototype.hasOwnProperty.call(assetCollection, key)) {
                types.push(typeName)
            }
        }
        return `"${key}" (${types.join(', ')})`
    }).join(', ')
    
    throw new Error(`Duplicate asset keys detected: ${duplicateDetails}`)
}