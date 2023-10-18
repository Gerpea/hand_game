import styled, { keyframes } from "styled-components";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";
import { useApi, useCameraImage, useGame } from "@/hooks";
import { useGesture } from "@/hooks/useGesture";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  useGestureClassification,
  useHandPosition,
} from "hand_recognizer";
import Loader from "@/components/Loader";
import Card from "@/components/Card";
import { OptionsModal } from "@/components/Modal";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

const appearance = keyframes`
  0% {
    box-shadow: none;
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  75% {
    transform: scale(1) translateX(0%);
    opacity: 1;
  }
  100% {
    box-shadow: 0px 0px 8px 2px rgba(34, 60, 80, 0.25);
    transform: scale(1) translateX(0%);
    opacity: 1;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  column-gap: 1rem;
`;

const StyledGestureCard = styled(GestureCard)`
  animation: ${appearance} 0.5s ease;
`;
const StyledHandCard = styled(HandCard)`
  animation: ${appearance} 0.5s ease;
`;

const StyledOptionsButton = styled(Card)`
  width: 3rem;
  height: 3rem;
  background-color: orange;

  border-top-right-radius: 0;
  border-top-left-radius: 0;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;

  cursor: pointer;

  transition: all 0.33s ease;

  &:hover {
    transform: scale(1.1);
  }

  animation: ${appearance} 0.5s ease;
`;

export default function Home() {
  const { id } = useRouter().query;
  const cameraImage = useCameraImage();
  const { gesture, nextGesture } = useGesture();
  const { detect, inited: handPositionInited } = useHandPosition();
  const { classify, inited: gestureClassificationInited } =
    useGestureClassification();
  const timerId = useRef<NodeJS.Timeout>();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const isLoading = useMemo(
    () => !handPositionInited || !gestureClassificationInited,
    [handPositionInited, gestureClassificationInited]
  );
  const { addScore, createGame, joinGame } = useApi();
  const { scores, userID, gameID, users } = useGame();

  useEffect(() => {
    if (id) {
      joinGame(id as string);
    } else {
      createGame();
    }
  }, [id, joinGame, createGame]);

  useEffect(() => {
    if (
      !cameraImage ||
      timerId.current ||
      !handPositionInited ||
      !gestureClassificationInited
    ) {
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
        addScore();
        nextGesture();
      }
    }, 1000);
  }, [
    gesture,
    detect,
    classify,
    cameraImage,
    nextGesture,
    handPositionInited,
    gestureClassificationInited,
    addScore,
  ]);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <StyledContainer>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <p>Score: {scores[userID]}</p>
            <StyledOptionsButton onClick={() => setIsOpen(true)} />
            <StyledGestureCard gesture={gesture} />
            <StyledHandCard imgSrc={cameraImage} boxes={boxes} />
          </>
        )}
      </StyledContainer>
      <OptionsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ToastContainer position="bottom-center" />
    </>
  );
}
