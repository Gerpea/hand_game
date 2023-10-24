import { useCallback, useEffect, useRef, useState } from "react";
import { Box, ClassificationWorker, GestureClass } from "../types";

export const useGestureClassification = () => {
  const workerRef = useRef<ClassificationWorker>();
  const [inited, setInited] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(new URL("../../workers/classification.worker.js", import.meta.url));
    workerRef.current.onmessage = function (msg: any) {
      switch (msg.data.type) {
        case "init":
          setInited(msg.data.data);
          return;
      }
    };
    workerRef.current.postMessage({ type: "init" });
  }, []);

  const classify = useCallback<(image: string, box?: Box) => Promise<GestureClass[]>>(
    async (image: string, box?: Box) => {
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
            case "classes":
              resolve(msg.data.data);
              return;
          }
        };

        workerRef.current.postMessage({ type: "image", data: { image, box } });
      });
    },
    [inited]
  );

  return {
    classify,
    inited
  };
};
