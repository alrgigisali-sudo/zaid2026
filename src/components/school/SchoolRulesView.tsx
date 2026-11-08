/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { PRIMARY_RULES, SECONDARY_RULES, ALL_RULES } from "../../data/schoolRules";
import { PrintButton } from "./SchoolSheetRenderer";
import { ArrowRight, Search, ShieldAlert, BookOpen, AlertCircle, FileCheck, CheckCircle2 } from "lucide-react";

export function SchoolRulesView() {
  const { setSchoolRoute } = usePlatform();
  const [activeStage, setActiveStage] = useState<"primary" | "secondary">("primary");
  const [selectedDegree, setSelectedDegree] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");

  const currentRules = activeStage === "primary" ? PRIMARY_RULES : SECONDARY_RULES;
  const currentDegreeData = currentRules[selectedDegree as keyof typeof currentRules] as any;

  // Search filter across all infractions
  const searchResults = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return [];

    const list: { stage: string; stageLabel: string; degree: number; degreeTitle: string; text: string }[] = [];

    Object.entries(PRIMARY_RULES).forEach(([deg, val]: [string, any]) => {
      val.items.forEach((item: string) => {
        if (item.includes(term)) {
          list.push({
            stage: "primary",
            stageLabel: "المرحلة الابتدائية",
            degree: Number(deg),
            degreeTitle: val.title,
            text: item
          });
        }
      });
    });

    Object.entries(SECONDARY_RULES).forEach(([deg, val]: [string, any]) => {
      val.items.forEach((item: string) => {
        if (item.includes(term)) {
          list.push({
            stage: "secondary",
            stageLabel: "المرحلتان المتوسطة والثانوية",
            degree: Number(deg),
            degreeTitle: val.title,
            text: item
          });
        }
      });
    });

    return list;
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-right" dir="rtl">
      {/* Top Banner & Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <button
              onClick={() => setSchoolRoute("home")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-800 font-bold mb-2 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للرئيسية</span>
            </button>
            <h1 className="text-2xl font-black text-slate-900">
              قواعد السلوك والمواظبة وإجراءاتها التفاعلية
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              الدليل الخامس المعتمد من وزارة التعليم 1446-1447هـ: تصنيف المخالفات حسب المرحلة والدرجة والتكرار مع الإجراءات التربوية والنماذج المرتبطة.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setSchoolRoute("behavior")}
              className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold text-xs px-3.5 py-2 rounded-xl border border-sky-200 cursor-pointer transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              <span>فتح نماذج السلوك القابلة للطباعة</span>
            </button>
            <PrintButton>طباعة الدليل</PrintButton>
          </div>
        </div>

        {/* Stage Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveStage("primary");
                if (selectedDegree > 4) setSelectedDegree(1);
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeStage === "primary"
                  ? "bg-white text-sky-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              الابتدائية (الدرجات 1 - 4)
            </button>

            <button
              onClick={() => setActiveStage("secondary")}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeStage === "secondary"
                  ? "bg-white text-sky-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              المتوسطة والثانوية (1 - 6)
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مخالفة… (مثال: شجار، جوال، تأخر)"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-9 text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-right m-0"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Search Results Dropdown/Box if searching */}
        {searchTerm && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-60 overflow-y-auto space-y-2">
            <div className="text-xs font-bold text-slate-700">نتائج البحث عن: "{searchTerm}"</div>
            {searchResults.length > 0 ? (
              searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveStage(res.stage as any);
                    setSelectedDegree(res.degree);
                    setSearchTerm("");
                  }}
                  className="p-2.5 bg-white hover:bg-sky-50 border border-slate-200 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
                    <span className="text-sky-800 font-bold">{res.stageLabel}</span>
                    <span>•</span>
                    <span>{res.degreeTitle}</span>
                  </div>
                  <div className="text-slate-900 font-medium">{res.text}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">لا توجد مخالفات مطابقة لكلمة البحث.</div>
            )}
          </div>
        )}

        {/* Degrees Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {Object.keys(currentRules).map(deg => {
            const num = Number(deg);
            const isSel = selectedDegree === num;
            return (
              <button
                key={deg}
                onClick={() => setSelectedDegree(num)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSel
                    ? "bg-sky-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                الدرجة {num} ({currentRules[num as keyof typeof currentRules]?.title})
              </button>
            );
          })}
        </div>
      </div>

      {/* Degree Content Card */}
      {currentDegreeData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-sky-700 block mb-1">
                {activeStage === "primary" ? "المرحلة الابتدائية" : "المرحلتان المتوسطة والثانوية"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                مخالفات {currentDegreeData.title}
              </h2>
            </div>
            {currentDegreeData.article && (
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                المادة ({currentDegreeData.article}) من الدليل التنظيمي
              </span>
            )}
          </div>

          {/* Infractions List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              المخالفات السلوكية المصنفة ضمن هذه الدرجة:
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {currentDegreeData.items.map((item: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps / Procedures */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-700" />
              الإجراءات التربوية المعتمدة حسب التكرار:
            </h3>

            <div className="space-y-3">
              {currentDegreeData.steps?.map((step: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 space-y-2 text-right"
                >
                  <h4 className="text-sm font-black text-sky-950 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-600" />
                    {step.t}
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 pr-2">
                    {step.b?.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Notes if available */}
          {currentDegreeData.notes && currentDegreeData.notes.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                تنبيهات وضوابط هامة:
              </div>
              <ul className="list-disc list-inside space-y-1 pr-2">
                {currentDegreeData.notes.map((note: string, nIdx: number) => (
                  <li key={nIdx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action to create behavior form */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              هل وقعت هذه المخالفة؟ يمكنك إصدار النموذج الرسمي المرتبط بها فوراً باسم الطالب أو مفرغاً.
            </span>
            <button
              onClick={() => setSchoolRoute("behavior")}
              className="inline-flex items-center gap-1.5 bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              <span>إصدار نموذج الرصد / التعهد / الإحالة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
