/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SAUDI_REGIONS, KHADAMATI_CONFIG } from "../../data/schoolModels";
import { ArrowRight, Save, Upload, Download, RefreshCw, KeyRound, ShieldCheck, HelpCircle } from "lucide-react";

export function SchoolSettingsView() {
  const {
    setSchoolRoute,
    schoolSettings,
    updateSchoolSettings,
    isSchoolSubscribed,
    schoolExpiresAt,
    activateSchoolLicense,
    resetSchoolLicense,
    openSubscriptionModal
  } = usePlatform();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const [inputCode, setInputCode] = useState(schoolSettings.code || "");
  const [inputSlug, setInputSlug] = useState(schoolSettings.slug || "");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          updateSchoolSettings({ schoolLogo: ev.target.result as string });
          setFeedback("تم تحديث شعار المدرسة بنجاح.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportBackup = () => {
    const dataStr = JSON.stringify(schoolSettings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `khadamati-plus-${schoolSettings.schoolName || "school"}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          updateSchoolSettings(parsed);
          setFeedback("تم استيراد نسخة الإعدادات الاحتياطية بنجاح.");
        } catch {
          setFeedback("الملف غير صالح.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = activateSchoolLicense(inputSlug, inputCode);
    updateSchoolSettings({ code: inputCode, slug: inputSlug });
    setFeedback(res.message);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-2">
        <button
          onClick={() => setSchoolRoute("home")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-800 font-bold mb-1 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة للرئيسية</span>
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900">إعدادات وبيانات المدرسة</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              اكتب بيانات مدرستك مرة واحدة، وستظهر تلقائياً في ترويسة وتوقيعات كل النماذج والسجلات المدرسية.
            </p>
          </div>
          <button
            onClick={openSubscriptionModal}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span>طريقة الاشتراك (99 ريال)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 font-bold text-xs animate-in fade-in">
          {feedback}
        </div>
      )}

      {/* License / Subscription Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-5 h-5 text-sky-700" />
          <span>ترخيص واشتراك المدرسة</span>
          {isSchoolSubscribed ? (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full mr-auto flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              مرخص رسمياً حتى {schoolExpiresAt}
            </span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full mr-auto">
              نسخة معاينة مجانية (تظهر علامة مائية)
            </span>
          )}
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          عند الاشتراك في باقة المدرسة (99 ريال / سنة)، يتم إرسال رمز الدخول عبر الواتساب لإزالة العلامة المائية تماماً وتفعيل التصدير الكامل باسم مدرستك.
        </p>

        <form onSubmit={handleActivate} className="grid sm:grid-cols-3 gap-3 pt-1">
          <input
            type="text"
            placeholder="معرف المدرسة (Slug)"
            value={inputSlug}
            onChange={e => setInputSlug(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
          />
          <input
            type="password"
            placeholder="رمز الدخول / كود التفعيل"
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
          />
          <button
            type="submit"
            className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors"
          >
            تفعيل الاشتراك
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 text-[11px]">
            {isSchoolSubscribed
              ? `الترخيص مفعل رسمياً حتى ${schoolExpiresAt}.`
              : "لا يقبل النظام إلا الأكواد الصادرة رسمياً من إدارة المنصة بعد سداد الرسوم (99 ر.س)."}
          </span>

          {isSchoolSubscribed && (
            <button
              type="button"
              onClick={() => {
                resetSchoolLicense();
                setFeedback("تمت إعادة ضبط الترخيص إلى نسخة المعاينة.");
              }}
              className="text-slate-500 hover:text-rose-600 font-bold cursor-pointer"
            >
              إلغاء التفعيل والعودة للمعاينة
            </button>
          )}
        </div>
      </div>

      {/* School Setup Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* School Type */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">نوع المدرسة والصيغة اللغوية:</label>
          <div className="flex gap-2">
            {[
              { id: "boys", label: "بنين (مذكر)" },
              { id: "girls", label: "بنات (مؤنث)" },
              { id: "early", label: "الطفولة المبكرة" }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => updateSchoolSettings({ schoolType: type.id as any })}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  schoolSettings.schoolType === type.id
                    ? "bg-sky-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            يضبط صيغة المذكر والمؤنث في كل النماذج والواجهة تلقائياً (الطالب/الطالبة، مدير/مديرة، وكيل/وكيلة).
          </p>
        </div>

        {/* Stage */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">المرحلة الدراسية:</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "kg", label: "رياض الأطفال" },
              { id: "primary", label: "ابتدائي" },
              { id: "middle", label: "متوسط" },
              { id: "secondary", label: "ثانوي" },
              { id: "multi", label: "متعدد المراحل" }
            ].map(stg => (
              <button
                key={stg.id}
                type="button"
                onClick={() => updateSchoolSettings({ stage: stg.id as any })}
                className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  schoolSettings.stage === stg.id
                    ? "bg-sky-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {stg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-2">التقويم الدراسي المعتمد:</label>
          <div className="flex gap-2">
            {[
              { id: "all", label: "جميع مناطق المملكة (التقويم القياسي)" },
              { id: "makkah", label: "نطاق مكة المكرمة والمدينة المنورة وجدة" }
            ].map(cal => (
              <button
                key={cal.id}
                type="button"
                onClick={() => updateSchoolSettings({ calendar: cal.id as any })}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  schoolSettings.calendar === cal.id
                    ? "bg-sky-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cal.label}
              </button>
            ))}
          </div>
        </div>

        {/* Educational Admin & School Name */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">إدارة التعليم:</label>
            <select
              value={schoolSettings.admin}
              onChange={e => updateSchoolSettings({ admin: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-right"
            >
              {SAUDI_REGIONS.map(reg => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">مكتب التعليم:</label>
            <input
              type="text"
              value={schoolSettings.office}
              onChange={e => updateSchoolSettings({ office: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-right"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-800 block mb-1">اسم المدرسة الرسمي:</label>
            <input
              type="text"
              value={schoolSettings.schoolName}
              onChange={e => updateSchoolSettings({ schoolName: e.target.value })}
              placeholder="مثال: مدرسة الإمام البخاري الابتدائية"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-right"
            />
          </div>
        </div>

        {/* Staff & Deputies Names */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900">أسماء القيادات المدرسية (للتوقيعات):</h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1">اسم مدير/ة المدرسة:</label>
              <input
                type="text"
                value={schoolSettings.managerName}
                onChange={e => updateSchoolSettings({ managerName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-right"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">وكيل/ة الشؤون التعليمية:</label>
              <input
                type="text"
                value={schoolSettings.deputyEdu}
                onChange={e => updateSchoolSettings({ deputyEdu: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-right"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">وكيل/ة شؤون الطلاب/الطالبات:</label>
              <input
                type="text"
                value={schoolSettings.deputyStudents}
                onChange={e => updateSchoolSettings({ deputyStudents: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-right"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">وكيل/ة الشؤون المدرسية:</label>
              <input
                type="text"
                value={schoolSettings.deputySchool}
                onChange={e => updateSchoolSettings({ deputySchool: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-right"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">الموجه/ة الطلابي/ة:</label>
              <input
                type="text"
                value={schoolSettings.counselor}
                onChange={e => updateSchoolSettings({ counselor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-right"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">الموجه/ة الصحي/ة:</label>
              <input
                type="text"
                value={schoolSettings.healthMentor}
                onChange={e => updateSchoolSettings({ healthMentor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-right"
              />
            </div>
          </div>
        </div>

        {/* School Logo Upload */}
        <div className="pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 block mb-2">شعار المدرسة المخصص:</label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            {schoolSettings.schoolLogo ? (
              <div className="relative group">
                <img
                  src={schoolSettings.schoolLogo}
                  alt="شعار المدرسة"
                  className="w-16 h-16 object-contain rounded-lg border border-slate-200 p-1 bg-white"
                />
                <button
                  type="button"
                  onClick={() => updateSchoolSettings({ schoolLogo: "" })}
                  className="text-[10px] text-rose-600 font-bold block mt-1 hover:underline cursor-pointer"
                >
                  حذف الشعار
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs text-center p-1">
                لا يوجد شعار
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>رفع شعار المدرسة (PNG أو JPG)</span>
            </button>
          </div>
        </div>

        {/* Backup / Export / Import */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            النسخ الاحتياطي: احفظ بيانات مدرستك ونزلها كملف JSON أو استرجعها بأي وقت.
          </span>

          <div className="flex items-center gap-2">
            <input
              ref={backupInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => backupInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد نسخة احتياطية</span>
            </button>

            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير نسخة احتياطية</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
