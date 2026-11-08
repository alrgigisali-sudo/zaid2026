/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePlatform, SchoolRoute } from "../../context/PlatformContext";
import { KHADAMATI_CONFIG } from "../../data/schoolModels";
import { PlatformLogo } from "../common/PlatformLogo";
import { School, GraduationCap, Settings, MessageCircle, HelpCircle, ShieldCheck, Lock } from "lucide-react";

export function SchoolTopbar() {
  const {
    schoolRoute,
    setSchoolRoute,
    setPortal,
    schoolSettings,
    isSchoolSubscribed,
    schoolExpiresAt,
    schoolDaysLeft,
    openSubscriptionModal,
    openAdminModal
  } = usePlatform();

  const navItems: { route: SchoolRoute; label: string; badge?: boolean }[] = [
    { route: "home", label: "الرئيسية" },
    { route: "settings", label: "الإعدادات", badge: !schoolSettings.schoolName },
    { route: "contact", label: "اتصل بنا" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      {/* Main Topbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Platform Name */}
          <button
            onClick={() => setSchoolRoute("home")}
            className="flex items-center gap-3 text-right cursor-pointer group"
          >
            <PlatformLogo
              size="md"
              subtitle="سجلات ونماذج مدرسية جاهزة باسم مدرستك"
            />
          </button>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.route}
                onClick={() => setSchoolRoute(item.route)}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                  schoolRoute === item.route
                    ? "bg-sky-50 text-sky-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-500" title="أكمل بيانات المدرسة" />
                )}
              </button>
            ))}

            {/* Link to Teacher Portal */}
            <button
              onClick={() => setPortal("teacher")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 mr-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>قسم المعلم</span>
            </button>
          </nav>

          {/* Action: How to subscribe button & Admin button */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSubscriptionModal}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black px-3.5 py-2 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>طريقة الاشتراك</span>
            </button>

            {/* Secret Admin License Generation Button for Owner */}
            <button
              onClick={openAdminModal}
              className="p-2 rounded-lg text-slate-500 hover:text-sky-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="إدارة التراخيص وتوليد الأكواد (للمدير)"
              aria-label="إدارة التراخيص"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Switch to teacher portal mobile button */}
            <button
              onClick={() => setPortal("teacher")}
              className="md:hidden p-2 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200"
              title="قسم المعلم"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Subbar: Subscription status / preview banner */}
      <div
        className={`px-4 py-2 text-xs font-semibold text-center border-t transition-colors ${
          isSchoolSubscribed
            ? "bg-sky-50 border-sky-200 text-sky-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {isSchoolSubscribed ? (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <b>{schoolSettings.schoolName || "المدرسة"}</b> — اشتراكك ساري حتى {schoolExpiresAt} ({schoolDaysLeft} يومًا متبقيًا) — نسخة مرخصة رسمياً بلا علامات مائية
              </span>
              <button
                onClick={() => setSchoolRoute("settings")}
                className="underline text-sky-700 hover:text-sky-900 cursor-pointer font-bold"
              >
                إدارة الاشتراك
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span>
                نسخة معاينة مجانية — تظهر علامة المنصة أسفل المطبوعات. للاشتراك وإزالة العلامة المائية:
              </span>
              <button
                onClick={openSubscriptionModal}
                className="font-bold underline text-amber-950 hover:text-black cursor-pointer"
              >
                تفاصيل وطريقة الاشتراك (99 ريال / سنة)
              </button>
              <span>—</span>
              <a
                href={KHADAMATI_CONFIG.waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب: {KHADAMATI_CONFIG.whatsapp}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
