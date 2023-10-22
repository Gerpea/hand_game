import React, { HTMLAttributes, useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Card from "../Card";
import { createPortal } from "react-dom";
import { BiX } from "react-icons/bi";

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
  background-color: var(--card-color);
  box-shadow: none;

  animation: ${({ $isClosing }) => ($isClosing ? disappearance : appearance)}
    0.5s ease forwards;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
  overflow: visible;
  padding: 1rem;
`;

export const StyledModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
  padding-bottom: 1.5rem;
`;

export const StyledModalTitle = styled.h2`
  text-align: center;
`;

export const StyledModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: flex-end;

width: 100%;
`;

const StyledCloseButton = styled(Card)`
  width: 2rem;
  height: 2rem;
  position: absolute;
  top: -1rem;
  right: -1rem;

  background-color: var(--card-color);
  
  box-shadow: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }
`;
const StyledCloseIcon = styled(BiX)`
  width: 100%;
  height: 100%;

  opacity: 0.5;

  &:hover {
    opacity: 1;
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
          <StyledCloseButton onClick={onClose}>
            <StyledCloseIcon />
          </StyledCloseButton>
          {children}
        </StyledModalContainer>
      </StyledOverlayContainer>,
      document.body
    )
  );
};
