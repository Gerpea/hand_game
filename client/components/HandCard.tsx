import React, { useEffect, useRef } from "react";
import Card from "./Card";
import { renderBoxes } from "@/utils";

type Props = {
  img?: HTMLImageElement;
};

const HandCard: React.FC<Props> = ({ img }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>();

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

    if (!img) {
      canvasCtx.current.clearRect(
        0,
        0,
        canvasRef.current?.width || 0,
        canvasRef.current?.height || 0
      );
      return;
    }

    canvasCtx.current.drawImage(
      img,
      0,
      0,
      canvasRef.current?.width || 0,
      canvasRef.current?.height || 0
    );
  }, [img]);

  return (
    <Card>
      <canvas ref={canvasRef} width="416" height="416" />
    </Card>
  );
};

export default HandCard;
