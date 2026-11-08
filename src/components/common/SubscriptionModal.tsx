/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { CheckCircle2, ShieldCheck, MessageCircle, X, School, GraduationCap, KeyRound } from "lucide-react";

export function SubscriptionModal() {
  const {
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    isSchoolSubscribed,
    activateSchoolLicense,
    resetSchoolLicense,
    isTeacherSubscribed,
    activateTeacherLicense,
    resetTeacherLicense,
    portal
  } = usePlatform();

  const [activePlan, setActivePlan] = useState<"school" | "teacher">(portal === "teacher" ? "teacher" : "school");
  const [activationCode, setActivationCode] = useState("");
  const [activationSlug, setActivationSlug] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync activePlan whenever modal opens or portal changes
  useEffect(() => {
    if (isSubscriptionModalOpen) {
      setActivePlan(portal === "teacher" ? "teacher" : "school");
      setStatusMessage(null);
    }
  }, [isSubscriptionModalOpen, portal]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isSubscriptionModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSubscriptionModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubscriptionModalOpen, setIsSubscriptionModalOpen]);

  if (!isSubscriptionModalOpen) return null;

  const handleClose = () => {
    setIsSubscriptionModalOpen(false);
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim()) {
      setStatusMessage({ type: "error", text: "يرجى إدخال كود التفعيل الرسمي أولاً." });
      return;
    }

    if (activePlan === "school") {
      const res = activateSchoolLicense(activationSlug.trim(), activationCode.trim());
      setStatusMessage({ type: res.ok ? "success" : "error", text: res.message });
    } else {
      const res = activateTeacherLicense(activationCode.trim());
      setStatusMessage({ type: res.ok ? "success" : "error", text: res.message });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150 no-print"
      dir="rtl"
      onClick={handleClose}
    >
      {/* Modal Box: Compact max-w-xl and constrained height max-h-[85vh] so it never traps the user */}
      <div
        className="relative w-full max-w-xl max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Header */}
        <div className="shrink-0 bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src="/zaid-logo-mark.png"
              alt="شعار منصة زيد الرقمية"
              className="w-9 h-9 object-contain brightness-0 invert shrink-0"
            />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                طريقة وتفاصيل الاشتراك في منصة زيد الرقمية
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                ترخيص رسمي لمدة سنة كاملة — إزالة فورية للعلامة المائية
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1 bg-white/15 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
            title="إغلاق النافذة (ESC)"
          >
            <X className="w-4 h-4" />
            <span>إغلاق</span>
          </button>
        </div>

        {/* Scrollable Middle Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Plan Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActivePlan("school");
                setStatusMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activePlan === "school"
                  ? "bg-[#080C3A] text-white shadow-xs"
                  : "text-slate-700 hover:bg-white/60"
              }`}
            >
              <School className="w-4 h-4 shrink-0" />
              <span>قسم المدرسة (سنة 129 / فصل 59 ر.س)</span>
              {isSchoolSubscribed && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="مفعل" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePlan("teacher");
                setStatusMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activePlan === "teacher"
                  ? "bg-[#111A5E] text-white shadow-xs"
                  : "text-slate-700 hover:bg-white/60"
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>قسم المعلم (سنة 90 / فصل 49 ر.س)</span>
              {isTeacherSubscribed && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="مفعل" />
              )}
            </button>
          </div>

          {/* Two Separate Subscription Cards */}
          {activePlan === "school" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Annual School */}
              <div className="bg-gradient-to-br from-[#080C3A]/5 to-[#111A5E]/10 border-2 border-[#080C3A]/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
                <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                  الأوفر قيمة 🌟
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#080C3A]">اشتراك مدرسة — سنة كاملة</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">ترخيص شامل طوال العام الدراسي</p>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-[#080C3A]">129</span>{" "}
                    <span className="text-xs font-bold text-slate-700">ريال سعودي / سنة</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>إزالة فورية للعلامة المائية لمدة عام</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>أكثر من 120 نموذج وسجل باسم المدرسة</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>تحديثات وتصاميم النماذج طوال السنة</span>
                    </li>
                  </ul>
                </div>
                <a
                  href={`https://wa.me/966539571077?text=${encodeURIComponent(
                    "السلام عليكم، أود الاشتراك في باقة المدرسة — سنة كاملة (129 ريال)."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#080C3A] hover:bg-[#111A5E] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>طلب اشتراك سنة (129 ر.س)</span>
                </a>
              </div>

              {/* Card 2: Term School */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">اشتراك مدرسة — فصل دراسي</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">ترخيص لمدرسة لمدة فصل دراسي واحد</p>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-slate-900">59</span>{" "}
                    <span className="text-xs font-bold text-slate-700">ريال سعودي / فصل</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>إزالة العلامة المائية للفصل الحالي</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>كافة السجلات المدرسية والخطط</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>طباعة وتصدير مباشر A4</span>
                    </li>
                  </ul>
                </div>
                <a
                  href={`https://wa.me/966539571077?text=${encodeURIComponent(
                    "السلام عليكم، أود الاشتراك في باقة المدرسة — فصل دراسي واحد (59 ريال)."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>طلب اشتراك فصل (59 ر.س)</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Annual Teacher */}
              <div className="bg-gradient-to-br from-[#111A5E]/5 to-[#080C3A]/10 border-2 border-[#111A5E]/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
                <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                  الأكثر طلباً 🌟
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#111A5E]">اشتراك معلم/ـة — سنة كاملة</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">شواهد وإنجاز بلا حدود طوال العام</p>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-[#111A5E]">90</span>{" "}
                    <span className="text-xs font-bold text-slate-700">ريال سعودي / سنة</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>إزالة العلامة المائية طوال العام</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>70 صفحة لملف الإنجاز و311 شاهد</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>توليد وتصدير الشواهد بدون قيود</span>
                    </li>
                  </ul>
                </div>
                <a
                  href={`https://wa.me/966539571077?text=${encodeURIComponent(
                    "السلام عليكم، أود الاشتراك في باقة المعلم/ـة — سنة كاملة (90 ريال)."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#111A5E] hover:bg-[#080C3A] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>طلب اشتراك سنة (90 ر.س)</span>
                </a>
              </div>

              {/* Card 2: Term Teacher */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">اشتراك معلم/ـة — فصل دراسي</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">تغطي شواهد الأداء لفصل دراسي واحد</p>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-slate-900">49</span>{" "}
                    <span className="text-xs font-bold text-slate-700">ريال سعودي / فصل</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>إزالة العلامة المائية للشواهد لفصل واحد</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>نماذج توزيع المنهج والخطط الأسبوعية</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>طباعة مباشر عالية الجودة A4</span>
                    </li>
                  </ul>
                </div>
                <a
                  href={`https://wa.me/966539571077?text=${encodeURIComponent(
                    "السلام عليكم، أود الاشتراك في باقة المعلم/ـة — فصل دراسي واحد (49 ريال)."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>طلب اشتراك فصل (49 ر.س)</span>
                </a>
              </div>
            </div>
          )}

          {/* Official Activation Code Input Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>لديك كود تفعيل رسمي؟ أدخله هنا:</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                {activePlan === "school" ? "تفعيل المدرسة" : "تفعيل المعلم"}
              </span>
            </div>

            <form onSubmit={handleActivate} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                {activePlan === "school" && (
                  <input
                    type="text"
                    value={activationSlug}
                    onChange={(e) => setActivationSlug(e.target.value)}
                    placeholder="معرّف المدرسة (Slug)..."
                    className="sm:w-2/5 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-right"
                  />
                )}
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder={
                    activePlan === "school"
                      ? "كود التفعيل (KP-SCH-XXXX-XXXX)"
                      : "كود التفعيل (KP-TCH-XXXX-XXXX)"
                  }
                  className="grow bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-right"
                />
                <button
                  type="submit"
                  className={`font-bold text-xs px-4 py-2 rounded-xl text-white cursor-pointer transition-colors shrink-0 ${
                    activePlan === "school"
                      ? "bg-sky-800 hover:bg-sky-900"
                      : "bg-emerald-700 hover:bg-emerald-800"
                  }`}
                >
                  تفعيل الكود
                </button>
              </div>
            </form>

            {statusMessage && (
              <div
                className={`p-2.5 rounded-xl text-xs font-bold ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {/* Current License Status */}
            {(activePlan === "school" ? isSchoolSubscribed : isTeacherSubscribed) && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  الترخيص مفعل رسمياً (بدون علامة مائية)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (activePlan === "school") resetSchoolLicense();
                    else resetTeacherLicense();
                    setStatusMessage({ type: "success", text: "تمت إعادة الضبط لوضع المعاينة." });
                  }}
                  className="text-[11px] text-rose-600 underline font-semibold cursor-pointer"
                >
                  إلغاء التفعيل
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Footer with WhatsApp & Clear Close Button */}
        <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <a
            href={`https://wa.me/966539571077?text=${encodeURIComponent(
              activePlan === "school"
                ? "السلام عليكم ورحمة الله، أود الاشتراك في منصة زيد الرقمية — باقة المدرسة (99 ريال / سنة)."
                : "السلام عليكم ورحمة الله، أود الاشتراك في منصة زيد الرقمية — باقة المعلم (49 ريال / سنة)."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer grow sm:grow-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>اشترك عبر واتساب: 0539571077</span>
          </a>

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}
