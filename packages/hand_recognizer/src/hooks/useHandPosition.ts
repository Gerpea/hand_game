import { useCallback, useEffect, useRef, useState } from "react";
import { Box, DetectorWorker, Params } from "../types";

export const useHandPosition = (params?: Partial<Params>) => {
  const workerRef = useRef<DetectorWorker>();
  const [inited, setInited] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(new URL("../../workers/detector.worker.js", import.meta.url));
    workerRef.current.onmessage = function (msg: any) {
      switch (msg.data.type) {
        case "init":
          setInited(msg.data.data);
          return;
      }
    };
    workerRef.current.postMessage({ type: "init" });
  }, []);

  useEffect(() => {
    if (!workerRef.current || !params) {
      return;
    }

    workerRef.current.postMessage({ type: "params", data: params });
  }, [params]);

  const detect = useCallback<(image: string) => Promise<Box[]>>(
    async (image) => {
      if (!inited) {
        return Promise.reject("Worker is not initialized yet");
      }

      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          reject("Worker doesn't set");
          return;
        }

        workerRef.current.onmessage = function (msg: any) {
          switch (msg.data.type) {
            case "boxes":
              resolve(msg.data.data);
              return;
          }
        };

        workerRef.current.postMessage({ type: "image", data: image });
      });
    },
    [inited]
  );

  return {
    detect,
    inited
  };
};
