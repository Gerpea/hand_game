"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, useHandPosition } from "hand_detector";
import { renderBoxes } from "@/utils/renderBox";
import styled from "styled-components";
import Card from "@/components/Card";
import GestureCard from "@/components/GestureCard";
import HandCard from "@/components/HandCard";

const localStreamConstraints = {
  audio: false,
  video: true,
};

const StyledContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const imgRef = useRef<HTMLImageElement>(null);
  const [fullImage, setFullImage] = useState<HTMLImageElement>();
  const [croppedImage, setCroppedImage] = useState<HTMLImageElement>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasDrawRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream>();

  const iRef = useRef(0);

  const { detect, inited } = useHandPosition({
    scoreThreshold: 0.7,
    topk: 2,
  });

  useEffect(() => {
    if (!fullImage) {
      return;
    }

    (async () => {
      console.time("Detection");
      const boxes = await detect(fullImage);
      console.timeEnd("Detection");

      if (!boxes[0]) {
        return;
      }

      let newW = boxes[0]?.w || 416;
      let newH = boxes[0]?.h || 416;
      let newX = boxes[0]?.x || 0;
      let newY = boxes[0]?.y || 0;
      newW += newW / 10;
      newH += newH / 10;
      newX -= newX / 20;
      newY -= newY / 10;

      canvasDrawRef.current!.width = newW;
      canvasDrawRef.current!.height = newH;
      canvasDrawRef.current
        ?.getContext("2d")
        ?.drawImage(fullImage, newX, newY, newW, newH, 0, 0, newW, newH);
      const image = new Image();
      image.src = canvasDrawRef.current!.toDataURL();
      setCroppedImage(image);
    })();
  }, [fullImage, detect]);

  // const handleImgLoad = async () => {
  //   if (!inited || !imgRef.current) {
  //     return;
  //   }

  //   const boxes = await detect(imgRef.current!);
  //   renderBoxes(canvasDrawRef.current!, boxes);
  // };

  const drawVideo = useCallback((videoElement: HTMLVideoElement) => {
    canvasCtx.current?.drawImage(
      videoElement,
      0,
      0,
      canvasRef.current?.width || 0,
      canvasRef.current?.height || 0
    );
    if (iRef.current % 1 === 0) {
      const image = new Image();
      image.src = canvasRef.current!.toDataURL();
      setFullImage(image);
    }
    iRef.current++;
    requestAnimationFrame(() => {
      drawVideo(videoElement);
    });
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(localStreamConstraints)
      .then(setVideoStream)
      .catch((e) => {
        console.error("Error while trying to get camera stream", e);
      });
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtx.current = canvasRef.current.getContext("2d", { alpha: false });
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current!.play();
      };
      drawVideo(videoRef.current);
    }
  }, [videoStream, drawVideo]);

  return (
    <>
      <StyledContainer>
        <GestureCard gesture="Hi!" />
        <HandCard img={croppedImage} />
      </StyledContainer>
      <canvas ref={canvasRef} width="416" height="416" hidden></canvas>
      <canvas ref={canvasDrawRef} width="416" height="416" hidden></canvas>
      <video ref={videoRef} autoPlay playsInline muted hidden />
      {/* <img ref={imgRef} onLoad={handleImgLoad} hidden /> */}
    </>
  );
}
