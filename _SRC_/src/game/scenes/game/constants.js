import { createEnum } from "../../../utils/functions";

export const PLACE = createEnum(['Arctic', 'Farm', 'Jungle', 'Ocean', 'Savannah'])
export const PLACE_MAP = {
    "A" : PLACE.Arctic,
    "F" : PLACE.Farm,
    "J" : PLACE.Jungle,
    "O" : PLACE.Ocean,
    "S" : PLACE.Savannah,
}

export const OBSTACLE = createEnum(['Clouds', 'Lock'])
export const CLOUDS_STATE = createEnum(['Clouds', 'Storm', 'Open'])

export const PET_LEVEL = {
    "Zebra": 31,
    "Parrot": 21,
    "Ostrich": 46,
    "Monkey": 11,
    "Lion": 26,
    "Kangaroo": 41,
    "Jerboa": 1,
    "Giraffe": 16,
    "Elephant": 36,
    "Capybara": 6,

    "Walrus": 32,
    "SnowyOwl": 42,
    "Reindeer": 12,
    "PolarBear": 22,
    "Penguin": 7,
    "Narwhal": 37,
    "Lemming": 2,
    "KillerWhale": 27,
    "BelugaWhale": 47,
    "ArcticFox": 17,

    "Mouse": 23,
    "Lamb": 33,
    "Filly": 43,
    "Duck": 28,
    "Dog": 8,
    "Chick": 3,
    "Cat": 18,
    "Bunny": 38,
    "Mole": 13,
    "Bat": 48,

    "Zebrasoma": 4,
    "Turtle": 9,
    "Shark": 34,
    "Seal": 24,
    "SeaHorse": 14,
    "Octopus": 29,
    "Goldfish": 44,
    "Dolphin": 19,
    "Cuttlefish": 39,
    "Axolotl": 49,

    "WhiteTiger": 50,
    "Snake": 20,
    "Raccoon": 15,
    "Peacock": 40,
    "Panda": 25,
    "Koala": 10,
    "Frog": 30,
    "Panther": 35,
    "Chameleon": 45,
    "Beaver": 5,

    "Dragon": 51,
}
export const LEVEL_PET = Object.fromEntries(
    Object.entries(PET_LEVEL).map(([pet, level]) => [level, pet])
)

export const PET = createEnum( Object.keys(PET_LEVEL) )

export const PLACE_PETS = {
    [PLACE.Farm] : [
        "Mouse",
        "Lamb",
        "Filly",
        "Duck",
        "Dog",
        "Chick",
        "Cat",
        "Bunny",
        "Mole",
        "Bat",

        "Dragon"
    ],
    [PLACE.Savannah] : [
        "Zebra",
        "Parrot",
        "Ostrich",
        "Monkey",
        "Lion",
        "Kangaroo",
        "Jerboa",
        "Giraffe",
        "Elephant",
        "Capybara",

        "Dragon"
    ],
    [PLACE.Arctic] : [
        "Walrus",
        "SnowyOwl",
        "Reindeer",
        "PolarBear",
        "Penguin",
        "Narwhal",
        "Lemming",
        "KillerWhale",
        "BelugaWhale",
        "ArcticFox",

        "Dragon"
    ],
    [PLACE.Ocean] : [
        "Zebrasoma",
        "Turtle",
        "Shark",
        "Seal",
        "SeaHorse",
        "Octopus",
        "Goldfish",
        "Dolphin",
        "Cuttlefish",
        "Axolotl",

        "Dragon"
    ],
    [PLACE.Jungle] : [
        "WhiteTiger",
        "Snake",
        "Raccoon",
        "Peacock",
        "Panda",
        "Koala",
        "Frog",
        "Panther",
        "Chameleon",
        "Beaver",

        "Dragon"
    ],
}

export const PET_DATA = {
    anchor: {x: 0.5, y: 0.62},
    scale: 1,
    scaleDrag: 1.2,
    scalingDuration: 120,
    scaleSpeed: 0,
}
PET_DATA.scaleSpeed = (PET_DATA.scaleDrag - PET_DATA.scale) / PET_DATA.scalingDuration

export const PET_STATE = createEnum(['EMPTY', 'IDLE', 'DRAGGING'])

export const CEIL_DATA = {
    height: 300,
    width: 400,
    alpha: 0.9,
    scale: 1.0,
    collideRadius: 120,
    collideRadiusSq: 1,
    highlightScale: 1.2,
    highlightAlpha: 1.0,
    highlightDuration: 120,
    highlightScaleStep: 0,
    highlightAlphaStep: 0,
}
CEIL_DATA.collideRadiusSq = CEIL_DATA.collideRadius * CEIL_DATA.collideRadius
CEIL_DATA.highlightScaleStep = (CEIL_DATA.highlightScale - CEIL_DATA.scale) / CEIL_DATA.highlightDuration
CEIL_DATA.highlightAlphaStep = (CEIL_DATA.highlightAlpha - CEIL_DATA.alpha) / CEIL_DATA.highlightDuration

export const FIELD_OFFSET_X = 0
export const FIELD_OFFSET_Y = 40