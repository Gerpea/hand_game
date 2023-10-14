// @ts-ignore
import { GESTURE_CLASSES } from '../workers/const'

export const GESTURES = Object.entries(GESTURE_CLASSES).map(([key, value]) => ({
    id: key,
    label: value
}))