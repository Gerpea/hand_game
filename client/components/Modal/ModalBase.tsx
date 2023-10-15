import React, { HTMLAttributes, useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Card from "../Card";
import { createPortal } from "react-dom";

const appearance = keyframes`
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const disappearance = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(0.9);
    opacity: 0;
  }
`;

const appearanceBack = keyframes`
  0% {
    background-color: rgba(0,0,0,0);
  }
  50% {
    background-color: rgba(0,0,0,0.8);
  }
  100% {
    background-color: rgba(0,0,0,0.8);
  }
`;
const disappearanceBack = keyframes`
  0% {
    background-color: rgba(0,0,0,0.8);
  }
  50% {
    background-color: rgba(0,0,0,0);
  }
  100% {
    background-color: rgba(0,0,0,0);
  }
`;

const StyledOverlayContainer = styled.div<{ $isClosing: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;
  animation: ${({ $isClosing }) =>
      $isClosing ? disappearanceBack : appearanceBack}
    0.7s ease forwards;
`;

const StyledModalContainer = styled(Card)<{ $isClosing: boolean }>`
  width: 30%;
  height: auto;
  min-height: 30%;
  background-color: orange;
  box-shadow: none;

  animation: ${({ $isClosing }) => ($isClosing ? disappearance : appearance)}
    0.5s ease forwards;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
  padding: 0.5rem;
  padding-bottom: 0;
`;

export const StyledModalBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;
`;

export const StyledModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: flex-end;
  height: 3rem;
  width: calc(100% + 1rem);
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  box-shadow: 0px 0px 8px 2px rgba(34, 60, 80, 0.25) inset;

  cursor: pointer;
  transition: all 0.15s linear;
  &:hover {
    box-shadow: 0px 0px 8px 8px rgba(34, 60, 80, 0.25) inset;
  }
`;

const StyledCloseButton = styled(Card)`
  width: 2rem;
  height: 2rem;
  top: -1rem;
  right: -1rem;
  background-color: orange;
  position: absolute;
  box-shadow: none;
  color: black;
  text-align: center;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
};
export const ModalBase: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  isOpen,
  onClose,
  children,
  ...props
}) => {
  const [isRender, setIsRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRender(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = useCallback(() => {
    if (!isOpen && isRender) {
      setIsRender(false);
    }
  }, [isOpen, isRender]);

  const stopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    isRender &&
    createPortal(
      <StyledOverlayContainer
        {...props}
        onClick={onClose}
        $isClosing={!isOpen}
        onAnimationEnd={handleAnimationEnd}
      >
        <StyledModalContainer onClick={stopPropagation} $isClosing={!isOpen}>
          <StyledCloseButton onClick={onClose} />
          {children}
        </StyledModalContainer>
      </StyledOverlayContainer>,
      document.body
    )
  );
};
