import React, { HTMLAttributes, useEffect, useRef } from "react";
import { Box } from "hand_recognizer";
import Card from "./Card";
import { renderBoxes } from "@/utils";
import styled from "styled-components";
import Canvas from "./Canvas";

type Props = {
  imgSrc?: string;
  boxes?: Box[];
};

const StyledHandCard = styled(Card)`
  overflow: hidden;
  position: relative;
`;

const StyledCanvas = styled(Canvas)`
  position: absolute;
`;

const HandCard: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  imgSrc,
  boxes,
  ...props
}) => {
  const canvasImgCtx = useRef<CanvasRenderingContext2D>(null);
  const canvasBoxesCtx = useRef<CanvasRenderingContext2D>(null);

  useEffect(() => {
    if (!canvasBoxesCtx.current || !boxes) {
      return;
    }

    renderBoxes(canvasBoxesCtx.current, boxes);
  }, [boxes]);

  useEffect(() => {
    if (!canvasImgCtx.current) {
      return;
    }

    if (!imgSrc) {
      canvasImgCtx.current.clearRect(
        0,
        0,
        canvasImgCtx.current.canvas.width || 0,
        canvasImgCtx.current.canvas.height || 0
      );
      return;
    }

    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      canvasImgCtx.current!.drawImage(
        img,
        0,
        0,
        canvasImgCtx.current!.canvas.width || 0,
        canvasImgCtx.current!.canvas.height || 0
      );
    };
  }, [imgSrc]);

  return (
    <StyledHandCard {...props}>
      <StyledCanvas ctx={canvasImgCtx} />
      {boxes && <StyledCanvas ctx={canvasBoxesCtx} />}
    </StyledHandCard>
  );
};

export default HandCard;
