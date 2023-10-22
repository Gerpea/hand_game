import React, { HTMLAttributes, useEffect, useRef } from "react";

type Props = {
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>;
};

const Canvas: React.FC<Props & HTMLAttributes<HTMLCanvasElement>> = React.memo(
  function Canvas({ ctx, ...props }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasCtx = useRef<CanvasRenderingContext2D | null>();

    useEffect(() => {
      if (canvasRef.current) {
        canvasRef.current.style.width = "100%";
        canvasRef.current.style.height = "100%";
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
      }
    }, []);

    useEffect(() => {
      if (canvasRef.current) {
        canvasCtx.current = canvasRef.current.getContext("2d");
        ctx.current = canvasCtx.current;
      }
    }, [ctx]);

    return <canvas ref={canvasRef} {...props} />;
  }
);

export default Canvas;
