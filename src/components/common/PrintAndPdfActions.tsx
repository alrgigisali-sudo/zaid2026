/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Printer, FileDown, Eye, X, CheckCircle2, FileText, Settings2, Minimize2, Layers } from "lucide-react";

export type PrintFitMode = "single-page" | "multi-page";

let currentFitMode: PrintFitMode = "single-page";

export function getPrintFitMode(): PrintFitMode {
  return currentFitMode;
}

export function setPrintFitMode(mode: PrintFitMode) {
  currentFitMode = mode;
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-print-fit", mode);
  }
}

/**
 * Triggers calibrated A4 printing or PDF saving without extra blank pages.
 * @param options.landscape Whether the active sheet is landscape A4
 * @param options.mode 'print' or 'pdf'
 * @param options.documentTitle Optional custom title so "Save as PDF" uses a clean Arabic filename
 * @param options.fitMode 'single-page' (strictly fits 1 A4 sheet) or 'multi-page' (allows flow)
 */
export function executeCalibratedPrint(options?: {
  landscape?: boolean;
  mode?: "print" | "pdf";
  documentTitle?: string;
  fitMode?: PrintFitMode;
}) {
  const isLandscape = options?.landscape ?? false;
  const fitMode = options?.fitMode ?? currentFitMode;
  setPrintFitMode(fitMode);

  // Inject exact @page rule so browser print / Save-as-PDF engine uses zero margin and exact A4 orientation
  let styleEl = document.getElementById("page-orient-style") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "page-orient-style";
    document.head.appendChild(styleEl);
  }

  const pageSize = isLandscape ? "A4 landscape" : "A4 portrait";
  styleEl.textContent = `
    @page {
      size: ${pageSize};
      margin: 0mm !important;
    }
  `;

  // Temporarily set document.title if saving as PDF so the browser names the PDF file cleanly
  const originalTitle = document.title;
  if (options?.documentTitle) {
    document.title = options.documentTitle;
  } else if (options?.mode === "pdf") {
    const activeHeading = document.querySelector(".sheet h2")?.textContent?.trim();
    if (activeHeading) {
      document.title = `منصة زيد الرقمية - ${activeHeading}`;
    }
  }

  // Measure sheets and auto-scale inner content if in single-page mode and content slightly overflows
  const sheets = document.querySelectorAll<HTMLElement>(".sheet");
  const originalTransforms: { el: HTMLElement; style: string }[] = [];

  if (fitMode === "single-page") {
    const targetMaxPx = isLandscape ? 780 : 1110; // Exact safe pixel height for 1 A4 page at 96 DPI
    sheets.forEach((sheet) => {
      originalTransforms.push({ el: sheet, style: sheet.getAttribute("style") || "" });
      const actualScrollHeight = sheet.scrollHeight;
      if (actualScrollHeight > targetMaxPx + 6) {
        // Compute subtle vertical compression ratio so nothing spills onto page 2
        const ratio = Math.max(0.78, targetMaxPx / actualScrollHeight);
        sheet.style.setProperty("--sheet-auto-scale", String(Number(ratio.toFixed(3))));
        sheet.classList.add("sheet-autofit-active");
      }
    });
  }

  setTimeout(() => {
    window.print();

    // Restore after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
      originalTransforms.forEach(({ el, style }) => {
        el.classList.remove("sheet-autofit-active");
        el.style.removeProperty("--sheet-auto-scale");
        if (style) {
          el.setAttribute("style", style);
        } else {
          el.removeAttribute("style");
        }
      });
    }, 500);
  }, 80);
}

interface PrintAndPdfActionsProps {
  landscape?: boolean;
  printLabel?: string;
  pdfLabel?: string;
  documentTitle?: string;
  compact?: boolean;
  variant?: "school" | "teacher" | "dark";
}

