/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePlatform, TeacherTab } from "../../context/PlatformContext";
import { TEACHER_CONFIG } from "../../data/teacherData";
import { PlatformLogo } from "../common/PlatformLogo";
import {
  Home,
  Sparkles,
  LayoutGrid,
  FolderKanban,
  Bookmark,
  ClipboardCheck,
  Image as ImageIcon,
  CreditCard,
  User,
  School,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Lock
} from "lucide-react";

interface Props {
  onOpenProfile: () => void;
}

export function TeacherNavbar({ onOpenProfile }: Props) {
  const {
    teacherTab,
    setTeacherTab,
    setPortal,
    teacherProfile,
    isTeacherSubscribed,
    teacherExpiresAt,
    savedWitnesses,
    openSubscriptionModal,
    openAdminModal
  } = usePlatform();

  const tabs: { id: TeacherTab; label: string; icon: any; badge?: string | number }[] = [
    { id: "landing", label: "الرئيسية", icon: Home },
    { id: "portfolio", label: "ملف الإنجاز (70 صفحة)", icon: FolderKanban },
    { id: "templates", label: "قوالب الشواهد (311)", icon: LayoutGrid },
    { id: "smart-witness", label: "إنشاء تقرير ذكي", icon: Sparkles },
    { id: "remedial-register", label: "الخطة العلاجية والإثرائية", icon: ClipboardCheck },
    { id: "photo-library", label: "مكتبة الصور (50)", icon: ImageIcon },
    { id: "my-witnesses", label: "تقاريري", icon: Bookmark, badge: savedWitnesses.length },
    { id: "subscribe", label: "اشتراك", icon: CreditCard }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print text-right" dir="rtl">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <button
            onClick={() => setTeacherTab("landing")}
            className="flex items-center gap-3 text-right cursor-pointer group shrink-0"
          >
            <PlatformLogo
              size="md"
              subtitle="ملف الإنجاز (70 صفحة) و 311 قالب شواهد"
            />
          </button>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isSel = teacherTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTeacherTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSel
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && Number(tab.badge) > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                        isSel ? "bg-white text-emerald-800" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Teacher Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              title="بياناتي — بيانات المعلم والمدرسة والترويسة"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">بياناتي ({teacherProfile.name.split(" ")[0]})</span>
            </button>

            {/* How to subscribe modal trigger */}
            <button
              onClick={openSubscriptionModal}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-3 py-2 rounded-xl shadow-xs cursor-pointer transition-colors whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">طريقة الاشتراك</span>
            </button>

            {/* Secret Admin License Generation Button for Owner */}
            <button
              onClick={openAdminModal}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="إدارة التراخيص وتوليد الأكواد (للمدير)"
              aria-label="إدارة التراخيص"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Back to School Portal Button */}
            <button
              onClick={() => setPortal("school")}
              className="flex items-center gap-1.5 bg-sky-900 hover:bg-sky-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <School className="w-4 h-4" />
              <span>قسم المدرسة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tablet / Mobile Tab Scroller */}
      <div className="xl:hidden flex items-center gap-1.5 px-4 py-2 border-t border-slate-200 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isSel = teacherTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTeacherTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                isSel ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && Number(tab.badge) > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold tabular-nums ${
                    isSel ? "bg-white text-emerald-800" : "bg-emerald-600 text-white"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subbar: Subscription status */}
      <div
        className={`px-4 py-1.5 text-xs font-semibold text-center border-t transition-colors ${
          isTeacherSubscribed
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {isTeacherSubscribed ? (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <b>أ. {teacherProfile.name}</b> — اشتراكك ساري حتى {teacherExpiresAt} — نسخة مرخصة رسمياً وبلا علامة مائية
              </span>
              <button
                onClick={() => setTeacherTab("subscribe")}
                className="underline text-emerald-800 hover:text-emerald-950 cursor-pointer font-bold"
              >
                تفاصيل الاشتراك
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span>
                نسخة تجريبية — للاشتراك وإزالة العلامة المائية وتفعيل التصدير الكامل لملف الإنجاز (70 صفحة) والـ 311 قالباً:
              </span>
              <button
                onClick={openSubscriptionModal}
                className="font-bold underline text-amber-950 hover:text-black cursor-pointer"
              >
                طريقة وتفاصيل الاشتراك (49 ريال / سنة)
              </button>
              <span>·</span>
              <a
                href={TEACHER_CONFIG.waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب: {TEACHER_CONFIG.whatsapp}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
