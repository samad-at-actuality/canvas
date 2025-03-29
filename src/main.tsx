import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router"; // Use "react-router-dom" instead of "react-router"

import "./index.css";
import App from "./App.tsx";
// import { PPT } from "./PPT.tsx";
import { PdfEditor } from "./PdfEditor.tsx";
// import { PdfEditor2 } from "./PdfEditor2.tsx";
// import ExportToPdf from "./PrintReact.tsx";
// import { PdfDocument } from "./PdfDocument.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="ppt" element={<PPT />} /> */}
        <Route path="pdf" element={<App />} />
        {/* <Route path="pdf2" element={<PdfEditor2 />} /> */}
        {/* <Route path="pdf3" element={<ExportToPdf />} /> */}
        {/* <Route path="pdfdoc" element={<PdfDocument />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
