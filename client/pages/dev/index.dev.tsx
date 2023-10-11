import { useEffect, useState } from "react";
import { Box, useHandPosition } from "hand_detector";
import styled from "styled-components";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";
import { useCameraImage } from "@/hooks";

const StyledContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

let timeoutId: NodeJS.Timeout;

export default function DevHome() {
  const cameraImage = useCameraImage();
  const [boxes, setBoxes] = useState<Box[]>([]);

  const { detect } = useHandPosition({
    scoreThreshold: 0.7,
    iouThreshold: 0.6,
    topk: 2,
  });

  useEffect(() => {
    if (!cameraImage) {
      return;
    }

    if (timeoutId) {
      return;
    }

    timeoutId = setTimeout(() => {
      (async () => {
        // @ts-ignore
        timeoutId = undefined;

        console.time("Detection");
        const boxes = await detect(cameraImage);
        console.timeEnd("Detection");

        setBoxes(boxes);
      })();
    }, 300);
  }, [cameraImage, detect]);

  return (
    <>
      <StyledContainer>
        <GestureCard gesture="Hi!" />
        <HandCard imgSrc={cameraImage} boxes={boxes} />
      </StyledContainer>
    </>
  );
}
