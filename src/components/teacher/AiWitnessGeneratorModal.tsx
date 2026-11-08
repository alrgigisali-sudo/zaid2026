import React, { useState } from "react";
import { Sparkles, Bot, Check, ArrowRight, Loader2, Bookmark, RefreshCw, X, Globe, Layers, BookOpen, AlertCircle } from "lucide-react";
import { SavedWitness } from "../../data/teacherData";

interface AiWitnessGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToEditor: (witnessData: Partial<SavedWitness>) => void;
  onSaveDirectly?: (witness: SavedWitness) => void;
  defaultSubject?: string;
  defaultStage?: string;
}

export const AiWitnessGeneratorModal: React.FC<AiWitnessGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyToEditor,
  onSaveDirectly,
  defaultSubject = "عام",
  defaultStage = "التعليم العام",
}) => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("التطوير المهني والممارسات التدريسية");
  const [stage, setStage] = useState(defaultStage);
  const [subject, setSubject] = useState(defaultSubject);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [suggestedImages, setSuggestedImages] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Quick prompt ideas for Saudi teachers
  const quickIdeas = [
    "درس تطبيقي باستخدام استراتيجيات التعلم النشط",
    "تفعيل الأسبوع الخليجي للموهبة والإبداع المدرسي",
    "ورشة عمل تدريبية لمجتمعات التعلم المهنية (PLC)",
    "خطة علاجية لرفع التحصيل الدراسي للطلاب المتعثرين",
    "معرض مشاريع التقنية والذكاء الاصطناعي في التعليم",
    "تكريم الطلاب المتفوقين في الاختبارات المحاكية (نافس)"
  ];

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("يرجى كتابة موضوع أو فكرة الشاهد أولاً");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const res = await fetch("/api/ai/generate-witness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          stage,
          subject,
          notes: notes.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.witness) {
        setGeneratedResult(data.witness);

        // Fetch matching educational web images for this witness
        const keywords = data.witness.searchKeywords?.join(" ") || topic;
        try {
          const imgRes = await fetch(`/api/web/search-images?q=${encodeURIComponent(keywords)}`);
          const imgData = await imgRes.json();
          if (imgData.success && imgData.images?.length) {
            const urls = imgData.images.slice(0, 4).map((i: any) => i.url);
            setSuggestedImages(urls);
            if (urls[0]) setSelectedPhoto(urls[0]);
          }
        } catch (imgErr) {
          console.warn("Failed to fetch suggested images", imgErr);
        }
      } else {
        setError(data.error || "تعذر توليد الشاهد بالذكاء الاصطناعي");
      }
    } catch (err: any) {
      console.error("AI Generation error:", err);
      setError("حدث خطأ في الاتصال بالخادم أثناء التوليد");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedResult) return;
    onApplyToEditor({
      title: generatedResult.title,
      formalTitle: generatedResult.formalTitle,
      category: generatedResult.category,
      performanceStandard: generatedResult.performanceStandard,
      objectives: generatedResult.objectives,
      summary: generatedResult.summary,
      outcomes: Array.isArray(generatedResult.outcomes) ? generatedResult.outcomes : [generatedResult.outcomes],
      recommendations: Array.isArray(generatedResult.recommendations) ? generatedResult.recommendations : [generatedResult.recommendations],
      photos: selectedPhoto ? [selectedPhoto] : []
    });
    onClose();
  };

  const handleSave = () => {
    if (!generatedResult || !onSaveDirectly) return;
    const newWitness: SavedWitness = {
      id: "w-ai-" + Date.now(),
      title: generatedResult.title,
      formalTitle: generatedResult.formalTitle,
      category: generatedResult.category,
      performanceStandard: generatedResult.performanceStandard,
      stage,
      subject,
      date: "1446/03/19 هـ",
      location: "المدرسة",
      audience: "الطلاب ومنسوبي المدرسة",
      beneficiariesCount: "40 مستفيداً",
      duration: "حصة دراسية كاملة",
      objectives: generatedResult.objectives,
      summary: generatedResult.summary,
      outcomes: Array.isArray(generatedResult.outcomes) ? generatedResult.outcomes : [generatedResult.outcomes],
      recommendations: Array.isArray(generatedResult.recommendations) ? generatedResult.recommendations : [generatedResult.recommendations],
      photos: selectedPhoto ? [selectedPhoto] : [],
      designId: "ministry-classic",
      createdAt: new Date().toISOString()
    };
    onSaveDirectly(newWitness);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs no-print text-right" dir="rtl">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-900 via-teal-900 to-sky-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">مساعد الذكاء الاصطناعي لتوليد الشواهد</h3>
                <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">صياغة تربوية وزارية رصينة ومطابقة لمعايير تقويم التعليم والرخص المهنية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!generatedResult ? (
            /* Input Form */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  ما هو موضوع أو فكرة الشاهد؟ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: درس تطبيقي في حل المسائل اللفظية باستخدام استراتيجية فكر زاوج شارك"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Quick suggestions */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-2">أفكار ومواضيع سريعة:</span>
                <div className="flex flex-wrap gap-2">
                  {quickIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(idea)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-slate-200 text-xs font-medium transition-colors cursor-pointer text-right"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category, Subject, Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المجال / التصنيف:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="التطوير المهني والممارسات التدريسية">التطوير المهني والتدريس</option>
                    <option value="الدروس التطبيقية والنموذجية">الدروس التطبيقية والنموذجية</option>
                    <option value="نواتج التعلم والتحصيل الدراسي">نواتج التعلم والتحصيل الدراسي</option>
                    <option value="الأنشطة المدرسية والمبادرات">الأنشطة المدرسية والمبادرات</option>
                    <option value="مجتمعات التعلم المهنية (PLC)">مجتمعات التعلم المهنية</option>
                    <option value="الشراكة المجتمعية مع أولياء الأمور">الشراكة المجتمعية</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المادة الدراسية:</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    placeholder="عام، لغتي، رياضيات..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المرحلة الدراسية:</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 cursor-pointer"
                  >
                    <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
                    <option value="المرحلة المتوسطة">المرحلة المتوسطة</option>
                    <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                    <option value="التعليم العام">التعليم العام</option>
                  </select>
                </div>
              </div>

              {/* Extra details */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ملاحظات أو تركيز إضافي (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف أي تفاصيل خاصة تود تضمينها مثل: أسماء الاستراتيجيات، الأدوات المستخدمة، نتائج الاختبار..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            /* Result Preview */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs sm:text-sm font-bold text-emerald-900">
                    تم توليد الشاهد بنجاح وفق معايير هيئة تقويم التعليم والتدريب!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setGeneratedResult(null)}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>توليد شاهد آخر</span>
                </button>
              </div>

              {/* Generated Content Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    المعيار المهني: {generatedResult.performanceStandard}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-2">
                    {generatedResult.formalTitle || generatedResult.title}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">
                    التصنيف: {generatedResult.category}
                  </span>
                </div>

                {/* Summary */}
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <b className="text-slate-800 block mb-1">الوصف والملخص التنفيذي:</b>
                  <p className="text-slate-600 leading-relaxed">{generatedResult.summary}</p>
                </div>

                {/* Objectives */}
                {generatedResult.objectives?.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <b className="text-slate-800 block mb-1.5">الأهداف الإجرائية والتربوية:</b>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {generatedResult.objectives.map((obj: string, i: number) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Execution Steps */}
                {generatedResult.executionSteps?.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <b className="text-slate-800 block mb-1.5">خطوات وإجراءات التنفيذ:</b>
                    <ul className="list-decimal list-inside space-y-1 text-slate-600">
                      {generatedResult.executionSteps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Outcomes */}
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <b className="text-slate-800 block mb-1">الأثر والنتائج المحققة:</b>
                  <p className="text-slate-600 leading-relaxed">{generatedResult.outcomes}</p>
                </div>

                {/* Suggested Web Photos Evidence */}
                {suggestedImages.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Globe className="w-3.5 h-3.5 text-sky-600" />
                      <span>اختر صورة توثيقية مقترحة من الويب للشاهد:</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {suggestedImages.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedPhoto(img)}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            selectedPhoto === img ? "border-emerald-600 ring-2 ring-emerald-400" : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <img src={img} alt="صورة الشاهد" className="w-full h-full object-cover" />
                          {selectedPhoto === img && (
                            <div className="absolute top-1 left-1 bg-emerald-600 text-white p-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            إلغاء
          </button>

          {!generatedResult ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الصياغة بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد الشاهد الآن</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {onSaveDirectly && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-xs"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>حفظ مباشرة في شواهدي</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2 rounded-xl cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>إدراج في المحرر للمعاينة والطباعة</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiWitnessGeneratorModal;
