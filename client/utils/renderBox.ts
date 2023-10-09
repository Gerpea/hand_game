export const renderBoxes = (canvas: HTMLCanvasElement, boxes: Box) => {
  const ctx = canvas.getContext("2d");
  // Clean canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  boxes.forEach((box) => {
    const color = '#48F90A';
    const { x: x1, y: y1, w: width, h: height } = box;

    // Draw box.
    ctx.fillStyle = '#48F90A43';
    ctx.fillRect(x1, y1, width, height);
    // Draw border box
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
    ctx.strokeRect(x1, y1, width, height);
  });
};