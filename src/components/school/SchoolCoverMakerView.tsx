/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { KHADAMATI_CONFIG } from "../../data/schoolModels";
import { PlatformWatermark } from "../common/PlatformLogo";
import { PrintButton } from "./SchoolSheetRenderer";
import { SheetContainer } from "../common/SheetContainer";
import { ArrowRight, Layout, Sparkles } from "lucide-react";

export function SchoolCoverMakerView() {
  const { setSchoolRoute, schoolSettings, isSchoolSubscribed, genderWords } = usePlatform();
  const [styleMode, setStyleMode] = useState<"classic" | "modern" | "minimal">("classic");
  const [coverTitle, setCoverTitle] = useState("سجل وكيل الشؤون التعليمية");
  const [coverSubtitle, setCoverSubtitle] = useState("متابعة الخطط الدراسية، الدروس التطبيقية، ونواتج التعلم");
  const [ownerRole, setOwnerRole] = useState("وكيل الشؤون التعليمية");
  const [ownerName, setOwnerName] = useState(schoolSettings.deputyEdu || "");
  const [schoolYear, setSchoolYear] = useState("١٤٤٦ / ١٤٤٧هـ");

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
              صانع أغلفة السجلات والملفات المدرسية
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              اصنع غلاف أي سجل مدرسي بثلاثة تصاميم رسمية راقية، بترويسة مدرستك وشعارها وتوقيعين اختياريين.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <PrintButton>طباعة الغلاف (A4)</PrintButton>
          </div>
        </div>

        {/* Style Selector & Inputs */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">نمط تصميم الغلاف:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStyleMode("classic")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  styleMode === "classic" ? "bg-sky-900 text-white shadow-xs" : "bg-slate-100 text-slate-700"
                }`}
              >
                النمط الوزاري المعتمد
              </button>
              <button
                type="button"
                onClick={() => setStyleMode("modern")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  styleMode === "modern" ? "bg-sky-900 text-white shadow-xs" : "bg-slate-100 text-slate-700"
                }`}
              >
                النمط العصري (Modern)
              </button>
              <button
                type="button"
                onClick={() => setStyleMode("minimal")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  styleMode === "minimal" ? "bg-sky-900 text-white shadow-xs" : "bg-slate-100 text-slate-700"
                }`}
              >
                النمط البسيط (Minimal)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">عنوان السجل الرئيسي:</label>
            <input
              type="text"
              value={coverTitle}
              onChange={e => setCoverTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-right"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الوصف الفرعي (اختياري):</label>
            <input
              type="text"
              value={coverSubtitle}
              onChange={e => setCoverSubtitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-right"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">صفة المسؤول:</label>
            <input
              type="text"
              value={ownerRole}
              onChange={e => setOwnerRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-right"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">اسم المسؤول:</label>
            <input
              type="text"
              value={ownerName}
              onChange={e => setOwnerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-right"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">العام الدراسي:</label>
            <input
              type="text"
              value={schoolYear}
              onChange={e => setSchoolYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-right"
            />
          </div>
        </div>
      </div>

      {/* Sheet Preview with Responsive Scaling */}
      <div className="py-2">
        <SheetContainer isLandscape={false}>
          <section className={`sheet portrait ${styleMode === "modern" ? "cover-modern" : styleMode === "minimal" ? "cover-minimal" : ""}`}>
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
            </div>

            <div className="sheet-head-left">
              {schoolSettings.schoolLogo ? (
                <img src={schoolSettings.schoolLogo} alt="شعار المدرسة" />
              ) : (
                <div className="w-12 h-12" />
              )}
            </div>
          </div>

          {/* Sheet Body: Cover */}
          <div className="sheet-body flex flex-col justify-between">
            <div className="cover pt-16 sm:pt-24 text-center">
              <div className="cover-title" contentEditable suppressContentEditableWarning>
                {coverTitle}
              </div>
              {coverSubtitle && (
                <div className="cover-sub mt-4 text-slate-600 font-semibold" contentEditable suppressContentEditableWarning>
                  {coverSubtitle}
                </div>
              )}

              <div className="cover-meta mt-16 max-w-md mx-auto text-right space-y-3 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
                <div className="flex gap-2">
                  <b className="w-28 shrink-0">اسم المدرسة:</b>
                  <span className="fill font-bold" contentEditable suppressContentEditableWarning>
                    {schoolSettings.schoolName || "مدرسة ........................"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <b className="w-28 shrink-0">العام الدراسي:</b>
                  <span className="fill font-bold" contentEditable suppressContentEditableWarning>
                    {schoolYear}
                  </span>
                </div>
                <div className="flex gap-2">
                  <b className="w-28 shrink-0">{ownerRole}:</b>
                  <span className="fill font-bold" contentEditable suppressContentEditableWarning>
                    {ownerName}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Signatures */}
            <div className="sign-row cover-sign mt-auto mb-6">
              <div>
                <b>{ownerRole}</b>
                <div>الاسم: <span className="fill" contentEditable suppressContentEditableWarning>{ownerName}</span></div>
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
            <div />
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
