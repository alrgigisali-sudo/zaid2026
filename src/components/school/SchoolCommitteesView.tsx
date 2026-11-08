/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SCHOOL_COMMITTEES } from "../../data/schoolCommittees";
import { PrintButton } from "./SchoolSheetRenderer";
import { ArrowRight, Users, CheckCircle2, Shield, Calendar, BookOpen } from "lucide-react";

export function SchoolCommitteesView() {
  const { setSchoolRoute } = usePlatform();
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>(SCHOOL_COMMITTEES[0]?.id || "admin");

  const committee = SCHOOL_COMMITTEES.find(c => c.id === selectedCommitteeId) || SCHOOL_COMMITTEES[0];

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
              اللجان وفرق العمل المدرسية الرسمية
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              تشكيل واختصاصات ومهام اللجان وفرق العمل المعتمدة في الدليل التنظيمي لمدارس التعليم العام 1446-1447هـ.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setSchoolRoute("staff")}
              className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold text-xs px-3.5 py-2 rounded-xl border border-sky-200 cursor-pointer transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>نماذج ومحاضر تشكيل اللجان</span>
            </button>
            <PrintButton>طباعة بطاقة اللجنة</PrintButton>
          </div>
        </div>

        {/* Committee Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SCHOOL_COMMITTEES.map(c => {
            const isSel = c.id === selectedCommitteeId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCommitteeId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSel
                    ? "bg-sky-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Committee Details */}
      {committee && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-sky-700 block mb-1">
                الدليل التنظيمي لمدارس التعليم العام (صفحة {committee.page || 21})
              </span>
              <h2 className="text-2xl font-black text-slate-900">{committee.title}</h2>
            </div>
            {committee.note && (
              <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold">
                {committee.note}
              </span>
            )}
          </div>

          {/* Goal */}
          {committee.goal && (
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-1">
              <h3 className="text-xs font-black text-sky-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-sky-700" />
                الهدف العام من التشكيل:
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {committee.goal}
              </p>
            </div>
          )}

          {/* Members Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-700" />
              أعضاء وتشكيل اللجنة / الفريق:
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-4">م</th>
                    <th className="py-2.5 px-4">الصفة في المدرسة</th>
                    <th className="py-2.5 px-4">الموقع في اللجنة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {committee.members?.map((m: [string, string], idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{m[0]}</td>
                      <td className="py-2.5 px-4 text-sky-800 font-semibold">{m[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tasks */}
          {committee.tasks && committee.tasks.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-700" />
                مهام ومسؤوليات اللجنة ({committee.tasks.length} مهام):
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {committee.tasks.map((task: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meetings Rules */}
          {committee.meetings && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-700" />
                آلية وضوابط عقد الاجتماعات:
              </div>
              <ul className="list-disc list-inside space-y-1 pr-2">
                {Array.isArray(committee.meetings)
                  ? committee.meetings.map((m: string, i: number) => <li key={i}>{m}</li>)
                  : <li>{committee.meetings}</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
