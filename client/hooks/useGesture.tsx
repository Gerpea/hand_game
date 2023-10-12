import { useCallback, useRef, useState } from "react";

type Gesture = {
  label: string;
};

const gestures = [
  { label: "Hi" },
  { label: "Ok" },
  { label: "V" },
  { label: "Like" },
  { label: "Dislike" },
  { label: "Fist" },
  { label: "Gun" },
];

export const useGesture = () => {
  const iRef = useRef(0);
  const [gesture, setGesture] = useState<Gesture>(gestures[iRef.current]);

  const nextGesture = useCallback(() => {
    iRef.current = iRef.current + 1
    if(iRef.current >= gestures.length) {
      iRef.current = 0
    }
    setGesture(gestures[iRef.current]);
  }, []);

  return {
    gesture,
    nextGesture,
  };
};
