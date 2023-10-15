import React, { HTMLAttributes, useEffect, useRef } from "react";
import { Box } from "hand_recognizer";
import Card from "./Card";
import { renderBoxes } from "@/utils";
import styled from "styled-components";

type Props = {
  imgSrc?: string;
  boxes?: Box[];
};

const StyledHandCard = styled(Card)`
  overflow: hidden;
  position: relative;
`;

const HandCard: React.FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  imgSrc,
  boxes,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>();

  useEffect(() => {
    if (!drawCanvasRef.current || !boxes) {
      return;
    }

    renderBoxes(drawCanvasRef.current!, boxes);
  }, [boxes]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    canvasCtx.current = canvasRef.current.getContext("2d");
  }, []);

  useEffect(() => {
    if (!canvasCtx.current) {
      return;
    }

    if (!imgSrc) {
      canvasCtx.current.clearRect(
        0,
        0,
        canvasRef.current?.width || 0,
        canvasRef.current?.height || 0
      );
      return;
    }

    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      canvasCtx.current!.drawImage(
        img,
        0,
        0,
        canvasRef.current?.width || 0,
        canvasRef.current?.height || 0
      );
    };
  }, [imgSrc]);

  return (
    <StyledHandCard {...props}>
      <canvas
        ref={canvasRef}
        width="416"
        height="416"
        style={{ position: "absolute" }}
      />
      {boxes && (
        <canvas
          ref={drawCanvasRef}
          width="416"
          height="416"
          style={{ position: "absolute" }}
        />
      )}
    </StyledHandCard>
  );
};

export default HandCard;
