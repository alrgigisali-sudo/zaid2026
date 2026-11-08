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
  const { setSchoolRoute, students, replaceGenderText, genderWords } = usePlatform();

  const [selectedFormId, setSelectedFormId] = useState<string>(() => {
    return forms[0]?.id || "";
  });

  const [selectedStudentIdx, setSelectedStudentIdx] = useState<string>("");

  const selectedStudent = useMemo(() => {
    if (selectedStudentIdx === "") return null;
    return students[Number(selectedStudentIdx)] || null;
  }, [selectedStudentIdx, students]);

  const activeForms = useMemo(() => {
    if (selectedFormId === "__all") return forms;
    const found = forms.find(f => f.id === selectedFormId);
    return found ? [found] : [forms[0]];
  }, [selectedFormId, forms]);

  const isLandscape = activeForms.some(f => f.landscape);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-right" dir="rtl">
      {/* Control Card / Toolbar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div>
            <button
              onClick={() => setSchoolRoute("home")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#111A5E] font-semibold mb-2 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لدليل الخدمات المدرسية</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{intro}</p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <PrintButton landscape={isLandscape}>
              طباعة النموذج الحالي
            </PrintButton>
          </div>
        </div>

        {/* Toolbar selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Form Selector */}
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

          {/* Student Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {genderWords.studentSlash} (للنماذج التي تتطلب اسماً):
            </label>
            <select
              value={selectedStudentIdx}
              onChange={e => setSelectedStudentIdx(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#111A5E] text-right cursor-pointer m-0"
            >
              <option value="">بدون اسم — نموذج فارغ للتعبئة اليدوية</option>
              {students.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {s.name} ({s.grade} - {s.cls})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hint bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            إرشاد: يمكنك النقر مباشرة على أي حقل أو جدول داخل ورقة A4 أدناه وتعديل النصوص قبل الطباعة أو الحفظ كـ PDF.
          </span>
          {selectedStudent && (
            <span className="font-bold text-[#080C3A] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#111A5E]" />
              تم إدراج بيانات: {selectedStudent.name}
            </span>
          )}
        </div>
      </div>

      {/* Sheets Preview Area with Responsive Scaler */}
      <div className="py-2">
        <SheetContainer isLandscape={isLandscape}>
          <div className="space-y-8 w-full flex flex-col items-center">
            {activeForms.map((f, i) => (
              <SchoolSheetRenderer
                key={f.id + (selectedStudent?.id || "")}
                form={f}
                student={selectedStudent}
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
