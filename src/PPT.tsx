import PptxGenJS from "pptxgenjs";

export const PPT = () => {
  const handleClick = () => {
    const ppt = new PptxGenJS();

    // Define A4 slide size
    ppt.defineLayout({ width: 8.27, height: 11.69, name: "A4Size" });
    ppt.layout = "A4Size";
    // Create a slide with the defined layout
    const slide = ppt.addSlide({ masterName: "A4Size" });

    // Add a full-width rectangle
    slide.addShape(ppt.ShapeType.rect, {
      x: 0,
      y: 0,
      h: 1.2,
      w: 8.27,
      fill: { color: "#FF5733" },
    });

    // Add text
    slide.addText("Hello world", {
      x: 1,
      y: 1,
      color: "aqua",
      fontSize: 24,
    });

    // Save the PPT
    ppt.writeFile({ fileName: "A4-Presentation.pptx" });
  };

  return (
    <div>
      <button onClick={handleClick}>Generate PPT</button>
    </div>
  );
};
