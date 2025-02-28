import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import PptxGenJS from "pptxgenjs";
const pixelsToInches = (pixels: number, dpi: number = 96): number => {
  return pixels / dpi;
};

const ResumeCanvas = () => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const [resumeData] = useState([
    {
      name: "John Doe",
      contact: "johndoe@example.com | +123 456 7890",
      experience: [
        {
          role: "Software Engineer - XYZ Corp (2020 - Present)",
          details: ["Built a React app", "Optimized database queries"],
        },
        {
          role: "Frontend Developer - ABC Inc (2018 - 2020)",
          details: ["Developed UI with CSS", "Integrated REST APIs"],
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "CSS", "MongoDB"],
      imageSrc: "/sample.jpg",
    },
    {
      name: "Jane Doe",
      contact: "janedoe@example.com | +987 654 3210",
      experience: [
        {
          role: "Product Manager - LMN Corp (2019 - Present)",
          details: ["Managed product roadmaps", "Led cross-functional teams"],
        },
        {
          role: "Business Analyst - PQR Ltd (2016 - 2019)",
          details: [
            "Conducted market research",
            "Developed business strategies",
          ],
        },
      ],
      skills: ["Agile", "Scrum", "Product Management", "Data Analysis"],
      imageSrc: "/sample.jpg",
    },
  ]);

  useEffect(() => {
    resumeData.forEach((data, index) => {
      if (canvasRefs.current[index]) {
        drawCanvas(data, canvasRefs.current[index]!);
      }
    });
  }, [resumeData]);

  const drawCanvas = (data: any, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 800;

    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, 100);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Arial";
    ctx.fillText(data.name, 20, 40);
    ctx.font = "16px Arial";
    ctx.fillText(data.contact, 20, 70);

    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Experience", 20, 150);
    ctx.fillText("Skills", 20, 400);

    let yOffset = 180;
    data.experience.forEach((job: any) => {
      ctx.fillText(job.role, 20, yOffset);
      yOffset += 30;
      job.details.forEach((detail: any) => {
        ctx.fillText("• " + detail, 40, yOffset);
        yOffset += 20;
      });
      yOffset += 10;
    });

    ctx.fillText(data.skills.join(", "), 40, 430);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => ctx.drawImage(img, 40, 460, 200, 200);
    img.src = data.imageSrc;
  };

  const exportToPPT = async () => {
    const pptx = new PptxGenJS();
    pptx.defineLayout({ width: 8.27, height: 11.69, name: "A4" });
    pptx.layout = "A4";

    for (const data of resumeData) {
      const slide = pptx.addSlide();

      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: "100%",
        h: 1,
        fill: { color: "2C3E50" },
      });

      slide.addText(data.name, {
        x: 0.5,
        y: 0.1,
        fontSize: 24,
        bold:true,
        h: pixelsToInches(24 + 6) + 0.1,
        color: "FFFFFF",fontFace: "Arial",
      });

      slide.addText(data.contact, {
        x: 0.5,
        y: 0.52,
        color: "FFFFFF",
        bold:true,
        h: pixelsToInches(14 + 6),
        fontSize: 14,fontFace: "Arial",
      });



      let yOffset = 1.5;

      slide.addText("Experience", {
        x: 0.5,
        y: yOffset,
        h:pixelsToInches(18 + 6),
        fontSize: 18,
        bold: true,
        fontFace: "Arial",
        color: "000000",
      });
      yOffset += 0.4;

      data.experience.forEach((job) => {
        slide.addText(job.role, {
          x: 0.5,
          y: yOffset,
          fontSize: 16,
          h:pixelsToInches(6 + 16),

          bold: true,
          fontFace: "Arial",
          color: "000000",
        });
        yOffset += 0.3;
        job.details.forEach((detail) => {
          slide.addText("• " + detail, {
            x: 0.7,
            y: yOffset,
            h:pixelsToInches(6 + 14),

            fontSize: 14,
            fontFace: "Arial",
            color: "000000",
          });
          yOffset += 0.2;
        });
        yOffset += 0.3;
      });

      slide.addText("Skills", {
        x: 0.5,
        y: yOffset,
        fontSize: 18,
        bold: true,
        fontFace: "Arial",
        color: "000000",          h:pixelsToInches(6 + 18),

      });

      yOffset += 0.3;
      slide.addText(data.skills.join(", "), {
        x: 0.7,
        y: yOffset,
        fontSize: 14,
        fontFace: "Arial",
        color: "000000",          h:pixelsToInches(6 + 14),

      });

      slide.addImage({
        path: data.imageSrc,
        x: 0.5,
        y: yOffset + 0.5,
        w: 2.5,
        h: 2.5,
      });
    }

    pptx.writeFile({ fileName: "resume.pptx" });
  };

  const loadImageAsDataURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context not available");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg")); // Convert image to base64
      };
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  };

  const exportToPDF = async () => {
    const doc = new jsPDF({ format: "a4" });

    for (const [index, data] of resumeData.entries()) {
      if (index > 0) doc.addPage();

      // Draw header background
      doc.setFillColor(44, 62, 80);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");

      // Name and contact details
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text(data.name, 20, 15);
      doc.setFontSize(12);
      doc.text(data.contact, 20, 25);

      let yOffset = 45;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text("Experience", 20, yOffset);
      yOffset += 10;

      data.experience.forEach((job) => {
        doc.setFontSize(14);
        doc.text(job.role, 20, yOffset);
        yOffset += 8;
        doc.setFontSize(12);
        job.details.forEach((detail) => {
          doc.text("• " + detail, 30, yOffset);
          yOffset += 6;
        });
        yOffset += 6;
      });

      // Skills section
      doc.setFontSize(16);
      doc.text("Skills", 20, yOffset + 10);
      doc.setFontSize(12);
      doc.text(data.skills.join(", "), 30, yOffset + 20);

      // Load and add the image
      try {
        const imageData = await loadImageAsDataURL(data.imageSrc);
        doc.addImage(imageData, "JPEG", 20, yOffset + 30, 50, 50);
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    }

    // Save the PDF after all processing is done
    doc.save("resume.pdf");
  };

  return (
    <div>
      <div>
        <button onClick={exportToPDF}>Export as PDF</button>
        <button onClick={exportToPPT}>Export as PPT</button>
      </div>
      {resumeData.map((_, index) => (
        <div key={index}>
          {/* @ts-ignore */}
          <canvas ref={(el) => (canvasRefs.current[index] = el)} />
        </div>
      ))}
    </div>
  );
};

export default ResumeCanvas;
