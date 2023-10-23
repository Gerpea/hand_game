import React, {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Gesture } from "@/types";
import styled, { css } from "styled-components";
import { zoomIn, zoomOut } from "@/styles/animations";

const StyledImage = styled(Image)<{ $isShow: boolean }>`
  filter: drop-shadow(2px 4px 6px var(--color));
  animation: ${({ $isShow }) =>
      $isShow
        ? css`
            ${zoomIn(false)} 0.5s
          `
        : css`
            ${zoomOut()} 0.25s
          `}
    ease forwards;
`;

type Props = {
  gesture: Gesture;
};

const GestureImage: React.FC<Props & HTMLAttributes<HTMLImageElement>> = ({
  gesture,
  className,
}) => {
  const [showedGesture, setShowedGesture] = useState<Gesture>(gesture);
  const [showGesture, setShowGesture] = useState<boolean>(false);

  useEffect(() => {
    setShowGesture(false);
  }, [gesture]);

  const handleAnimationEnd = useCallback(() => {
    if (!showGesture) {
      setShowedGesture(gesture);
      setShowGesture(true);
    }
  }, [showGesture, gesture]);

  return (
    <StyledImage
      src={showedGesture.img}
      alt={showedGesture.label}
      layout="fill"
      objectFit="contain"
      $isShow={showGesture}
      onAnimationEnd={handleAnimationEnd}
      className={className}
    />
  );
};

export default GestureImage;
