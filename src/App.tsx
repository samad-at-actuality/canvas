import { useEffect, useRef } from "react";

const pixelsToInches = (pixels: number, dpi: number = 96): number => {
  return pixels / dpi;
};

const ResumeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resumeElements = [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 600,
      height: 100,
      color: "#2c3e50",
    },
    {
      type: "text",
      content: "John Doe",
      x: 20,
      y: 40,
      fontSize: 24,
      bold: true,
      color: "#FFFFFF",
    },
    {
      type: "text",
      content: "johndoe@example.com | +123 456 7890",
      x: 20,
      y: 70,
      fontSize: 16,
      color: "#FFFFFF",
    },
    {
      type: "text",
      content: "Experience",
      x: 20,
      y: 150,
      fontSize: 22,
      bold: true,
      color: "#333",
    },
    {
      type: "text",
      content: "Software Engineer - XYZ Corp (2020 - Present)",
      x: 20,
      y: 180,
      fontSize: 18,
      bold: true,
      color: "#000",
    },
    {
      type: "bullet",
      items: ["Built a React app", "Optimized database queries"],
      x: 40,
      y: 210,
      fontSize: 14,
      color: "#000",
    },
  ];

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas(canvasRef.current, resumeElements);
    }
  }, []);

  const drawCanvas = (canvas: HTMLCanvasElement, elements: any[]) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 800;

    elements.forEach((el) => {
      if (el.type === "rect") {
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
      } else if (el.type === "text") {
        ctx.fillStyle = el.color;
        ctx.font = `${el.bold ? "bold" : ""} ${el.fontSize}px Arial`;
        ctx.fillText(el.content, el.x, el.y);
      } else if (el.type === "bullet") {
        let yOffset = el.y;
        ctx.font = `${el.fontSize}px Arial`;
        ctx.fillStyle = el.color;
        el.items.forEach((item: string) => {
          ctx.fillText("• " + item, el.x, yOffset);
          yOffset += 20;
        });
      }
    });
  };

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ResumeCanvas;
