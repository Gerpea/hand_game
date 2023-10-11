import { useEffect, useRef } from "react";
import { Box, DetectorWorker, Params } from "../types";

export const useHandPosition = (params?: Partial<Params>) => {
    const workerRef = useRef<DetectorWorker>();

    useEffect(() => {
        workerRef.current = new Worker(new URL('../../workers/detector.worker.js', import.meta.url))
    }, [])

    useEffect(() => {
        if (!workerRef.current || !params) {
            return
        }

        workerRef.current.postMessage({ type: 'params', data: params })
    }, [params])

    const detect = async (image: string): Promise<Box[]> => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                reject("Worker doesn't set")
                return
            }

            workerRef.current.onmessage = function (msg: any) {
                switch (msg.data.type) {
                    case 'boxes':
                        resolve(msg.data.data)
                        return
                }
            }

            workerRef.current.postMessage({ type: 'image', data: image })
        })
    }

    return {
        detect
    }
}