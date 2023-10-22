import styled from "styled-components";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";
import { useGame } from "@/hooks";
import { useMemo, useState } from "react";
import { HiPlay } from "react-icons/hi2";
import Loader from "@/components/Loader";
import Card from "@/components/Card";
import { OptionsModal } from "@/components/Modal";
import { ToastContainer, Zoom } from "react-toastify";
import Score from "@/components/Score";
import { ScoreModal } from "@/components/Modal/ScoreModal";
import "react-toastify/dist/ReactToastify.css";
import { useGameRedirects } from "@/hooks/useGameRedirects";
import { useGameLogic } from "@/hooks/useGameLogic";
import { zoomIn } from "@/styles/animations";

const StyledContainer = styled.div`
  display: flex;
  column-gap: 1rem;
`;

const StyledGestureCard = styled(GestureCard)`
  width: 25vw;
  height: 25vw;

  animation: ${zoomIn(true)} 0.5s ease;
`;
const StyledHandCard = styled(HandCard)`
  width: 25vw;
  height: 25vw;

  animation: ${zoomIn(true)} 0.5s ease;
`;

const StyledOptionsButton = styled(Card)`
  width: fit-content;
  min-width: 3rem;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--card-color);

  border-top-right-radius: 0;
  border-top-left-radius: 0;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  margin-left: auto;
  margin-right: auto;

  cursor: pointer;

  transition: width .33s ease;

  &:hover {
    transform: scale(1.1);
  }

  animation: ${zoomIn(true)} 0.5s ease;
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
    border-radius: var(--card-border-radius);

    background-color: var(--toast-color);
    color: inherit;

    font: inherit;
  }
`;

export default function Home() {
  const { gameID, opponentID } = useGame();
  const { isLoading, gesture, cameraImgSrc, boxes } = useGameLogic(1000);
  useGameRedirects(gameID);

  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <StyledContainer>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <StyledOptionsButton onClick={handleOpenModal}>
              {opponentID ? <Score /> : <StyledOptionsIcon />}
            </StyledOptionsButton>
            <StyledGestureCard gesture={gesture} />
            <StyledHandCard imgSrc={cameraImgSrc} boxes={boxes} />
          </>
        )}
      </StyledContainer>
      <ScoreModal isOpen={isOpen && !!opponentID} onClose={handleCloseModal} />
      <OptionsModal isOpen={isOpen && !!!opponentID} onClose={handleCloseModal} />
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

export { getServerSideProps } from "@/utils/getServerSideLocale";
