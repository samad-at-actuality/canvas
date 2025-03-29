import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";

const Toolbar = ({
  onToolSelect,
  onBackgroundColorChange,
  onColorChange,
  onGradientChange,
  onShadowChange,
  onOpacityChange,
  onTextPropertiesChange,
  onSaveCanvas,
  onLoadCanvas,
  onClearCanvas,
}) => {
  const fonts = [
    "Arial",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Verdana",
  ];

  return (
    <div className="flex flex-wrap gap-3 p-2 bg-gray-200 border-b">
      {[
        "Text",
        "Rectangle",
        "Circle",
        "Line",
        "Image",
        "Gradient",
        "Shadow",
        "Opacity",
        "Download PDF",
        "Delete",
      ].map((tool) => (
        <button
          key={tool}
          className="p-2 bg-white rounded shadow hover:bg-gray-100"
          onClick={() => onToolSelect(tool)}
        >
          {tool}
        </button>
      ))}
      <input
        type="color"
        onChange={(e) => onColorChange(e.target.value)}
        className="w-10 h-10 border rounded cursor-pointer"
        title="Change Color"
      />
      <input
        type="color"
        onChange={(e) => onGradientChange(e.target.value, "#0000ff")}
        className="w-10 h-10 border rounded cursor-pointer"
        title="Gradient Start"
      />
      <input
        type="color"
        onChange={(e) => onGradientChange("#ff0000", e.target.value)}
        className="w-10 h-10 border rounded cursor-pointer"
        title="Gradient End"
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
        title="Opacity"
      />
      <select
        onChange={(e) => onTextPropertiesChange("black", 20, e.target.value)}
      >
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
      <button
        onClick={onSaveCanvas}
        className="p-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
      >
        Save Canvas
      </button>
      <button
        onClick={onLoadCanvas}
        className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Load Canvas
      </button>
      <button
        onClick={onClearCanvas}
        className="p-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
      >
        Clear Canvas
      </button>
    </div>
  );
};

const PdfEditor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      width: 800,
      height: 600,
      backgroundColor: "#fff",
    });
    canvasRef.current = canvas;

    // Auto-load from localStorage
    const savedCanvas = localStorage.getItem("canvasData");
    if (savedCanvas) {
      canvas.loadFromJSON(savedCanvas, () => {
        canvas.renderAll();
      });
    }

    document.addEventListener("keydown", (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && canvasRef.current) {
        const activeObject = canvasRef.current.getActiveObject();
        if (activeObject) {
          canvasRef.current.remove(activeObject);
          canvasRef.current.renderAll();
        }
      }
    });

    return () => canvas.dispose();
  }, []);

  const handleToolSelect = (tool) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    if (tool === "Download PDF") {
      const pdf = new jsPDF();
      pdf.text("Generated PDF", 20, 20);
      pdf.save("canvas.pdf");
    } else if (tool === "Delete") {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
      }
    } else {
      const shape = {
        Text: new fabric.Textbox("Type here", {
          left: 100,
          top: 100,
          fontSize: 20,
          fill: "black",
        }),
        Rectangle: new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: "blue",
        }),
        Circle: new fabric.Circle({
          left: 150,
          top: 150,
          radius: 50,
          fill: "red",
        }),
        Line: new fabric.Line([50, 50, 200, 200], {
          stroke: "black",
          strokeWidth: 5,
        }),
        Image: new fabric.Image.fromURL(
          "https://via.placeholder.com/150",
          (img) => {
            img.scale(0.5);
            canvas.add(img);
          },
        ),
      }[tool];
      console.log(tool);
      if (shape) canvas.add(shape);
    }
  };

  const handleBackgroundColorChange = (color) => {
    if (canvasRef.current) {
      canvasRef.current.setBackgroundColor(
        color,
        canvasRef.current.renderAll.bind(canvasRef.current),
      );
    }
  };

  const handleSaveCanvas = () => {
    console.log(canvasRef.current.toJSON());
    return;
    if (canvasRef.current) {
      const json = JSON.stringify(canvasRef.current.toJSON());
      localStorage.setItem("canvasData", json);
      alert("Canvas saved!");
    }
  };

  const handleLoadCanvas = () => {
    if (canvasRef.current) {
      const savedCanvas = localStorage.getItem("canvasData");
      if (savedCanvas) {
        canvasRef.current.loadFromJSON(savedCanvas, () => {
          canvasRef.current.renderAll();
        });
      } else {
        alert("No saved canvas found.");
      }
    }
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      canvasRef.current.setBackgroundColor(
        "#fff",
        canvasRef.current.renderAll.bind(canvasRef.current),
      );
      localStorage.removeItem("canvasData");
      alert("Canvas cleared!");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Toolbar
        onToolSelect={handleToolSelect}
        onBackgroundColorChange={handleBackgroundColorChange}
        onSaveCanvas={handleSaveCanvas}
        onLoadCanvas={handleLoadCanvas}
        onClearCanvas={handleClearCanvas}
      />
      <div className="border mt-2 w-[800px] h-[600px] relative">
        <canvas id="canvas"></canvas>
      </div>
    </div>
  );
};

export { PdfEditor };
