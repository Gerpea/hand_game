import { useEffect, useRef, useState } from "react";
import { useHandPosition } from "hand_detector";
import styled from "styled-components";
import Card from "@/components/Card";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";
import { useCameraImage } from "@/hooks";
import { renderBoxes } from "@/utils";

const localStreamConstraints = {
  audio: false,
  video: true,
};

const StyledContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

let timeoutId: NodeJS.Timeout;

export default function DevHome() {
  const cameraImage = useCameraImage();

  const { detect } = useHandPosition({
    scoreThreshold: 0.7,
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

        const boxes = await detect(cameraImage);
      })();
    }, 1000);
  }, [cameraImage, detect]);

  return (
    <>
      <StyledContainer>
        <GestureCard gesture="Hi!" />
        <HandCard img={cameraImage} />
      </StyledContainer>
    </>
  );
}
