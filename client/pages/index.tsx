import { useCallback, useEffect, useRef, useState } from "react";

const localStreamConstraints = {
  audio: false,
  video: true,
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream>();

  const drawVideo = useCallback((videoElement: HTMLVideoElement) => {
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
      <div className="container">
        <canvas
          ref={canvasRef}
          id="cancaselement"
          width="1920"
          height="1080"
        ></canvas>
      </div>
    </>
  );
}
