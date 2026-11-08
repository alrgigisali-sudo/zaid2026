/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { usePlatform, SchoolRoute } from "../../context/PlatformContext";
import { KHADAMATI_CONFIG } from "../../data/schoolModels";
import { Search, Settings, ArrowLeft, School, GraduationCap, Sparkles, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

interface Tile {
  route: SchoolRoute;
  title: string;
  badge?: string;
  text: string;
}

interface Group {
  name: string;
  tiles: Tile[];
}

export const SCHOOL_GROUPS: Group[] = [
  {
    name: "الإدارة المدرسية",
    tiles: [
      {
        route: "admin-forms",
        title: "الإدارة والتعاميم",
        text: "خطاب رسمي، وتعميم مع بيان الاطلاع، وتكليف معلم، وقبول طالب، والتزام سلوكي، وتأمين حصص، وتقرير برنامج."
      },
      {
        route: "authority",
        title: "الصلاحيات والتكليفات والأداء",
        badge: "جديد",
        text: "قرارات التفويض والتكليف، ونماذج نظام فارس، وسجل التكليفات، وبطاقات تقويم الأداء الوظيفي."
      },
      {
        route: "plans",
        title: "الخطط",
        text: "خطط عمل المدير والوكلاء الثلاثة، أفقية التنسيق، مع متابعة أسبوعية مولّدة تلقائيًا للفصل الأول."
      },
      {
        route: "readiness",
        title: "الاستعداد والأسبوع التمهيدي",
        badge: "جديد",
        text: "ملف الاستعداد للعام الدراسي حسب المسؤوليات، وملف الأسبوع التمهيدي للصف الأول."
      },
      {
        route: "registers",
        title: "سجلات الوكلاء والدليل الإجرائي",
        badge: "جديد",
        text: "استئذان الطلاب والموظفين، وكشف الحضور، ومتابعة السجلات وفهرسها، ونماذج الدليل الإجرائي."
      },
      {
        route: "committees",
        title: "اللجان وفرق العمل الرسمية",
        badge: "جديد",
        text: "تشكيل ومهام اللجنة الإدارية والتوجيه والتحصيل والتميز، وفرق الصندوق والأمن والسلامة وذوي الإعاقة."
      },
      {
        route: "jobs",
        title: "الوصف الوظيفي لمنسوبي المدرسة",
        badge: "جديد",
        text: "بطاقات الوصف الوظيفي الرسمية للمدير والوكلاء والمعلم والموجهين ورائد النشاط من الدليل التنظيمي 1446هـ."
      },
      {
        route: "staff",
        title: "اللجان والموظفون",
        text: "قرارات اللجان ومحاضرها وخططها، وبطاقات الموظفين، والاستئذان والمساءلة والحسم، والنمو المهني."
      },
      {
        route: "cover-maker",
        title: "صانع غلاف السجلات",
        badge: "جديد",
        text: "اصنع غلاف أي سجل بثلاثة تصاميم، بترويسة مدرستك وتوقيعين اختياريين."
      }
    ]
  },
  {
    name: "شؤون الطلاب والسلوك",
    tiles: [
      {
        route: "rules",
        title: "قواعد السلوك والمواظبة وإجراءاتها",
        badge: "جديد",
        text: "الدليل الخامس: المخالفات حسب المرحلة والدرجة والتكرار مع الإجراءات والنماذج المرتبطة، والمواظبة والغياب."
      },
      {
        route: "behavior",
        title: "نماذج السلوك والمواظبة",
        badge: "تفاعلي",
        text: "اختر النموذج، واطبعه باسم الطالب أو مفرغًا للتعبئة اليدوية."
      },
      {
        route: "discipline",
        title: "الانضباط وتعزيز السلوك والأزمات",
        badge: "جديد",
        text: "خطة الانضباط، وتعزيز السلوك الإيجابي وقياس الأثر، وإدارة الأزمات والمخاطر."
      },
      {
        route: "followup",
        title: "كشوف متابعة الطلاب",
        text: "كشوف المواد الدراسية بدرجات المشاركة والمهام والواجبات والتقويمات."
      },
      {
        route: "monthly-attendance",
        title: "كشف الغياب الشهري",
        text: "كشف يومي على مستوى الشهر مرتبط بقوائم الطلاب والفصول المحفوظة."
      },
      {
        route: "guidance",
        title: "التوجيه الطلابي",
        text: "الخطة العامة، والجلسات، ودراسة الحالة، وحصر الحالات والغياب، والتواصل مع الأسرة."
      },
      {
        route: "health",
        title: "الموجه الصحي",
        text: "التكليف والخطة واللجنة، وسجل الحالات الصحية والعيادة، ومتابعة البيئة المدرسية."
      },
      {
        route: "gifted",
        title: "سجل معلم الموهوبين",
        badge: "جديد",
        text: "اللجنة والخطة والترشيح وبطاقة الطالب الموهوب وبرامج موهبة وإبداع وأذكى."
      },
      {
        route: "kindergarten",
        title: "نماذج وسجلات رياض الأطفال",
        badge: "جديد",
        text: "بطاقة الطفل والحضور وملاحظة النمو والخطة الأسبوعية والتقارير."
      }
    ]
  },
  {
    name: "الأسرة والجودة والسلامة",
    tiles: [
      {
        route: "parents",
        title: "سجلات أولياء الأمور",
        text: "الزيارات والتواصل، ومجلس أولياء الأمور، والشراكة الأسرية والمجتمعية."
      },
      {
        route: "quality",
        title: "الجودة والمتابعة",
        text: "تبادل الزيارات، ومتابعة الدروس، واستمارات رضا المستفيد، والتقويم الذاتي."
      },
      {
        route: "safety",
        title: "الأمن والسلامة والصندوق",
        text: "خطة السلامة وتجربة الإخلاء وتقييم المخاطر، وحماية الحقوق، والصندوق المدرسي."
      }
    ]
  }
];

export function SchoolHome() {
  const { setSchoolRoute, setPortal, schoolSettings } = usePlatform();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>("all");

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim();
    const baseGroups =
      activeGroupFilter === "all"
        ? SCHOOL_GROUPS
        : SCHOOL_GROUPS.filter(g => g.name === activeGroupFilter);

    if (!term) return baseGroups;

    return baseGroups
      .map(group => ({
        ...group,
        tiles: group.tiles.filter(tile => (tile.title + tile.text).includes(term))
      }))
      .filter(group => group.tiles.length > 0);
  }, [searchTerm, activeGroupFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-right" dir="rtl">
      {/* School Section Header Card */}
      <section className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111A5E]">
              <span>قسم المدرسة</span>
              <span>·</span>
              <span>إصدار العام الدراسي 1446-1447هـ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              دليل الخدمات والنماذج والسجلات المدرسية المعتمدة
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              تُدرج بيانات مدرستك ({schoolSettings.schoolName || "لم يتم تسمية المدرسة بعد"}) تلقائياً في ترويسة كافة النماذج والسجلات، مع إمكانية اختيار اسم الطالب والطباعة المباشرة بمقاس A4 الرسمي أو الحفظ كملف PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setSchoolRoute("settings")}
              className="inline-flex items-center gap-2 bg-[#111A5E] hover:bg-[#080C3A] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>{schoolSettings.schoolName ? "تعديل إعدادات المدرسة" : "إعداد بيانات المدرسة"}</span>
            </button>

            <button
              onClick={() => setPortal("subscription")}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EEF1FA] text-slate-800 hover:text-[#080C3A] border border-[#D1D5DB] hover:border-[#111A5E] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#111A5E]" />
              <span>قسم الاشتراك والتفعيل</span>
            </button>
          </div>
        </div>

        {/* Integrated Search Bar + Category Filter Tabs for Easy Preview */}
        <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ابحث عن خدمة أو نموذج أو سجل (مثال: استئذان، لجنة، خطة، سلوك، موجه صحي)..."
                className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg py-2.5 pr-10 pl-14 text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#111A5E] m-0"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 tabular-nums">
              <span>21 قسماً رئيسياً</span>
              <span>·</span>
              <span>أكثر من 120 نموذجاً وسجلاً رسمياً</span>
              <span>·</span>
              <button
                onClick={() => setPortal("teacher")}
                className="font-bold text-[#111A5E] hover:text-[#080C3A] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>الانتقال لقسم المعلم</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "جميع الأقسام (21)" },
              ...SCHOOL_GROUPS.map(g => ({
                id: g.name,
                label: `${g.name} (${g.tiles.length})`
              }))
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveGroupFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeGroupFilter === tab.id
                    ? "bg-[#080C3A] text-white"
                    : "bg-[#F9FAFB] text-slate-700 hover:bg-[#EEF1FA] hover:text-[#080C3A] border border-[#E5E7EB]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Service Directory Groups */}
      <div className="space-y-8">
        {filteredGroups.map(group => (
          <section key={group.name} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
              <h2 className="text-lg font-bold text-slate-900">
                {group.name}
              </h2>
              <span className="text-xs text-slate-500 tabular-nums">
                {group.tiles.length} أقسام جاهزة للمعاينة والطباعة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.tiles.map(tile => (
                <button
                  key={tile.route}
                  onClick={() => setSchoolRoute(tile.route)}
                  className="bg-white border border-[#E5E7EB] hover:border-[#111A5E] rounded-xl p-5 text-right flex flex-col justify-between transition-colors group cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EEF1FA] text-[#111A5E] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      {tile.badge && (
                        <span className="text-[11px] font-semibold text-[#080C3A] bg-[#EEF1FA] px-2 py-0.5 rounded-md">
                          {tile.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#111A5E] transition-colors">
                      {tile.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {tile.text}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#111A5E]">
                    <span>معاينة النماذج والسجلات</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
            <p className="text-slate-600 font-semibold text-sm">
              لا توجد خدمات أو نماذج مطابقة لبحثك. جرّب كتابة كلمة أخرى.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
