import { GESTURE_CLASSES } from "../const";
/**
 * Label probabilities array according to GESTURE_CLASSES
 *
 * @export
 * @param {Number[]} probs - probabilities array
 * @return {GestureClass[]} Labeled probabilities
 */
export function labelProbs(probs) {
    return probs.map((prob, i) => ({
        id: i,
        label: GESTURE_CLASSES[i],
        probability: prob

    }))
}