import { useEffect, useRef, useState } from "react";

const LOCAL_STREAM_CONSTRAINTS = {
  audio: false,
  video: true,
};

export const useCameraImage = () => {
  const videoRef = useRef<HTMLVideoElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream>();
  const [fullImage, setFullImage] = useState<HTMLImageElement>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(LOCAL_STREAM_CONSTRAINTS)
      .then(setVideoStream)
      .catch((e) => {
        console.error("Error while trying to get camera stream", e);
      });

    canvasRef.current = document.createElement("canvas");
    canvasCtx.current = canvasRef.current.getContext("2d", { alpha: false });
  }, []);

  useEffect(() => {
    if (!videoRef.current) {
      videoRef.current = document.createElement("video");
      videoRef.current.setAttribute("muted", "true");
    }

    if (videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    }
  }, [videoStream]);

  useEffect(() => {
    function getImage() {
      requestAnimationFrame(getImage);
      if (!canvasCtx.current || !videoRef.current) {
        return;
      }
      canvasCtx.current.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current?.width || 0,
        canvasRef.current?.height || 0
      );

      const image = new Image();
      image.src = canvasRef.current!.toDataURL();
      setFullImage(image);
    }

    getImage();
  }, []);

  return fullImage;
};
