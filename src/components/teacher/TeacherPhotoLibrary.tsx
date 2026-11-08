/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { FAWRN_PHOTO_LIBRARY_50, PhotoLibraryItem } from "../../data/fawrnPortfolio70";
import { Search, Image as ImageIcon, Eye, X, ArrowLeft, CheckCircle2 } from "lucide-react";

const PHOTO_CATEGORIES = [
  "الكل",
  "مبادرات مدرسية",
  "أيام عالمية",
  "استراتيجيات",
  "وسائل تعليمية"
] as const;

export function TeacherPhotoLibrary() {
  const { setTeacherTab, saveWitness, teacherProfile } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoomedItem, setZoomedItem] = useState<PhotoLibraryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return FAWRN_PHOTO_LIBRARY_50.filter(item => {
      const matchesCat = selectedCategory === "الكل" || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      return (
        item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleCreateReportWithPhoto = (item: PhotoLibraryItem) => {
    const newWitness = {
      id: "w-photo-" + Date.now(),
      title: item.title,
      formalTitle: item.title.startsWith("تقرير") ? item.title : `تقرير ${item.title}`,
      category: item.category,
      performanceStandard:
        item.category === "استراتيجيات"
          ? "التنويع في استراتيجيات التدريس (10%)"
          : item.category === "وسائل تعليمية"
          ? "توظيف تقنيات ووسائل التعلم المناسبة (10%)"
          : item.category === "أيام عالمية"
          ? "تهيئة بيئة تعليمية (5%)"
          : "أداء الواجبات الوظيفية (10%)",
      stage: teacherProfile.stage,
      subject: teacherProfile.subject,
      date: "1448/03/20 هـ",
      location: "القاعة الصفية / مرافق المدرسة",
      audience: "طلاب / طالبات المدرسة",
      beneficiariesCount: "30 مستفيداً",
      duration: "حصة دراسية كاملة",
      objectives: [
        `تحقيق الأهداف التربوية والتعليمية لـ (${item.title}).`,
        "تعزيز تفاعل المتعلمين وربط التعلم بالممارسات التطبيقية.",
        "توثيق الشواهد المصورة وفق معايير الأداء الوظيفي المعتمدة."
      ],
      summary: `تم تنفيذ (${item.title}) داخل البيئة المدرسية بمشاركة فاعلة من المتعلمين، وتوظيف الأدوات والوسائل المناسبة لتحقيق المخرجات التعليمية المستهدفة.`,
      outcomes: [
        "مشاركة إيجابية وتفاعل متميز من المتعلمين.",
        "تحقق الأهداف المرسومة وتوثيق الشاهد الفوتوغرافي."
      ],
      recommendations: ["الاستمرار في تفعيل النشاط وتعميم التجربة."],
      photos: [item.fallbackImage],
      xAccount: teacherProfile.xAccount || "@School_MOE",
      designId: teacherProfile.designId || "moe-1448",
      createdAt: new Date().toISOString()
    };

    saveWitness(newWitness);
    setToastMessage(`تم إنشاء وحفظ تقرير «${item.title}» بالصورة المختارة في تقاريرك المحفوظة!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right" dir="rtl">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-emerald-700">مكتبة شواهد مصورة جاهزة للإدراج الفوري</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              مكتبة صور الشواهد الجاهزة (50 نموذجاً مصوراً)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              تصفح 50 نموذجاً توضيحياً مصنفاً في 4 فئات (مبادرات مدرسية، أيام عالمية، استراتيجيات، وسائل تعليمية) لإرفاقها مباشرة في تقاريرك أو ملف إنجازك.
            </p>
          </div>

          <button
            onClick={() => setTeacherTab("smart-witness")}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>الانتقال إلى منشئ التقارير الذكي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setTeacherTab("my-witnesses")}
              className="underline text-emerald-800 hover:text-emerald-950 cursor-pointer whitespace-nowrap"
            >
              عرض في تقاريري ←
            </button>
          </div>
        )}

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {PHOTO_CATEGORIES.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[240px] sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث في الـ 50 صورة..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Grid of 50 Photo Samples */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 overflow-hidden flex flex-col justify-between transition-all hover:shadow-sm group"
          >
            <div>
              <div
                onClick={() => setZoomedItem(item)}
                className="aspect-[4/3] w-full bg-slate-100 overflow-hidden cursor-pointer relative"
              >
                <img
                  src={item.fallbackImage}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="p-3.5 space-y-1">
                <div className="text-[11px] text-slate-500">
                  <span>{item.category}</span>
                  <span> · </span>
                  <span className="tabular-nums">نموذج {item.number}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setZoomedItem(item)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>تكبير</span>
              </button>

              <button
                type="button"
                onClick={() => handleCreateReportWithPhoto(item)}
                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span>إنشاء تقرير بالصورة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Modal */}
      {zoomedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setZoomedItem(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-right"
            dir="rtl"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-emerald-300">
                  {zoomedItem.category} · نموذج ({zoomedItem.number})
                </div>
                <h3 className="text-sm font-black text-white">{zoomedItem.title}</h3>
              </div>
              <button
                onClick={() => setZoomedItem(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 bg-slate-50 flex justify-center">
              <img
                src={zoomedItem.fallbackImage}
                alt={zoomedItem.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[60vh] object-contain rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setZoomedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  const item = zoomedItem;
                  setZoomedItem(null);
                  handleCreateReportWithPhoto(item);
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
              >
                <span>اعتماد الصورة وإنشاء تقرير شاهد</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
