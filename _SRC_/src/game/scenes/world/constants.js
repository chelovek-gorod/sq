import { createEnum } from "../../../utils/functions"

export const MAP_WIDTH = 2048
export const MAP_HEIGHT = 1366

export const MAP_HALF_WIDTH = Math.ceil(MAP_WIDTH * 0.5)
export const MAP_HALF_HEIGHT = Math.ceil(MAP_HEIGHT * 0.5)

export const POINT_COLORS = createEnum(["RED", "PURPLE", "GREEN", "BLUE", "GRAY"])
export const TASK = createEnum(["CLOUD", "LOCK", "NEW", "TIME"])

export const POINTS = [
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 468, y: -MAP_HALF_HEIGHT + 439,
        tasks: [
            {type: TASK.NEW, value: 0, turns: 0, levelIndex: 0},
            {type: TASK.NEW, value: 0, turns: 0, levelIndex: 1},
            {type: TASK.NEW, value: 0, turns: 0, levelIndex: 2}
        ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 325, y: -MAP_HALF_HEIGHT + 526,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 3},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 4},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 5}
        ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 688, y: -MAP_HALF_HEIGHT + 579,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 6},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 7},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 8}
        ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 549, y: -MAP_HALF_HEIGHT + 721,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 9},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 10},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 11}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 292, y: -MAP_HALF_HEIGHT + 804,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 12},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 13},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 14}
        ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 792, y: -MAP_HALF_HEIGHT + 1035,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 15},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 16},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 17}
        ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 967, y: -MAP_HALF_HEIGHT + 1103,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 18},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 19},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 20}
        ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1148, y: -MAP_HALF_HEIGHT + 1144,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 21},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 22},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 23}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1295, y: -MAP_HALF_HEIGHT + 1075,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 24},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 25},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 26}
        ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1229, y: -MAP_HALF_HEIGHT + 913,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 27},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 28},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 29}
        ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1119, y: -MAP_HALF_HEIGHT + 580,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 30},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 31},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 32}
        ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 912, y: -MAP_HALF_HEIGHT + 439,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 33},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 34},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 35}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 800, y: -MAP_HALF_HEIGHT + 280,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 36},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 37},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 38}
        ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1078, y: -MAP_HALF_HEIGHT + 338,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 39},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 40},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 41}
        ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1252, y: -MAP_HALF_HEIGHT + 450,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 42},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 43},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 44}
        ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1432, y: -MAP_HALF_HEIGHT + 562,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 45},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 46},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 47}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1595, y: -MAP_HALF_HEIGHT + 726,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 48},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 49},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 50}
        ]
    },
    {
        color: POINT_COLORS.GREEN,
        x: -MAP_HALF_WIDTH + 1664, y: -MAP_HALF_HEIGHT + 562,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 51},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 52},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 53}
        ]
    },
    {
        color: POINT_COLORS.RED,
        x: -MAP_HALF_WIDTH + 1515, y: -MAP_HALF_HEIGHT + 435,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 54},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 55},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 56}
        ]
    },
    {
        color: POINT_COLORS.PURPLE,
        x: -MAP_HALF_WIDTH + 1672, y: -MAP_HALF_HEIGHT + 347,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 12, levelIndex: 57},
            {type: TASK.CLOUD, value: 8, turns: 0, levelIndex: 58},
            {type: TASK.CLOUD, value: 12, turns: 12, levelIndex: 59}
        ]
    }
]