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
}
export const atlases = {
    buttons: 'buttons.json',
    pets: 'pets.json',
    places: 'places.json',
    clouds: 'clouds.json',
    splash: 'splash.json',
    splash_2: 'splash_2.json',
    stars: 'stars.json',
}
export const sounds = {
    se_swipe: 'se_swipe.mp3',
    se_click: 'se_click.mp3',
    se_bonus: 'se_bonus.mp3',
}
export const music = {
    bgm_0: 'bgm_0.mp3',
    bgm_1: 'bgm_1.mp3',
    bgm_2: 'bgm_2.mp3',
    bgm_3: 'bgm_3.mp3',
    bgm_4: 'bgm_4.mp3',
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