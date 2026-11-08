/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePlatform } from "../../context/PlatformContext";
import { KHADAMATI_CONFIG } from "../../data/schoolModels";
import { TEACHER_CONFIG } from "../../data/teacherData";
import { ArrowRight, MessageCircle, HelpCircle, School, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";

export function SchoolContactView() {
  const { setSchoolRoute, openSubscriptionModal, activateSchoolLicense } = usePlatform();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-right" dir="rtl">
      <button
        onClick={() => setSchoolRoute("home")}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-800 font-bold mb-1 cursor-pointer"
      >
        <ArrowRight className="w-3.5 h-3.5" />
        <span>العودة للرئيسية</span>
      </button>

      {/* Main Contact Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-sky-700 block mb-1">خدمة العملاء والدعم الفني المباشر</span>
          <h1 className="text-3xl font-black text-slate-900">تواصل معنا والاشتراك في المنصة</h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {KHADAMATI_CONFIG.name} يوفّر السجلات والنماذج الإدارية والتعليمية جاهزة باسم مدرستك، مع شواهد الأداء وملفات الإنجاز للمعلمين، وتُضاف تباعاً نماذج وخدمات جديدة معتمدة.
          </p>
        </div>

        {/* Pricing Summary */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                <School className="w-4 h-4" />
                اشتراك المدرسة بالكامل
              </span>
              <span className="text-lg font-black text-sky-900">99 ريال / سنة</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              يشمل كافة سجلات ونماذج الإدارة والوكلاء والتوجيه والسلوك بدون علامة مائية باسم مدرستك.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                اشتراك المعلم الفردي
              </span>
              <span className="text-lg font-black text-emerald-900">49 ريال / سنة</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              يشمل شواهد الأداء الوظيفي وملف الإنجاز الرقمي بـ 5 تصاميم معتمدة بالذكاء الاصطناعي.
            </p>
          </div>
        </div>

        {/* Contact WhatsApp Notice */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <p className="text-sm text-slate-800">
            للاستفسار أو الدعم الفني أو شراء وتفعيل الترخيص تواصل مباشرة عبر واتساب على الرقم:{" "}
            <b dir="ltr" className="text-base text-slate-950 font-black">{KHADAMATI_CONFIG.whatsapp}</b>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={KHADAMATI_CONFIG.waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال رسالة واتساب (0539571077)</span>
            </a>

            <button
              onClick={openSubscriptionModal}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>إدخال كود التفعيل أو شرح الاشتراك</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
