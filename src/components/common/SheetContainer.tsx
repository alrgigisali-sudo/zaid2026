import React, { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Smartphone, Monitor, Printer, Layers } from "lucide-react";
import { PrintAndPdfActions, getPrintFitMode, setPrintFitMode, PrintFitMode } from "./PrintAndPdfActions";

interface SheetContainerProps {
  children: React.ReactNode;
  isLandscape?: boolean;
  className?: string;
  showToolbar?: boolean;
}

export const SheetContainer: React.FC<SheetContainerProps> = ({
  children,
  isLandscape = false,
  className = "",
  showToolbar = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sheet native pixel dimensions at 96 DPI:
  // Portrait: 210mm ~ 794px, 297mm ~ 1123px
  // Landscape: 297mm ~ 1123px, 210mm ~ 794px
  const sheetBaseWidth = isLandscape ? 1123 : 794;
  const sheetBaseHeight = isLandscape ? 794 : 1123;

  const [mode, setMode] = useState<"fit" | "custom">("fit");
  const [scale, setScale] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const [fitMode, setFitModeState] = useState<PrintFitMode>(() => getPrintFitMode());

  const handleToggleFitMode = () => {
    const next: PrintFitMode = fitMode === "single-page" ? "multi-page" : "single-page";
    setFitModeState(next);
    setPrintFitMode(next);
  };

  // Measure container and auto-fit on resize
  useEffect(() => {
    function updateDimensions() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availableWidth = rect.width;
      setContainerWidth(availableWidth);

      if (mode === "fit") {
        if (availableWidth < sheetBaseWidth + 24) {
          // Screen is narrower than the sheet: fit with safety padding
          const computedScale = Math.max(0.35, Math.min(1, (availableWidth - 16) / sheetBaseWidth));
          setScale(Number(computedScale.toFixed(3)));
        } else {
          // Screen is wide enough for natural 100% scale
          setScale(1);
        }
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
    };
  }, [mode, sheetBaseWidth, sheetBaseHeight]);

  const handleZoomIn = () => {
    setMode("custom");
    setScale((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setMode("custom");
    setScale((prev) => Math.max(0.35, Number((prev - 0.1).toFixed(2))));
  };

  const handleResetFit = () => {
    setMode("fit");
    if (containerWidth < sheetBaseWidth + 24) {
      const computedScale = Math.max(0.35, Math.min(1, (containerWidth - 16) / sheetBaseWidth));
      setScale(Number(computedScale.toFixed(3)));
    } else {
      setScale(1);
    }
  };

  const handleSetActualSize = () => {
    setMode("custom");
    setScale(1);
  };

  // Scaled height for preserving layout flow without bottom white void
  const scaledWrapperHeight = scale < 1 ? `${Math.ceil(sheetBaseHeight * scale + 30)}px` : "auto";

  return (
    <div ref={containerRef} className={`w-full flex flex-col items-center ${className}`}>
      {/* Responsive Toolbar */}
      {showToolbar && (
        <div className="no-print w-full max-w-4xl mx-auto mb-3 px-3 py-2 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-2 text-xs select-none">
          {/* Mode & Preset controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleResetFit}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                mode === "fit"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title="ملاءمة النموذج مع عرض شاشة الهاتف أو الكمبيوتر تلقائياً"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ملاءمة الشاشة</span>
            </button>

            <button
              type="button"
              onClick={handleSetActualSize}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                mode === "custom" && scale === 1
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title="عرض النموذج بالحجم الطبيعي للطباعة A4 بنسبة 100%"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>100% حجم A4</span>
            </button>

            <button
              type="button"
              onClick={handleToggleFitMode}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer border ${
                fitMode === "single-page"
                  ? "bg-sky-900/80 border-sky-500/50 text-sky-200 hover:bg-sky-800"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
              title="التبديل بين ضبط النموذج في صفحة A4 واحدة إجبارياً أو السماح بتعدد الصفحات للنماذج الطويلة"
            >
              {fitMode === "single-page" ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>ضبط: صفحة واحدة</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>ضبط: صفحات متعددة</span>
                </>
              )}
            </button>
          </div>

          {/* Zoom Level & Actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="font-mono font-bold text-[11px] px-2 py-1 rounded bg-slate-800/80 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            <PrintAndPdfActions
              landscape={isLandscape}
              printLabel="طباعة A4"
              pdfLabel="حفظ PDF"
              compact={true}
              variant="dark"
            />
          </div>
        </div>
      )}

      {/* Sheet Scaled Viewport Container */}
      <div
        className="w-full flex justify-center overflow-x-auto overflow-y-visible relative py-2 px-1 transition-all"
        style={{
          minHeight: scaledWrapperHeight,
        }}
      >
        <div
          ref={contentRef}
          className="sheet-viewport-wrapper origin-top transition-transform duration-150 flex flex-col items-center"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: "top center",
            width: scale < 1 ? `${sheetBaseWidth}px` : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SheetContainer;
