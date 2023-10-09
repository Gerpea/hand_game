import { useEffect, useState } from "react";
import { HandDetector } from "..";
import { Params } from "../types";

const IOU_THRESHOLD = 0.45;
const SCORE_THRESHOLD = 0.25;
const TOP_K = 1;

export const useHandPosition = (params?: Partial<Params>) => {
    const { iouThreshold = IOU_THRESHOLD, scoreThreshold = SCORE_THRESHOLD, topk = TOP_K } = params || {}
    const [handDetector, setHandDetector] = useState<HandDetector>();

    useEffect(() => {
        const detector = new HandDetector({
            iouThreshold,
            scoreThreshold,
            topk
        })

        if (!detector.inited) {
            (async () => {
                await detector.initialize()
                setHandDetector(detector)
            })()
        }
    }, [])

    const detect = async (image: HTMLImageElement) => {
        if (handDetector) {
            return handDetector.detect(image)
        } else {
            throw 'Hand detector is not initialized yet'
        }
    }

    return {
        detect,
        inited: handDetector?.inited
    }
}