import { useEffect, useState } from "react";
import styled from "styled-components";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";
import { useCameraImage } from "@/hooks";

const StyledContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

const gestures = ["hi", "bye", "ok"];
let currentGestureIdx = 0;

export default function Home() {
  const cameraImage = useCameraImage();
  const [gesture, setGesture] = useState(gestures[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGesture(gestures[++currentGestureIdx]);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <StyledContainer>
      <GestureCard gesture={gesture} />
      <HandCard img={cameraImage} />
    </StyledContainer>
  );
}
