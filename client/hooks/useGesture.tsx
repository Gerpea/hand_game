import { useCallback, useRef, useState } from "react";
import { GESTURES } from "hand_recognizer";
import { Gesture } from "@/types";
import { shuffleArray } from "@/utils";

let gestures = shuffleArray<Gesture>(
  GESTURES.map((gesture) => ({
    ...gesture,
    img: `/images/gestures/${gesture.label.toLowerCase()}.svg`
  })).slice(1)
);

export const useGesture = () => {
  const iRef = useRef(0);
  const [gesture, setGesture] = useState<Gesture>(gestures[iRef.current]);

  const nextGesture = useCallback(() => {
    iRef.current = iRef.current + 1;
    if (iRef.current >= gestures.length) {
      iRef.current = 0;
      gestures = shuffleArray(gestures);
    }
    setGesture(gestures[iRef.current]);
  }, []);

  return {
    gesture,
    nextGesture
  };
};
