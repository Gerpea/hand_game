import { InferenceSession } from "onnxruntime-web"

/**
 * HandDetectorSession
 * @param {InferenceSession} net Main model session
 * @param {InferenceSession} iouThreshold NMS model Session
 */
export type Session = {
    net: InferenceSession,
    nms: InferenceSession
}

/**
 * HandDetectorParams
 * @param {Number} topk Maximum number of boxes to be selected per class
 * @param {Number} iouThreshold Threshold for deciding whether boxes overlap too much with respect to IOU
 * @param {Number} scoreThreshold Threshold for deciding when to remove boxes based on score
 */
export type Params = {
    topk: number;
    iouThreshold: number;
    scoreThreshold: number;
}

/**
 * Detected Box
 * @param {Number} x X coord of box from left side
 * @param {Number} y Y coord of box from bottom side
 * @param {Number} w Y Width of box
 * @param {Number} h Y Height of box
 * 
 */
export type Box = {
    x: number;
    y: number;
    w: number;
    h: number;
}

export type GestureClass = {
    id: string;
    label: string;
    probability: number;
}
