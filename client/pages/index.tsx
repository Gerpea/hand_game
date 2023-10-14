import styled from "styled-components";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";
import { useCameraImage } from "@/hooks";
import { useGesture } from "@/hooks/useGesture";
import {
  Box,
  useGestureClassification,
  useHandPosition,
} from "hand_recognizer";
import { useEffect, useRef, useState } from "react";

const StyledContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

export default function Home() {
  const cameraImage = useCameraImage();
  const { gesture, nextGesture } = useGesture();
  const { detect } = useHandPosition();
  const { classify } = useGestureClassification();
  const timerId = useRef<NodeJS.Timeout>();
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    if (!cameraImage || timerId.current) {
      return;
    }

    timerId.current = setTimeout(async () => {
      timerId.current = undefined;
      const boxes = await detect(cameraImage);
      setBoxes(boxes);
      const box = boxes[0];
      if (!box) {
        return;
      }

      const classes = await classify(cameraImage, box);
      const topClass = classes.sort((a, b) =>
        a.probability < b.probability ? 1 : -1
      )[0];

      if (topClass.probability > 0.9 && topClass.id === gesture.id) {
        nextGesture();
      }
    }, 1000);
  }, [gesture, detect, classify, cameraImage, nextGesture]);

  return (
    <StyledContainer>
      <GestureCard gesture={gesture} />
      <HandCard imgSrc={cameraImage} boxes={boxes} />
    </StyledContainer>
  );
}
