/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { usePlatform } from "../../context/PlatformContext";
import {
  FAWRN_311_TEMPLATES,
  FAWRN_TEMPLATE_CATEGORIES,
  FawrnReadyTemplate
} from "../../data/fawrnTemplatesCatalog";
import {
  Search,
  LayoutGrid,
  ArrowLeft,
  Eye,
  X,
  ClipboardCheck,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export function TeacherTemplates() {
  const { openTemplateInBuilder, setTeacherTab } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewTemplate, setPreviewTemplate] = useState<FawrnReadyTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return FAWRN_311_TEMPLATES.filter(tpl => {
      const matchesCat = selectedCategory === "all" || tpl.category === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        tpl.title.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q) ||
        tpl.performanceStandard.toLowerCase().includes(q) ||
        tpl.fields.some(f => f.value.toLowerCase().includes(q) || f.label.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right" dir="rtl">
      {/* Header & Remedial Register Callout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-emerald-700">قوالب جاهزة بلا كتابة — مصاغة وفق المعايير الوزارية</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              قوالب تقارير شواهد الأداء الجاهزة (311 قالباً)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              اختر أي قالب من القوالب الـ 311 الموزعة على 6 تصنيفات، وستجد الأهداف والإجراءات والمخرجات جاهزة ومرتبطة بعنصر تقييم الأداء الوظيفي مع إمكانية التعديل والطباعة الفورية بمقاس A4.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setTeacherTab("remedial-register")}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>سجل الخطة العلاجية والإثرائية</span>
            </button>
            <button
              onClick={() => setTeacherTab("smart-witness")}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>إنشاء تقرير مخصص بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Segmented Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {FAWRN_TEMPLATE_CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md tabular-nums ${
                      active ? "bg-emerald-950/50 text-emerald-100" : "bg-white text-slate-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] sm:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث في 311 قالباً (مبادرة، يوم عالمي، استراتيجية...)"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>
          يعرض الآن <b className="text-slate-900 tabular-nums">{filteredTemplates.length}</b> قالباً جاهزاً
          {selectedCategory !== "all" ? ` في تصنيف «${selectedCategory}»` : ""}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-emerald-700 hover:underline font-bold cursor-pointer"
          >
            إعادة تعيين البحث
          </button>
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <LayoutGrid className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-slate-900">لا توجد قوالب مطابقة لعبارة البحث</h3>
          <p className="text-xs text-slate-500">جرّب البحث بكلمة أخرى أو اختر «جميع القوالب» لاستعراض الـ 311 قالباً.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            عرض كافة الـ 311 قالباً
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(tpl => {
            const firstSummary =
              tpl.fields.find(f => f.key === "Objectives" || f.key === "InitiativeIdea" || f.key === "Activities")
                ?.value ||
              tpl.fields[0]?.value ||
              "";

            return (
              <div
                key={tpl.slug}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-sm"
              >
                <div className="space-y-2">
                  {/* Unboxed clean metadata per design guidelines */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-emerald-700">{tpl.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{tpl.performanceStandard}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {tpl.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {firstSummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(tpl)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>معاينة الحقول ({tpl.fields.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openTemplateInBuilder(tpl.slug)}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>فتح وإصدار التقرير</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Template Quick Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-right"
            dir="rtl"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <div className="text-[11px] text-emerald-300 font-semibold">
                  {previewTemplate.category} · {previewTemplate.performanceStandard}
                </div>
                <h3 className="text-base font-black text-white mt-0.5">{previewTemplate.title}</h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>جميع الحقول التالية معبأة مسبقاً وقابلة للتعديل والطباعة الفورية بمقاس A4:</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {previewTemplate.fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1"
                  >
                    <div className="text-xs font-black text-emerald-800">{field.label}</div>
                    <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  const slug = previewTemplate.slug;
                  setPreviewTemplate(null);
                  openTemplateInBuilder(slug);
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                <span>فتح القالب في المحرر وإصدار التقرير</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
