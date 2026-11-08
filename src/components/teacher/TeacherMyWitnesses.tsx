/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SavedWitness } from "../../data/teacherData";
import {
  Bookmark,
  Printer,
  Trash2,
  Plus,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Globe,
  Wand2,
  Loader2,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { AiWitnessGeneratorModal } from "./AiWitnessGeneratorModal";
import { WebImagePickerModal } from "./WebImagePickerModal";

export function TeacherMyWitnesses() {
  const { savedWitnesses, saveWitness, deleteWitness, setTeacherTab, setPreviewWitness, teacherProfile } = usePlatform();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isWebImageModalOpen, setIsWebImageModalOpen] = useState(false);
  const [targetWitnessForImage, setTargetWitnessForImage] = useState<SavedWitness | null>(null);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handlePrint = (witness: SavedWitness) => {
    setPreviewWitness(witness);
    setTeacherTab("smart-witness");
  };

  // Enhance an existing saved witness with AI
  const handleEnhanceWitness = async (witness: SavedWitness) => {
    setEnhancingId(witness.id);
    try {
      const res = await fetch("/api/ai/enhance-witness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ witness })
      });
      const data = await res.json();
      if (data.success && data.witness) {
        saveWitness(data.witness);
        setFeedbackMsg(`تم تحسين الشاهد "${witness.title}" بالذكاء الاصطناعي بنجاح!`);
        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    } catch (e) {
      console.error("Enhance failed", e);
    } finally {
      setEnhancingId(null);
    }
  };

  // Open web image picker for a specific witness
  const handleOpenWebImageFor = (witness: SavedWitness) => {
    setTargetWitnessForImage(witness);
    setIsWebImageModalOpen(true);
  };

  const handleApplyWebImage = (imgUrl: string) => {
    if (targetWitnessForImage) {
      const updated: SavedWitness = {
        ...targetWitnessForImage,
        photos: [imgUrl, ...(targetWitnessForImage.photos?.slice(1) || [])]
      };
      saveWitness(updated);
      setFeedbackMsg("تم تحديث صورة الشاهد من الويب بنجاح!");
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right" dir="rtl">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Bookmark className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                شواهدي وتقاريري المحفوظة
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              جميع الشواهد التي قمت بإعدادها وحفظها على جهازك ({savedWitnesses.length} شاهد محفوظ). يمكنك توليد شواهد جديدة بالذكاء الاصطناعي، إضافة وتعديل الصور من الويب، أو الطباعة بصيغة A4 المعتمدة.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:opacity-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md transition-all cursor-pointer ring-2 ring-amber-400/30"
            >
              <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>توليد شاهد بالذكاء الاصطناعي</span>
            </button>

            <button
              onClick={() => setTeacherTab("smart-witness")}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء يدوي</span>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedbackMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Grid of Saved Witnesses */}
      {savedWitnesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedWitnesses.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {w.photos && w.photos[0] ? (
                    <img
                      src={w.photos[0]}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-xs">لا توجد صورة مرفقة</span>
                    </div>
                  )}

                  {/* Category badge */}
                  <span className="absolute top-3 right-3 bg-slate-950/75 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                    {w.category}
                  </span>

                  {/* Add Web Photo quick button over image */}
                  <button
                    type="button"
                    onClick={() => handleOpenWebImageFor(w)}
                    className="absolute bottom-2 left-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="تغيير أو إضافة صورة للشاهد من الويب"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>صورة من الويب</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg inline-block border border-emerald-100 line-clamp-1">
                      المعيار: {w.performanceStandard}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-2 leading-snug">
                      {w.formalTitle || w.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {w.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{w.date || "الفصل الحالي"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{w.location || "المدرسة"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePrint(w)}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-sky-800 hover:bg-sky-900 text-white px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>معاينة وطباعة</span>
                  </button>

                  <button
                    onClick={() => handleEnhanceWitness(w)}
                    disabled={enhancingId === w.id}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
                    title="تحسين وإثراء الشاهد بالذكاء الاصطناعي"
                  >
                    {enhancingId === w.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    <span>إثراء AI</span>
                  </button>
                </div>

                <button
                  onClick={() => deleteWitness(w.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  title="حذف الشاهد"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4 p-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">لا توجد شواهد محفوظة حتى الآن</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            ابدأ الآن بإنشاء أول تقرير أو شاهد مهني رسمي، أو دع الذكاء الاصطناعي يصيغه لك كاملاً بالمعايير الوزارية والصور في ثوانٍ.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-amber-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md cursor-pointer hover:opacity-95"
            >
              <Sparkles className="w-4 h-4 fill-amber-200 text-amber-200" />
              <span>توليد بالذكاء الاصطناعي الآن</span>
            </button>

            <button
              onClick={() => setTeacherTab("smart-witness")}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>محرر القوالب الجاهزة</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      <AiWitnessGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyToEditor={(witnessData) => {
          setPreviewWitness(witnessData as SavedWitness);
          setTeacherTab("smart-witness");
        }}
        onSaveDirectly={(w) => {
          saveWitness(w);
          setFeedbackMsg("تم توليد وحفظ الشاهد الجديد بنجاح في شواهدي المحفوظة!");
          setTimeout(() => setFeedbackMsg(null), 4000);
        }}
        defaultSubject={teacherProfile.subject}
        defaultStage={teacherProfile.stage}
      />

      {/* Web Image Picker Modal */}
      <WebImagePickerModal
        isOpen={isWebImageModalOpen}
        onClose={() => {
          setIsWebImageModalOpen(false);
          setTargetWitnessForImage(null);
        }}
        onSelectImage={handleApplyWebImage}
        initialQuery={targetWitnessForImage?.title || targetWitnessForImage?.category || "تعليم"}
      />
    </div>
  );
}
