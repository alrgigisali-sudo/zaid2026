/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { usePlatform } from "../../context/PlatformContext";
import {
  PRIMARY_CURRICULUM_1448,
  getPrimaryCalendar1448,
  PrimarySemesterKey,
  PrimaryRegionKey,
  PrimaryDistMode,
  CalendarWeekItem
} from "../../data/primaryCurriculumData";
import { PrintAndPdfActions } from "../common/PrintAndPdfActions";
import { SheetContainer } from "../common/SheetContainer";
import { PlatformWatermark } from "../common/PlatformLogo";
import {
  Calendar,
  MapPin,
  RotateCcw,
  CheckCircle2,
  Edit3,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  Search,
  RectangleVertical,
  RectangleHorizontal,
  KeyRound
} from "lucide-react";

const DAYS_OF_WEEK = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

interface CustomWeeklyDetails {
  objectives: string;
  strategies: string;
  homework: string;
  parentNote: string;
}

export function TeacherCurriculumView() {
  const {
    teacherProfile,
    updateTeacherProfile,
    isTeacherSubscribed,
    setPortal
  } = usePlatform();

  // Step 1: Grade selection (Grades 1 to 6)
  const [selectedGradeKey, setSelectedGradeKey] = useState<string>("g1");

  // Step 2: Semester & Region
  const [semester, setSemester] = useState<PrimarySemesterKey>("first");
  const [region, setRegion] = useState<PrimaryRegionKey>("public");

  // Step 3: Mode (normal distribution, detailed distribution, or weekly plan)
  const [mode, setMode] = useState<PrimaryDistMode>("detailed");

  // Step 4: Page Orientation (Portrait A4 vs Landscape A4)
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Step 5: Subject selection & search
  const [subjectSearch, setSubjectSearch] = useState<string>("");
  const currentGrade = useMemo(
    () =>
      PRIMARY_CURRICULUM_1448.find(g => g.key === selectedGradeKey) ||
      PRIMARY_CURRICULUM_1448[0],
    [selectedGradeKey]
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    currentGrade.subjects[0]?.id || ""
  );

  // Ensure selectedSubjectId stays valid when switching grades
  useEffect(() => {
    const exists = currentGrade.subjects.some(s => s.id === selectedSubjectId);
    if (!exists && currentGrade.subjects.length > 0) {
      const prevSubjTitle = PRIMARY_CURRICULUM_1448.flatMap(g => g.subjects).find(
        s => s.id === selectedSubjectId
      )?.title;
      const sameTitleSubj = prevSubjTitle
        ? currentGrade.subjects.find(s => s.title === prevSubjTitle)
        : undefined;
      setSelectedSubjectId((sameTitleSubj || currentGrade.subjects[0]).id);
    }
  }, [currentGrade, selectedSubjectId]);

  const currentSubject = useMemo(
    () =>
      currentGrade.subjects.find(s => s.id === selectedSubjectId) ||
      currentGrade.subjects[0],
    [currentGrade, selectedSubjectId]
  );

  const filteredSubjects = useMemo(() => {
    const q = subjectSearch.trim();
    if (!q) return currentGrade.subjects;
    return currentGrade.subjects.filter(s => s.title.includes(q));
  }, [currentGrade, subjectSearch]);

  // Calendar weeks for current semester & region
  const calendarItems = useMemo(
    () => getPrimaryCalendar1448(semester, region),
    [semester, region]
  );

  // Active teaching weeks for Weekly Plan selector
  const teachingWeeks = useMemo(
    () =>
      calendarItems.filter(
        w => w.kind === "teach" || w.kind === "partial" || w.kind === "exam"
      ),
    [calendarItems]
  );

  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(0);

  useEffect(() => {
    if (selectedWeekIdx >= teachingWeeks.length) {
      setSelectedWeekIdx(0);
    }
  }, [teachingWeeks.length, selectedWeekIdx]);

  // Custom inline edits persisted in localStorage
  const [customWeekEdits, setCustomWeekEdits] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("zaid-primary-curriculum-edits-v1");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [customWeeklyPlanMeta, setCustomWeeklyPlanMeta] = useState<
    Record<string, CustomWeeklyDetails>
  >(() => {
    try {
      const saved = localStorage.getItem("zaid-primary-weekly-meta-v1");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "zaid-primary-curriculum-edits-v1",
        JSON.stringify(customWeekEdits)
      );
    } catch {}
  }, [customWeekEdits]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "zaid-primary-weekly-meta-v1",
        JSON.stringify(customWeeklyPlanMeta)
      );
    } catch {}
  }, [customWeeklyPlanMeta]);

  // Base lessons array for the selected subject, semester, and mode
  const baseLessonsByTeachWeek = useMemo(() => {
    if (!currentSubject) return [];
    if (semester === "first") {
      return mode === "normal"
        ? currentSubject.sem1Normal
        : currentSubject.sem1Detailed;
    }
    return mode === "normal"
      ? currentSubject.sem2Normal
      : currentSubject.sem2Detailed;
  }, [currentSubject, semester, mode]);

  const getEditKey = (teachIdx: number) =>
    `${currentGrade.key}_${currentSubject?.id}_${semester}_${
      mode === "normal" ? "normal" : "detailed"
    }_${teachIdx}`;

  const getLessonsForTeachIndex = (
    teachIdx: number | undefined,
    isRevision?: boolean
  ): string[] => {
    if (teachIdx === undefined) return [];
    const key = getEditKey(teachIdx);
    if (customWeekEdits[key]) {
      return customWeekEdits[key];
    }
    const raw = baseLessonsByTeachWeek[teachIdx] || [];
    if (raw.length > 0) return raw;
    if (isRevision) return ["مراجعة عامة وتعزيز المهارات الأساسية"];
    return ["استكمال المقررات الدراسية وتطبيقات عملية"];
  };

  const handleUpdateWeekLessons = (teachIdx: number, value: string) => {
    const lines = value
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);
    const key = getEditKey(teachIdx);
    setCustomWeekEdits(prev => ({
      ...prev,
      [key]: lines.length > 0 ? lines : ["—"]
    }));
  };

  const handleResetCurrentSubjectEdits = () => {
    const prefix = `${currentGrade.key}_${currentSubject?.id}_${semester}_`;
    setCustomWeekEdits(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (k.startsWith(prefix)) delete next[k];
      });
      return next;
    });
  };

  // Active week item for Weekly Plan mode
  const activeWeekItem: CalendarWeekItem =
    teachingWeeks[selectedWeekIdx] || calendarItems[0];

  const activeWeekLessons = useMemo(() => {
    if (!activeWeekItem) return [];
    if (activeWeekItem.kind === "exam") {
      return [activeWeekItem.label || "اختبارات نهاية الفصل الدراسي"];
    }
    return getLessonsForTeachIndex(activeWeekItem.teachIndex, activeWeekItem.revision);
  }, [activeWeekItem, baseLessonsByTeachWeek, customWeekEdits]);

  const weeklyMetaKey = `${currentGrade.key}_${currentSubject?.id}_${semester}_${selectedWeekIdx}`;
  const currentWeeklyMeta: CustomWeeklyDetails = customWeeklyPlanMeta[weeklyMetaKey] || {
    objectives: `إتقان المفاهيم والمهارات الأساسية المقررة في ${
      currentSubject?.title || "المادة"
    } لهذا الأسبوع وتطبيقها عملياً.`,
    strategies:
      "التعلم النشط · الحوار والمناقشة · التعلم التعاوني · التقويم البنائي المستمر",
    homework: "حل تدريبات الكتاب المدرسي والواجبات المرسلة عبر منصة مدرستي.",
    parentNote:
      "نأمل من ولي الأمر متابعة إنجاز الواجبات الأسبوعية ومراجعة الدروس أولاً بأول."
  };

  const updateWeeklyMeta = (field: keyof CustomWeeklyDetails, value: string) => {
    setCustomWeeklyPlanMeta(prev => ({
      ...prev,
      [weeklyMetaKey]: {
        ...currentWeeklyMeta,
        [field]: value
      }
    }));
  };

  // Distribute lessons across the 5 school days for Weekly Plan mode
  const dailyDistributedLessons = useMemo(() => {
    const lessons =
      activeWeekLessons.length > 0 ? activeWeekLessons : ["مراجعة وتطبيقات عامة"];
    return DAYS_OF_WEEK.map((dayName, dayIdx) => {
      if (lessons.length >= 5) {
        const chunkSize = Math.ceil(lessons.length / 5);
        const slice = lessons.slice(dayIdx * chunkSize, (dayIdx + 1) * chunkSize);
        return {
          day: dayName,
          topic: slice.length > 0 ? slice.join(" + ") : lessons[lessons.length - 1]
        };
      }
      const mappedLesson = lessons[dayIdx % lessons.length];
      const suffix =
        dayIdx >= lessons.length
          ? dayIdx === 4
            ? " (تدريبات وتقويم أسبوعي)"
            : " (استكمال وتطبيقات)"
          : "";
      return {
        day: dayName,
        topic: `${mappedLesson}${suffix}`
      };
    });
  }, [activeWeekLessons]);

  const semesterLabel =
    semester === "first" ? "الفصل الدراسي الأول" : "الفصل الدراسي الثاني";
  const regionBadgeText =
    region === "makka"
      ? "توزيع خاص بالمنطقة الغربية (مكة المكرمة - المدينة المنورة - جدة - الطائف)"
      : "التوزيع العام (جميع إدارات التعليم بالمملكة)";

  const documentTitle =
    mode === "weekly"
      ? `الخطة الأسبوعية - ${currentSubject?.title} - ${currentGrade.title} - ${activeWeekItem?.head}`
      : `توزيع منهج ${currentSubject?.title} - ${currentGrade.title} - ${semesterLabel} 1448هـ`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-right" dir="rtl">
      {/* Top Interactive Configuration Panel (No-Print) */}
      <section className="no-print bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111A5E]">
              <span>منصة زيد الرقمية</span>
              <span>·</span>
              <span>توزيع المنهج والخطط الأسبوعية ١٤٤٨هـ (٢٠٢٦ - ٢٠٢٧م)</span>
              <span>·</span>
              <span>المرحلة الابتدائية</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#111A5E]" />
              <span>توزيع المنهج الدراسي والخطط الأسبوعية — المرحلة الابتدائية</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              اختر الصف والفصل الدراسي ونوع التقويم واتجاه الورقة (عمودي أو أفقي) لعرض أوراق توزيع المنهج والخطة الأسبوعية بشعار وزارة التعليم وترويسة مدرستك.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Orientation Quick Toggle in Top Header */}
            <div className="inline-flex items-center bg-[#F3F4F6] p-1 rounded-xl border border-[#D1D5DB]">
              <button
                type="button"
                onClick={() => setIsLandscape(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  !isLandscape
                    ? "bg-[#080C3A] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                title="ضبط مقاس النموذج على A4 عمودي (Portrait)"
              >
                <RectangleVertical className="w-3.5 h-3.5" />
                <span>عمودي A4</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLandscape(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isLandscape
                    ? "bg-[#080C3A] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
                title="ضبط مقاس النموذج على A4 أفقي (Landscape)"
              >
                <RectangleHorizontal className="w-3.5 h-3.5" />
                <span>أفقي A4</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetCurrentSubjectEdits}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D1D5DB] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              title="استعادة التوزيع الأصلي المعتمد للمادة الحالية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>استعادة الأصل</span>
            </button>

            <PrintAndPdfActions
              landscape={isLandscape}
              printLabel={
                mode === "weekly"
                  ? `طباعة الخطة (${isLandscape ? "أفقي" : "عمودي"})`
                  : `طباعة التوزيع (${isLandscape ? "أفقي" : "عمودي"})`
              }
              pdfLabel="تصدير PDF"
              documentTitle={documentTitle}
              variant="teacher"
            />
          </div>
        </div>

        {/* Step 1: Select Primary Grade (1 to 6) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111A5E] text-white text-[11px] font-bold inline-flex items-center justify-center">
                1
              </span>
              <span>اختر الصف الدراسي (المرحلة الابتدائية):</span>
            </label>
            <span className="text-[11px] text-slate-500 tabular-nums">
              6 صفوف دراسية ·{" "}
              {PRIMARY_CURRICULUM_1448.reduce((acc, g) => acc + g.subjects.length, 0)} مقررًا
              معتمدًا
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {PRIMARY_CURRICULUM_1448.map(grade => {
              const active = grade.key === selectedGradeKey;
              return (
                <button
                  key={grade.key}
                  type="button"
                  onClick={() => setSelectedGradeKey(grade.key)}
                  className={`px-3 py-2.5 rounded-lg border text-right transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    active
                      ? "bg-[#080C3A] text-white border-[#080C3A] shadow-xs"
                      : "bg-[#F9FAFB] hover:bg-[#EEF1FA]/60 text-slate-800 border-[#E5E7EB] hover:border-[#111A5E]"
                  }`}
                >
                  <div className="text-xs font-bold whitespace-nowrap truncate">
                    {grade.title}
                  </div>
                  <div
                    className={`text-[11px] tabular-nums ${
                      active ? "text-[#C5D0F0]" : "text-slate-500"
                    }`}
                  >
                    {grade.subjects.length} مادة دراسية
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 & Step 3: Semester, Region, Mode, and Page Orientation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* Semester Selector */}
          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111A5E] text-white text-[11px] font-bold inline-flex items-center justify-center">
                2
              </span>
              <span>الفصل الدراسي (١٤٤٨هـ):</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setSemester("first")}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  semester === "first"
                    ? "bg-[#111A5E] text-white border-[#111A5E]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                الفصل الأول
              </button>
              <button
                type="button"
                onClick={() => setSemester("second")}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  semester === "second"
                    ? "bg-[#111A5E] text-white border-[#111A5E]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                الفصل الثاني
              </button>
            </div>
          </div>

          {/* Regional Calendar Selector (Public vs Western Region) */}
          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#111A5E]" />
              <span>التقويم الإقليمي:</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setRegion("public")}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap truncate ${
                  region === "public"
                    ? "bg-[#111A5E] text-white border-[#111A5E]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                توزيع عام
              </button>
              <button
                type="button"
                onClick={() => setRegion("makka")}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap truncate ${
                  region === "makka"
                    ? "bg-[#111A5E] text-white border-[#111A5E]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
                title="مكة المكرمة - المدينة المنورة - جدة - الطائف"
              >
                المنطقة الغربية
              </button>
            </div>
          </div>

          {/* Display Mode Selector (Normal, Detailed, Weekly Plan) */}
          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111A5E] text-white text-[11px] font-bold inline-flex items-center justify-center">
                3
              </span>
              <span>نوع النموذج المطلوب:</span>
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setMode("normal")}
                className={`py-2 px-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  mode === "normal"
                    ? "bg-[#111A5E] text-white border-[#111A5E]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                توزيع عادي
              </button>
              <button
                type="button"
                onClick={() => setMode("detailed")}
                className={`py-2 px-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  mode === "detailed"
                    ? "bg-[#111A5E] text-white border-[#111A5E]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                توزيع مفصل
              </button>
              <button
                type="button"
                onClick={() => setMode("weekly")}
                className={`py-2 px-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                  mode === "weekly"
                    ? "bg-[#080C3A] text-white border-[#080C3A]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                خطة أسبوعية
              </button>
            </div>
          </div>

          {/* Orientation Selector (Portrait vs Landscape) */}
          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111A5E] text-white text-[11px] font-bold inline-flex items-center justify-center">
                4
              </span>
              <span>اتجاه ومقاس الورقة (A4):</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setIsLandscape(false)}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  !isLandscape
                    ? "bg-[#080C3A] text-white border-[#080C3A]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                <RectangleVertical className="w-3.5 h-3.5" />
                <span>عمودي (Portrait)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLandscape(true)}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  isLandscape
                    ? "bg-[#080C3A] text-white border-[#080C3A]"
                    : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                }`}
              >
                <RectangleHorizontal className="w-3.5 h-3.5" />
                <span>أفقي (Landscape)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step 5: Subject Selection Grid */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#111A5E] text-white text-[11px] font-bold inline-flex items-center justify-center">
                5
              </span>
              <span>اختر المادة الدراسية ({currentGrade.title}):</span>
            </label>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={subjectSearch}
                onChange={e => setSubjectSearch(e.target.value)}
                placeholder="بحث في مواد الصف..."
                className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg py-1.5 pr-8 pl-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#111A5E]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredSubjects.map(subj => {
              const active = subj.id === currentSubject?.id;
              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className={`px-3 py-2.5 rounded-lg border text-right text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    active
                      ? "bg-[#EEF1FA] text-[#080C3A] border-[#111A5E] ring-1 ring-[#111A5E]"
                      : "bg-white text-slate-700 border-[#E5E7EB] hover:border-[#111A5E] hover:bg-[#F9FAFB]"
                  }`}
                >
                  <span className="truncate" title={subj.title}>
                    {subj.title}
                  </span>
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-[#111A5E] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Plan Week Selector (Only shown when mode === "weekly") */}
        {mode === "weekly" && (
          <div className="p-4 rounded-xl bg-[#EEF1FA]/70 border border-[#C5D0F0] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-[#080C3A] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#111A5E]" />
                <span>اختر الأسبوع الدراسي لعرض وتخصيص الخطة الأسبوعية:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={selectedWeekIdx <= 0}
                  onClick={() => setSelectedWeekIdx(i => Math.max(0, i - 1))}
                  className="px-2.5 py-1 rounded-md border border-[#111A5E]/30 bg-white text-xs font-bold text-[#080C3A] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 inline" /> الأسبوع السابق
                </button>
                <button
                  type="button"
                  disabled={selectedWeekIdx >= teachingWeeks.length - 1}
                  onClick={() =>
                    setSelectedWeekIdx(i => Math.min(teachingWeeks.length - 1, i + 1))
                  }
                  className="px-2.5 py-1 rounded-md border border-[#111A5E]/30 bg-white text-xs font-bold text-[#080C3A] disabled:opacity-40 cursor-pointer"
                >
                  الأسبوع التالي <ChevronLeft className="w-3.5 h-3.5 inline" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {teachingWeeks.map((w, idx) => {
                const active = idx === selectedWeekIdx;
                return (
                  <button
                    key={`${w.head}-${idx}`}
                    type="button"
                    onClick={() => setSelectedWeekIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? "bg-[#111A5E] text-white border-[#111A5E]"
                        : "bg-white text-slate-700 border-[#D1D5DB] hover:border-[#111A5E]"
                    }`}
                  >
                    {w.head}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Header & Signature Fields (Synced with TeacherProfile) */}
        <div className="pt-2 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">إدارة التعليم:</label>
            <input
              type="text"
              value={teacherProfile.educationAdmin}
              onChange={e => updateTeacherProfile({ educationAdmin: e.target.value })}
              placeholder="الإدارة العامة للتعليم..."
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#111A5E]"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">اسم المدرسة:</label>
            <input
              type="text"
              value={teacherProfile.school}
              onChange={e => updateTeacherProfile({ school: e.target.value })}
              placeholder="مدرسة..."
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#111A5E]"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              اسم المعلم / المعلمة:
            </label>
            <input
              type="text"
              value={teacherProfile.name}
              onChange={e => updateTeacherProfile({ name: e.target.value })}
              placeholder="أ. ..."
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#111A5E]"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              مدير / مديرة المدرسة:
            </label>
            <input
              type="text"
              value={teacherProfile.principalName}
              onChange={e => updateTeacherProfile({ principalName: e.target.value })}
              placeholder="أ. ..."
              className="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#111A5E]"
            />
          </div>
        </div>
      </section>

      {/* Hint Strip for Direct Editing + Watermark Status */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-[#EEF1FA] border border-[#C5D0F0] text-xs text-[#080C3A]">
        <div className="flex items-center gap-2 font-semibold">
          <Edit3 className="w-4 h-4 text-[#111A5E] shrink-0" />
          <span>
            انقر مباشرة على أي خلية أسبوع لتعديل الدروس قبل الطباعة. المقاس الحالي:{" "}
            <strong>{isLandscape ? "A4 أفقي (Landscape)" : "A4 عمودي (Portrait)"}</strong>.
          </span>
        </div>
        {!isTeacherSubscribed && (
          <button
            type="button"
            onClick={() => setPortal("subscription")}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#111A5E] hover:underline cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>اشترك لإخفاء العلامة المائية واسم المنصة من النموذج</span>
          </button>
        )}
      </div>

      {/* Official Calibrated A4 Sheet Surface (Portrait or Landscape) */}
      <SheetContainer isLandscape={isLandscape} className="p-0">
        <section
          className={`sheet ${
            isLandscape ? "landscape" : "portrait"
          } flex flex-col justify-between bg-white text-slate-900`}
        >
          {/* Free Preview Transparent Center Watermark (Hidden when subscribed) */}
          {!isTeacherSubscribed && (
            <PlatformWatermark subtitle="معاينة مجانية — تختفي العلامة المائية عند الاشتراك" />
          )}

          <div className="sheet-body flex flex-col justify-between space-y-2.5">
            <div className="space-y-2.5">
              {/* Official 3-Column Header with Saudi Ministry of Education Logo in the Center */}
              <header className="sheet-head !mb-2 !pb-2">
                {/* Right Column: Kingdom, Ministry, Administration, School */}
                <div className="sheet-head-right space-y-0.5 text-right">
                  <div>المملكة العربية السعودية</div>
                  <div>وزارة التعليم</div>
                  <div>{teacherProfile.educationAdmin || "الإدارة العامة للتعليم"}</div>
                  <div>المدرسة: {teacherProfile.school || "................................"}</div>
                </div>

                {/* Center Column: Official Ministry of Education Logo + Framed Title */}
                <div className="sheet-head-center">
                  <img
                    src="/moe-logo.png"
                    alt="شعار وزارة التعليم"
                    className={
                      isLandscape
                        ? "!h-[14mm] w-auto object-contain mb-0.5"
                        : "!h-[17mm] w-auto object-contain mb-1"
                    }
                  />
                  <h2 className={isLandscape ? "!text-[13px] !py-0.5 !px-3" : "!text-[14px]"}>
                    {mode === "weekly"
                      ? `الخطة الأسبوعية لمادة ${currentSubject?.title}`
                      : mode === "normal"
                        ? `توزيع المنهج الدراسي (العادي) — ${currentSubject?.title}`
                        : `توزيع المنهج الدراسي (المفصل) — ${currentSubject?.title}`}
                  </h2>
                  {region === "makka" && (
                    <div className="mt-0.5 text-[9.5px] font-extrabold text-amber-800 bg-amber-50 border border-amber-300 rounded px-2 py-0.5 inline-block">
                      {regionBadgeText}
                    </div>
                  )}
                </div>

                {/* Left Column: Academic Year, Semester, Grade, Subject */}
                <div className="text-left text-[11px] font-bold text-[#16293d] space-y-0.5 leading-[1.55]">
                  <div className="text-[#080C3A] font-extrabold">
                    العام الدراسي: ١٤٤٨هـ
                  </div>
                  <div>{semesterLabel}</div>
                  <div>المرحلة الابتدائية — {currentGrade.title}</div>
                  <div>المادة: {currentSubject?.title}</div>
                </div>
              </header>

              {/* MODE A: FULL SEMESTER CURRICULUM DISTRIBUTION GRID (Normal or Detailed) */}
              {mode !== "weekly" ? (
                <div
                  className={`grid ${
                    isLandscape ? "grid-cols-5 gap-1.5" : "grid-cols-4 gap-1.5"
                  }`}
                >
                  {calendarItems.map((week, idx) => {
                    if (week.kind === "vac") {
                      return (
                        <div
                          key={`vac-${idx}`}
                          className="rounded-md border-[1.5px] border-amber-400 bg-amber-50/80 flex flex-col overflow-hidden"
                        >
                          <div className="bg-amber-500 text-white text-[10px] font-extrabold py-0.5 px-1.5 text-center">
                            {week.head}
                          </div>
                          <div className="p-1.5 flex-1 flex flex-col items-center justify-center text-center space-y-0.5">
                            <div className="text-[9.5px] font-extrabold text-amber-950 tabular-nums">
                              {week.hijri}
                            </div>
                            {week.greg && (
                              <div className="text-[8.5px] font-semibold text-amber-800 border-b border-amber-200 pb-0.5 w-full tabular-nums">
                                {week.greg}
                              </div>
                            )}
                            <div className="text-[10.5px] font-extrabold text-amber-900 pt-0.5">
                              {week.label}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (week.kind === "exam") {
                      return (
                        <div
                          key={`exam-${idx}`}
                          className="rounded-md border-[1.5px] border-[#080C3A] bg-[#EEF1FA]/90 flex flex-col overflow-hidden"
                        >
                          <div className="bg-[#080C3A] text-white text-[10px] font-extrabold py-0.5 px-1.5 text-center">
                            {week.head}
                          </div>
                          <div className="p-1.5 flex-1 flex flex-col items-center justify-center text-center space-y-0.5">
                            <div className="text-[9.5px] font-extrabold text-[#080C3A] tabular-nums">
                              {week.hijri}
                            </div>
                            {week.greg && (
                              <div className="text-[8.5px] font-semibold text-[#111A5E] border-b border-[#C5D0F0] pb-0.5 w-full tabular-nums">
                                {week.greg}
                              </div>
                            )}
                            <div className="text-[10.5px] font-extrabold text-[#080C3A] pt-0.5">
                              {week.label}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const weekLessons = getLessonsForTeachIndex(
                      week.teachIndex,
                      week.revision
                    );

                    return (
                      <div
                        key={`teach-${idx}`}
                        className="rounded-md border border-[#94A3B8] bg-white flex flex-col overflow-hidden"
                      >
                        {/* Week Header */}
                        <div className="bg-[#080C3A] text-white text-[10px] font-extrabold py-0.5 px-2 text-center flex items-center justify-between">
                          <span>{week.head}</span>
                          <span className="text-[8.5px] text-[#C5D0F0] font-normal">
                            {week.kind === "partial" ? "أسبوع جزئي" : "أسبوع دراسي"}
                          </span>
                        </div>

                        {/* Dates Strip */}
                        <div className="bg-[#EEF1FA]/70 border-b border-[#CBD5E1] px-1.5 py-0.5 text-center leading-tight">
                          <div className="text-[9.5px] font-extrabold text-[#080C3A] tabular-nums">
                            {week.hijri}
                          </div>
                          {week.greg && (
                            <div className="text-[8.5px] font-semibold text-slate-500 tabular-nums">
                              {week.greg}
                            </div>
                          )}
                        </div>

                        {/* Partial Holiday Callout inside Teaching Week */}
                        {week.kind === "partial" && week.label && (
                          <div className="mx-1 mt-1 px-1 py-0.5 rounded bg-amber-50 border border-amber-300 text-[8.5px] font-bold text-amber-900 text-center leading-tight">
                            {week.label}
                          </div>
                        )}

                        {/* Editable Lessons List */}
                        <div className="p-1 flex-1 flex flex-col justify-center">
                          <textarea
                            value={weekLessons.join("\n")}
                            onChange={e =>
                              week.teachIndex !== undefined &&
                              handleUpdateWeekLessons(week.teachIndex, e.target.value)
                            }
                            rows={
                              isLandscape
                                ? Math.max(2, Math.min(3, weekLessons.length))
                                : Math.max(2, Math.min(4, weekLessons.length))
                            }
                            className={`w-full h-full ${
                              isLandscape ? "min-h-[34px] text-[9.5px]" : "min-h-[44px] text-[10px]"
                            } resize-none border-0 bg-transparent font-bold text-slate-800 leading-snug text-center focus:outline-hidden focus:bg-[#EEF1FA]/40 rounded p-0.5`}
                            title="انقر لتعديل دروس هذا الأسبوع"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* MODE B: DEDICATED WEEKLY PLAN SHEET (الخطة الأسبوعية المفصلة للمادة) */
                <div className="space-y-2.5">
                  {/* Selected Week Banner */}
                  <div className="rounded-lg bg-[#080C3A] text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold">
                        {activeWeekItem?.head}
                      </span>
                      <span>·</span>
                      <span className="text-xs text-[#C5D0F0] font-semibold">
                        {activeWeekItem?.hijri}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#C5D0F0] tabular-nums">
                      {activeWeekItem?.greg}
                    </div>
                  </div>

                  {/* All Assigned Topics for the Selected Week */}
                  <div className="rounded-lg border border-[#C5D0F0] bg-[#EEF1FA]/50 p-2.5 space-y-1">
                    <div className="text-[11px] font-extrabold text-[#080C3A]">
                      الموضوعات والدروس المقررة خلال {activeWeekItem?.head}:
                    </div>
                    <textarea
                      value={activeWeekLessons.join("\n")}
                      onChange={e =>
                        activeWeekItem?.teachIndex !== undefined &&
                        handleUpdateWeekLessons(activeWeekItem.teachIndex, e.target.value)
                      }
                      rows={2}
                      className="w-full bg-white border border-[#D1D5DB] rounded p-1.5 text-[11px] font-bold text-slate-800 leading-relaxed focus:outline-hidden focus:border-[#111A5E]"
                    />
                  </div>

                  {/* 5-Day Structured Weekly Schedule Table */}
                  <div className="overflow-hidden rounded-lg border border-[#94A3B8]">
                    <table className="w-full border-collapse text-right text-[11px]">
                      <thead>
                        <tr className="bg-[#080C3A] text-white">
                          <th className="py-1.5 px-2.5 font-extrabold w-24 border-l border-white/20">
                            اليوم
                          </th>
                          <th className="py-1.5 px-2.5 font-extrabold border-l border-white/20">
                            الدرس / موضوع الحصة المقرر
                          </th>
                          <th className="py-1.5 px-2.5 font-extrabold w-48 border-l border-white/20">
                            النشاط والتطبيق الصفي
                          </th>
                          <th className="py-1.5 px-2.5 font-extrabold w-44">
                            الواجب والمتابعة المنزلية
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {dailyDistributedLessons.map((item, idx) => (
                          <tr
                            key={item.day}
                            className={idx % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                          >
                            <td className="py-2 px-2.5 font-extrabold text-[#080C3A] border-l border-[#E5E7EB]">
                              {item.day}
                            </td>
                            <td className="py-2 px-2.5 font-bold text-slate-900 border-l border-[#E5E7EB]">
                              <input
                                type="text"
                                defaultValue={item.topic}
                                key={`${weeklyMetaKey}-day-${idx}-${item.topic}`}
                                className="w-full bg-transparent border-0 text-[11px] font-bold text-slate-900 focus:outline-hidden focus:bg-[#EEF1FA]/40 rounded px-1 m-0 p-0"
                              />
                            </td>
                            <td className="py-2 px-2.5 text-slate-700 border-l border-[#E5E7EB]">
                              <input
                                type="text"
                                defaultValue={
                                  idx === 4
                                    ? "تقويم ختامي أسبوعي ومراجعة المهارات"
                                    : "تطبيقات الكتاب المدرسي وأوراق العمل"
                                }
                                className="w-full bg-transparent border-0 text-[10.5px] text-slate-700 focus:outline-hidden focus:bg-[#EEF1FA]/40 rounded px-1 m-0 p-0"
                              />
                            </td>
                            <td className="py-2 px-2.5 text-slate-700">
                              <input
                                type="text"
                                defaultValue={
                                  idx === 4
                                    ? "الاستعداد لأسبوع الدراسة القادم"
                                    : "واجب إلكتروني عبر منصة مدرستي"
                                }
                                className="w-full bg-transparent border-0 text-[10.5px] text-slate-700 focus:outline-hidden focus:bg-[#EEF1FA]/40 rounded px-1 m-0 p-0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pedagogical Objectives, Strategies, Homework & Parent Notes */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-[#CBD5E1] bg-[#F9FAFB] space-y-1">
                      <div className="text-[10.5px] font-extrabold text-[#080C3A]">
                        الأهداف التعليمية والمهارات المستهدفة:
                      </div>
                      <textarea
                        value={currentWeeklyMeta.objectives}
                        onChange={e => updateWeeklyMeta("objectives", e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-[#D1D5DB] rounded p-1.5 text-[10.5px] text-slate-800 leading-snug focus:outline-hidden focus:border-[#111A5E] m-0"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#CBD5E1] bg-[#F9FAFB] space-y-1">
                      <div className="text-[10.5px] font-extrabold text-[#080C3A]">
                        استراتيجيات التدريس والوسائل التعليمية:
                      </div>
                      <textarea
                        value={currentWeeklyMeta.strategies}
                        onChange={e => updateWeeklyMeta("strategies", e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-[#D1D5DB] rounded p-1.5 text-[10.5px] text-slate-800 leading-snug focus:outline-hidden focus:border-[#111A5E] m-0"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#CBD5E1] bg-[#F9FAFB] space-y-1">
                      <div className="text-[10.5px] font-extrabold text-[#080C3A]">
                        التكليفات والواجبات الأسبوعية:
                      </div>
                      <textarea
                        value={currentWeeklyMeta.homework}
                        onChange={e => updateWeeklyMeta("homework", e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-[#D1D5DB] rounded p-1.5 text-[10.5px] text-slate-800 leading-snug focus:outline-hidden focus:border-[#111A5E] m-0"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg border border-[#CBD5E1] bg-[#F9FAFB] space-y-1">
                      <div className="text-[10.5px] font-extrabold text-[#080C3A]">
                        توجيهات وملاحظات لولي الأمر:
                      </div>
                      <textarea
                        value={currentWeeklyMeta.parentNote}
                        onChange={e => updateWeeklyMeta("parentNote", e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-[#D1D5DB] rounded p-1.5 text-[10.5px] text-slate-800 leading-snug focus:outline-hidden focus:border-[#111A5E] m-0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Official Signature Row + Conditional Platform Footer */}
            <div className="pt-2">
              <div className="sign-row !mt-2">
                <div>
                  <b>معلم / معلمة المادة</b>
                  <div className="font-extrabold text-[11px] text-slate-900 mt-0.5">
                    {teacherProfile.name}
                  </div>
                  <div className="line !mt-3" />
                  <small>التوقيع</small>
                </div>

                <div>
                  <b>الختم الرسمي للمدرسة</b>
                  <div className="font-bold text-[10.5px] text-slate-500 mt-0.5">
                    {teacherProfile.school}
                  </div>
                  <div className="line !mt-3" />
                  <small>الختم</small>
                </div>

                <div>
                  <b>مدير / مديرة المدرسة</b>
                  <div className="font-extrabold text-[11px] text-slate-900 mt-0.5">
                    {teacherProfile.principalName || "................................"}
                  </div>
                  <div className="line !mt-3" />
                  <small>الاعتماد والتوقيع</small>
                </div>
              </div>

              {/* Bottom Platform Name Strip — Shown ONLY in Free Preview Mode, Completely Hidden When Subscribed */}
              {!isTeacherSubscribed && (
                <div className="sheet-foot !mt-1.5">
                  <div className="font-extrabold text-[#080C3A]">
                    منصة زيد الرقمية (ZAID) — نسخة معاينة مجانية
                  </div>
                  <div className="free-note text-slate-500">
                    تختفي العلامة المائية واسم المنصة تلقائياً عند تفعيل الاشتراك
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </SheetContainer>
    </div>
  );
}
