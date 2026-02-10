import { createEnum } from "../../../utils/functions"

export const MAP_WIDTH = 2048
export const MAP_HEIGHT = 1366

export const MAP_HALF_WIDTH = Math.ceil(MAP_WIDTH * 0.5)
export const MAP_HALF_HEIGHT = Math.ceil(MAP_HEIGHT * 0.5)

export const POINT_COLORS = createEnum(["RED", "PURPLE", "GREEN", "BLUE", "GRAY"])
export const TASK = createEnum(["CLOUD", "LOCK", "NEW"])

export const POINTS = [
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 468, y: -MAP_HALF_HEIGHT + 439,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 325, y: -MAP_HALF_HEIGHT + 526,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 688, y: -MAP_HALF_HEIGHT + 579,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 549, y: -MAP_HALF_HEIGHT + 721,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 292, y: -MAP_HALF_HEIGHT + 804,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 792, y: -MAP_HALF_HEIGHT + 1035,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 967, y: -MAP_HALF_HEIGHT + 1103,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1148, y: -MAP_HALF_HEIGHT + 1144,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1295, y: -MAP_HALF_HEIGHT + 1075,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1229, y: -MAP_HALF_HEIGHT + 913,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 1119, y: -MAP_HALF_HEIGHT + 580,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    },
    {
        color: POINT_COLORS.BLUE,
        x: -MAP_HALF_WIDTH + 912, y: -MAP_HALF_HEIGHT + 439,
        tasks: [
            {type: TASK.NEW, value: 2, turns: 0}
        ]
    }
]