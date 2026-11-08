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
import { ArrowRight, Calendar } from "lucide-react";

export function SchoolMonthlyAttendanceView() {
  const { setSchoolRoute, students, schoolSettings, isSchoolSubscribed, genderWords } = usePlatform();
  const [selectedMonth, setSelectedMonth] = useState("شهر ربيع الأول 1446هـ");

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
              كشف الغياب والمواظبة الشهري للطلاب
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              رصد يومي لغياب الطلاب على مدار أسابيع الشهر مع حصر الغياب بعذر وبدون عذر والتأخر الصباحي.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <PrintButton landscape>طباعة كشف الغياب (A4 أفقي)</PrintButton>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">الشهر المستهدف:</label>
          <input
            type="text"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="w-full sm:w-80 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-right"
          />
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
              <h2>كشف متابعة الغياب والمواظبة اليومي عن ({selectedMonth})</h2>
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
          <div className="sheet-body space-y-2">
            <div className="f-row">
              <div>
                <b>الصف والفصل:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  {students[0]?.grade || "الصف السادس"} - {students[0]?.cls || "6/1"}
                </span>
              </div>
              <div>
                <b>الشهر:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  {selectedMonth}
                </span>
              </div>
              <div>
                <b>{genderWords.deputyStudents}:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  {schoolSettings.deputyStudents}
                </span>
              </div>
            </div>

            {/* Attendance Matrix Table */}
            <table className="t dense text-[10px]">
              <thead>
                <tr>
                  <th style={{ width: "25px" }} rowSpan={2}>م</th>
                  <th style={{ width: "160px" }} rowSpan={2}>اسم {genderWords.student}</th>
                  <th colSpan={5}>الأسبوع 1</th>
                  <th colSpan={5}>الأسبوع 2</th>
                  <th colSpan={5}>الأسبوع 3</th>
                  <th colSpan={5}>الأسبوع 4</th>
                  <th style={{ width: "45px" }} rowSpan={2}>غياب بعذر</th>
                  <th style={{ width: "45px" }} rowSpan={2}>بدون عذر</th>
                  <th style={{ width: "45px" }} rowSpan={2}>المجموع</th>
                </tr>
                <tr>
                  <th>ح</th><th>ن</th><th>ث</th><th>ر</th><th>خ</th>
                  <th>ح</th><th>ن</th><th>ث</th><th>ر</th><th>خ</th>
                  <th>ح</th><th>ن</th><th>ث</th><th>ر</th><th>خ</th>
                  <th>ح</th><th>ن</th><th>ث</th><th>ر</th><th>خ</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, idx) => (
                  <tr key={st.id} style={{ height: "24px" }}>
                    <td className="text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="text-right font-bold text-slate-900 pr-2 whitespace-nowrap" contentEditable suppressContentEditableWarning>
                      {st.name}
                    </td>
                    {Array.from({ length: 20 }).map((_, c) => (
                      <td key={c} contentEditable suppressContentEditableWarning className="text-center text-slate-300">
                        •
                      </td>
                    ))}
                    <td contentEditable suppressContentEditableWarning className="text-center">0</td>
                    <td contentEditable suppressContentEditableWarning className="text-center">0</td>
                    <td contentEditable suppressContentEditableWarning className="text-center font-bold text-sky-900">0</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="sign-row">
              <div>
                <b>مسؤول الغياب والمواظبة</b>
                <div>الاسم: <span className="fill" contentEditable suppressContentEditableWarning /></div>
                <div className="line" />
                <small>التوقيع</small>
              </div>
              <div>
                <b>{genderWords.deputyStudents}</b>
                <div>الاسم: <span className="fill" contentEditable suppressContentEditableWarning>{schoolSettings.deputyStudents}</span></div>
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
