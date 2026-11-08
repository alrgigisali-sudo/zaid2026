/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SchoolForm } from "../../data/schoolModels";
import { SchoolSheetRenderer, PrintButton } from "./SchoolSheetRenderer";
import { SheetContainer } from "../common/SheetContainer";
import { ArrowRight, UserCheck, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  title: string;
  intro: string;
  forms: SchoolForm[];
}

export function SchoolModelViewer({ title, intro, forms }: Props) {
  const { setSchoolRoute, replaceGenderText } = usePlatform();

  const [selectedFormId, setSelectedFormId] = useState<string>(() => {
    return forms[0]?.id || "";
  });

  const activeForms = useMemo(() => {
    if (selectedFormId === "__all") return forms;
    const found = forms.find(f => f.id === selectedFormId);
    return found ? [found] : [forms[0]];
  }, [selectedFormId, forms]);

  const isLandscape = activeForms.some(f => f.landscape);

  return (
    <div className="max-w-6xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 text-right overflow-x-hidden" dir="rtl">
      {/* Control Card / Toolbar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div>
            <button
              onClick={() => setSchoolRoute("home")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#111A5E] font-semibold mb-2 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لدليل الخدمات المدرسية</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{intro}</p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <PrintButton landscape={isLandscape}>
              طباعة النموذج الحالي
            </PrintButton>
          </div>
        </div>

        {/* Toolbar selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            النموذج أو السجل المطلوب ({forms.length} نماذج متوفرة):
          </label>
          <select
            value={selectedFormId}
            onChange={e => setSelectedFormId(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#111A5E] text-right cursor-pointer m-0"
          >
            {forms.map(f => (
              <option key={f.id} value={f.id}>
                {replaceGenderText(f.title)} {f.landscape ? "— (أفقي)" : ""}
              </option>
            ))}
            <option value="__all">كل النماذج دفعة واحدة ({forms.length} نماذج)</option>
          </select>
        </div>

        {/* Hint bar */}
        <div className="text-xs text-slate-500 pt-1">
          إرشاد: يمكنك النقر مباشرة على أي حقل أو جدول داخل ورقة A4 أدناه وتعديل النصوص قبل الطباعة أو الحفظ كـ PDF.
        </div>
      </div>

      {/* Sheets Preview Area with Responsive Scaler */}
      <div className="py-2">
        <SheetContainer isLandscape={isLandscape}>
          <div className="space-y-8 w-full flex flex-col items-center">
            {activeForms.map((f, i) => (
              <SchoolSheetRenderer
                key={f.id}
                form={f}
                student={null}
                pageNumber={i + 1}
                totalPages={activeForms.length}
              />
            ))}
          </div>
        </SheetContainer>
      </div>
    </div>
  );
}
