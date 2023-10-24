import { CAMERA_HEIGHT, CAMERA_WIDTH } from "@/const";
import { useEffect, useRef, useState } from "react";

const LOCAL_STREAM_CONSTRAINTS = {
  audio: false,
  video: true
};
/**
 * Use MediaStream from camera to get image every browser repaint
 *
 * @return {cameraImage} Image from a camera in base64 string
 */
export const useCameraImage = () => {
  const videoRef = useRef<HTMLVideoElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream>();
  const [cameraImage, setCameraImage] = useState<string>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(LOCAL_STREAM_CONSTRAINTS)
      .then(setVideoStream)
      .catch((e) => {
        console.error("Error while trying to get camera stream", e);
      });

    canvasRef.current = document.createElement("canvas");
    canvasRef.current.setAttribute("width", `${CAMERA_WIDTH}px`);
    canvasRef.current.setAttribute("height", `${CAMERA_HEIGHT}px`);
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

      setCameraImage(canvasRef.current!.toDataURL());
    }

    getImage();
  }, []);

  return cameraImage;
};
