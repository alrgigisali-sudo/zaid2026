/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { usePlatform, SchoolRoute, TeacherTab } from "../../context/PlatformContext";
import { PlatformLogo } from "./PlatformLogo";
import { SCHOOL_GROUPS } from "../school/SchoolHome";
import {
  Building2,
  GraduationCap,
  Home,
  Settings,
  KeyRound,
  FileText,
  ShieldCheck,
  Calendar,
  BookOpen,
  ClipboardList,
  Users,
  Briefcase,
  Award,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Lock,
  Menu,
  X,
  Search,
  ChevronLeft,
  FolderKanban,
  LayoutGrid,
  ClipboardCheck,
  Image as ImageIcon,
  Bookmark,
  User,
  HelpCircle,
  Scale,
  UserCheck,
  Layers
} from "lucide-react";

interface DgaAppShellProps {
  children: React.ReactNode;
  onOpenTeacherProfile: () => void;
}

const SCHOOL_ROUTE_LABELS: Record<SchoolRoute, string> = {
  home: "الرئيسية ومكتبة النماذج",
  settings: "إعدادات المدرسة والطلاب",
  contact: "الاشتراك والتراخيص والدعم",
  rules: "قواعد السلوك والمواظبة",
  committees: "اللجان وفرق العمل الرسمية",
  jobs: "الوصف الوظيفي لمنسوبي المدرسة",
  plans: "خطط المدير والوكلاء",
  followup: "كشوف متابعة الطلاب",
  "monthly-attendance": "كشف الغياب الشهري",
  "cover-maker": "صانع غلاف السجلات",
  behavior: "نماذج السلوك والمواظبة",
  guidance: "التوجيه الطلابي",
  health: "الموجه الصحي",
  "admin-forms": "الإدارة والتعاميم",
  parents: "سجلات أولياء الأمور",
  staff: "اللجان والموظفون",
  quality: "الجودة والمتابعة",
  safety: "الأمن والسلامة والصندوق",
  registers: "سجلات الوكلاء والدليل الإجرائي",
  kindergarten: "نماذج وسجلات رياض الأطفال",
  readiness: "الاستعداد والأسبوع التمهيدي",
  gifted: "سجل معلم الموهوبين",
  discipline: "الانضباط وتعزيز السلوك والأزمات",
  authority: "الصلاحيات والتكليفات والأداء"
};

const TEACHER_TAB_LABELS: Record<TeacherTab, string> = {
  landing: "لوحة تحكم المعلم",
  portfolio: "ملف الإنجاز الشامل (70 صفحة)",
  curriculum: "توزيع المنهج والخطط الأسبوعية (الابتدائية)",
  templates: "قوالب الشواهد الجاهزة (311 قالب)",
  "smart-witness": "إنشاء تقرير ذكي (بالصوت و AI)",
  "remedial-register": "سجل الخطة العلاجية والإثرائية",
  "photo-library": "مكتبة صور الشواهد (50 نموذجاً)",
  "my-witnesses": "تقاريري المحفوظة",
  subscribe: "الاشتراك وتفعيل الكود"
};

function getSchoolRouteIcon(route: SchoolRoute) {
  switch (route) {
    case "home":
      return Home;
    case "settings":
      return Settings;
    case "contact":
      return KeyRound;
    case "rules":
    case "behavior":
    case "discipline":
      return Scale;
    case "committees":
    case "staff":
    case "parents":
      return Users;
    case "jobs":
    case "authority":
      return Briefcase;
    case "plans":
    case "monthly-attendance":
    case "readiness":
      return Calendar;
    case "followup":
    case "registers":
      return ClipboardList;
    case "health":
      return HeartPulse;
    case "quality":
    case "gifted":
      return Award;
    case "safety":
      return ShieldCheck;
    case "cover-maker":
    case "kindergarten":
      return BookOpen;
    default:
      return FileText;
  }
}

