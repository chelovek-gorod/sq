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
    BSBold: 'BalsamiqSans-Bold.ttf',
    BSBoldItalic: 'BalsamiqSans-BoldItalic.ttf',
    BSItalic: 'BalsamiqSans-Italic.ttf',
    BSRegular: 'BalsamiqSans-Regular.ttf',
}

export const images = {
    logo: 'logo.png',
    bg_main: 'main_bg.png',
    popup_bg: 'popup_bg.png',
    collection_bg: 'collection_bg.png',

    map_static: 'map_static.png',
    map_action: 'map_action.png',

    dpf: 'dpf.png',

    star_radial_1: 'star_radial_a.png',
    star_radial_2: 'star_radial_b.png',
    star_radial_3: 'star_radial_c.png',
    dpf_radial: 'dpf_radial.png',


}
export const atlases = {
    units: 'units.json',
    
    splash: 'splash.json',
    fireworks: 'fireworks.json',
    stars: 'color_stars.json',

    ui: 'ui.json',
    shine_ui: 'shine_ui.json',

    world: 'world.json',
    map_dots: 'map_dots.json',
}
export const sounds = {
    se_hover: 'se_hover.mp3',
    se_scale: 'se_scale.mp3',
    se_click: 'se_click.mp3',
    se_map_hover: 'se_map_hover.mp3',
    se_task_hover: 'se_task_hover.mp3',

    se_squinki_start: 'se_squinki_start.mp3',
    se_squinki_back: 'se_squinki_back.mp3',
    se_squinki_error: 'se_squinki_error.mp3',
    se_squinki_merge_1: 'se_squinki_merge_1.mp3',
    se_squinki_merge_2: 'se_squinki_merge_2.mp3',
    se_squinki_merge_3: 'se_squinki_merge_3.mp3',
    se_squinki_sparks: 'se_squinki_sparks.mp3',
    se_squinki_max: 'se_squinki_max.mp3',
    se_squinki_dragon: 'se_squinki_dragon.mp3',

    se_sparks_small: 'se_sparks_small.mp3',
    se_sparks_max: 'se_sparks_max.mp3',

    se_storm: 'se_storm.mp3',
    se_clouds: 'se_clouds.mp3',
    se_lock: 'se_lock.mp3',

    se_result_lose: 'se_result_lose.mp3',
    se_result_win: 'se_result_win.mp3',
    se_popup_new: 'se_popup_new.mp3',
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