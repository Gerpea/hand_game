import { useState } from "react";

type Gesture = {
  label: string;
};

export const useGesture = () => {
  const [gesture, setGesture] = useState<Gesture>();

  return {
    gesture,
  };
};
