import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { Box } from "hand_recognizer";
import Card from "./Card";
import { renderBoxes } from "@/utils";
import styled from "styled-components";
import Canvas from "./Canvas";
import { CAMERA_HEIGHT, CAMERA_WIDTH } from "@/const";

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

    const xRatio = canvasBoxesCtx.current.canvas.width / CAMERA_WIDTH;
    const yRatio = canvasBoxesCtx.current.canvas.height / CAMERA_HEIGHT;
    renderBoxes(canvasBoxesCtx.current, boxes, xRatio, yRatio);
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
