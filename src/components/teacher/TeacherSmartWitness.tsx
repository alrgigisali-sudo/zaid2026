/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { usePlatform } from "../../context/PlatformContext";
import {
  FAWRN_311_TEMPLATES,
  FAWRN_TEMPLATE_CATEGORIES,
  FawrnTemplateField
} from "../../data/fawrnTemplatesCatalog";
import { FAWRN_PHOTO_LIBRARY_50 } from "../../data/fawrnPortfolio70";
import {
  DESIGN_THEMES,
  extractTemplateDetails,
  SavedWitness
} from "../../data/teacherData";
import {
  Save,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Globe,
  Wand2,
  Loader2,
  Mic,
  MicOff,
  LayoutGrid
} from "lucide-react";
import { PrintAndPdfActions } from "../common/PrintAndPdfActions";
import { SheetContainer } from "../common/SheetContainer";
import { PlatformWatermark } from "../common/PlatformLogo";
import { AiWitnessGeneratorModal } from "./AiWitnessGeneratorModal";
import { WebImagePickerModal } from "./WebImagePickerModal";

// Fawrn-style bordered box with floating label on top-right
function ReportFieldBox({
  label,
  children,
  borderColor = "#A9D3BF",
  labelColor = "#154459",
  className = ""
}: {
  label: string;
  children: React.ReactNode;
  borderColor?: string;
  labelColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-[10px] border bg-white px-3 pb-2 pt-3 text-slate-900 ${className}`}
      style={{ borderColor }}
    >
      <span
        className="absolute -top-[0.75em] right-3 bg-white px-1.5 text-[8.5pt] font-black leading-none"
        style={{ color: labelColor }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export function TeacherSmartWitness() {
  const {
    teacherProfile,
    isTeacherSubscribed,
    saveWitness,
    setTeacherTab,
    activeTemplateSlug,
    setActiveTemplateSlug
  } = usePlatform();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialTpl =
    FAWRN_311_TEMPLATES.find(t => t.slug === activeTemplateSlug) ||
    FAWRN_311_TEMPLATES[0];
  const initialDetails = extractTemplateDetails(initialTpl);

  const [filterCat, setFilterCat] = useState<string>("all");
  const [selectedSlug, setSelectedSlug] = useState<string>(initialTpl.slug);
  const [selectedDesignId, setSelectedDesignId] = useState<string>(
    teacherProfile.designId || "moe-1448"
  );

  // Form fields
  const [title, setTitle] = useState(initialDetails.title);
  const [formalTitle, setFormalTitle] = useState(initialDetails.formalTitle);
  const [category, setCategory] = useState(initialDetails.category);
  const [performanceStandard, setPerformanceStandard] = useState(
    initialDetails.performanceStandard
  );
  const [stage, setStage] = useState(teacherProfile.stage || "المرحلة الثانوية");
  const [subject, setSubject] = useState(teacherProfile.subject || "المهارات الرقمية");
  const [dateHijri, setDateHijri] = useState("1448/03/19 هـ");
  const [dateGregorian, setDateGregorian] = useState("2026/09/01 م");
  const [location, setLocation] = useState(initialDetails.location);
  const [targetAudience, setTargetAudience] = useState(initialDetails.audience);
  const [beneficiariesCount, setBeneficiariesCount] = useState(
    initialDetails.beneficiariesCount
  );
  const [executionDuration, setExecutionDuration] = useState(initialDetails.duration);
  const [objectives, setObjectives] = useState<string[]>(initialDetails.objectives);
  const [newObjective, setNewObjective] = useState("");
  const [executionSummary, setExecutionSummary] = useState(initialDetails.summary);
  const [outcomes, setOutcomes] = useState<string[]>(initialDetails.outcomes);
  const [newOutcome, setNewOutcome] = useState("");
  const [extraFields, setExtraFields] = useState<FawrnTemplateField[]>(
    initialDetails.fields
  );
  const [photos, setPhotos] = useState<string[]>(initialDetails.photos);
  const [xAccount, setXAccount] = useState<string>(
    teacherProfile.xAccount || "@School_MOE"
  );

  // Voice dictation state
  const [isListening, setIsListening] = useState(false);
  const [voicePrompt, setVoicePrompt] = useState("");
  const recognitionRef = useRef<any>(null);

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isWebImageModalOpen, setIsWebImageModalOpen] = useState(false);
  const [isPhotoLibraryPickerOpen, setIsPhotoLibraryPickerOpen] = useState(false);
  const [isEnhancingWithAi, setIsEnhancingWithAi] = useState(false);

  // Sync if activeTemplateSlug changes from Catalog
  useEffect(() => {
    if (activeTemplateSlug) {
      const found = FAWRN_311_TEMPLATES.find(t => t.slug === activeTemplateSlug);
      if (found) {
        applyTemplate(found.slug);
      }
      setActiveTemplateSlug(null);
    }
  }, [activeTemplateSlug]);

  const applyTemplate = (slug: string) => {
    setSelectedSlug(slug);
    const tpl = FAWRN_311_TEMPLATES.find(t => t.slug === slug);
    if (!tpl) return;
    const d = extractTemplateDetails(tpl);
    setTitle(d.title);
    setFormalTitle(d.formalTitle);
    setCategory(d.category);
    setPerformanceStandard(d.performanceStandard);
    setLocation(d.location);
    setTargetAudience(d.audience);
    setBeneficiariesCount(d.beneficiariesCount);
    setExecutionDuration(d.duration);
    setObjectives(d.objectives);
    setExecutionSummary(d.summary);
    setOutcomes(d.outcomes);
    setExtraFields(d.fields);
    setPhotos(d.photos);
  };

  // Voice Dictation (Web Speech API)
  const toggleVoiceDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSavedFeedback(
        "المتصفح الحالي لا يدعم الإملاء الصوتي المباشر؛ يمكنك كتابة فكرة النشاط في الحقل وتوليد التقرير بالذكاء الاصطناعي."
      );
      setTimeout(() => setSavedFeedback(null), 4000);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setVoicePrompt(prev => (prev ? prev + " " + transcript : transcript));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleGenerateFromVoiceOrPrompt = async () => {
    const topicToUse = voicePrompt.trim() || title;
    if (!topicToUse) return;
    setIsEnhancingWithAi(true);
    try {
      const res = await fetch("/api/ai/generate-witness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicToUse,
          category,
          performanceStandard,
          stage,
          subject
        })
      });
      const data = await res.json();
      if (data.success && data.witness) {
        handleApplyAiWitness(data.witness);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancingWithAi(false);
    }
  };

  const handleApplyAiWitness = (data: Partial<SavedWitness>) => {
    if (data.title) setTitle(data.title);
    if (data.formalTitle) setFormalTitle(data.formalTitle);
    if (data.category) setCategory(data.category);
    if (data.performanceStandard) setPerformanceStandard(data.performanceStandard);
    if (data.objectives && data.objectives.length) setObjectives(data.objectives);
    if (data.summary) setExecutionSummary(data.summary);
    if (data.outcomes) {
      setOutcomes(Array.isArray(data.outcomes) ? data.outcomes : [String(data.outcomes)]);
    }
    if (data.photos && data.photos.length) setPhotos(data.photos);
    setSavedFeedback("تم توليد وتطبيق بيانات التقرير بالذكاء الاصطناعي بنجاح!");
    setTimeout(() => setSavedFeedback(null), 4000);
  };

  const handleEnhanceCurrentWitness = async () => {
    setIsEnhancingWithAi(true);
    try {
      const currentData = {
        title,
        formalTitle,
        category,
        performanceStandard,
        objectives,
        summary: executionSummary,
        outcomes
      };
      const res = await fetch("/api/ai/enhance-witness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ witness: currentData })
      });
      const data = await res.json();
      if (data.success && data.witness) {
        if (data.witness.formalTitle) setFormalTitle(data.witness.formalTitle);
        if (data.witness.summary) setExecutionSummary(data.witness.summary);
        if (data.witness.objectives) setObjectives(data.witness.objectives);
        if (data.witness.outcomes) {
          setOutcomes(
            Array.isArray(data.witness.outcomes)
              ? data.witness.outcomes
              : [data.witness.outcomes]
          );
        }
        setSavedFeedback("تم تحسين وإثراء صياغة التقرير بالذكاء الاصطناعي!");
        setTimeout(() => setSavedFeedback(null), 4000);
      }
    } catch (e) {
      console.error("Failed to enhance witness", e);
    } finally {
      setIsEnhancingWithAi(false);
    }
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives(prev => [...prev, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes(prev => [...prev, newOutcome.trim()]);
      setNewOutcome("");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setPhotos(prev => [...prev.slice(0, 3), ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSaveWitness = () => {
    const witness: SavedWitness = {
      id: "w-" + Date.now(),
      slug: selectedSlug,
      title,
      formalTitle,
      category,
      performanceStandard,
      stage,
      subject,
      date: dateHijri,
      dateGregorian,
      location,
      audience: targetAudience,
      beneficiariesCount,
      duration: executionDuration,
      objectives,
      summary: executionSummary,
      outcomes,
      recommendations: ["الاستمرار في تفعيل البرنامج وتعميم أثره التربوي."],
      fields: extraFields,
      photos,
      xAccount,
      designId: selectedDesignId,
      createdAt: new Date().toISOString()
    };

    saveWitness(witness);
    setSavedFeedback("تم حفظ التقرير بنجاح في قسم (تقاريري المحفوظة) وربطه بملف الإنجاز!");
    setTimeout(() => setSavedFeedback(null), 4000);
  };

  const activeTheme =
    DESIGN_THEMES.find(t => t.id === selectedDesignId) || DESIGN_THEMES[0];

  const templatesForDropdown =
    filterCat === "all"
      ? FAWRN_311_TEMPLATES
      : FAWRN_311_TEMPLATES.filter(t => t.category === filterCat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-right" dir="rtl">
      {/* Top Builder Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-bold text-emerald-700">
              منشئ تقارير الشواهد الذكي — يدعم الـ 311 قالباً جاهزاً والإملاء الصوتي
            </p>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">
              إصدار تقرير شاهد أداء وظيفي (A4 / PDF)
            </h1>
          </div>

          <div className="shrink-0 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTeacherTab("templates")}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-700" />
              <span>تصفح الـ 311 قالباً</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>توليد ذكي مفصل</span>
            </button>

            <button
              onClick={handleEnhanceCurrentWitness}
              disabled={isEnhancingWithAi}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isEnhancingWithAi ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
              ) : (
                <Wand2 className="w-4 h-4 text-emerald-700" />
              )}
              <span>تحسين الصياغة</span>
            </button>

            <button
              onClick={handleSaveWitness}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التقرير</span>
            </button>

            <PrintAndPdfActions
              landscape={false}
              printLabel="طباعة A4"
              pdfLabel="حفظ PDF"
              documentTitle={`تقرير شاهد - ${formalTitle || title}`}
              variant="teacher"
            />
          </div>
        </div>

        {savedFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedFeedback}</span>
            <button
              onClick={() => setTeacherTab("my-witnesses")}
              className="mr-auto underline cursor-pointer whitespace-nowrap"
            >
              فتح تقاريري المحفوظة ←
            </button>
          </div>
        )}

        {/* Voice Dictation & Quick AI Prompt Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <label className="text-xs font-black text-slate-800 block">
            الخطوة (1): تحدث بالصوت أو اكتب فكرة النشاط ليقوم الذكاء الاصطناعي بتعبئة التقرير، أو اختر من الـ 311 قالباً أدناه:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative grow">
              <input
                type="text"
                value={voicePrompt}
                onChange={e => setVoicePrompt(e.target.value)}
                placeholder="مثال: نفذت اليوم درساً تطبيقياً باستراتيجية الخرائط الذهنية لطالبات الصف الأول الثانوي..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleVoiceDictation}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isListening
                    ? "bg-rose-600 text-white"
                    : "bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>إيقاف التسجيل...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-700" />
                    <span>إملاء صوتي</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleGenerateFromVoiceOrPrompt}
                disabled={isEnhancingWithAi}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>صياغة التقرير تلقائياً</span>
              </button>
            </div>
          </div>
        </div>

        {/* 311 Templates Selector & Theme Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              تصنيف القالب الجاهز (6 فئات):
            </label>
            <select
              value={filterCat}
              onChange={e => {
                const newCat = e.target.value;
                setFilterCat(newCat);
                const list =
                  newCat === "all"
                    ? FAWRN_311_TEMPLATES
                    : FAWRN_311_TEMPLATES.filter(t => t.category === newCat);
                if (list.length > 0) applyTemplate(list[0].slug);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800"
            >
              {FAWRN_TEMPLATE_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.count} قالب)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              اختر القالب الجاهز ({templatesForDropdown.length} قالب):
            </label>
            <select
              value={selectedSlug}
              onChange={e => applyTemplate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
            >
              {templatesForDropdown.map(tpl => (
                <option key={tpl.slug} value={tpl.slug}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              تصميم ورقة التقرير المعتمدة:
            </label>
            <select
              value={selectedDesignId}
              onChange={e => setSelectedDesignId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800"
            >
              {DESIGN_THEMES.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Editor + Live A4 Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Editor Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 no-print text-xs">
          <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2.5">
            الخطوة (2): تخصيص حقول التقرير وصور الشواهد
          </h2>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">عنوان التقرير الرسمي:</label>
              <input
                type="text"
                value={formalTitle}
                onChange={e => {
                  setFormalTitle(e.target.value);
                  setTitle(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">عنصر تقييم الأداء (من الـ 11):</label>
                <input
                  type="text"
                  value={performanceStandard}
                  onChange={e => setPerformanceStandard(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">التصنيف / المجال:</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">تاريخ التنفيذ (هجري):</label>
                <input
                  type="text"
                  value={dateHijri}
                  onChange={e => setDateHijri(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">مكان التنفيذ:</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">الفئة المستهدفة:</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 block">الأهداف:</label>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200"
                  >
                    <input
                      type="text"
                      value={obj}
                      onChange={e => {
                        const copy = [...objectives];
                        copy[i] = e.target.value;
                        setObjectives(copy);
                      }}
                      className="grow bg-transparent text-[11px] text-slate-800 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setObjectives(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="أضف هدفاً جديداً..."
                  value={newObjective}
                  onChange={e => setNewObjective(e.target.value)}
                  className="grow bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Execution Summary */}
            <div className="pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 block mb-1">
                وصف التنفيذ والأنشطة والإجراءات:
              </label>
              <textarea
                rows={3}
                value={executionSummary}
                onChange={e => setExecutionSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed"
              />
            </div>

            {/* Outcomes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 block">النتائج والمخرجات المتوقعة:</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {outcomes.map((out, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200"
                  >
                    <input
                      type="text"
                      value={out}
                      onChange={e => {
                        const copy = [...outcomes];
                        copy[i] = e.target.value;
                        setOutcomes(copy);
                      }}
                      className="grow bg-transparent text-[11px] text-slate-800 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setOutcomes(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="أضف مخرجاً أو نتيجة..."
                  value={newOutcome}
                  onChange={e => setNewOutcome(e.target.value)}
                  className="grow bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddOutcome}
                  className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Photos Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="font-bold text-slate-700 block">
                إرفاق صور الشواهد (من جهازك أو من مكتبة الـ 50 صورة):
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة من جهازي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPhotoLibraryPickerOpen(!isPhotoLibraryPickerOpen)}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>مكتبة الـ 50 صورة جاهزة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWebImageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>صور من الويب</span>
                </button>
              </div>

              {isPhotoLibraryPickerOpen && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto grid grid-cols-3 gap-2">
                  {FAWRN_PHOTO_LIBRARY_50.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setPhotos(prev => [...prev.slice(0, 1), item.fallbackImage])
                      }
                      className="rounded-lg border border-slate-200 hover:border-emerald-600 bg-white overflow-hidden text-right p-1 cursor-pointer"
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
              )}

              {/* Current Attached Photos */}
              <div className="flex gap-2 pt-1">
                {photos.map((p, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group"
                  >
                    <img
                      src={p}
                      alt="صورة الشاهد"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-0 left-0 bg-rose-600 text-white p-0.5 rounded-br-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Live A4 Sheet Preview (7 cols) */}
        <div className="lg:col-span-7">
          <SheetContainer isLandscape={false}>
            <section className="sheet portrait relative flex flex-col justify-between">
              {!isTeacherSubscribed && (
                <PlatformWatermark subtitle="نسخة تجريبية — شواهد الأداء الوظيفي" />
              )}

              <div>
                {/* Ministry Header */}
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
                      {formalTitle || title}
                    </h2>
                  </div>

                  <div className="sheet-head-left flex flex-col items-end text-left text-[10px] text-slate-600">
                    <span className="font-bold text-slate-900">مجال التوثيق:</span>
                    <span>{category}</span>
                    <span className="font-bold text-slate-900 mt-1">تاريخ التنفيذ:</span>
                    <span>{dateHijri}</span>
                  </div>
                </div>

                {/* Fawrn Atomic Bordered Boxes Body */}
                <div className="sheet-body space-y-3 text-xs leading-relaxed mt-2">
                  {/* Top Metadata Row */}
                  <ReportFieldBox
                    label="البيانات الأساسية وعنصر الأداء الوظيفي"
                    borderColor={activeTheme.primaryColor + "45"}
                    labelColor={activeTheme.primaryColor}
                  >
                    <div className="grid grid-cols-3 gap-2 text-[10.5px]">
                      <div>
                        <b>اسم المعلم/ـة:</b>{" "}
                        <span className="font-bold">{teacherProfile.name}</span>
                      </div>
                      <div>
                        <b>التخصص والمرحلة:</b>{" "}
                        <span>
                          {subject} — {stage}
                        </span>
                      </div>
                      <div>
                        <b>مكان التنفيذ:</b> <span>{location}</span>
                      </div>
                      <div className="col-span-2">
                        <b>عنصر تقييم الأداء الوظيفي:</b>{" "}
                        <span className="font-bold text-emerald-800">
                          {performanceStandard}
                        </span>
                      </div>
                      <div>
                        <b>المستفيدون:</b> <span>{targetAudience}</span>
                      </div>
                    </div>
                  </ReportFieldBox>

                  {/* Objectives & Summary in 2 or 1 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <ReportFieldBox
                      label="الأهداف التربوية والتعليمية"
                      borderColor={activeTheme.primaryColor + "45"}
                      labelColor={activeTheme.primaryColor}
                    >
                      <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-800 pr-1">
                        {objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </ReportFieldBox>

                    <ReportFieldBox
                      label="النتائج والمخرجات المتحققة"
                      borderColor={activeTheme.primaryColor + "45"}
                      labelColor={activeTheme.primaryColor}
                    >
                      <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-800 pr-1">
                        {outcomes.map((out, i) => (
                          <li key={i}>{out}</li>
                        ))}
                      </ul>
                    </ReportFieldBox>
                  </div>

                  {/* Execution Summary Box */}
                  <ReportFieldBox
                    label="الوصف التنفيذي وإجراءات التطبيق والأنشطة"
                    borderColor={activeTheme.primaryColor + "45"}
                    labelColor={activeTheme.primaryColor}
                  >
                    <p
                      className="text-[10.5px] text-slate-800 leading-relaxed whitespace-pre-line"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {executionSummary}
                    </p>
                  </ReportFieldBox>

                  {/* Photo Evidence Box */}
                  <ReportFieldBox
                    label="الشواهد الفوتوغرافية الموثقة"
                    borderColor={activeTheme.primaryColor + "45"}
                    labelColor={activeTheme.primaryColor}
                  >
                    <div
                      className={`grid gap-2.5 pt-1 ${
                        photos.length === 1 ? "grid-cols-1" : "grid-cols-2"
                      }`}
                    >
                      {photos.slice(0, 2).map((p, i) => (
                        <div
                          key={i}
                          className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center"
                          style={{ height: photos.length === 1 ? "165px" : "135px" }}
                        >
                          <img
                            src={p}
                            alt={`شاهد ${i + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </ReportFieldBox>

                  {/* Signatures */}
                  <div className="sign-row mt-3">
                    <div>
                      <b>المعلم / معد التقرير</b>
                      <div className="font-bold mt-1">{teacherProfile.name}</div>
                      <div className="line" />
                      <small>التوقيع</small>
                    </div>
                    <div>
                      <b>وكيل الشؤون التعليمية / المشرف</b>
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
                </div>
              </div>

              {/* Sheet Footer */}
              <div className="mt-2">
                <div className="sheet-foot">
                  <div>صفحة 1 / 1 — توثيق شواهد الأداء الوظيفي</div>
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
      </div>

      {/* AI Witness Generator Modal */}
      <AiWitnessGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyToEditor={handleApplyAiWitness}
        onSaveDirectly={w => {
          saveWitness(w);
          setSavedFeedback("تم توليد وحفظ التقرير مباشرة بنجاح!");
          setTimeout(() => setSavedFeedback(null), 4000);
        }}
        defaultSubject={teacherProfile.subject}
        defaultStage={teacherProfile.stage}
      />

      {/* Web Image Picker Modal */}
      <WebImagePickerModal
        isOpen={isWebImageModalOpen}
        onClose={() => setIsWebImageModalOpen(false)}
        onSelectImage={url => {
          setPhotos(prev => [...prev.slice(0, 1), url]);
          setSavedFeedback("تم إدراج الصورة في التقرير بنجاح!");
          setTimeout(() => setSavedFeedback(null), 3000);
        }}
        initialQuery={title || category || "تعليم"}
      />
    </div>
  );
}
