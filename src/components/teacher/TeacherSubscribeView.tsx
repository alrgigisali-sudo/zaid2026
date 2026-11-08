/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { TEACHER_CONFIG, TEACHER_SUBSCRIPTION_FEATURES } from "../../data/teacherData";
import { CheckCircle2, MessageCircle, KeyRound, Sparkles, ShieldCheck, Zap } from "lucide-react";

export function TeacherSubscribeView() {
  const {
    teacherProfile,
    isTeacherSubscribed,
    teacherExpiresAt,
    activateTeacherLicense,
    resetTeacherLicense,
    openSubscriptionModal
  } = usePlatform();

  const [inputCode, setInputCode] = useState(teacherProfile.code || "");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = activateTeacherLicense(inputCode);
    setFeedback(res.message);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-right" dir="rtl">
      <div>
        <span className="text-xs font-bold text-[#111A5E] block mb-1">الترخيص والاشتراك الرسمي للمعلم</span>
        <h1 className="text-3xl font-black text-slate-900">اشتراك منصة زيد الرقمية للمعلم</h1>
        <p className="mt-1 text-sm text-slate-600">
          اشتراك سنوي مخصص لمعلم واحد يتيح إزالة العلامة المائية وحفظ الشواهد والتصدير غير المحدود.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 animate-in fade-in">
          {feedback}
        </div>
      )}

      {/* Subscription Active Alert */}
      {isTeacherSubscribed && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>
              أنت مشترك بنجاح حتى <b>{teacherExpiresAt}</b> (نسخة مرخصة رسمياً بلا علامات مائية).
            </span>
          </div>
          <button
            onClick={() => {
              resetTeacherLicense();
              setFeedback("تمت إعادة تعيين النسخة للمعاينة.");
            }}
            className="text-xs text-rose-600 underline font-semibold cursor-pointer"
          >
            إلغاء التفعيل
          </button>
        </div>
      )}

      {/* Pricing Card */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-bold text-slate-500">اشتراك سنوي لمعلم واحد</div>
            <div className="text-4xl font-black text-emerald-800 mt-1">
              49 <span className="text-base font-bold text-slate-600">ريال / سنة</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">السعر شامل كافة التحديثات</span>
        </div>

        {/* Feature List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800">مميزات الاشتراك المرخص:</h3>
          <ul className="space-y-2.5">
            {TEACHER_SUBSCRIPTION_FEATURES.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WhatsApp Button */}
        <div className="pt-2">
          <a
            href={TEACHER_CONFIG.waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>اشترك عبر واتساب 0539571077</span>
          </a>
          <p className="text-xs text-slate-500 mt-2">
            بعد الدفع يصلك رابط خاص ورمز دخول، افتح الرابط وأدخل الرمز لتفعيل نسختك مباشرة.
          </p>
        </div>
      </div>

      {/* Code Activation Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-slate-700" />
          تفعيل رمز الدخول بعد الاشتراك:
        </h3>
        <p className="text-xs text-slate-600">
          أدخل رمز الدخول الذي وصلك بعد الاشتراك لتفعيل نسختك (بلا علامة مائية):
        </p>

        <form onSubmit={handleActivate} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            placeholder="أدخل رمز الدخول هنا..."
            className="grow bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-right focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-2 rounded-lg cursor-pointer transition-colors shrink-0"
          >
            تفعيل النسخة
          </button>
        </form>

        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 text-[11px]">
            {isTeacherSubscribed
              ? `الترخيص مفعل رسمياً حتى ${teacherExpiresAt}.`
              : "لا يقبل النظام إلا الأكواد الصادرة رسمياً من إدارة المنصة بعد سداد الرسوم (49 ر.س)."}
          </span>

          <button
            type="button"
            onClick={openSubscriptionModal}
            className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
          >
            شرح الخطوات بالتفصيل
          </button>
        </div>
      </div>
    </div>
  );
}
