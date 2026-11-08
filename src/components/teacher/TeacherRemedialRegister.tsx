/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { PrintAndPdfActions } from "../common/PrintAndPdfActions";
import { SheetContainer } from "../common/SheetContainer";
import { PlatformWatermark } from "../common/PlatformLogo";
import {
  ClipboardCheck,
  Plus,
  Trash2,
  UserPlus,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

interface RemedialStudent {
  id: string;
  name: string;
  track: "remedial" | "enrichment";
  skill: string;
  maxScore: number;
  preScore: number;
  postScore: number;
  intervention: string;
  notes: string;
}

const INITIAL_REMEDIAL_STUDENTS: RemedialStudent[] = [
  {
    id: "rs-1",
    name: "سارة بنت محمد القحطاني",
    track: "remedial",
    skill: "إتقان العمليات الحسابية الكسرية وحل المسائل اللفظية",
    maxScore: 20,
    preScore: 11,
    postScore: 18,
    intervention: "أوراق عمل تفريدية + تدريب الأقران + متابعة أسرية",
    notes: "انتقلت إلى مستوى الإتقان الكامل"
  },
  {
    id: "rs-2",
    name: "نورة بنت خالد العتيبي",
    track: "remedial",
    skill: "تحليل النصوص القرائية واستنتاج الفكرة الرئيسة",
    maxScore: 20,
    preScore: 12,
    postScore: 17,
    intervention: "خرائط المفاهيم + جلسات قراءة موجهة",
    notes: "تحسن ملحوظ في طلاقة القراءة والفهم"
  },
  {
    id: "rs-3",
    name: "ريم بنت عبد الله الدوسري",
    track: "remedial",
    skill: "تطبيق القواعد النحوية والمهارات الإملائية",
    maxScore: 20,
    preScore: 10,
    postScore: 17,
    intervention: "أنشطة تفاعلية رقمية عبر منصة مدرستي",
    notes: "اجتازت معيار الإتقان (85%)"
  },
  {
    id: "rs-4",
    name: "لينا بنت فهد الشهري",
    track: "enrichment",
    skill: "تصميم مشاريع البحث العلمي والتفكير الناقد",
    maxScore: 20,
    preScore: 18,
    postScore: 20,
    intervention: "تكليف بقيادة مجموعة التعلم التعاوني ومشروع ابتكاري",
    notes: "طالبة فائقة ومتميزة — مرشحة للمسابقات"
  },
  {
    id: "rs-5",
    name: "مها بنت سعد الغامدي",
    track: "enrichment",
    skill: "حل مشكلات البرمجة والمنطق الرياضي المتقدم",
    maxScore: 20,
    preScore: 19,
    postScore: 20,
    intervention: "أنشطة إثرائية عليا وتحديات أولمبياد التخصص",
    notes: "أنجزت المشروع الإثرائي بامتياز"
  }
];

export function TeacherRemedialRegister() {
  const { teacherProfile, isTeacherSubscribed } = usePlatform();
  const [students, setStudents] = useState<RemedialStudent[]>(INITIAL_REMEDIAL_STUDENTS);
  const [gradeClass, setGradeClass] = useState<string>("الصف الأول الثانوي — شعبة (1)");
  const [semester, setSemester] = useState<string>("الفصل الدراسي الأول 1448هـ");
  const [masteryThreshold, setMasteryThreshold] = useState<number>(80);
  const [diagnosticTool, setDiagnosticTool] = useState<string>(
    "اختبار تشخيصي قبلي مقنن + الملاحظة الصفية + تحليل نتائج الفترات"
  );

  // Add student state
  const [newName, setNewName] = useState("");
  const [newTrack, setNewTrack] = useState<"remedial" | "enrichment">("remedial");
  const [newSkill, setNewSkill] = useState("");
  const [newMax, setNewMax] = useState(20);
  const [newPre, setNewPre] = useState(11);
  const [newPost, setNewPost] = useState(18);
  const [newIntervention, setNewIntervention] = useState("أوراق عمل تفريدية وجلسات دعم مركزة");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSkill.trim()) return;
    const item: RemedialStudent = {
      id: "rs-" + Date.now(),
      name: newName.trim(),
      track: newTrack,
      skill: newSkill.trim(),
      maxScore: Number(newMax) || 20,
      preScore: Number(newPre) || 0,
      postScore: Number(newPost) || 0,
      intervention: newIntervention.trim(),
      notes:
        ((Number(newPost) || 0) / (Number(newMax) || 20)) * 100 >= masteryThreshold
          ? "متقن بعد الخطة"
          : "مستمر في المتابعة"
    };
    setStudents(prev => [...prev, item]);
    setNewName("");
    setNewSkill("");
  };

  const handleRemoveStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const remedialList = students.filter(s => s.track === "remedial");
  const enrichmentList = students.filter(s => s.track === "enrichment");

  const calcPct = (score: number, max: number) =>
    max > 0 ? Math.round((score / max) * 100) : 0;

  const avgPre =
    students.length > 0
      ? Math.round(
          students.reduce((acc, s) => acc + calcPct(s.preScore, s.maxScore), 0) / students.length
        )
      : 0;
  const avgPost =
    students.length > 0
      ? Math.round(
          students.reduce((acc, s) => acc + calcPct(s.postScore, s.maxScore), 0) / students.length
        )
      : 0;
  const masteredCount = students.filter(
    s => calcPct(s.postScore, s.maxScore) >= masteryThreshold
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right" dir="rtl">
      {/* Top Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 no-print shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-700">
              العنصر الخامس والعاشر من تقييم الأداء الوظيفي — تشخيص وتحسين نتائج المتعلمين
            </p>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-emerald-700" />
              <span>سجل الخطة العلاجية والإثرائية وقياس الأثر</span>
            </h1>
            <p className="text-xs text-slate-600">
              أضف الطلاب المستهدفين بالدعم العلاجي أو الإثرائي، وارصد درجات القياس القبلي والبعدي ليقوم السجل بحساب نسب التقدم ومؤشرات الإتقان تلقائياً.
            </p>
          </div>

          <PrintAndPdfActions
            landscape={false}
            printLabel="طباعة السجل (A4)"
            pdfLabel="حفظ PDF"
            documentTitle={`سجل الخطة العلاجية والإثرائية - ${teacherProfile.name}`}
            variant="teacher"
          />
        </div>

        {/* Metadata Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">الصف والفصل الدراسي:</label>
            <input
              type="text"
              value={gradeClass}
              onChange={e => setGradeClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">الفصل والعام الدراسي:</label>
            <input
              type="text"
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">أدوات ومصادر التشخيص المعتمدة:</label>
            <input
              type="text"
              value={diagnosticTool}
              onChange={e => setDiagnosticTool(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
            />
          </div>
        </div>

        {/* Quick Add Student Form */}
        <form
          onSubmit={handleAddStudent}
          className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
        >
          <div className="font-black text-slate-900 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-emerald-700" />
            <span>إضافة طالب / طالبة إلى سجل الخطة العلاجية أو الإثرائية:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
            <input
              type="text"
              placeholder="اسم الطالب / الطالبة..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold lg:col-span-2"
              required
            />
            <select
              value={newTrack}
              onChange={e => setNewTrack(e.target.value as "remedial" | "enrichment")}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
            >
              <option value="remedial">مسار علاجي (دعم)</option>
              <option value="enrichment">مسار إثرائي (تفوق)</option>
            </select>
            <input
              type="text"
              placeholder="المهارة المستهدفة..."
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs lg:col-span-2"
              required
            />
            <div className="grid grid-cols-3 gap-1">
              <input
                type="number"
                title="الدرجة القبلية"
                placeholder="قبلي"
                value={newPre}
                onChange={e => setNewPre(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs text-center tabular-nums"
              />
              <input
                type="number"
                title="الدرجة البعدية"
                placeholder="بعدي"
                value={newPost}
                onChange={e => setNewPost(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs text-center tabular-nums"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center justify-center cursor-pointer"
                title="إضافة للسجل"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Printable A4 Sheet Preview */}
      <SheetContainer isLandscape={false}>
        <section className="sheet portrait relative">
          {!isTeacherSubscribed && (
            <PlatformWatermark subtitle="نسخة تجريبية — سجل الخطة العلاجية والإثرائية" />
          )}

          {/* Header */}
          <div className="sheet-head" style={{ borderBottomColor: "#154459" }}>
            <div className="sheet-head-right text-[11px] leading-tight">
              <div className="font-bold">المملكة العربية السعودية</div>
              <div className="font-bold">وزارة التعليم</div>
              <div>{teacherProfile.educationAdmin || "الإدارة العامة للتعليم"}</div>
              <div>{teacherProfile.school || "مدرسة التعليم العام"}</div>
            </div>

            <div className="sheet-head-center">
              <img src="/moe-logo.png" alt="شعار وزارة التعليم" className="h-12 object-contain" />
              <h2 className="text-sm font-black px-4 py-1 rounded-lg border border-emerald-800 bg-emerald-50 text-emerald-950 mt-1">
                سجل الخطة العلاجية والإثرائية وقياس الأثر
              </h2>
            </div>

            <div className="sheet-head-left flex flex-col items-end text-left text-[10px] text-slate-600">
              <span className="font-bold text-slate-900">الفصل الدراسي:</span>
              <span>{semester}</span>
              <span className="font-bold text-slate-900 mt-1">معيار الإتقان:</span>
              <span className="tabular-nums">{masteryThreshold}% فأعلى</span>
            </div>
          </div>

          <div className="sheet-body space-y-3 text-xs leading-relaxed">
            {/* Teacher & Course Summary Box */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-[11px]">
              <div>
                <b>اسم المعلم/ـة:</b> <span className="font-bold">{teacherProfile.name}</span>
              </div>
              <div>
                <b>المادة والتخصص:</b> <span>{teacherProfile.subject}</span>
              </div>
              <div>
                <b>الصف والفصل:</b> <span>{gradeClass}</span>
              </div>
              <div className="col-span-3">
                <b>أدوات ومصادر التشخيص:</b> <span>{diagnosticTool}</span>
              </div>
            </div>

            {/* Quantitative Impact Summary Strip */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-lg border border-slate-200 bg-white">
                <div className="text-[10px] text-slate-500">إجمالي المستهدفين</div>
                <div className="text-sm font-black text-slate-900 tabular-nums">
                  {students.length} ({remedialList.length} علاجي / {enrichmentList.length} إثرائي)
                </div>
              </div>
              <div className="p-2 rounded-lg border border-slate-200 bg-white">
                <div className="text-[10px] text-slate-500">متوسط القياس القبلي</div>
                <div className="text-sm font-black text-amber-700 tabular-nums">{avgPre}%</div>
              </div>
              <div className="p-2 rounded-lg border border-slate-200 bg-white">
                <div className="text-[10px] text-slate-500">متوسط القياس البعدي</div>
                <div className="text-sm font-black text-emerald-700 tabular-nums">{avgPost}%</div>
              </div>
              <div className="p-2 rounded-lg border border-slate-200 bg-white">
                <div className="text-[10px] text-slate-500">فرق التحسن ونسبة الإتقان</div>
                <div className="text-sm font-black text-sky-800 tabular-nums">
                  +{Math.max(0, avgPost - avgPre)}% ({masteredCount}/{students.length} متقن)
                </div>
              </div>
            </div>

            {/* Unified Remedial & Enrichment Table */}
            <div>
              <div className="sec-title">
                أولاً: بيان الطلاب المستهدفين بالخطة العلاجية والإثرائية ومقارنة القياس القبلي والبعدي:
              </div>
              <table className="t text-[10.5px]">
                <thead>
                  <tr>
                    <th style={{ width: "26px" }}>م</th>
                    <th style={{ width: "135px" }}>اسم الطالب / الطالبة</th>
                    <th style={{ width: "65px" }}>المسار</th>
                    <th>المهارة المستهدفة والإجراء المنفذ</th>
                    <th style={{ width: "52px" }}>القبلي</th>
                    <th style={{ width: "52px" }}>البعدي</th>
                    <th style={{ width: "62px" }}>التحسن</th>
                    <th style={{ width: "85px" }}>الحالة</th>
                    <th className="no-print" style={{ width: "28px" }}>حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, idx) => {
                    const prePct = calcPct(st.preScore, st.maxScore);
                    const postPct = calcPct(st.postScore, st.maxScore);
                    const diff = postPct - prePct;
                    return (
                      <tr key={st.id}>
                        <td className="text-center font-bold tabular-nums">{idx + 1}</td>
                        <td className="text-right font-bold pr-1.5">{st.name}</td>
                        <td className="text-center font-bold">
                          {st.track === "remedial" ? "علاجي" : "إثرائي"}
                        </td>
                        <td className="text-right pr-1.5">
                          <div className="font-bold text-slate-900">{st.skill}</div>
                          <div className="text-[9.5px] text-slate-500">{st.intervention}</div>
                        </td>
                        <td className="text-center font-bold text-rose-700 tabular-nums">
                          {st.preScore}/{st.maxScore} ({prePct}%)
                        </td>
                        <td className="text-center font-bold text-emerald-700 tabular-nums">
                          {st.postScore}/{st.maxScore} ({postPct}%)
                        </td>
                        <td className="text-center font-black text-sky-800 tabular-nums">
                          +{diff}%
                        </td>
                        <td className="text-center font-semibold">{st.notes}</td>
                        <td className="text-center no-print">
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(st.id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Before/After Progress Bars */}
            <div>
              <div className="sec-title">
                ثانياً: المؤشر البصري لمقارنة الأداء (قبل التطبيق ← بعد التطبيق):
              </div>
              <div className="space-y-1.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/60">
                {students.slice(0, 5).map(st => {
                  const prePct = calcPct(st.preScore, st.maxScore);
                  const postPct = calcPct(st.postScore, st.maxScore);
                  return (
                    <div key={st.id} className="grid grid-cols-12 items-center gap-2 text-[10px]">
                      <span className="col-span-3 font-bold truncate">{st.name}</span>
                      <div className="col-span-7 h-3 bg-slate-200 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${prePct}%` }}
                          className="bg-amber-500 h-full"
                          title={`قبلي: ${prePct}%`}
                        />
                        <div
                          style={{ width: `${Math.max(0, postPct - prePct)}%` }}
                          className="bg-emerald-600 h-full"
                          title={`نمو بعدي: +${postPct - prePct}%`}
                        />
                      </div>
                      <span className="col-span-2 text-left font-bold tabular-nums text-slate-700">
                        {prePct}% ← {postPct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Professional Reflection & Followup */}
            <div className="grid grid-cols-2 gap-2.5 text-[10.5px]">
              <div className="p-2.5 rounded-xl border border-slate-300 bg-white">
                <b className="text-emerald-900 block mb-1">آليات التواصل مع أولياء الأمور والمتابعة:</b>
                <p contentEditable suppressContentEditableWarning>
                  تم إشعار أولياء الأمور بنتائج التشخيص القبلي وخطة الدعم الأسبوعية عبر منصة مدرستي، وتزويدهم بتقارير التحسن البعدي.
                </p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-300 bg-white">
                <b className="text-emerald-900 block mb-1">التأمل المهني والتوصيات الختامية:</b>
                <p contentEditable suppressContentEditableWarning>
                  حققت الخطة العلاجية والإثرائية ارتفاعاً في متوسط الإتقان من {avgPre}% إلى {avgPost}%، ويوصى بالاستمرار في التعزيز الأسبوعي.
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="sign-row mt-3">
              <div>
                <b>معلم / معلمة المادة</b>
                <div className="font-bold mt-1">{teacherProfile.name}</div>
                <div className="line" />
                <small>التوقيع</small>
              </div>
              <div>
                <b>الموجه الطلابي / وكيل الشؤون التعليمية</b>
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

          <div className="sheet-foot">
            <div>سجل الخطة العلاجية والإثرائية — صفحة 1 / 1</div>
            <div />
          </div>
        </section>
      </SheetContainer>
    </div>
  );
}
