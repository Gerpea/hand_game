import styled, { keyframes } from "styled-components";
import { useRouter } from "next/router";
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
import { HiPlay } from "react-icons/hi2";
import Loader from "@/components/Loader";
import Card from "@/components/Card";
import { OptionsModal } from "@/components/Modal";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Score from "@/components/Score";
import { ScoreModal } from "@/components/Modal/ScoreModal";

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
  display: flex;
  align-items: center;
  justify-content: center;

  width: fit-content;
  min-width: 3rem;
  height: 3rem;
  background-color: #fe8033;

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

const StyledOptionsIcon = styled(HiPlay)`
  width: 2rem;
  height: 2rem;
`;

const StyledToastContainer = styled(ToastContainer).attrs({
  className: "toast-container",
  toastClassName: "toast",
})`
  width: fit-content;
  max-width: 50%;
  color: inherit;

  .toast {
    background-color: rgba(254, 128, 51, 0.6);
    color: inherit;
    font: inherit;
    border-radius: 8px;
  }
`;

export default function Home() {
  const { query, isReady, push: routerPush } = useRouter();

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
  const { gameID, users } = useGame();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (gameID && gameID !== query["id"]) {
      routerPush(gameID);
    }
  }, [routerPush, query, isReady, gameID]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (query["id"]) {
      joinGame(query["id"] as string);
      return;
    }

    if (!query["id"]) {
      (async () => {
        const gameID = await createGame();
        if (gameID) {
          routerPush(`/${gameID}`);
        }
      })();
    }
  }, [routerPush, query, isReady, joinGame, createGame]);

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
            <StyledOptionsButton onClick={() => setIsOpen(true)}>
              {Object.values(users).filter((active) => active).length > 1 ? (
                <Score />
              ) : (
                <StyledOptionsIcon />
              )}
            </StyledOptionsButton>
            <StyledGestureCard gesture={gesture} />
            <StyledHandCard imgSrc={cameraImage} boxes={boxes} />
          </>
        )}
      </StyledContainer>
      {Object.values(users).filter((active) => active).length > 1 ? (
        <ScoreModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      ) : (
        <OptionsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
      <StyledToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        transition={Zoom}
        closeButton={false}
        icon={false}
      />
    </>
  );
}