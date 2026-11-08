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
import { ArrowRight, UserPlus, Trash2, CheckCircle2 } from "lucide-react";

export function SchoolFollowupView() {
  const { setSchoolRoute, students, addStudent, removeStudent, schoolSettings, isSchoolSubscribed, genderWords } = usePlatform();
  const [selectedSubject, setSelectedSubject] = useState("المهارات الرقمية");
  const [selectedTerm, setSelectedTerm] = useState("الفصل الدراسي الأول");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("الصف السادس");
  const [newStudentClass, setNewStudentClass] = useState("6/1");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      addStudent({
        name: newStudentName.trim(),
        grade: newStudentGrade,
        cls: newStudentClass
      });
      setNewStudentName("");
    }
  };

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
              كشف متابعة درجات وتقويم {genderWords.student}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              سجل رصد المشاركة والمهام الأدائية والواجبات المنزلية والاختبارات القصيرة، مع حفظ القوائم محلياً.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <PrintButton landscape>طباعة كشف المتابعة (A4 أفقي)</PrintButton>
          </div>
        </div>

        {/* Filters & Quick Add */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">المادة الدراسية:</label>
            <input
              type="text"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-right"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الفصل الدراسي:</label>
            <input
              type="text"
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-right"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">إضافة {genderWords.student} جديد للقائمة:</label>
            <form onSubmit={handleAdd} className="flex gap-1.5">
              <input
                type="text"
                placeholder="اسم الطالب/ـة"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                className="grow bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-right"
              />
              <button
                type="submit"
                className="bg-sky-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-sky-900"
              >
                إضافة
              </button>
            </form>
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
              <h2>كشف متابعة وتقويم أعمال الطلاب — مادة ({selectedSubject})</h2>
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
                <b>المادة:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  {selectedSubject}
                </span>
              </div>
              <div>
                <b>معلم المادة:</b>
                <span className="fill" contentEditable suppressContentEditableWarning />
              </div>
              <div>
                <b>الصف والفصل:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  {students[0]?.grade || "الصف السادس"} - {students[0]?.cls || "6/1"}
                </span>
              </div>
              <div>
                <b>العام الدراسي:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  ١٤٤٦ / ١٤٤٧هـ
                </span>
              </div>
            </div>

            {/* Scores Table */}
            <table className="t dense">
              <thead>
                <tr>
                  <th style={{ width: "35px" }} rowSpan={2}>م</th>
                  <th style={{ width: "170px" }} rowSpan={2}>اسم {genderWords.student}</th>
                  <th colSpan={4}>المشاركة والتفاعل (20)</th>
                  <th colSpan={4}>الواجبات المنزلية (20)</th>
                  <th colSpan={2}>المهام الأدائية (20)</th>
                  <th colSpan={2}>الاختبارات القصيرة (20)</th>
                  <th style={{ width: "50px" }} rowSpan={2}>المجموع (100)</th>
                  <th style={{ width: "90px" }} rowSpan={2}>ملاحظات</th>
                  <th style={{ width: "40px" }} className="no-print" rowSpan={2}>حذف</th>
                </tr>
                <tr>
                  <th>1</th><th>2</th><th>3</th><th>4</th>
                  <th>1</th><th>2</th><th>3</th><th>4</th>
                  <th>م1</th><th>م2</th>
                  <th>ف1</th><th>ف2</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, idx) => (
                  <tr key={st.id} style={{ height: "24px" }}>
                    <td className="text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="text-right font-bold text-slate-900 pr-2 whitespace-nowrap" contentEditable suppressContentEditableWarning>
                      {st.name}
                    </td>
                    {Array.from({ length: 12 }).map((_, c) => (
                      <td key={c} contentEditable suppressContentEditableWarning className="text-center">
                        {c < 4 ? "5" : c < 8 ? "5" : c < 10 ? "10" : "10"}
                      </td>
                    ))}
                    <td contentEditable suppressContentEditableWarning className="text-center font-bold text-sky-900">
                      100
                    </td>
                    <td contentEditable suppressContentEditableWarning className="text-right text-[10px]">
                      متميز
                    </td>
                    <td className="text-center no-print">
                      <button
                        onClick={() => removeStudent(st.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="حذف من الكشف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="sign-row">
              <div>
                <b>معلم المادة</b>
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
                <small>الاعتماد</small>
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
