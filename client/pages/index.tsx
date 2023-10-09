import { useCallback, useEffect, useRef, useState } from "react";
import { useHandPosition } from "hand_detector";
import { renderBoxes } from "@/utils/renderBox";

const localStreamConstraints = {
  audio: false,
  video: true,
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasDrawRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream>();

  const iRef = useRef(0);

  const { detect, inited } = useHandPosition({
    scoreThreshold: 0.7,
    topk: 2,
  });

  const handleImgLoad = async () => {
    if (!inited) {
      return;
    }

    const boxes = await detect(imgRef.current!);
    renderBoxes(canvasDrawRef.current!, boxes);
  };

  const drawVideo = useCallback((videoElement: HTMLVideoElement) => {
    if (iRef.current % 20 === 0) {
      const image = new Image();
      image.src = canvasRef.current!.toDataURL();
      imgRef.current!.src = image.src;
    }
    iRef.current++;
    canvasCtx.current?.drawImage(
      videoElement,
      0,
      0,
      canvasRef.current?.width || 0,
      canvasRef.current?.height || 0
    );
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
      <video ref={videoRef} autoPlay playsInline muted hidden />
      <div className="container" style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          id="cancaselement"
          width="416"
          height="416"
          style={{ position: "absolute" }}
        ></canvas>
        <canvas
          ref={canvasDrawRef}
          id="cancaseDrawlement"
          width="416"
          height="416"
          style={{ position: "absolute" }}
        ></canvas>
      </div>
      <img ref={imgRef} onLoad={handleImgLoad} style={{ display: "hidden" }} />
    </>
  );
}
