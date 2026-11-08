/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { usePlatform } from "../../context/PlatformContext";
import {
  PORTFOLIO_70_PAGES,
  PORTFOLIO_CHAPTERS,
  ELEVEN_EVALUATION_ELEMENTS,
  FAWRN_PHOTO_LIBRARY_50,
  PortfolioPageDef
} from "../../data/fawrnPortfolio70";
import { DESIGN_THEMES } from "../../data/teacherData";
import { PrintAndPdfActions } from "../common/PrintAndPdfActions";
import { SheetContainer } from "../common/SheetContainer";
import { PlatformWatermark } from "../common/PlatformLogo";
import {
  User,
  ChevronRight,
  ChevronLeft,
  FolderKanban,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface Props {
  onOpenProfile: () => void;
}

export function TeacherPortfolio({ onOpenProfile }: Props) {
  const { teacherProfile, isTeacherSubscribed, savedWitnesses, setTeacherTab } =
    usePlatform();

  const [portfolioMode, setPortfolioMode] = useState<"full-70" | "quick">("full-70");
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [activeThemeId, setActiveThemeId] = useState<string>(
    teacherProfile.designId || "moe-1448"
  );

  // Custom evidence photos per pageNumber
  const [pageCustomPhotos, setPageCustomPhotos] = useState<Record<number, string[]>>({});
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState<boolean>(false);

  const visiblePages = useMemo(() => {
    let list = PORTFOLIO_70_PAGES;
    if (portfolioMode === "quick") {
      list = list.filter(p => p.isQuickModeIncluded);
    }
    if (selectedChapter !== "all") {
      list = list.filter(p => p.chapterNumber === selectedChapter);
    }
    return list.length > 0 ? list : PORTFOLIO_70_PAGES;
  }, [portfolioMode, selectedChapter]);

  const currentPage: PortfolioPageDef =
    PORTFOLIO_70_PAGES.find(p => p.pageNumber === currentPageNum) ||
    visiblePages[0] ||
    PORTFOLIO_70_PAGES[0];

  const currentIndexInVisible = visiblePages.findIndex(
    p => p.pageNumber === currentPage.pageNumber
  );

  const goPrev = () => {
    if (currentIndexInVisible > 0) {
      setCurrentPageNum(visiblePages[currentIndexInVisible - 1].pageNumber);
    }
  };

  const goNext = () => {
    if (currentIndexInVisible >= 0 && currentIndexInVisible < visiblePages.length - 1) {
      setCurrentPageNum(visiblePages[currentIndexInVisible + 1].pageNumber);
    }
  };

  const activeTheme =
    DESIGN_THEMES.find(t => t.id === activeThemeId) || DESIGN_THEMES[0];

  const activeElement = currentPage.elementNumber
    ? ELEVEN_EVALUATION_ELEMENTS.find(e => e.number === currentPage.elementNumber)
    : undefined;

  // Determine 2 photos for any evidence page
  const getEvidencePhotosForPage = (page: PortfolioPageDef): string[] => {
    if (pageCustomPhotos[page.pageNumber]?.length) {
      return pageCustomPhotos[page.pageNumber];
    }
    const idx1 = (page.pageNumber * 2) % FAWRN_PHOTO_LIBRARY_50.length;
    const idx2 = (page.pageNumber * 2 + 1) % FAWRN_PHOTO_LIBRARY_50.length;
    return [
      FAWRN_PHOTO_LIBRARY_50[idx1].fallbackImage,
      FAWRN_PHOTO_LIBRARY_50[idx2].fallbackImage
    ];
  };

  const handleAssignLibraryPhoto = (url: string) => {
    setPageCustomPhotos(prev => {
      const existing = prev[currentPage.pageNumber] || getEvidencePhotosForPage(currentPage);
      return {
        ...prev,
        [currentPage.pageNumber]: [url, existing[0]]
      };
    });
    setIsPhotoPickerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 text-right overflow-x-hidden" dir="rtl">
      {/* Top Control Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4 sm:space-y-5 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <p className="text-[11px] sm:text-xs font-bold text-emerald-700">
              ملف إنجاز المعلم وفق عناصر تقييم الأداء الوظيفي الـ 11 (8 فصول · 70 صفحة رسمية)
            </p>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900">
              ملف الإنجاز المهني الشامل (صفحة {currentPage.pageNumber} من 70)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              يمكنك التبديل بين «الملف الشامل (70 صفحة)» و«الملف السريع المختصر»، وتعديل أي نص مباشرة داخل الورقة قبل الطباعة أو الحفظ بصيغة PDF.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 flex-wrap">
            {/* Mode Switch: Full 70 vs Quick */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setPortfolioMode("full-70");
                  setSelectedChapter("all");
                }}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  portfolioMode === "full-70"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                الملف الشامل (70 صفحة)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPortfolioMode("quick");
                  setSelectedChapter("all");
                  setCurrentPageNum(1);
                }}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  portfolioMode === "quick"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                الملف السريع المختصر
              </button>
            </div>

            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span>بياناتي</span>
            </button>

            <PrintAndPdfActions
              landscape={false}
              printLabel="طباعة الصفحة (A4)"
              pdfLabel="حفظ PDF"
              documentTitle={`ملف الإنجاز - ص${currentPage.pageNumber} - ${currentPage.title}`}
              variant="teacher"
            />
          </div>
        </div>

        {/* Chapters Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setSelectedChapter("all");
              setCurrentPageNum(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedChapter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            جميع الفصول (1 – 70)
          </button>
          {PORTFOLIO_CHAPTERS.map(ch => {
            const active = selectedChapter === ch.number;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChapter(ch.number);
                  setCurrentPageNum(ch.startPage);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {ch.number === 0
                  ? `المقدمات (${ch.startPage}–${ch.endPage})`
                  : `الفصل ${ch.number} (${ch.startPage}–${ch.endPage})`}
              </button>
            );
          })}
        </div>

        {/* Page Navigator & Quick Jump Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 grow">
            <span className="text-xs font-bold text-slate-700 shrink-0">انتقال سريع للصفحة:</span>
            <select
              value={currentPage.pageNumber}
              onChange={e => setCurrentPageNum(Number(e.target.value))}
              className="w-full sm:max-w-xl bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 m-0"
            >
              {visiblePages.map(p => (
                <option key={p.id} value={p.pageNumber}>
                  صفحة ({p.pageNumber} / 70) — {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPhotoPickerOpen(!isPhotoPickerOpen)}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>تغيير صور الصفحة</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndexInVisible <= 0}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابقة</span>
              </button>

              <span className="text-xs font-black text-slate-800 px-1.5 tabular-nums">
                {currentPage.pageNumber} / 70
              </span>

              <button
                type="button"
                onClick={goNext}
                disabled={
                  currentIndexInVisible < 0 ||
                  currentIndexInVisible >= visiblePages.length - 1
                }
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                <span>التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Optional Photo Library Drawer for Evidence Pages */}
        {isPhotoPickerOpen && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800">
              اختر أي صورة من مكتبة الشواهد الـ 50 لإدراجها في الصفحة الحالية (صفحة {currentPage.pageNumber}):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-8 gap-2 max-h-44 overflow-y-auto">
              {FAWRN_PHOTO_LIBRARY_50.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAssignLibraryPhoto(item.fallbackImage)}
                  className="p-1 rounded-lg border border-slate-200 hover:border-emerald-600 bg-white text-right cursor-pointer"
                >
                  <img
                    src={item.fallbackImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-12 object-cover rounded"
                  />
                  <span className="block text-[9px] font-bold text-slate-700 truncate mt-1">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main A4 Page Preview */}
      <SheetContainer isLandscape={false}>
        <section className="sheet portrait relative flex flex-col justify-between">
          {!isTeacherSubscribed && (
            <PlatformWatermark subtitle="نسخة تجريبية — ملف الإنجاز (70 صفحة)" />
          )}

          <div>
            {/* Standard Sheet Header */}
            <div
              className="sheet-head"
              style={{ borderBottomColor: activeTheme.primaryColor }}
            >
              <div className="sheet-head-right text-[11px] leading-tight">
                <div className="font-bold">المملكة العربية السعودية</div>
                <div className="font-bold">وزارة التعليم</div>
                <div>{teacherProfile.educationAdmin || "الإدارة العامة للتعليم"}</div>
                <div>{teacherProfile.school || "مدرسة التعليم العام"}</div>
              </div>

              <div className="sheet-head-center">
                <img
                  src="/moe-logo.png"
                  alt="شعار وزارة التعليم"
                  className="h-13 object-contain"
                />
                <h2
                  style={{
                    backgroundColor: activeTheme.accentColor,
                    borderColor: activeTheme.primaryColor,
                    color: activeTheme.primaryColor
                  }}
                  className="text-xs sm:text-sm font-black px-4 py-1 rounded-lg border mt-1 text-center"
                >
                  {currentPage.title}
                </h2>
              </div>

              <div className="sheet-head-left flex flex-col items-end text-left text-[10px] text-slate-600">
                <span className="font-bold text-slate-900">ملف إنجاز المعلم</span>
                <span className="tabular-nums">صفحة ({currentPage.pageNumber}) من (70)</span>
                <span className="font-bold text-slate-900 mt-1">العام الدراسي:</span>
                <span>1448 هـ</span>
              </div>
            </div>

            {/* Dynamic Body Based on Page Type */}
            <div className="sheet-body space-y-4 text-xs leading-relaxed mt-3">
              {/* PAGE 1: COVER */}
              {currentPage.type === "cover" && (
                <div className="py-10 px-6 text-center space-y-6">
                  <div
                    className="p-8 rounded-3xl border-4 border-double space-y-5 max-w-xl mx-auto"
                    style={{
                      borderColor: activeTheme.primaryColor,
                      backgroundColor: activeTheme.accentColor
                    }}
                  >
                    <div className="text-xs font-bold text-slate-600">
                      المملكة العربية السعودية · وزارة التعليم · {teacherProfile.educationAdmin}
                    </div>
                    <h1
                      className="text-3xl font-black leading-snug"
                      style={{ color: activeTheme.primaryColor }}
                    >
                      ملف الإنجاز المهني للمعلم
                    </h1>
                    <p className="text-sm font-bold text-slate-700">
                      وفق عناصر تقييم الأداء الوظيفي الـ 11 المعتمدة ومعايير الرخصة المهنية
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-right bg-white p-4 rounded-2xl border border-slate-200 text-xs mt-4">
                      <div>
                        <b>اسم المعلم/ـة:</b>{" "}
                        <span className="font-bold">{teacherProfile.name}</span>
                      </div>
                      <div>
                        <b>التخصص والمادة:</b> <span>{teacherProfile.subject}</span>
                      </div>
                      <div>
                        <b>الرتبة المهنية:</b>{" "}
                        <span>{teacherProfile.professionalRank}</span>
                      </div>
                      <div>
                        <b>المرحلة الدراسية:</b> <span>{teacherProfile.stage}</span>
                      </div>
                      <div>
                        <b>المدرسة:</b> <span>{teacherProfile.school}</span>
                      </div>
                      <div>
                        <b>مدير/ة المدرسة:</b>{" "}
                        <span>{teacherProfile.principalName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: IDENTITY */}
              {currentPage.type === "identity" && (
                <div className="space-y-4">
                  <div className="sec-title">بطاقة هوية ملف الإنجاز المهني:</div>
                  <table className="t text-right">
                    <tbody>
                      <tr>
                        <th style={{ width: "170px" }}>مسمى الوثيقة الرسمية:</th>
                        <td className="font-bold">
                          ملف الإنجاز المهني وتوثيق شواهد الأداء الوظيفي (70 صفحة)
                        </td>
                      </tr>
                      <tr>
                        <th>صاحب الملف:</th>
                        <td className="font-bold">{teacherProfile.name}</td>
                      </tr>
                      <tr>
                        <th>إدارة التعليم والمدرسة:</th>
                        <td>
                          {teacherProfile.educationAdmin} — {teacherProfile.school}
                        </td>
                      </tr>
                      <tr>
                        <th>التخصص والمرحلة:</th>
                        <td>
                          {teacherProfile.subject} — {teacherProfile.stage}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <b className="text-slate-900 block">تعريف ملف الإنجاز المهني:</b>
                    <p contentEditable suppressContentEditableWarning>
                      وثيقة تربوية ومهنية منظمة تضم شواهد وأدلة أعمال المعلم ومنجزاته خلال العام الدراسي، مصنفة وفق الفصول الثمانية وعناصر تقييم الأداء الوظيفي الـ 11 المعتمدة من وزارة التعليم.
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 3: PROFILE & CV */}
              {currentPage.type === "profile" && (
                <div className="space-y-4">
                  <div className="sec-title">البيانات الشخصية والوظيفية والسيرة الذاتية:</div>
                  <table className="t text-right">
                    <tbody>
                      <tr>
                        <th style={{ width: "155px" }}>الاسم الرباعي:</th>
                        <td className="font-bold">{teacherProfile.name}</td>
                        <th style={{ width: "155px" }}>المؤهل العلمي:</th>
                        <td>{teacherProfile.qualification}</td>
                      </tr>
                      <tr>
                        <th>التخصص التدريسي:</th>
                        <td>{teacherProfile.subject}</td>
                        <th>الرتبة المهنية:</th>
                        <td className="font-bold text-emerald-800">
                          {teacherProfile.professionalRank}
                        </td>
                      </tr>
                      <tr>
                        <th>تاريخ المباشرة:</th>
                        <td>{teacherProfile.hireDate}</td>
                        <th>سنوات الخبرة:</th>
                        <td>{teacherProfile.experienceYears}</td>
                      </tr>
                      <tr>
                        <th>المرحلة الدراسية:</th>
                        <td>{teacherProfile.stage}</td>
                        <th>نصاب الحصص الأسبوعي:</th>
                        <td>{teacherProfile.weeklyClasses}</td>
                      </tr>
                      <tr>
                        <th>رقم الجوال:</th>
                        <td>{teacherProfile.phone}</td>
                        <th>البريد الإلكتروني:</th>
                        <td dir="ltr" className="text-right">
                          {teacherProfile.email}
                        </td>
                      </tr>
                      <tr>
                        <th>رقم الرخصة المهنية:</th>
                        <td className="font-bold">{teacherProfile.licenseNumber}</td>
                        <th>المدرسة الحالية:</th>
                        <td>{teacherProfile.school}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGE 4: CAREER & SKILLS */}
              {currentPage.type === "career" && (
                <div className="space-y-4">
                  <div className="sec-title">ملخص المسيرة المهنية والمهارات التربوية والتقنية:</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <b className="text-emerald-900 block">الكفايات والمهارات التربوية:</b>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        <li>التخطيط الفعال للدروس وتصميم الأنشطة المتمايزة.</li>
                        <li>تطبيق استراتيجيات التعلم النشط والتفكير الناقد.</li>
                        <li>بناء الاختبارات وفق جداول المواصفات وتحليل النتائج.</li>
                        <li>تصميم الخطط العلاجية والإثرائية المبنية على البيانات.</li>
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <b className="text-emerald-900 block">الكفايات التقنية والرقمية:</b>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        <li>إدارة الفصول الافتراضية وأدوات منصة مدرستي بكفاءة.</li>
                        <li>توظيف تطبيقات الذكاء الاصطناعي والسبورة التفاعلية.</li>
                        <li>تصميم المسابقات والأنشطة التفاعلية (Quizizz, Nearpod, Blooket).</li>
                        <li>إعداد التقارير الإحصائية والملفات التفاعلية الرقمية.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 5 & 6: INTRO, OBJECTIVES, VISION, MISSION */}
              {(currentPage.type === "introduction-objectives" ||
                currentPage.type === "direction") && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                    <h3 className="font-black text-emerald-950 text-sm">الرؤية المهنية:</h3>
                    <p contentEditable suppressContentEditableWarning>
                      الريادة في تقديم تعليم عصري ملهم يبني شخصية المتعلم علمياً وقيمياً ومهارياً، ويواكب مستهدفات رؤية المملكة العربية السعودية 2030.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-1.5">
                    <h3 className="font-black text-sky-950 text-sm">الرسالة التربوية:</h3>
                    <p contentEditable suppressContentEditableWarning>
                      تهيئة بيئة تعلم جاذبة ومحفزة توظف أحدث الاستراتيجيات التدريسية والتقنيات الرقمية وتفعل الشراكة مع الأسرة والمجتمع المهني لتحقيق أعلى نواتج تعلم.
                    </p>
                  </div>
                  <div className="sec-title">الأهداف العامة والقيم المهنية الحاكمة:</div>
                  <ul className="list-disc list-inside space-y-1.5 pr-2">
                    <li>الاعتزاز بالهوية الإسلامية والوطنية وغرس القيم التربوية الأصيلة.</li>
                    <li>الالتزام التام بأخلاقيات مهنة التعليم والانضباط الوظيفي.</li>
                    <li>التطوير المهني المستمر وتبادل الخبرات مع الزملاء في مجتمعات التعلم.</li>
                    <li>رفع مستوى التحصيل الدراسي ورعاية الفروق الفردية بين المتعلمين.</li>
                  </ul>
                </div>
              )}

              {/* PAGE 7: TABLE OF CONTENTS OF 8 CHAPTERS */}
              {currentPage.type === "contents" && (
                <div className="space-y-3">
                  <div className="sec-title">
                    فهرس محتويات ملف الإنجاز الشامل (8 فصول · 70 صفحة):
                  </div>
                  <table className="t">
                    <thead>
                      <tr>
                        <th style={{ width: "55px" }}>الفصل</th>
                        <th>عنوان الفصل ومحتوياته</th>
                        <th style={{ width: "110px" }}>أرقام الصفحات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PORTFOLIO_CHAPTERS.map(ch => (
                        <tr
                          key={ch.id}
                          onClick={() => setCurrentPageNum(ch.startPage)}
                          className="cursor-pointer hover:bg-emerald-50"
                        >
                          <td className="text-center font-bold tabular-nums">
                            {ch.number === 0 ? "مقدمة" : `الفصل ${ch.number}`}
                          </td>
                          <td className="text-right pr-2">
                            <div className="font-bold text-slate-900">{ch.title}</div>
                            <div className="text-[10px] text-slate-500">{ch.subtitle}</div>
                          </td>
                          <td className="text-center font-bold text-emerald-800 tabular-nums">
                            ص {ch.startPage} – {ch.endPage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CHAPTER DIVIDERS */}
              {currentPage.type === "chapter-divider" && (
                <div className="py-16 text-center space-y-6">
                  <div
                    className="p-10 rounded-3xl border-4 border-double max-w-lg mx-auto space-y-4"
                    style={{
                      borderColor: activeTheme.primaryColor,
                      backgroundColor: activeTheme.accentColor
                    }}
                  >
                    <span className="text-xs font-bold text-slate-600 block">
                      فاصل رسمي ضمن ملف إنجاز المعلم (صفحة {currentPage.pageNumber} من 70)
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-black leading-snug"
                      style={{ color: activeTheme.primaryColor }}
                    >
                      {currentPage.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {currentPage.subtitle}
                    </p>
                    <div className="pt-6 border-t border-slate-300 flex justify-between text-xs font-bold text-slate-800">
                      <span>إعداد: {teacherProfile.name}</span>
                      <span>{teacherProfile.school}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 13: PERFORMANCE COVENANT & 11 ELEMENTS MATRIX */}
              {(currentPage.type === "performance-covenant" ||
                currentPage.type === "evaluation-overview") && (
                <div className="space-y-2.5">
                  <div className="sec-title">
                    مصفوفة عناصر تقييم الأداء الوظيفي الـ 11 والأوزان النسبية المعتمدة (100%):
                  </div>
                  <table className="t text-[10.5px]">
                    <thead>
                      <tr>
                        <th style={{ width: "32px" }}>م</th>
                        <th>عنصر تقييم الأداء الوظيفي</th>
                        <th style={{ width: "65px" }}>الوزن</th>
                        <th>مؤشر التحقق والشاهد المرتبط</th>
                        <th style={{ width: "85px" }}>صفحات الملف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ELEVEN_EVALUATION_ELEMENTS.map(el => (
                        <tr
                          key={el.id}
                          onClick={() => setCurrentPageNum(el.detailPage)}
                          className="cursor-pointer hover:bg-emerald-50"
                        >
                          <td className="text-center font-bold tabular-nums">{el.number}</td>
                          <td className="text-right font-bold pr-2">{el.title}</td>
                          <td className="text-center font-black text-emerald-800 tabular-nums">
                            {el.weight}
                          </td>
                          <td className="text-right pr-2 text-[10px] text-slate-700">
                            {el.defaultEvidenceTitle}
                          </td>
                          <td className="text-center font-bold tabular-nums">
                            ص {el.detailPage} – {el.evidencePage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGES 14-35 (EVEN): ELEMENT DETAIL PAGE */}
              {currentPage.type === "element-detail" && activeElement && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800">
                        العنصر رقم ({activeElement.number}) من عناصر تقييم الأداء الوظيفي الـ 11
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">
                        {activeElement.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-1">{activeElement.description}</p>
                    </div>
                    <div className="text-center px-4 py-2 rounded-xl bg-white border border-emerald-300 shrink-0">
                      <div className="text-[10px] text-slate-500 font-bold">الوزن النسبي</div>
                      <div className="text-xl font-black text-emerald-800 tabular-nums">
                        {activeElement.weight}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="sec-title">أولاً: معايير ومؤشرات التحقق المعتمدة للعنصر:</div>
                    <ul className="list-disc list-inside space-y-1.5 pr-2 text-slate-800">
                      {activeElement.verificationIndicators.map((ind, i) => (
                        <li key={i} contentEditable suppressContentEditableWarning>
                          {ind}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="sec-title">
                      ثانياً: الإجراءات والممارسات العملية المنفذة لتحقيق العنصر:
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 pr-2 text-slate-800">
                      {activeElement.procedures.map((proc, i) => (
                        <li key={i} contentEditable suppressContentEditableWarning>
                          {proc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <table className="t">
                    <thead>
                      <tr>
                        <th>الشاهد الرئيس المرفق في الصفحة المقابلة (ص {activeElement.evidencePage})</th>
                        <th style={{ width: "180px" }}>مصدر التحقق</th>
                        <th style={{ width: "110px" }}>تقدير الأداء الذاتي</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-right font-bold pr-2">
                          {activeElement.defaultEvidenceTitle}
                        </td>
                        <td className="text-center">{activeElement.defaultEvidenceSource}</td>
                        <td className="text-center font-black text-emerald-800">
                          متميز (5 / 5)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGES 14-35 (ODD): ELEMENT EVIDENCE PAGE */}
              {currentPage.type === "element-evidence" && activeElement && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px]">
                    <div className="col-span-2">
                      <b>العنصر المرتبط:</b>{" "}
                      <span className="font-bold text-emerald-900">
                        ({activeElement.number}) {activeElement.title} — الوزن ({activeElement.weight})
                      </span>
                    </div>
                    <div>
                      <b>تاريخ التوثيق:</b> <span>1448/03/20 هـ</span>
                    </div>
                    <div className="col-span-2">
                      <b>عنوان الشاهد المرفق:</b>{" "}
                      <span contentEditable suppressContentEditableWarning>
                        {activeElement.defaultEvidenceTitle}
                      </span>
                    </div>
                    <div>
                      <b>المصدر:</b> <span>{activeElement.defaultEvidenceSource}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <b className="text-slate-900 block mb-1">وصف الشاهد والأثر المتحقق:</b>
                    <p contentEditable suppressContentEditableWarning>
                      {activeElement.defaultEvidenceSummary}
                    </p>
                  </div>

                  <div>
                    <div className="sec-title">المرفقات والشواهد المصورة الموثقة للعنصر:</div>
                    <div className="grid grid-cols-2 gap-3">
                      {getEvidencePhotosForPage(currentPage).map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-2 flex flex-col items-center gap-1.5"
                        >
                          <img
                            src={photoUrl}
                            alt={`شاهد العنصر ${activeElement.number}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-36 object-contain bg-white rounded-lg border border-slate-100"
                          />
                          <span
                            className="text-[10px] font-bold text-slate-700"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            شاهد ({idx + 1}): {activeElement.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 67: LINKED EVIDENCE INDEX */}
              {currentPage.type === "linked-evidence-index" && (
                <div className="space-y-3">
                  <div className="sec-title">
                    فهرس الشواهد والتقارير الموثقة والمربوطة تلقائياً بعناصر التقييم ({savedWitnesses.length} تقارير محفوظة):
                  </div>
                  <table className="t text-[10.5px]">
                    <thead>
                      <tr>
                        <th style={{ width: "32px" }}>م</th>
                        <th>عنوان تقرير الشاهد الموثق</th>
                        <th>التصنيف</th>
                        <th>عنصر الأداء الوظيفي المرتبط</th>
                        <th style={{ width: "85px" }}>التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedWitnesses.map((w, idx) => (
                        <tr key={w.id}>
                          <td className="text-center font-bold tabular-nums">{idx + 1}</td>
                          <td className="text-right font-bold pr-2">{w.formalTitle || w.title}</td>
                          <td className="text-center">{w.category}</td>
                          <td className="text-center font-semibold text-emerald-800">
                            {w.performanceStandard}
                          </td>
                          <td className="text-center tabular-nums">{w.date || "1448 هـ"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* GENERAL SPECIALIZED REGISTER & FORM PAGES (Pages 9, 10, 37-66, 68-70) */}
              {![
                "cover",
                "identity",
                "profile",
                "career",
                "introduction-objectives",
                "direction",
                "contents",
                "chapter-divider",
                "performance-covenant",
                "evaluation-overview",
                "element-detail",
                "element-evidence",
                "linked-evidence-index"
              ].includes(currentPage.type) && (
                <div className="space-y-3.5">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <b className="text-slate-900 block">{currentPage.title}</b>
                      <span className="text-[11px] text-slate-600">{currentPage.subtitle}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 tabular-nums">
                      الفصل ({currentPage.chapterNumber}) · ص {currentPage.pageNumber}
                    </span>
                  </div>

                  <table className="t text-[11px]">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>م</th>
                        <th>البند / النشاط / الإجراء التوثيقي</th>
                        <th>التفاصيل والشواهد ومؤشرات التحقق</th>
                        <th style={{ width: "95px" }}>التاريخ / الفترة</th>
                        <th style={{ width: "90px" }}>حالة الإنجاز</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4].map(rowNum => (
                        <tr key={rowNum}>
                          <td className="text-center font-bold tabular-nums">{rowNum}</td>
                          <td
                            className="text-right font-bold pr-2"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            {rowNum === 1
                              ? `توثيق وتنفيذ البند الأول ضمن (${currentPage.title})`
                              : rowNum === 2
                              ? `متابعة وتقييم مؤشرات الأداء المرتبطة بـ (${currentPage.title})`
                              : rowNum === 3
                              ? "تطبيق الإجراءات المعتمدة وربطها بمخرجات التعلم"
                              : "المراجعة الدورية وتحديث الشواهد والمرفقات الرسمية"}
                          </td>
                          <td
                            className="text-right pr-2"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            تم التنفيذ والتوثيق وفق النماذج المعتمدة وإرفاق الشواهد الداعمة في الملف.
                          </td>
                          <td
                            className="text-center tabular-nums"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            1448/0{rowNum + 1}/15 هـ
                          </td>
                          <td className="text-center font-bold text-emerald-800">
                            مكتمل (100%)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {getEvidencePhotosForPage(currentPage).map((photoUrl, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-2 flex flex-col items-center gap-1"
                      >
                        <img
                          src={photoUrl}
                          alt={currentPage.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-28 object-contain bg-white rounded-lg"
                        />
                        <span className="text-[10px] font-bold text-slate-600">
                          مرفق توثيقي ({idx + 1}) — {currentPage.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signatures Row */}
              {currentPage.type !== "cover" && currentPage.type !== "chapter-divider" && (
                <div className="sign-row mt-4">
                  <div>
                    <b>المعلم / صاحب الملف</b>
                    <div className="font-bold mt-1">{teacherProfile.name}</div>
                    <div className="line" />
                    <small>التوقيع</small>
                  </div>
                  <div>
                    <b>المشرف التربوي / وكيل الشؤون التعليمية</b>
                    <div className="font-bold mt-1">........................................</div>
                    <div className="line" />
                    <small>التوقيع</small>
                  </div>
                  <div>
                    <b>مدير/ة المدرسة</b>
                    <div className="font-bold mt-1">{teacherProfile.principalName}</div>
                    <div className="line" />
                    <small>الاعتماد والختم</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sheet Footer */}
          <div className="mt-2">
            <div className="sheet-foot">
              <div className="tabular-nums">
                ملف الإنجاز المهني للمعلم — صفحة {currentPage.pageNumber} من 70
              </div>
              <div>
                {!isTeacherSubscribed && (
                  <span className="free-note text-slate-500">
                    نسخة تجريبية — منصة زيد الرقمية للمعلم (لإزالة العلامة المائية اشترك بـ 49 ريال)
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </SheetContainer>
    </div>
  );
}
