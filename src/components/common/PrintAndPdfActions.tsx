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

  // Save and reset mobile viewport wrapper scales and outer heights so mobile print engine (iOS Safari/Android) sees full-size unscaled A4
  const viewportWrappers = document.querySelectorAll<HTMLElement>(".sheet-viewport-wrapper");
  const viewportOuters = document.querySelectorAll<HTMLElement>(".sheet-viewport-outer");
  const savedStyles: { el: HTMLElement; style: string }[] = [];

  viewportWrappers.forEach((el) => {
    savedStyles.push({ el, style: el.getAttribute("style") || "" });
    el.style.transform = "none";
    el.style.width = "auto";
  });

  viewportOuters.forEach((el) => {
    savedStyles.push({ el, style: el.getAttribute("style") || "" });
    el.style.height = "auto";
    el.style.minHeight = "0";
  });

  // Measure sheets and auto-scale inner content if in single-page mode and content slightly overflows
  const sheets = document.querySelectorAll<HTMLElement>(".sheet");
  const originalSheetTransforms: { el: HTMLElement; style: string }[] = [];

  if (fitMode === "single-page") {
    const targetMaxPx = isLandscape ? 780 : 1110; // Exact safe pixel height for 1 A4 page at 96 DPI
    sheets.forEach((sheet) => {
      originalSheetTransforms.push({ el: sheet, style: sheet.getAttribute("style") || "" });
      const actualScrollHeight = sheet.scrollHeight;
      if (actualScrollHeight > targetMaxPx + 6) {
        // Compute subtle vertical compression ratio so nothing spills onto page 2
        const ratio = Math.max(0.78, targetMaxPx / actualScrollHeight);
        sheet.style.setProperty("--sheet-auto-scale", String(Number(ratio.toFixed(3))));
        sheet.classList.add("sheet-autofit-active");
      }
    });
  }

  document.body.classList.add("is-printing");

  setTimeout(() => {
    window.print();

    // Restore after print dialog closes
    setTimeout(() => {
      document.body.classList.remove("is-printing");
      document.title = originalTitle;

      savedStyles.forEach(({ el, style }) => {
        if (style) {
          el.setAttribute("style", style);
        } else {
          el.removeAttribute("style");
        }
      });

      originalSheetTransforms.forEach(({ el, style }) => {
        el.classList.remove("sheet-autofit-active");
        el.style.removeProperty("--sheet-auto-scale");
        if (style) {
          el.setAttribute("style", style);
        } else {
          el.removeAttribute("style");
        }
      });
    }, 600);
  }, 100);
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
  const [fitMode] = useState<PrintFitMode>(currentFitMode);

  const handleDirectPrint = () => {
    executeCalibratedPrint({
      landscape,
      mode: "print",
      documentTitle,
      fitMode,
    });
  };

  const handleDirectPdfSave = () => {
    executeCalibratedPrint({
      landscape,
      mode: "pdf",
      documentTitle,
      fitMode,
    });
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
    <div className="inline-flex items-center gap-2 flex-wrap no-print print:hidden">
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

      {/* Direct Save as PDF Button */}
      <button
        type="button"
        onClick={handleDirectPdfSave}
        className={`inline-flex items-center gap-1.5 font-black ${
          compact ? "text-xs px-3 py-1.5 rounded-lg" : "text-xs sm:text-sm px-4 py-2.5 rounded-xl"
        } shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${pdfBtnClass}`}
        title="حفظ مباشر وسريع للنموذج كملف PDF بمقاس A4 دقيق"
      >
        <FileDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        <span>{pdfLabel}</span>
      </button>
    </div>
  );
};
