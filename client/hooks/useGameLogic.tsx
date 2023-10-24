import { Box, useGestureClassification, useHandPosition } from "hand_recognizer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApi, useCameraImage, useGesture } from ".";
import { Gesture } from "@/types";

export const useGameLogic = (tickTime: number) => {
  const cameraImgSrc = useCameraImage();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const { gesture, nextGesture } = useGesture();
  const { addScore } = useApi();
  const { detect, inited: handPositionInited } = useHandPosition();
  const { classify, inited: gestureClassificationInited } = useGestureClassification();

  const isLoading = useMemo(
    () => !handPositionInited || !gestureClassificationInited,
    [handPositionInited, gestureClassificationInited]
  );

  const cameraImgSrcRef = useRef<string>();
  const gestureRef = useRef<Gesture>();

  useEffect(() => {
    cameraImgSrcRef.current = cameraImgSrc;
  }, [cameraImgSrc]);

  useEffect(() => {
    gestureRef.current = gesture;
  }, [gesture]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setInterval(async () => {
      if (!cameraImgSrcRef.current || !gestureRef.current) {
        return;
      }

      const boxes = await detect(cameraImgSrcRef.current);
      setBoxes(boxes);
      const box = boxes[0];
      if (!box) {
        return;
      }
      const classes = await classify(cameraImgSrcRef.current, box);
      const topClass = classes.sort((a, b) => (a.probability < b.probability ? 1 : -1))[0];
      if (topClass.probability > 0.9 && topClass.id === gestureRef.current.id) {
        addScore();
        nextGesture();
      }
    }, tickTime);
  }, [isLoading, tickTime, addScore, detect, classify, nextGesture]);

  return {
    gesture,
    boxes,
    isLoading,
    cameraImgSrc
  };
};
