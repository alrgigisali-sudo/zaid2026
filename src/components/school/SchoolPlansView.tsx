/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SCHOOL_PLANS_CONFIG, KHADAMATI_CONFIG } from "../../data/schoolModels";
import { PlatformWatermark } from "../common/PlatformLogo";
import { PrintButton } from "./SchoolSheetRenderer";
import { SheetContainer } from "../common/SheetContainer";
import { ArrowRight, Calendar, CheckSquare } from "lucide-react";

export function SchoolPlansView() {
  const { setSchoolRoute, schoolSettings, isSchoolSubscribed, genderWords } = usePlatform();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("manager");
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const plan = SCHOOL_PLANS_CONFIG.find((p: any) => p.id === selectedPlanId) || SCHOOL_PLANS_CONFIG[0];

  const planTitle = genderWords.female ? plan.title.f : plan.title.m;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-right" dir="rtl">
      {/* Top Banner */}
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
              الخطط التشغيلية والأسبوعية للإدارة والوكلاء
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              خطط عمل أفقية التنسيق مع جدول متابعة أسبوعي مولّد تلقائياً للفصل الدراسي، جاهزة للطباعة والتوثيق.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <PrintButton landscape>طباعة الخطة (A4 أفقي)</PrintButton>
          </div>
        </div>

        {/* Plan Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-2">
            {SCHOOL_PLANS_CONFIG.map((p: any) => {
              const isSel = p.id === selectedPlanId;
              const t = genderWords.female ? p.title.f : p.title.m;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSel
                      ? "bg-sky-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  خطة {t}
                </button>
              );
            })}
          </div>

          {/* Week selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">الأسبوع الدراسي:</label>
            <select
              value={activeWeek}
              onChange={e => setActiveWeek(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-hidden"
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  الأسبوع ({i + 1})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Printable Sheet (Landscape A4) with Responsive Scaling */}
      <div className="py-2">
        <SheetContainer isLandscape={true}>
          <section className="sheet landscape relative">
          {!isSchoolSubscribed && (
            <PlatformWatermark subtitle={`نسخة تجريبية — ${KHADAMATI_CONFIG.nameEn}`} />
          )}

          {/* Sheet Head */}
          <div className="sheet-head">
            <div className="sheet-head-right">
              <div>المملكة العربية السعودية</div>
              <div>وزارة التعليم</div>
              <div>{schoolSettings.admin || "الإدارة العامة للتعليم"}</div>
              <div>{schoolSettings.schoolName || "اسم المدرسة"}</div>
            </div>

            <div className="sheet-head-center">
              <img src="/moe-logo.png" alt="شعار وزارة التعليم" />
              <h2>خطة متابعة {planTitle} — الأسبوع ({activeWeek})</h2>
            </div>

            <div className="sheet-head-left">
              {schoolSettings.schoolLogo ? (
                <img src={schoolSettings.schoolLogo} alt="شعار المدرسة" />
              ) : (
                <div className="w-12 h-12" />
              )}
            </div>
          </div>

          {/* Sheet Body */}
          <div className="sheet-body space-y-3">
            <div className="f-row">
              <div>
                <b>{planTitle}:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  {schoolSettings[plan.key as keyof typeof schoolSettings] || ""}
                </span>
              </div>
              <div>
                <b>الفصل الدراسي:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  الفصل الدراسي الأول ١٤٤٦ / ١٤٤٧هـ
                </span>
              </div>
              <div>
                <b>الأسبوع:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  الأسبوع ({activeWeek})
                </span>
              </div>
            </div>

            {plan.vision && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
                <b>الرؤية والهدف:</b> {plan.vision}
              </div>
            )}

            {/* Tasks Schedule Table */}
            <table className="t">
              <thead>
                <tr>
                  <th style={{ width: "45px" }}>م</th>
                  <th>المهمة / الإجراء التنفيذي</th>
                  <th style={{ width: "120px" }}>اليوم المستهدف</th>
                  <th style={{ width: "120px" }}>المسؤول / المشارك</th>
                  <th style={{ width: "100px" }}>مؤشر التحقق</th>
                  <th style={{ width: "70px" }}>تم ✓</th>
                  <th style={{ width: "160px" }}>ملاحظات الشواهد</th>
                </tr>
              </thead>
              <tbody>
                {plan.tasks?.map((task: any, idx: number) => (
                  <tr key={idx} style={{ height: "30px" }}>
                    <td className="text-center font-bold text-slate-400">{idx + 1}</td>
                    <td contentEditable suppressContentEditableWarning className="text-right font-medium">
                      {typeof task === "string" ? task : task.text || task.name}
                    </td>
                    <td contentEditable suppressContentEditableWarning className="text-center">
                      {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"][idx % 5]}
                    </td>
                    <td contentEditable suppressContentEditableWarning className="text-center">
                      {planTitle}
                    </td>
                    <td contentEditable suppressContentEditableWarning className="text-center">
                      مكتمل
                    </td>
                    <td contentEditable suppressContentEditableWarning className="text-center font-bold text-emerald-700">
                      ✓
                    </td>
                    <td contentEditable suppressContentEditableWarning className="text-right">
                      مرفق في السجل
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="sign-row">
              <div>
                <b>{planTitle}</b>
                <div>الاسم: <span className="fill" contentEditable suppressContentEditableWarning>{schoolSettings[plan.key as keyof typeof schoolSettings] || ""}</span></div>
                <div className="line" />
                <small>التوقيع</small>
              </div>
              <div>
                <b>{genderWords.manager}</b>
                <div>الاسم: <span className="fill" contentEditable suppressContentEditableWarning>{schoolSettings.managerName}</span></div>
                <div className="line" />
                <small>الاعتماد والختم</small>
              </div>
            </div>
          </div>

          {/* Sheet Foot */}
          <div className="sheet-foot">
            <div>صفحة 1 / 1</div>
            <div>
              {!isSchoolSubscribed && (
                <span className="free-note text-slate-500">
                  {KHADAMATI_CONFIG.freeFooter}
                  <small className="no-print"> — {KHADAMATI_CONFIG.freeFooterHint}</small>
                </span>
              )}
            </div>
          </div>
        </section>
        </SheetContainer>
      </div>
    </div>
  );
}
