import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
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
  const [firstGesture, setFirstGesture] = useState<Gesture>(gesture);
  const [secondGesture, setSecondGesture] = useState<Gesture>(gesture);
  const isShowFisrt = useRef(true);
  const isShowSecond = useRef(false);
  const firstEnd = useRef(true);
  const secondEnd = useRef(false);

  useEffect(() => {
    if (isShowFisrt.current) {
      setSecondGesture(gesture);
      isShowSecond.current = true;
      secondEnd.current = false;
      isShowFisrt.current = false;
      return;
    }
    if (isShowSecond.current) {
      setFirstGesture(gesture);
      isShowSecond.current = false;
      firstEnd.current = false;
      isShowFisrt.current = true;
      return;
    }
  }, [gesture]);

  return (
    <>
      <StyledImage
        src={firstGesture.img}
        alt={firstGesture.label}
        layout="fill"
        objectFit="contain"
        $isShow={secondEnd.current && isShowFisrt.current}
        onAnimationEnd={() => (firstEnd.current = true)}
        className={className}
      />
      <StyledImage
        src={secondGesture.img}
        alt={secondGesture.label}
        layout="fill"
        objectFit="contain"
        $isShow={firstEnd.current && isShowSecond.current}
        onAnimationEnd={() => (secondEnd.current = true)}
        className={className}
      />
    </>
  );
};

export default GestureImage;
