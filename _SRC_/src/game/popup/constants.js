import { createEnum } from "../../utils/functions"


export const POPUP_TYPE =  createEnum(['TASK', 'INFO', 'HELP', 'RESULT', 'NEW', 'SETTINGS', 'RESET'])
export const POPUP_HELP_TYPE =  createEnum(['DRAGON_ADD', 'DRAGON_USE'])