export const PrintAndPdfActions: React.FC<PrintAndPdfActionsProps> = ({
  landscape = false,
  printLabel = "طباعة النموذج",
  pdfLabel = "حفظ PDF",
  documentTitle,
  compact = false,
  variant = "school",
}) => {
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [fitMode, setFitModeState] = useState<PrintFitMode>(currentFitMode);

  const handleToggleFit = (mode: PrintFitMode) => {
    setFitModeState(mode);
    setPrintFitMode(mode);
  };

  const handleDirectPrint = () => {
    executeCalibratedPrint({
      landscape,
      mode: "print",
      documentTitle,
      fitMode,
    });
  };

  const handleConfirmPdfSave = () => {
    setIsPdfPreviewOpen(false);
    setTimeout(() => {
      executeCalibratedPrint({
        landscape,
        mode: "pdf",
        documentTitle,
        fitMode,
      });
    }, 120);
  };

  const printBtnClass =
    variant === "teacher"
      ? "bg-emerald-700 hover:bg-emerald-800 text-white"
      : variant === "dark"
      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
      : "bg-sky-800 hover:bg-sky-900 text-white";

  const pdfBtnClass =
    variant === "dark"
      ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
      : "bg-amber-500 hover:bg-amber-600 text-slate-950";

  return (
    <>
      <div className="inline-flex items-center gap-2 flex-wrap no-print">
        {/* Direct Print Button */}
        <button
          type="button"
          onClick={handleDirectPrint}
          className={`inline-flex items-center gap-1.5 font-bold ${
            compact ? "text-xs px-3 py-1.5 rounded-lg" : "text-xs sm:text-sm px-4 py-2.5 rounded-xl"
          } shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${printBtnClass}`}
          title="طباعة فورية بمقاس A4 مضبوط في صفحة واحدة"
        >
          <Printer className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          <span>{printLabel}</span>
        </button>

        {/* Save as PDF Button with Preview Modal */}
        <button
          type="button"
          onClick={() => setIsPdfPreviewOpen(true)}
          className={`inline-flex items-center gap-1.5 font-black ${
            compact ? "text-xs px-3 py-1.5 rounded-lg" : "text-xs sm:text-sm px-4 py-2.5 rounded-xl"
          } shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${pdfBtnClass}`}
          title="معاينة وحفظ النموذج كملف PDF بمقاس A4 دقيق"
        >
          <FileDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          <span>{pdfLabel}</span>
        </button>
      </div>

      {/* Calibrated PDF & Print Preview Modal */}
      {isPdfPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 no-print text-right"
          dir="rtl"
          onClick={() => setIsPdfPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">حفظ وتصدير النموذج بصيغة PDF</h3>
                  <p className="text-[11px] text-slate-300">
                    معايرة تلقائية لمقاس A4 لمنع خروج ورقة ثانية فارغة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Page Fit Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-sky-700" />
                  <span>نظام ضبط مقاس الورقة (A4 {landscape ? "أفقي" : "عمودي"}):</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleFit("single-page")}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                      fitMode === "single-page"
                        ? "border-sky-700 bg-sky-50/80 ring-2 ring-sky-600/20"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <Minimize2 className="w-3.5 h-3.5 text-sky-700" />
                        صفحة A4 واحدة فقط
                      </span>
                      {fitMode === "single-page" && (
                        <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-600 leading-relaxed">
                      ضبط تلقائي للهوامش والارتفاع لمنع خروج ورقة ثانية فارغة (موصى به)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFit("multi-page")}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                      fitMode === "multi-page"
                        ? "border-sky-700 bg-sky-50/80 ring-2 ring-sky-600/20"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        نماذج طويلة (متعدد)
                      </span>
                      {fitMode === "multi-page" && (
                        <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-600 leading-relaxed">
                      السماح بامتداد الجداول الطويلة لأكثر من صفحة عند الحاجة
                    </span>
                  </button>
                </div>
              </div>

              {/* Quick instructions for crisp vector PDF */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-amber-950">
                <div className="font-black flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>خطوات حفظ ملف الـ PDF بأعلى دقة رسمية:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 pr-1 leading-relaxed">
                  <li>
                    في النافذة التالية، اختر الوجهة (Destination):{" "}
                    <b className="text-slate-950">حفظ بتنسيق PDF (Save as PDF)</b>.
                  </li>
                  <li>
                    تم ضبط الهوامش تلقائياً على <b className="text-slate-950">بلا هوامش (None / Default)</b> ومقاس{" "}
                    <b className="text-slate-950">A4 {landscape ? "أفقي" : "عمودي"}</b>.
                  </li>
                  <li>
                    فعّل خيار <b className="text-slate-950">رسومات الخلفية (Background graphics)</b> لظهور ألوان الترويسة الرسمية.
                  </li>
                </ol>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPdfPreviewOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPdfSave}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  <span>متابعة وحفظ ملف PDF الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
