import { createEnum } from "../../../utils/functions"

export const MAP_WIDTH = 2048
export const MAP_HEIGHT = 1366

export const MAP_HALF_WIDTH = Math.ceil(MAP_WIDTH * 0.5)
export const MAP_HALF_HEIGHT = Math.ceil(MAP_HEIGHT * 0.5)

export const POINT_COLORS = createEnum(["RED", "PURPLE", "GREEN", "BLUE", "GRAY"])
export const TASK = createEnum(["CLOUD", "LOCK", "NEW", "TIME", "FREE"])

export const FREE_POINTS = [
    {
        crystals: [1, 2, 3],
        x: -MAP_HALF_WIDTH + 928, y: -MAP_HALF_HEIGHT + 626,
        task: 0
    },
    {
        crystals: [2, 3, 1],
        x: -MAP_HALF_WIDTH + 1142, y: -MAP_HALF_HEIGHT + 985,
        task: 1
    },
    {
        crystals: [3, 1, 2],
        x: -MAP_HALF_WIDTH + 1690, y: -MAP_HALF_HEIGHT + 715,
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
        x: -MAP_HALF_WIDTH + 325, y: -MAP_HALF_HEIGHT + 520,
        tasks: [ 3, 4, 5 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 508, y: -MAP_HALF_HEIGHT + 563,
        tasks: [ 6, 7, 8 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 679, y: -MAP_HALF_HEIGHT + 594,
        tasks: [ 9, 10, 11 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 555, y: -MAP_HALF_HEIGHT + 713,
        tasks: [ 12, 13, 14 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 572, y: -MAP_HALF_HEIGHT + 905,
        tasks: [ 15, 16, 17 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 808, y: -MAP_HALF_HEIGHT + 1024,
        tasks: [ 18, 19, 20 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 967, y: -MAP_HALF_HEIGHT + 1102,
        tasks: [ 21, 22, 23 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1147, y: -MAP_HALF_HEIGHT + 1140,
        tasks: [ 24, 25, 26 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1289, y: -MAP_HALF_HEIGHT + 1076,
        tasks: [ 27, 28, 29 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1413, y: -MAP_HALF_HEIGHT + 982,
        tasks: [ 30, 31, 32 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1340, y: -MAP_HALF_HEIGHT + 822,
        tasks: [ 33, 34, 35 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1178, y: -MAP_HALF_HEIGHT + 630,
        tasks: [ 36, 37, 38 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1062, y: -MAP_HALF_HEIGHT + 468,
        tasks: [ 39, 40, 41 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 888, y: -MAP_HALF_HEIGHT + 374,
        tasks: [ 42, 43, 44 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 950, y: -MAP_HALF_HEIGHT + 269,
        tasks: [ 45, 46, 47 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1085, y: -MAP_HALF_HEIGHT + 307,
        tasks: [ 48, 49, 50 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1247, y: -MAP_HALF_HEIGHT + 437,
        tasks: [ 51, 52, 53 ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1392, y: -MAP_HALF_HEIGHT + 413,
        tasks: [ 54, 55, 56 ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1460, y: -MAP_HALF_HEIGHT + 547,
        tasks: [ 57, 58, 59 ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1690, y: -MAP_HALF_HEIGHT + 497,
        tasks: [ 60, 61, 62 ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1687, y: -MAP_HALF_HEIGHT + 350,
        tasks: [ 63, 64, 65 ]
    }
]