/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePlatform } from "../../context/PlatformContext";
import {
  FAWRN_311_TEMPLATES,
  FAWRN_TEMPLATE_CATEGORIES
} from "../../data/fawrnTemplatesCatalog";
import { ELEVEN_EVALUATION_ELEMENTS } from "../../data/fawrnPortfolio70";
import { TEACHER_CONFIG } from "../../data/teacherData";
import {
  FolderKanban,
  Sparkles,
  LayoutGrid,
  Image as ImageIcon,
  ClipboardCheck,
  Bookmark,
  User,
  ArrowLeft,
  CheckCircle2,
  Mic,
  FileText,
  HelpCircle,
  Layers
} from "lucide-react";

interface Props {
  onOpenProfile?: () => void;
}

export function TeacherLanding({ onOpenProfile }: Props) {
  const {
    setTeacherTab,
    openTemplateInBuilder,
    openSubscriptionModal,
    teacherProfile,
    savedWitnesses
  } = usePlatform();

  const mainChoices = [
    {
      id: "portfolio-choice",
      title: "أبغى ملف إنجاز كامل (70 صفحة)",
      subtitle: "ملف إنجاز المعلم الشامل (8 فصول + 11 عنصر تقييم بالأوزان) أو الملف السريع المختصر",
      meta: "70 صفحة رسمية · 8 فصول · 11 عنصر أداء وزاري",
      icon: FolderKanban,
      actionLabel: "فتح ملف الإنجاز الشامل",
      onClick: () => setTeacherTab("portfolio"),
      primary: true
    },
    {
      id: "curriculum-choice",
      title: "توزيع المنهج والخطط الأسبوعية — المرحلة الابتدائية ١٤٤٨هـ",
      subtitle: "توزيع جميع مواد الصفوف (الأول إلى السادس الابتدائي) للفصلين الأول والثاني بالتقويم العام والغربية مع الخطة الأسبوعية",
      meta: "6 صفوف · 85 مقرراً · توزيع عادي ومفصل وخطة أسبوعية",
      icon: Layers,
      actionLabel: "فتح توزيع المنهج والخطط الأسبوعية",
      onClick: () => setTeacherTab("curriculum"),
      primary: false
    },
    {
      id: "smart-report-choice",
      title: "أبغى تقرير عن نشاط / عمل (بالذكاء الاصطناعي والصوت)",
      subtitle: "منشئ تقارير من 3 خطوات يدعم الإملاء الصوتي المباشر وتوليد الأهداف والوصف والمخرجات",
      meta: "إملاء صوتي · صياغة Gemini · قالب وزارة التعليم 1448هـ",
      icon: Sparkles,
      actionLabel: "إنشاء تقرير ذكي الآن",
      onClick: () => setTeacherTab("smart-witness"),
      primary: false
    },
    {
      id: "templates-choice",
      title: "أبغى من قوالب تقارير شواهد الأداء الجاهزة (311 قالب)",
      subtitle: "قوالب جاهزة ومصاغة بالكامل في 6 فئات مع سجل الخطة العلاجية والإثرائية التفاعلي",
      meta: "35 مبادرة · 82 يوم عالمي · 28 برنامج تقني · 45 استراتيجية · 120 إدارة صفية",
      icon: LayoutGrid,
      actionLabel: "استعراض الـ 311 قالباً",
      onClick: () => setTeacherTab("templates"),
      primary: false
    },
    {
      id: "photo-library-choice",
      title: "أبغى صورة شاهد جاهزة (مكتبة 50 نموذجاً)",
      subtitle: "مكتبة صور شواهد تعليمية مصنفة جاهزة للإدراج الفوري في تقاريرك وملف إنجازك",
      meta: "50 نموذجاً مصوراً · 4 فئات · إدراج بضغطة زر",
      icon: ImageIcon,
      actionLabel: "فتح مكتبة صور الشواهد",
      onClick: () => setTeacherTab("photo-library"),
      primary: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-right" dir="rtl">
      {/* Main DGA Service Header & "وش ودّك تجهّز اليوم؟" Dashboard */}
      <section className="rounded-xl bg-white border border-[#E5E7EB] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#E5E7EB] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111A5E]">
              <span>بوابة المعلم وشواهد الأداء الوظيفي</span>
              <span>·</span>
              <span>نماذج وزارة التعليم المعتمدة 1447-1448هـ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              مرحبًا أ. {teacherProfile.name.split(" ")[0]}، اختر الخدمة المطلوبة لتجهيز ملفك وشواهدك
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              تُدرج بياناتك المهنية وبيانات مدرستك ({teacherProfile.school}) تلقائياً في جميع صفحات ملف الإنجاز الـ 70 وتوزيع المنهج والخطط الأسبوعية وقوالب الشواهد الـ 311 بمقاس A4 الرسمي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setTeacherTab("curriculum")}
              className="inline-flex items-center gap-2 bg-[#080C3A] hover:bg-[#06092B] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-4 h-4 text-[#C5D0F0]" />
              <span>توزيع المنهج والخطط الأسبوعية</span>
            </button>

            <button
              onClick={() => setTeacherTab("remedial-register")}
              className="inline-flex items-center gap-2 bg-[#111A5E] hover:bg-[#080C3A] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>سجل الخطة العلاجية والإثرائية</span>
            </button>

            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#EEF1FA] text-slate-800 hover:text-[#080C3A] border border-[#D1D5DB] hover:border-[#111A5E] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <User className="w-4 h-4 text-[#111A5E]" />
                <span>تحديث بياناتي والترويسة</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Main DGA Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainChoices.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.onClick}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-colors cursor-pointer group ${
                  card.primary
                    ? "bg-[#080C3A] text-white border-[#080C3A] hover:bg-[#06092B]"
                    : "bg-white text-slate-900 border-[#E5E7EB] hover:border-[#111A5E]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        card.primary
                          ? "bg-white/10 text-[#C5D0F0]"
                          : "bg-[#EEF1FA] text-[#111A5E]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        card.primary ? "text-[#C5D0F0]" : "text-slate-500"
                      }`}
                    >
                      {card.meta}
                    </span>
                  </div>

                  <h2
                    className={`text-lg font-bold ${
                      card.primary ? "text-white" : "text-slate-900 group-hover:text-[#111A5E]"
                    }`}
                  >
                    {card.title}
                  </h2>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      card.primary ? "text-emerald-100" : "text-slate-600"
                    }`}
                  >
                    {card.subtitle}
                  </p>
                </div>

                <div
                  className={`mt-5 pt-3.5 border-t flex items-center justify-between ${
                    card.primary ? "border-white/15" : "border-slate-100"
                  }`}
                >
                  <span
                    className={`text-xs font-bold inline-flex items-center gap-1.5 ${
                      card.primary ? "text-[#C5D0F0]" : "text-[#111A5E]"
                    }`}
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom 3 Quick Access Links + Remedial Register */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => setTeacherTab("my-witnesses")}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors cursor-pointer text-right"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">تقاريري المحفوظة</div>
                <div className="text-[11px] text-slate-500 tabular-nums">{savedWitnesses.length} تقارير جاهزة</div>
              </div>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setTeacherTab("photo-library")}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors cursor-pointer text-right"
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">مكتبة صور الشواهد</div>
                <div className="text-[11px] text-slate-500 tabular-nums">50 نموذجاً مصوراً</div>
              </div>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => setTeacherTab("remedial-register")}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors cursor-pointer text-right"
          >
            <div className="flex items-center gap-2.5">
              <ClipboardCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">الخطة العلاجية والإثرائية</div>
                <div className="text-[11px] text-slate-500">سجل تفاعلي وقياس أثر</div>
              </div>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => (onOpenProfile ? onOpenProfile() : setTeacherTab("portfolio"))}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors cursor-pointer text-right"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-900">بياناتي والترويسة</div>
                <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{teacherProfile.school}</div>
              </div>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </section>

      {/* Overview of the 6 Categories of the 311 Templates */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-bold text-emerald-700">قوالب جاهزة بلا كتابة</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              كتالوج قوالب شواهد الأداء الجاهزة (311 قالباً في 6 تصنيفات)
            </h2>
          </div>
          <button
            onClick={() => setTeacherTab("templates")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer whitespace-nowrap"
          >
            <span>تصفح جميع الـ 311 قالباً</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Category Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FAWRN_TEMPLATE_CATEGORIES.filter(c => c.id !== "all").map(cat => (
            <button
              key={cat.id}
              onClick={() => setTeacherTab("templates")}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-white text-right transition-all cursor-pointer group"
            >
              <div className="text-2xl font-black text-emerald-700 tabular-nums group-hover:scale-105 transition-transform">
                {cat.count}
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">{cat.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">قالب جاهز للطباعة</div>
            </button>
          ))}
        </div>

        {/* Sample Featured Templates from the 311 Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {FAWRN_311_TEMPLATES.slice(0, 6).map(tpl => (
            <div
              key={tpl.slug}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white flex flex-col justify-between gap-4 transition-all"
            >
              <div className="space-y-1.5">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span>{tpl.category}</span>
                  <span>·</span>
                  <span>{tpl.performanceStandard}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900">{tpl.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {tpl.fields.find(f => f.key === "Objectives" || f.key === "InitiativeIdea")?.value ||
                    tpl.fields[0]?.value}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {tpl.fields.length} حقول معبأة تلقائياً
                </span>
                <button
                  onClick={() => openTemplateInBuilder(tpl.slug)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <span>فتح وتخصيص القالب</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Overview of the 11 Official Evaluation Criteria in the 70-Page Portfolio */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-bold text-emerald-700">الفصل الثاني من ملف الإنجاز (الصفحات 14 – 35)</p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              عناصر تقييم الأداء الوظيفي الـ 11 المعتمدة وأوزانها النسبية (100%)
            </h2>
          </div>
          <button
            onClick={() => setTeacherTab("portfolio")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer whitespace-nowrap"
          >
            <span>فتح ملف الإنجاز (70 صفحة)</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ELEVEN_EVALUATION_ELEMENTS.map(elem => (
            <button
              key={elem.id}
              onClick={() => setTeacherTab("portfolio")}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-white text-right flex items-start justify-between gap-3 transition-all cursor-pointer"
            >
              <div className="space-y-1">
                <div className="text-xs font-black text-slate-900">
                  {elem.number}. {elem.title}
                </div>
                <div className="text-[11px] text-slate-500">
                  صفحة التفصيل ({elem.detailPage}) · صفحة الشواهد ({elem.evidencePage})
                </div>
              </div>
              <span className="text-xs font-black text-emerald-800 tabular-nums shrink-0">
                {elem.weight}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
