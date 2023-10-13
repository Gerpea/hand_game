import { useEffect, useRef } from "react";
import { Box, ClassificationWorker, GestureClass } from "../types";

export const useGestureClassification = () => {
    const workerRef = useRef<ClassificationWorker>();

    useEffect(() => {
        workerRef.current = new Worker(new URL('../../workers/classification.worker.js', import.meta.url))
    }, [])

    const classify = async (image: string, box?: Box): Promise<GestureClass[]> => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                reject("Worker doesn't set")
                return
            }

            workerRef.current.onmessage = function (msg: any) {
                switch (msg.data.type) {
                    case 'classes':
                        resolve(msg.data.data)
                        return
                }
            }

            workerRef.current.postMessage({ type: 'image', data: { image, box } })
        })
    }

    return {
        classify
    }
}