export function DgaAppShell({ children, onOpenTeacherProfile }: DgaAppShellProps) {
  const {
    portal,
    setPortal,
    schoolRoute,
    setSchoolRoute,
    schoolSettings,
    isSchoolSubscribed,
    teacherTab,
    setTeacherTab,
    teacherProfile,
    isTeacherSubscribed,
    savedWitnesses,
    openSubscriptionModal,
    openAdminModal
  } = usePlatform();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState("");

  const isSchoolActiveLicense = isSchoolSubscribed;
  const needsSchoolSetup = !schoolSettings.schoolName;

  const filteredSchoolGroups = useMemo(() => {
    const q = sidebarFilter.trim();
    if (!q) return SCHOOL_GROUPS;
    return SCHOOL_GROUPS.map(g => ({
      ...g,
      tiles: g.tiles.filter(t => (t.title + " " + t.text).includes(q))
    })).filter(g => g.tiles.length > 0);
  }, [sidebarFilter]);

  const handleSelectSchoolRoute = (route: SchoolRoute) => {
    setSchoolRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectTeacherTab = (tab: TeacherTab) => {
    setTeacherTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentBreadcrumb =
    portal === "school"
      ? SCHOOL_ROUTE_LABELS[schoolRoute] || "الرئيسية"
      : TEACHER_TAB_LABELS[teacherTab] || "لوحة تحكم المعلم";

  const renderSidebarContent = () => {
    if (portal === "school") {
      return (
        <div className="flex flex-col h-full text-right" dir="rtl">
          {/* Active School Summary Block */}
          <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-[#111A5E] block">
                  بيانات المدرسة الحالية
                </span>
                <h2 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {schoolSettings.schoolName || "لم يتم إعداد اسم المدرسة"}
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {schoolSettings.office || schoolSettings.admin || "إدارة التعليم"} ·{" "}
                  {schoolSettings.schoolType === "girls"
                    ? "بنات"
                    : schoolSettings.schoolType === "early"
                      ? "طفولة مبكرة"
                      : "بنين"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectSchoolRoute("settings")}
                className="shrink-0 p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#111A5E] text-slate-600 hover:text-[#111A5E] transition-colors cursor-pointer"
                title="تعديل إعدادات المدرسة"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sidebar Search */}
            <div className="relative mt-3">
              <input
                type="text"
                value={sidebarFilter}
                onChange={e => setSidebarFilter(e.target.value)}
                placeholder="تصفية الأقسام والنماذج..."
                className="w-full bg-white border border-[#D1D5DB] rounded-lg py-1.5 pr-8 pl-6 text-xs text-slate-800 focus:outline-hidden focus:border-[#111A5E] m-0"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              {sidebarFilter && (
                <button
                  type="button"
                  onClick={() => setSidebarFilter("")}
                  className="absolute left-2 top-2 text-[10px] text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Navigation Links */}
          <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
            {/* Primary System Links */}
            <div>
              <div className="px-2.5 mb-1.5 text-[11px] font-bold text-slate-400">
                الوصول السريع
              </div>
              <div className="space-y-0.5">
                {([
                  { route: "home" as SchoolRoute, label: "الرئيسية ومكتبة النماذج", icon: Home },
                  {
                    route: "settings" as SchoolRoute,
                    label: "إعدادات المدرسة والطلاب",
                    icon: Settings,
                    alert: needsSchoolSetup
                  },
                  {
                    route: "contact" as SchoolRoute,
                    label: "الاشتراك والتراخيص والدعم",
                    icon: KeyRound
                  }
                ]).map(item => {
                  const Icon = item.icon;
                  const active = schoolRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => handleSelectSchoolRoute(item.route)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-right ${
                        active
                          ? "bg-[#EEF1FA] text-[#080C3A] font-bold border-r-[3px] border-[#111A5E]"
                          : "text-slate-700 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            active ? "text-[#111A5E]" : "text-slate-500"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.alert && (
                        <span
                          className="w-2 h-2 rounded-full bg-red-600 shrink-0"
                          title="يرجى إكمال بيانات المدرسة"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* School Model Categories */}
            {filteredSchoolGroups.map(group => (
              <div key={group.name}>
                <div className="px-2.5 mb-1.5 text-[11px] font-bold text-slate-400">
                  {group.name}
                </div>
                <div className="space-y-0.5">
                  {group.tiles.map(tile => {
                    const Icon = getSchoolRouteIcon(tile.route);
                    const active = schoolRoute === tile.route;
                    return (
                      <button
                        key={tile.route}
                        type="button"
                        onClick={() => handleSelectSchoolRoute(tile.route)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-right ${
                          active
                            ? "bg-[#EEF1FA] text-[#080C3A] font-bold border-r-[3px] border-[#111A5E]"
                            : "text-slate-700 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              active ? "text-[#111A5E]" : "text-slate-500"
                            }`}
                          />
                          <span className="truncate">{tile.title}</span>
                        </span>
                        {tile.badge && (
                          <span className="text-[10px] font-semibold text-[#111A5E] shrink-0">
                            {tile.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Portal Switch Shortcut */}
          <div className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
            <button
              type="button"
              onClick={() => {
                setPortal("teacher");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#111A5E] text-xs font-bold text-slate-800 hover:text-[#080C3A] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#111A5E]" />
                <span>الانتقال إلى بوابة المعلم</span>
              </span>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      );
    }

    // Teacher Portal Sidebar Content
    const teacherGroups: {
      groupTitle: string;
      items: {
        id: TeacherTab;
        label: string;
        icon: React.ElementType;
        meta?: string;
      }[];
    }[] = [
      {
        groupTitle: "الرئيسية وملف الإنجاز",
        items: [
          { id: "landing", label: "لوحة تحكم المعلم", icon: Home },
          {
            id: "portfolio",
            label: "ملف الإنجاز الشامل",
            icon: FolderKanban,
            meta: "70 ص"
          },
          {
            id: "curriculum",
            label: "توزيع المنهج والخطط الأسبوعية",
            icon: Calendar,
            meta: "الابتدائية"
          }
        ]
      },
      {
        groupTitle: "نماذج وشواهد الأداء الوظيفي",
        items: [
          {
            id: "templates",
            label: "قوالب الشواهد الجاهزة",
            icon: LayoutGrid,
            meta: "311"
          },
          {
            id: "smart-witness",
            label: "إنشاء تقرير ذكي (صوت + AI)",
            icon: Sparkles
          },
          {
            id: "remedial-register",
            label: "سجل الخطة العلاجية والإثرائية",
            icon: ClipboardCheck
          },
          {
            id: "photo-library",
            label: "مكتبة صور الشواهد الجاهزة",
            icon: ImageIcon,
            meta: "50"
          },
          {
            id: "my-witnesses",
            label: "تقاريري المحفوظة",
            icon: Bookmark,
            meta: String(savedWitnesses.length)
          }
        ]
      },
      {
        groupTitle: "الاشتراك والتفعيل",
        items: [
          {
            id: "subscribe",
            label: isTeacherSubscribed ? "حالة الاشتراك (مفعّل)" : "تفعيل الاشتراك السنوي",
            icon: KeyRound
          }
        ]
      }
    ];

    return (
      <div className="flex flex-col h-full text-right" dir="rtl">
        {/* Active Teacher Profile Summary Card */}
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-[#111A5E] block">
                ملف المعلم النشط
              </span>
              <h2 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                أ. {teacherProfile.name}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {teacherProfile.subject} · {teacherProfile.school}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTeacherProfile();
              }}
              className="shrink-0 p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#111A5E] text-slate-600 hover:text-[#111A5E] transition-colors cursor-pointer"
              title="تعديل بيانات المعلم والترويسة"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTeacherProfile();
            }}
            className="mt-3 w-full py-1.5 px-3 rounded-lg border border-[#D1D5DB] bg-white hover:border-[#111A5E] text-xs font-semibold text-slate-700 hover:text-[#080C3A] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#111A5E]" />
            <span>تحديث بياناتي والترويسة الرسمية</span>
          </button>
        </div>

        {/* Teacher Navigation Tree */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
          {teacherGroups.map(group => (
            <div key={group.groupTitle}>
              <div className="px-2.5 mb-1.5 text-[11px] font-bold text-slate-400">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const active = teacherTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTeacherTab(item.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer text-right ${
                        active
                          ? "bg-[#EEF1FA] text-[#080C3A] font-bold border-r-[3px] border-[#111A5E]"
                          : "text-slate-700 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            active ? "text-[#111A5E]" : "text-slate-500"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.meta && (
                        <span className="text-[11px] font-semibold text-slate-500 tabular-nums shrink-0">
                          {item.meta}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Portal Switch Shortcut */}
        <div className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <button
            type="button"
            onClick={() => {
              setPortal("school");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#111A5E] text-xs font-bold text-slate-800 hover:text-[#080C3A] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#111A5E]" />
              <span>الانتقال إلى بوابة المدرسة</span>
            </span>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    );
  };

  const showSidebar = portal === "school" || portal === "teacher";

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-slate-900 font-sans antialiased overflow-x-hidden" dir="rtl">
      {/* Main Top Navigation Header */}
      <header className="dga-header no-print sticky top-0 z-30 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          {/* Row 1: Brand + Desktop Switcher + Quick Actions */}
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
            {/* Right: Mobile Drawer Trigger + Brand + Active Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {showSidebar && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-slate-800 hover:bg-slate-100 cursor-pointer shrink-0"
                  aria-label="فتح القائمة الجانبية"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setPortal("overview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-right cursor-pointer shrink-0"
              >
                <PlatformLogo size="sm" />
              </button>

              {showSidebar && (
                <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 border-r border-[#E5E7EB] pr-3 mr-1 truncate">
                  <span className="font-semibold text-slate-700">
                    {portal === "school" ? "قسم المدرسة" : "قسم المعلم"}
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-bold text-[#111A5E] truncate">{currentBreadcrumb}</span>
                </div>
              )}
            </div>

            {/* Center: Desktop Unified Segmented Portal Switcher (Hidden on phones, shown on md+) */}
            <div className="hidden md:flex items-center bg-[#F3F4F6] p-1 rounded-xl border border-[#E5E7EB] shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPortal("overview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "overview"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>الرئيسية</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortal("school");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "school"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>قسم المدرسة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortal("teacher");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "teacher"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>قسم المعلم</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortal("subscription");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "subscription"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>الاشتراك والتفعيل</span>
              </button>
            </div>

            {/* Left: Contextual Profile / Settings + Subscription Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {portal === "teacher" ? (
                <button
                  type="button"
                  onClick={onOpenTeacherProfile}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#111A5E] text-xs font-bold text-slate-700 hover:text-[#080C3A] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 text-[#111A5E] shrink-0" />
                  <span className="hidden sm:inline">بيانات المعلم</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPortal("school");
                    setSchoolRoute("settings");
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#111A5E] text-xs font-bold text-slate-700 hover:text-[#080C3A] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Settings className="w-3.5 h-3.5 text-[#111A5E] shrink-0" />
                  <span className="hidden sm:inline">إعدادات المدرسة</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPortal("subscription")}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-[#111A5E] hover:bg-[#080C3A] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>تفعيل الكود</span>
              </button>
            </div>
          </div>

          {/* Row 2 (Mobile Only): Full-Width 4-Column Portal Switcher Bar */}
          <div className="md:hidden pb-2.5 pt-0.5">
            <div className="grid grid-cols-4 gap-1 bg-[#F3F4F6] p-1 rounded-xl border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => {
                  setPortal("overview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "overview"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span>الرئيسية</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortal("school");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "school"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>المدرسة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortal("teacher");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "teacher"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span>المعلم</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortal("subscription");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  portal === "subscription"
                    ? "bg-[#111A5E] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>الاشتراك</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body: Fixed Right RTL Sidebar (when inside school/teacher) + Main Viewport */}
      <div className="dga-main-shell flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Fixed Right Sidebar (w-72) */}
        {showSidebar && (
          <aside className="dga-sidebar no-print hidden lg:flex lg:flex-col w-72 shrink-0 bg-white border-l border-[#E5E7EB] sticky top-16 h-[calc(100vh-4rem)]">
            {renderSidebarContent()}
          </aside>
        )}

        {/* Mobile Slide-Over Right Drawer */}
        {showSidebar && mobileMenuOpen && (
          <div className="dga-sidebar no-print fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-10 w-80 max-w-[85vw] bg-white h-full flex flex-col border-l border-[#E5E7EB] shadow-xl">
              <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
                <PlatformLogo size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">{renderSidebarContent()}</div>
            </aside>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile Quick Section Bar when inside School or Teacher portal */}
          {showSidebar && (
            <div className="lg:hidden no-print bg-white border-b border-[#E5E7EB] px-3 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0 text-xs">
                <span className="font-semibold text-slate-500 shrink-0">
                  {portal === "school" ? "قسم المدرسة:" : "قسم المعلم:"}
                </span>
                <span className="font-bold text-[#080C3A] truncate">{currentBreadcrumb}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#EEF1FA] text-[#080C3A] border border-[#C5D0F0] px-2.5 py-1.5 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer"
              >
                <Menu className="w-3.5 h-3.5 text-[#111A5E]" />
                <span>قائمة الأقسام</span>
              </button>
            </div>
          )}

          {/* Subtle Contextual Status Bar (No-Print) */}
          {portal === "school" && !isSchoolActiveLicense && (
            <div className="no-print bg-[#EEF1FA] border-b border-[#C5D0F0] px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-[#080C3A] flex flex-wrap items-center justify-between gap-2">
              <span className="leading-relaxed">
                وضع المعاينة المجانية: جميع النماذج مفتوحة للتجربة، وتُطبع مع علامة مائية خفيفة حتى يتم تفعيل ترخيص المدرسة.
              </span>
              <div className="flex items-center gap-3 font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setPortal("subscription")}
                  className="underline hover:text-slate-900 cursor-pointer"
                >
                  إدخال كود الترخيص
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={openSubscriptionModal}
                  className="underline hover:text-slate-900 cursor-pointer"
                >
                  طلب اشتراك
                </button>
              </div>
            </div>
          )}

          {portal === "teacher" && !isTeacherSubscribed && (
            <div className="no-print bg-[#EEF1FA] border-b border-[#C5D0F0] px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-[#080C3A] flex flex-wrap items-center justify-between gap-2">
              <span className="leading-relaxed">
                قسم المعلم (ملف الإنجاز 70 صفحة + توزيع المنهج + 311 قالب شاهد): متاح للمعاينة، ولتفعيل الطباعة الرسمية بدون علامة مائية أدخل كود التفعيل.
              </span>
              <div className="flex items-center gap-3 font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setPortal("subscription")}
                  className="underline hover:text-slate-900 cursor-pointer"
                >
                  إدخال كود التفعيل
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={openSubscriptionModal}
                  className="underline hover:text-slate-900 cursor-pointer"
                >
                  طريقة الاشتراك
                </button>
              </div>
            </div>
          )}

          <main className="grow w-full max-w-full overflow-x-hidden">{children}</main>

          {/* Clean Institutional Footer */}
          <footer className="no-print border-t border-[#E5E7EB] bg-white py-5 px-6 text-xs text-slate-500 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-medium text-slate-600">
                <span>
                  منصة زيد الرقمية (ZAID) © {new Date().getFullYear()} — جميع الحقوق محفوظة
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[11px] text-slate-500 tabular-nums">
                  الدعم الفني والاشتراكات: 0539571077
                </span>

                {/* Secret Admin Portal Lock Button */}
                <button
                  type="button"
                  onClick={openAdminModal}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#080C3A] bg-[#F9FAFB] hover:bg-[#EEF1FA] border border-[#E5E7EB] px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                  title="لوحة تحكم المدير وتوليد التراخيص (محمية بكلمة مرور)"
                >
                  <Lock className="w-3 h-3 text-[#111A5E]" />
                  <span>إدارة التراخيص</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
