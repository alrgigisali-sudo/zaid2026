/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform, SchoolRoute, TeacherTab } from "../../context/PlatformContext";
import { KHADAMATI_CONFIG } from "../../data/schoolModels";
import { TEACHER_CONFIG } from "../../data/teacherData";
import {
  Building2,
  GraduationCap,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  FileText,
  FolderKanban,
  Layers,
  LayoutGrid,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  Printer,
  Settings,
  User,
  Users,
  Award,
  Calendar,
  BookOpen,
  MessageCircle,
  Lock
} from "lucide-react";

interface OverviewProps {
  onOpenTeacherProfile?: () => void;
}

export function PlatformOverviewHome({ onOpenTeacherProfile }: OverviewProps) {
  const {
    setPortal,
    setSchoolRoute,
    setTeacherTab,
    schoolSettings,
    teacherProfile,
    isSchoolSubscribed,
    isTeacherSubscribed
  } = usePlatform();

  const navigateToSchoolService = (route: SchoolRoute) => {
    setPortal("school");
    setSchoolRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToTeacherService = (tab: TeacherTab) => {
    setPortal("teacher");
    setTeacherTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10 text-right overflow-x-hidden" dir="rtl">
      {/* 1. Hero Section — About Zaid Digital Platform & Services */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#080C3A] bg-[#EEF1FA] border border-[#C5D0F0] px-2.5 sm:px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-[#111A5E] shrink-0" />
              <span>منصة زيد الرقمية (ZAID) — الحل المتكامل للمدارس والمعلمين والمعلمات</span>
            </div>

            <h1 className="text-xl sm:text-4xl font-black text-slate-900 leading-snug sm:leading-tight tracking-tight">
              منصة رقمية موحدة لإعداد السجلات والنماذج المدرسية وشواهد الأداء الوظيفي وتوزيع المنهج
            </h1>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              توفّر <strong className="text-slate-900">منصة زيد الرقمية</strong> بيئة عمل احترافية تجمع كافة احتياجات الإدارة المدرسية والهيئة التعليمية في مكان واحد؛ حيث تُدرج بيانات المدرسة أو المعلم تلقائياً في الترويسة الرسمية لجميع النماذج والسجلات والخطط مع إمكانية التعديل المباشر والطباعة الفورية بمقاس A4 المعتمد أو الحفظ كملف PDF.
            </p>

            {/* Primary Quick Navigation Buttons */}
            <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setPortal("school");
                  setSchoolRoute("home");
                }}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#080C3A] hover:bg-[#06092B] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-3 rounded-xl transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#C5D0F0] shrink-0" />
                <span>قسم المدرسة</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortal("teacher");
                  setTeacherTab("landing");
                }}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#111A5E] hover:bg-[#080C3A] text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-3 rounded-xl transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#C5D0F0] shrink-0" />
                <span>قسم المعلم</span>
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setPortal("subscription")}
                className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#EEF1FA] text-slate-800 hover:text-[#080C3A] border border-[#D1D5DB] hover:border-[#111A5E] font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-xl transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#111A5E] shrink-0" />
                <span>قسم الاشتراك والتفعيل</span>
              </button>
            </div>
          </div>

          {/* Key Platform Statistics Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
              <div className="w-9 h-9 rounded-lg bg-[#EEF1FA] text-[#111A5E] flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">+120</div>
              <div className="text-xs font-bold text-slate-800">نموذج وسجل مدرسي</div>
              <div className="text-[11px] text-slate-500">موزعة على 21 قسماً إدارياً وطلابياً</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
              <div className="w-9 h-9 rounded-lg bg-[#EEF1FA] text-[#111A5E] flex items-center justify-center mb-2">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">70 صفحة</div>
              <div className="text-xs font-bold text-slate-800">ملف إنجاز المعلم الشامل</div>
              <div className="text-[11px] text-slate-500">يغطي 11 عنصر تقييم أداء وزاري</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
              <div className="w-9 h-9 rounded-lg bg-[#EEF1FA] text-[#111A5E] flex items-center justify-center mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">85 مقرراً</div>
              <div className="text-xs font-bold text-slate-800">توزيع المنهج والخطط الأسبوعية</div>
              <div className="text-[11px] text-slate-500">المرحلة الابتدائية للفصلين ١٤٤٨هـ</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
              <div className="w-9 h-9 rounded-lg bg-[#EEF1FA] text-[#111A5E] flex items-center justify-center mb-2">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">311 قالباً</div>
              <div className="text-xs font-bold text-slate-800">شواهد وتقارير جاهزة</div>
              <div className="text-[11px] text-slate-500">مع التوثيق الذكي ومكتبة الصور</div>
            </div>
          </div>
        </div>

        {/* How It Works Strip */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#080C3A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
              1
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">أدخل بيانات المدرسة أو المعلم مرة واحدة</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                تُحفظ بيانات الترويسة والأسماء تلقائياً وتنعكس فوراً في جميع السجلات والخطط والنماذج.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#080C3A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
              2
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">استعرض الأقسام وعدّل مباشرة في المعاينة</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                جميع النماذج والجداول مفتوحة للمعاينة والتجربة مع إمكانية تحرير النصوص داخل الورقة مباشرة.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#080C3A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
              3
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">اطبع بمقاس A4 الرسمي أو احفظ كملف PDF</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                تنسيق طباعة قياسي مضبوط الجداول والهوامش وجاهز للاعتماد والأرشفة المدرسية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Three Main Platform Sections (الأقسام الثلاثة الرئيسية للمنصة) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-xs font-bold text-[#111A5E]">هيكل المنصة الموحد</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              أقسام المنصة الثلاثة والخدمات المقدمة في كل قسم
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            اختر القسم المطلوب أو اضغط على أي خدمة فرعية للمعاينة الفورية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* SECTION 1: SCHOOL PORTAL */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#111A5E] transition-colors flex flex-col justify-between overflow-hidden shadow-xs">
            <div className="p-6 space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#080C3A] text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-[#C5D0F0]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#111A5E] block">القسم الأول</span>
                    <h3 className="text-lg font-black text-slate-900">قسم المدرسة</h3>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#EEF1FA] text-[#080C3A]">
                  21 قسماً · +120 نموذجاً
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                بوابة متكاملة لمدير المدرسة والوكلاء والموجه الطلابي والصحي واللجان، تضم السجلات والخطط والتعاميم وقواعد السلوك والمواظبة بترويسة المدرسة.
              </p>

              {/* Organized Sub-sections inside School Card for Quick Preview */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">
                  معاينة سريعة لمسارات قسم المدرسة:
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">1. الإدارة والخطط واللجان</span>
                      <span className="text-[10px] text-slate-500">9 أقسام</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "الإدارة والتعاميم", route: "admin-forms" as SchoolRoute },
                        { label: "خطط المدير والوكلاء", route: "plans" as SchoolRoute },
                        { label: "الصلاحيات والأداء", route: "authority" as SchoolRoute },
                        { label: "اللجان الرسمية", route: "committees" as SchoolRoute },
                        { label: "الوصف الوظيفي", route: "jobs" as SchoolRoute },
                        { label: "صانع الأغلفة", route: "cover-maker" as SchoolRoute }
                      ].map(item => (
                        <button
                          key={item.route}
                          type="button"
                          onClick={() => navigateToSchoolService(item.route)}
                          className="text-[11px] font-semibold bg-white hover:bg-[#EEF1FA] text-slate-700 hover:text-[#080C3A] border border-slate-200 hover:border-[#111A5E] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">2. شؤون الطلاب والسلوك والتوجيه</span>
                      <span className="text-[10px] text-slate-500">9 أقسام</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "قواعد السلوك", route: "rules" as SchoolRoute },
                        { label: "نماذج السلوك", route: "behavior" as SchoolRoute },
                        { label: "كشوف المتابعة", route: "followup" as SchoolRoute },
                        { label: "الغياب الشهري", route: "monthly-attendance" as SchoolRoute },
                        { label: "التوجيه الطلابي", route: "guidance" as SchoolRoute },
                        { label: "الموجه الصحي", route: "health" as SchoolRoute }
                      ].map(item => (
                        <button
                          key={item.route}
                          type="button"
                          onClick={() => navigateToSchoolService(item.route)}
                          className="text-[11px] font-semibold bg-white hover:bg-[#EEF1FA] text-slate-700 hover:text-[#080C3A] border border-slate-200 hover:border-[#111A5E] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">3. الأسرة والجودة والأمن والسلامة</span>
                      <span className="text-[10px] text-slate-500">3 أقسام</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "سجلات أولياء الأمور", route: "parents" as SchoolRoute },
                        { label: "الجودة والمتابعة", route: "quality" as SchoolRoute },
                        { label: "الأمن والسلامة والصندوق", route: "safety" as SchoolRoute }
                      ].map(item => (
                        <button
                          key={item.route}
                          type="button"
                          onClick={() => navigateToSchoolService(item.route)}
                          className="text-[11px] font-semibold bg-white hover:bg-[#EEF1FA] text-slate-700 hover:text-[#080C3A] border border-slate-200 hover:border-[#111A5E] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer CTA */}
            <div className="p-5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => navigateToSchoolService("settings")}
                className="text-xs font-semibold text-slate-600 hover:text-[#080C3A] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#111A5E]" />
                <span>إعدادات المدرسة</span>
              </button>

              <button
                type="button"
                onClick={() => navigateToSchoolService("home")}
                className="inline-flex items-center gap-2 bg-[#080C3A] hover:bg-[#06092B] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <span>تصفح ومعاينة قسم المدرسة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SECTION 2: TEACHER PORTAL */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#111A5E] transition-colors flex flex-col justify-between overflow-hidden shadow-xs">
            <div className="p-6 space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#111A5E] text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-[#C5D0F0]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#111A5E] block">القسم الثاني</span>
                    <h3 className="text-lg font-black text-slate-900">قسم المعلم</h3>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#EEF1FA] text-[#080C3A]">
                  ملف الإنجاز · التوزيع · الشواهد
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                بوابة شاملة للمعلمين والمعلمات لإعداد ملف الإنجاز المهني (70 صفحة)، وتوزيع المنهج والخطط الأسبوعية، وتوثيق شواهد الأداء الوظيفي الـ 11.
              </p>

              {/* Organized Sub-sections inside Teacher Card for Quick Preview */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">
                  معاينة سريعة لخدمات قسم المعلم:
                </div>

                {[
                  {
                    tab: "portfolio" as TeacherTab,
                    title: "ملف الإنجاز المهني الشامل (70 صفحة)",
                    desc: "8 فصول كاملة + 11 عنصر تقييم بالأوزان النسبية مع تحرير مباشر",
                    icon: FolderKanban,
                    badge: "70 صفحة"
                  },
                  {
                    tab: "curriculum" as TeacherTab,
                    title: "توزيع المنهج والخطط الأسبوعية ١٤٤٨هـ",
                    desc: "المرحلة الابتدائية (الصفوف 1–6) جميع المواد للفصلين (عادي ومفصل)",
                    icon: Layers,
                    badge: "85 مقرراً"
                  },
                  {
                    tab: "templates" as TeacherTab,
                    title: "قوالب تقارير شواهد الأداء الجاهزة",
                    desc: "قوالب مصاغة وجاهزة للطباعة في 6 تصنيفات تربوية",
                    icon: LayoutGrid,
                    badge: "311 قالباً"
                  },
                  {
                    tab: "smart-witness" as TeacherTab,
                    title: "منشئ التقارير الذكي + السجل العلاجي",
                    desc: "توثيق البرامج والأنشطة بالصوت والذكاء الاصطناعي والخطة العلاجية",
                    icon: Sparkles,
                    badge: "تفاعلي"
                  }
                ].map(service => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.tab}
                      type="button"
                      onClick={() => navigateToTeacherService(service.tab)}
                      className="w-full p-3 rounded-xl bg-[#F9FAFB] hover:bg-[#EEF1FA] border border-[#E5E7EB] hover:border-[#111A5E] text-right flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[#111A5E] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#080C3A] truncate">
                            {service.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {service.desc}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#080C3A] bg-white border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
                        {service.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Footer CTA */}
            <div className="p-5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenTeacherProfile) onOpenTeacherProfile();
                  else navigateToTeacherService("landing");
                }}
                className="text-xs font-semibold text-slate-600 hover:text-[#080C3A] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#111A5E]" />
                <span>بيانات المعلم</span>
              </button>

              <button
                type="button"
                onClick={() => navigateToTeacherService("landing")}
                className="inline-flex items-center gap-2 bg-[#111A5E] hover:bg-[#080C3A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <span>تصفح ومعاينة قسم المعلم</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SECTION 3: SUBSCRIPTION & ACTIVATION */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#111A5E] transition-colors flex flex-col justify-between overflow-hidden shadow-xs">
            <div className="p-6 space-y-5">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <KeyRound className="w-6 h-6 text-[#C5D0F0]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#111A5E] block">القسم الثالث</span>
                    <h3 className="text-lg font-black text-slate-900">قسم الاشتراك والتفعيل</h3>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#EEF1FA] text-[#080C3A]">
                  تفعيل فوري
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                استعرض تفاصيل باقة المدرسة الشاملة وباقة المعلم السنوية، أو أدخل كود الترخيص لتفعيل الطباعة الرسمية مباشرة بدون علامة مائية.
              </p>

              {/* Packages Summary inside Subscription Card */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">
                  الباقات السنوية المتاحة وحالة التفعيل:
                </div>

                {/* School Package Box */}
                <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">باقة المدرسة المتكاملة</span>
                    <span className="text-xs font-black text-[#080C3A] bg-[#EEF1FA] px-2.5 py-0.5 rounded-md tabular-nums">
                      129 ريال (سنة) / 59 ريال (فصل)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    تشمل جميع الأقسام الـ 21 وأكثر من 120 نموذجاً وسجلاً وخطط المدير والوكلاء بترويسة المدرسة بدون علامة مائية.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">
                      الحالة الحالية:{" "}
                      <strong className={isSchoolSubscribed ? "text-[#080C3A]" : "text-amber-700"}>
                        {isSchoolSubscribed ? "مفعّل رسمياً" : "معاينة مجانية"}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPortal("subscription")}
                      className="font-bold text-[#111A5E] hover:underline cursor-pointer"
                    >
                      تفعيل ترخيص المدرسة ←
                    </button>
                  </div>
                </div>

                {/* Teacher Package Box */}
                <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">باقة المعلم الشاملة</span>
                    <span className="text-xs font-black text-[#080C3A] bg-[#EEF1FA] px-2.5 py-0.5 rounded-md tabular-nums">
                      90 ريال (سنة) / 49 ريال (فصل)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    تشمل ملف الإنجاز (70 صفحة)، توزيع المنهج والخطط الأسبوعية، الـ 311 قالب شاهد، والتقارير الذكية بدون علامة مائية.
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">
                      الحالة الحالية:{" "}
                      <strong className={isTeacherSubscribed ? "text-[#080C3A]" : "text-amber-700"}>
                        {isTeacherSubscribed ? "مفعّل رسمياً" : "معاينة مجانية"}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPortal("subscription")}
                      className="font-bold text-[#111A5E] hover:underline cursor-pointer"
                    >
                      تفعيل كود المعلم ←
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer CTA */}
            <div className="p-5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <a
                href={`https://wa.me/${KHADAMATI_CONFIG.waNumber}?text=${encodeURIComponent(
                  "السلام عليكم، أرغب في الاستفسار عن باقات الاشتراك في منصة زيد الرقمية"
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-slate-600 hover:text-[#080C3A] inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#111A5E]" />
                <span>تواصل عبر واتساب</span>
              </a>

              <button
                type="button"
                onClick={() => setPortal("subscription")}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <span>فتح قسم الاشتراك والتفعيل</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PlatformSubscriptionSection() {
  const {
    schoolSettings,
    updateSchoolSettings,
    isSchoolSubscribed,
    schoolExpiresAt,
    activateSchoolLicense,
    resetSchoolLicense,
    teacherProfile,
    isTeacherSubscribed,
    teacherExpiresAt,
    activateTeacherLicense,
    resetTeacherLicense,
    setPortal,
    setSchoolRoute,
    setTeacherTab
  } = usePlatform();

  const [schoolSlug, setSchoolSlug] = useState(schoolSettings.slug || "");
  const [schoolCode, setSchoolCode] = useState(schoolSettings.code || "");
  const [schoolMsg, setSchoolMsg] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: ""
  });

  const [teacherCode, setTeacherCode] = useState(teacherProfile.code || "");
  const [teacherMsg, setTeacherMsg] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: ""
  });

  const handleActivateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({ slug: schoolSlug, code: schoolCode });
    const res = activateSchoolLicense(schoolSlug, schoolCode);
    setSchoolMsg({
      text: res.message,
      type: res.ok ? "success" : "error"
    });
  };

  const handleActivateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const res = activateTeacherLicense(teacherCode);
    setTeacherMsg({
      text: res.message,
      type: res.ok ? "success" : "error"
    });
  };

  const schoolWhatsappUrl = `https://wa.me/${KHADAMATI_CONFIG.waNumber}?text=${encodeURIComponent(
    `السلام عليكم، أرغب في الاشتراك في باقة المدرسة الشاملة (${KHADAMATI_CONFIG.schoolPrice} ريال) في منصة زيد الرقمية.\nاسم المدرسة: ${
      schoolSettings.schoolName || "—"
    }`
  )}`;

  const teacherWhatsappUrl = `https://wa.me/${TEACHER_CONFIG.waNumber}?text=${encodeURIComponent(
    `السلام عليكم، أرغب في الاشتراك في باقة المعلم الشاملة (${TEACHER_CONFIG.price} ريال) في منصة زيد الرقمية.\nاسم المعلم/ة: ${
      teacherProfile.name || "—"
    }`
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right" dir="rtl">
      {/* Section Header */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#080C3A] bg-[#EEF1FA] px-3 py-1 rounded-lg">
            <KeyRound className="w-4 h-4 text-[#111A5E]" />
            <span>قسم الاشتراك والتفعيل الفوري</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            باقات الاشتراك وتفعيل التراخيص في منصة زيد الرقمية
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            جميع أقسام المنصة متاحة للمعاينة والتجربة المجانية. عند تفعيل كود الاشتراك تتم إزالة العلامة المائية التجريبية فوراً من جميع المطبوعات وملفات PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setPortal("overview")}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-[#D1D5DB] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <span>العودة للرئيسية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Two Main Columns: School Subscription & Teacher Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 1. School Package & Activation */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#080C3A] text-white flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-[#C5D0F0]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111A5E]">تراخيص المدارس</span>
                <h2 className="text-xl font-black text-slate-900">باقة المدرسة المتكاملة</h2>
              </div>
            </div>
            <div className="text-left space-y-0.5">
              <div className="text-lg font-black text-[#080C3A] tabular-nums">
                129 ريال <span className="text-xs font-normal text-slate-500">/ سنة</span>
              </div>
              <div className="text-xs font-bold text-[#111A5E] tabular-nums">
                أو 59 ريال <span className="text-[10px] font-normal text-slate-500">/ فصل</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#111A5E] shrink-0" />
              <span>فتح كافة الأقسام الـ 21 وأكثر من 120 نموذجاً وسجلاً رسمياً بدون علامة مائية</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#111A5E] shrink-0" />
              <span>إدراج ترويسة المدرسة وأسماء المدير والوكلاء والموجهين تلقائياً في كل ورقة</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#111A5E] shrink-0" />
              <span>استيراد وحفظ قوائم الطلاب والطباعة الفردية أو الجماعية بمقاس A4</span>
            </li>
          </ul>

          {/* School Activation Form */}
          <form onSubmit={handleActivateSchool} className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">تفعيل كود ترخيص المدرسة</span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                  isSchoolSubscribed
                    ? "bg-[#EEF1FA] text-[#080C3A]"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {isSchoolSubscribed ? `مفعّل حتى ${schoolExpiresAt}` : "وضع المعاينة المجانية"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  معرّف المدرسة (Slug):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={schoolSlug}
                  onChange={e => setSchoolSlug(e.target.value)}
                  placeholder="مثال: andalus-boys"
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-mono text-left"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  كود تفعيل المدرسة:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={schoolCode}
                  onChange={e => setSchoolCode(e.target.value)}
                  placeholder="مثال: SCH-2026-XXXX"
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-mono text-left"
                />
              </div>
            </div>

            {schoolMsg.text && (
              <div
                className={`p-2.5 rounded-lg text-xs font-bold ${
                  schoolMsg.type === "success"
                    ? "bg-[#EEF1FA] text-[#080C3A] border border-[#C5D0F0]"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {schoolMsg.text}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-[#080C3A] hover:bg-[#06092B] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>تفعيل ترخيص المدرسة</span>
              </button>

              {isSchoolSubscribed && (
                <button
                  type="button"
                  onClick={() => {
                    resetSchoolLicense();
                    setSchoolMsg({ text: "تم إلغاء تفعيل ترخيص المدرسة على هذا الجهاز.", type: "error" });
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  إلغاء التفعيل
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <a
              href={schoolWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#111A5E] hover:bg-[#080C3A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب اشتراك مدرسة عبر واتساب</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setPortal("school");
                setSchoolRoute("home");
              }}
              className="text-xs font-bold text-slate-700 hover:text-[#080C3A] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>معاينة نماذج المدرسة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Teacher Package & Activation */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#111A5E] text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-[#C5D0F0]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111A5E]">تراخيص المعلمين والمعلمات</span>
                <h2 className="text-xl font-black text-slate-900">باقة المعلم الشاملة</h2>
              </div>
            </div>
            <div className="text-left space-y-0.5">
              <div className="text-lg font-black text-[#080C3A] tabular-nums">
                90 ريال <span className="text-xs font-normal text-slate-500">/ سنة</span>
              </div>
              <div className="text-xs font-bold text-[#111A5E] tabular-nums">
                أو 49 ريال <span className="text-[10px] font-normal text-slate-500">/ فصل</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#111A5E] shrink-0" />
              <span>طباعة ملف الإنجاز المهني الكامل (70 صفحة) بدون علامة مائية</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#111A5E] shrink-0" />
              <span>توزيع المنهج والخطط الأسبوعية لجميع مواد المرحلة الابتدائية ١٤٤٨هـ</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#111A5E] shrink-0" />
              <span>استخدام وطباعة الـ 311 قالب شاهد جاهز ومنشئ التقارير الذكي والسجل العلاجي</span>
            </li>
          </ul>

          {/* Teacher Activation Form */}
          <form onSubmit={handleActivateTeacher} className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">تفعيل كود اشتراك المعلم</span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                  isTeacherSubscribed
                    ? "bg-[#EEF1FA] text-[#080C3A]"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {isTeacherSubscribed ? `مفعّل حتى ${teacherExpiresAt}` : "وضع المعاينة المجانية"}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                كود تفعيل المعلم:
              </label>
              <input
                type="text"
                dir="ltr"
                value={teacherCode}
                onChange={e => setTeacherCode(e.target.value)}
                placeholder="مثال: TCH-2026-XXXX"
                className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-mono text-left"
              />
            </div>

            {teacherMsg.text && (
              <div
                className={`p-2.5 rounded-lg text-xs font-bold ${
                  teacherMsg.type === "success"
                    ? "bg-[#EEF1FA] text-[#080C3A] border border-[#C5D0F0]"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {teacherMsg.text}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-[#111A5E] hover:bg-[#080C3A] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>تفعيل كود المعلم</span>
              </button>

              {isTeacherSubscribed && (
                <button
                  type="button"
                  onClick={() => {
                    resetTeacherLicense();
                    setTeacherMsg({ text: "تم إلغاء تفعيل كود المعلم على هذا الجهاز.", type: "error" });
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  إلغاء التفعيل
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <a
              href={teacherWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#111A5E] hover:bg-[#080C3A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب اشتراك معلم عبر واتساب</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setPortal("teacher");
                setTeacherTab("landing");
              }}
              className="text-xs font-bold text-slate-700 hover:text-[#080C3A] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>معاينة خدمات المعلم</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
