/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SCHOOL_JOBS } from "../../data/schoolJobs";
import { PrintButton } from "./SchoolSheetRenderer";
import { ArrowRight, Briefcase, CheckCircle2, Award, FileText } from "lucide-react";

export function SchoolJobsView() {
  const { setSchoolRoute } = usePlatform();
  const [selectedJobId, setSelectedJobId] = useState<string>(SCHOOL_JOBS[0]?.id || "manager");

  const job = SCHOOL_JOBS.find(j => j.id === selectedJobId) || SCHOOL_JOBS[0];

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
              الوصف الوظيفي المعتمد لمنسوبي المدرسة
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              بطاقات الوصف الوظيفي الرسمية للمدير والوكلاء والمعلم والموجهين ورائد النشاط من الدليل التنظيمي المعتمد 1446-1447هـ.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <PrintButton>طباعة بطاقة الوصف الوظيفي</PrintButton>
          </div>
        </div>

        {/* Job Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SCHOOL_JOBS.map(j => {
            const isSel = j.id === selectedJobId;
            return (
              <button
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSel
                    ? "bg-sky-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {j.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Card Details */}
      {job && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-sky-700 block mb-1">
                الدليل التنظيمي لمدارس التعليم العام (صفحة {job.page || 29})
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                بطاقة الوصف الوظيفي: {job.title}
              </h2>
            </div>
          </div>

          {/* Direct Link / Relations */}
          {job.link && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">الارتباط التنظيمي:</span>
              <p>{Array.isArray(job.link) ? job.link.join(" ") : job.link}</p>
            </div>
          )}

          {/* Purpose / Goal */}
          {job.goal && (
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-1">
              <h3 className="text-xs font-black text-sky-900 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-700" />
                الهدف العام من الوظيفة:
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {job.goal}
              </p>
            </div>
          )}

          {/* Tasks & Responsibilities */}
          {job.tasks && job.tasks.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                المهام والمسؤوليات الموكلة ({job.tasks.length} مهمة):
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {job.tasks.map((task: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qualifications & Requirements */}
          {job.qualifications && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-700" />
                متطلبات وشروط شغل الوظيفة:
              </div>
              <ul className="list-disc list-inside space-y-1 pr-2">
                {Array.isArray(job.qualifications)
                  ? job.qualifications.map((q: string, i: number) => <li key={i}>{q}</li>)
                  : <li>{job.qualifications}</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
