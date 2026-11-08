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
  const [measuredHeight, setMeasuredHeight] = useState<number>(sheetBaseHeight);

  useEffect(() => {
    function updateDimensions() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Fallback to window.innerWidth if container hasn't settled yet
      const availableWidth = rect.width > 0 ? rect.width : window.innerWidth - 16;
      setContainerWidth(availableWidth);

      if (contentRef.current) {
        const sheets = contentRef.current.querySelectorAll<HTMLElement>(".sheet");
        if (sheets.length > 0) {
          let totalH = 0;
          sheets.forEach((s, idx) => {
            totalH += s.offsetHeight > 150 ? s.offsetHeight : sheetBaseHeight;
            if (idx > 0) totalH += 32;
          });
          setMeasuredHeight(Math.max(sheetBaseHeight, totalH));
        } else {
          setMeasuredHeight(sheetBaseHeight);
        }
      }

      if (mode === "fit") {
        if (availableWidth < sheetBaseWidth + 12) {
          // Screen is narrower than the sheet: fit cleanly even on 320px-430px smartphones (portrait & landscape)
          const safetyPad = availableWidth < 500 ? 4 : 16;
          const computedScale = Math.max(
            0.26,
            Math.min(1, (availableWidth - safetyPad) / sheetBaseWidth)
          );
          setScale(Number(computedScale.toFixed(3)));
        } else {
          // Screen is wide enough for natural 100% scale
          setScale(1);
        }
      }
    }

    updateDimensions();
    const timer = setTimeout(updateDimensions, 60);
    window.addEventListener("resize", updateDimensions);
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
    };
  }, [mode, sheetBaseWidth, sheetBaseHeight, isLandscape, children]);

  const handleZoomIn = () => {
    setMode("custom");
    setScale(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setMode("custom");
    setScale(prev => Math.max(0.26, Number((prev - 0.1).toFixed(2))));
  };

  const handleResetFit = () => {
    setMode("fit");
    if (containerWidth < sheetBaseWidth + 16) {
      const safetyPad = containerWidth < 500 ? 8 : 16;
      const computedScale = Math.max(
        0.26,
        Math.min(1, (containerWidth - safetyPad) / sheetBaseWidth)
      );
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
  const activeHeight = Math.max(sheetBaseHeight, measuredHeight);
  const scaledWrapperHeight =
    scale < 1 ? `${Math.ceil(activeHeight * scale + 20)}px` : "auto";

  return (
    <div ref={containerRef} className={`w-full max-w-full flex flex-col items-center overflow-hidden ${className}`}>
      {/* Responsive Toolbar */}
      {showToolbar && (
        <div className="no-print w-full max-w-4xl mx-auto mb-3 p-2.5 sm:px-3.5 sm:py-2.5 bg-[#080C3A] text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs select-none border border-[#111A5E]">
          {/* Mode & Preset controls */}
          <div className="flex items-center justify-between sm:justify-start gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleResetFit}
                className={`min-h-[38px] flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  mode === "fit"
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-white/10 text-slate-200 hover:text-white hover:bg-white/15"
                }`}
                title="ملاءمة النموذج مع عرض شاشة الجوال أو الكمبيوتر تلقائياً"
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span>ملاءمة الشاشة</span>
              </button>

              <button
                type="button"
                onClick={handleSetActualSize}
                className={`min-h-[38px] flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  mode === "custom" && scale === 1
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-white/10 text-slate-200 hover:text-white hover:bg-white/15"
                }`}
                title="عرض النموذج بالحجم الطبيعي للطباعة A4 بنسبة 100%"
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span>100% حجم A4</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleFitMode}
              className={`min-h-[38px] flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer border whitespace-nowrap ${
                fitMode === "single-page"
                  ? "bg-white/10 border-amber-400/50 text-amber-200 hover:bg-white/15"
                  : "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10"
              }`}
              title="التبديل بين ضبط النموذج في صفحة A4 واحدة إجبارياً أو السماح بتعدد الصفحات للنماذج الطويلة"
            >
              {fitMode === "single-page" ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>صفحة واحدة</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span>متعدد الصفحات</span>
                </>
              )}
            </button>
          </div>

          {/* Zoom Level & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleZoomOut}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="font-mono font-bold text-[11px] px-2 py-1.5 rounded-lg bg-white/10 min-w-[52px] text-center tabular-nums">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:block h-4 w-px bg-white/20 mx-1" />

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
        className={`sheet-viewport-outer w-full flex justify-center ${
          scale < 1 ? "overflow-hidden" : "overflow-x-auto"
        } overflow-y-visible relative py-1 px-0 sm:px-1 transition-all`}
        style={{
          height: scaledWrapperHeight,
          minHeight: scaledWrapperHeight,
        }}
      >
        <div
          ref={contentRef}
          className="sheet-viewport-wrapper origin-top transition-transform duration-150 flex flex-col items-center shrink-0"
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: "top center",
            width: `${sheetBaseWidth}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SheetContainer;
