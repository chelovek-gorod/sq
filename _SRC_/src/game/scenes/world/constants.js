import { createEnum } from "../../../utils/functions"

export const MAP_WIDTH = 2048
export const MAP_HEIGHT = 1366

export const MAP_HALF_WIDTH = Math.ceil(MAP_WIDTH * 0.5)
export const MAP_HALF_HEIGHT = Math.ceil(MAP_HEIGHT * 0.5)

export const POINT_COLORS = createEnum(["RED", "PURPLE", "GREEN", "BLUE", "GRAY"])
export const TASK = createEnum(["CLOUD", "LOCK", "NEW", "TIME", "FREE"])

export const FREE_POINTS = [
    {
        color: 'blue',
        crystals: ['Y', 'G', 'P'],
        x: -MAP_HALF_WIDTH + 880, y: -MAP_HALF_HEIGHT + 620,
        task: 0
    },
    {
        color: 'green',
        crystals: ['B', 'P', 'Y'],
        x: -MAP_HALF_WIDTH + 1190, y: -MAP_HALF_HEIGHT + 265,
        task: 1
    },
    {
        color: 'purple',
        crystals: ['G', 'Y', 'B'],
        x: -MAP_HALF_WIDTH + 1750, y: -MAP_HALF_HEIGHT + 480,
        task: 2
    }
]

export const POINTS = [
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 468, y: -MAP_HALF_HEIGHT + 439,
        tasks: [ 0, 1, 2 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 325, y: -MAP_HALF_HEIGHT + 526,
        tasks: [ 3, 4, 5 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 688, y: -MAP_HALF_HEIGHT + 579,
        tasks: [ 6, 7, 8 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 549, y: -MAP_HALF_HEIGHT + 721,
        tasks: [ 9, 10, 11 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 292, y: -MAP_HALF_HEIGHT + 804,
        tasks: [ 12, 13, 14 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 792, y: -MAP_HALF_HEIGHT + 1035,
        tasks: [ 15, 16, 17 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 967, y: -MAP_HALF_HEIGHT + 1103,
        tasks: [ 18, 19, 20 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1148, y: -MAP_HALF_HEIGHT + 1144,
        tasks: [ 21, 22, 23 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1295, y: -MAP_HALF_HEIGHT + 1075,
        tasks: [ 24, 25, 26 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1229, y: -MAP_HALF_HEIGHT + 913,
        tasks: [ 27, 28, 29 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1119, y: -MAP_HALF_HEIGHT + 580,
        tasks: [ 30, 31, 32 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 912, y: -MAP_HALF_HEIGHT + 439,
        tasks: [ 33, 34, 35 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 800, y: -MAP_HALF_HEIGHT + 280,
        tasks: [ 36, 37, 38 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1078, y: -MAP_HALF_HEIGHT + 338,
        tasks: [ 39, 40, 41 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1252, y: -MAP_HALF_HEIGHT + 450,
        tasks: [ 42, 43, 44 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1432, y: -MAP_HALF_HEIGHT + 562,
        tasks: [ 45, 46, 47 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1595, y: -MAP_HALF_HEIGHT + 726,
        tasks: [ 48, 49, 50 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1664, y: -MAP_HALF_HEIGHT + 562,
        tasks: [ 51, 52, 53 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1515, y: -MAP_HALF_HEIGHT + 435,
        tasks: [ 54, 55, 56 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1672, y: -MAP_HALF_HEIGHT + 347,
        tasks: [ 57, 58, 59 ]
    }
]