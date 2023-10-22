import {
  Box,
  useGestureClassification,
  useHandPosition,
} from "hand_recognizer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApi, useCameraImage, useGesture } from ".";

export const useGameLogic = (tickTime: number) => {
  const timerId = useRef<NodeJS.Timeout>();
  const cameraImgSrc = useCameraImage();
  const [boxes, setBoxes] = useState<Box[]>([]);

  const { gesture, nextGesture } = useGesture();

  const { detect, inited: handPositionInited } = useHandPosition();
  const { classify, inited: gestureClassificationInited } =
    useGestureClassification();

  const { addScore } = useApi();

  const isLoading = useMemo(
    () => !handPositionInited || !gestureClassificationInited,
    [handPositionInited, gestureClassificationInited]
  );

  useEffect(() => {
    if (!cameraImgSrc || timerId.current || isLoading) {
      return;
    }

    timerId.current = setTimeout(async () => {
      timerId.current = undefined;
      const boxes = await detect(cameraImgSrc);
      setBoxes(boxes);
      const box = boxes[0];
      if (!box) {
        return;
      }

      const classes = await classify(cameraImgSrc, box);
      const topClass = classes.sort((a, b) =>
        a.probability < b.probability ? 1 : -1
      )[0];

      if (topClass.probability > 0.9 && topClass.id === gesture.id) {
        addScore();
        nextGesture();
      }
    }, tickTime);
  }, [
    cameraImgSrc,
    isLoading,
    addScore,
    classify,
    detect,
    gesture.id,
    nextGesture,
    tickTime,
  ]);

  return {
    gesture,
    boxes,
    isLoading,
    cameraImgSrc,
  };
};
