/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FAWRN_311_TEMPLATES, FawrnReadyTemplate, FawrnTemplateField } from "./fawrnTemplatesCatalog";
import { FAWRN_PHOTO_LIBRARY_50, PORTFOLIO_70_PAGES, ELEVEN_EVALUATION_ELEMENTS } from "./fawrnPortfolio70";

export interface DesignTheme {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  description: string;
}

export interface ActivityPhoto {
  id: string;
  title: string;
  category: string;
  url: string;
  alt: string;
}

export interface SavedWitness {
  id: string;
  slug?: string;
  title: string;
  formalTitle: string;
  category: string;
  performanceStandard: string;
  stage: string;
  subject: string;
  date?: string;
  dateGregorian?: string;
  location?: string;
  audience?: string;
  beneficiariesCount?: string;
  duration?: string;
  objectives: string[];
  summary: string;
  outcomes: string[];
  recommendations: string[];
  fields?: FawrnTemplateField[];
  photos: string[];
  photoCaptions?: string[];
  xAccount?: string;
  designId?: string;
  createdAt: string;
}

export const DESIGN_THEMES: DesignTheme[] = [
  {
    id: "moe-1448",
    name: "قالب منصة زيد الكحلي الرسمي (1448هـ)",
    subtitle: "التصميم الرسمي المعتمد بهوية منصة زيد باللون الكحلي",
    badge: "الافتراضي المعتمد",
    primaryColor: "#080C3A",
    secondaryColor: "#111A5E",
    accentColor: "#EEF1FA",
    description: "ترويسة رسمية باللون الكحلي المعتمد في شعار منصة زيد مع صناديق مؤطرة أنيقة لكل حقل وإطارين للشواهد المصورة."
  },
  {
    id: "ministry-classic",
    name: "النموذج الكحلي الكلاسيكي",
    subtitle: "التصميم الكلاسيكي المعتمد باللون الكحلي الداكن",
    badge: "رسمي معتمد",
    primaryColor: "#111A5E",
    secondaryColor: "#080C3A",
    accentColor: "#EEF1FA",
    description: "ترويسة رسمية باللون الكحلي مع جداول منظمة وترتيب قياسي للأهداف والشواهد المصورة."
  },
  {
    id: "royal-gold",
    name: "النموذج الملكي الفاخر",
    subtitle: "إطار رسمي مذهب مع الكحلي الداكن",
    badge: "فاخر للطباعة",
    primaryColor: "#080C3A",
    secondaryColor: "#b45309",
    accentColor: "#fffbeb",
    description: "إطار احتفالي رسمي بلمسات ذهبية مع اللون الكحلي يناسب الدروس التطبيقية، الفعاليات الوطنية، وملفات الإنجاز المتميزة."
  },
  {
    id: "modern-gradient",
    name: "نموذج الهوية البصرية الحديثة",
    subtitle: "مستوحى من تدرجات الكحلي والأزرق الرسمي",
    badge: "هوية 2026",
    primaryColor: "#111A5E",
    secondaryColor: "#1E338A",
    accentColor: "#EEF1FA",
    description: "تصميم عصري بتدرجات اللون الكحلي، يعرض الأهداف والمخرجات في بطاقات منظمة متجاورة."
  },
  {
    id: "minimal-print",
    name: "النموذج الاقتصادي الأنيق",
    subtitle: "خفيف الحبر ومثالي للطباعة اليومية السريعة",
    badge: "صديق للطابعة",
    primaryColor: "#0f172a",
    secondaryColor: "#475569",
    accentColor: "#f8fafc",
    description: "تصميم نقي بخلفية بيضاء صافية وحدود نحيفة عالية الوضوح، يوفر استهلاك الحبر مع الحفاظ على الهيبة الرسمية."
  }
];

export const SAMPLE_PHOTOS: ActivityPhoto[] = FAWRN_PHOTO_LIBRARY_50.map(item => ({
  id: item.id,
  title: item.title,
  category: item.category,
  url: item.fallbackImage,
  alt: item.caption
}));

// Convert any of the 311 Fawrn templates into a full SavedWitness / Editor structure
export function extractTemplateDetails(tpl: FawrnReadyTemplate) {
  const getField = (...keys: string[]) => {
    for (const k of keys) {
      const f = tpl.fields.find(item => item.key.toLowerCase() === k.toLowerCase() || item.label.includes(k));
      if (f && f.value) return f.value;
    }
    return "";
  };

  const splitBullets = (text: string): string[] => {
    if (!text) return [];
    return text
      .split(/\n+/)
      .map(s => s.replace(/^[•\-*١٢٣٤٥٦٧٨٩٠0-9()+.)\s]+/, "").trim())
      .filter(Boolean);
  };

  const objectivesRaw = getField("Objectives", "الأهداف", "Goal", "هدف");
  const summaryRaw = getField("InitiativeIdea", "Activities", "ImplementationApproach", "فكرة", "وصف", "الإجراءات", "الأنشطة");
  const outcomesRaw = getField("ExpectedOutcomes", "Outcomes", "النتائج", "المخرجات", "الأثر");
  const location = getField("InitiativeLocation", "ExecutionLocation", "Location", "مكان") || "القاعة الصفية / مرافق المدرسة";
  const audience = getField("TargetGroup", "Beneficiaries", "الفئة المستهدفة", "المستفيدون") || "طلاب / طالبات الفصل والمدرسة";
  const duration = getField("ExecutionTime", "Duration", "مدة", "وقت التنفيذ", "تاريخ") || "حصة دراسية / حسب خطة النشاط";

  const objectives = splitBullets(objectivesRaw);
  const outcomes = splitBullets(outcomesRaw);

  // Match a relevant photo from the 50 library samples
  const matchingPhoto =
    FAWRN_PHOTO_LIBRARY_50.find(p => tpl.title.includes(p.title) || p.title.includes(tpl.title)) ||
    FAWRN_PHOTO_LIBRARY_50.find(p => p.category === tpl.category) ||
    FAWRN_PHOTO_LIBRARY_50[0];

  const secondPhoto =
    FAWRN_PHOTO_LIBRARY_50[(matchingPhoto.number % FAWRN_PHOTO_LIBRARY_50.length)] ||
    FAWRN_PHOTO_LIBRARY_50[1];

  return {
    id: tpl.id,
    slug: tpl.slug,
    title: tpl.title,
    formalTitle: tpl.formalTitle,
    category: tpl.category,
    performanceStandard: tpl.performanceStandard,
    location,
    audience,
    beneficiariesCount: "30 مستفيداً",
    duration,
    objectives:
      objectives.length > 0
        ? objectives
        : [
            `تحقيق الأهداف التربوية والتعليمية لـ (${tpl.title}).`,
            "تفعيل المشاركة الإيجابية وتنمية مهارات المتعلمين.",
            "توثيق الشواهد وفق عناصر تقييم الأداء الوظيفي المعتمدة."
          ],
    summary:
      summaryRaw ||
      `تم بحمد الله إعداد وتنفيذ (${tpl.title}) وفق خطة منظمة تراعي احتياجات المتعلمين وتوظف الأساليب التربوية الحديثة، مع متابعة التفاعل وتقويم الأثر المتحقق داخل البيئة المدرسية.`,
    outcomes:
      outcomes.length > 0
        ? outcomes
        : [
            "تفاعل إيجابي متميز من المتعلمين وتحقق الأهداف المنشودة.",
            "تحسن مخرجات التعلم وارتباطها بعنصر التقييم الوزاري.",
            "توثيق التقرير والشواهد المصورة في ملف الإنجاز المهني."
          ],
    fields: tpl.fields,
    photos: [matchingPhoto.fallbackImage, secondPhoto.fallbackImage]
  };
}

export const SEED_WITNESSES: SavedWitness[] = FAWRN_311_TEMPLATES.slice(0, 4).map((tpl, idx) => {
  const details = extractTemplateDetails(tpl);
  return {
    id: `w-seed-${idx + 1}`,
    slug: tpl.slug,
    title: details.title,
    formalTitle: details.formalTitle,
    category: details.category,
    performanceStandard: details.performanceStandard,
    stage: "المرحلة الثانوية",
    subject: "المهارات الرقمية",
    date: "1448/03/19 هـ",
    dateGregorian: "2026/09/01 م",
    location: details.location,
    audience: details.audience,
    beneficiariesCount: details.beneficiariesCount,
    duration: details.duration,
    objectives: details.objectives,
    summary: details.summary,
    outcomes: details.outcomes,
    recommendations: ["الاستمرار في تفعيل المبادرة وتعميم أثرها في الفصول الدراسية القادمة."],
    fields: tpl.fields,
    photos: details.photos,
    xAccount: "@School_MOE",
    designId: "moe-1448",
    createdAt: new Date().toISOString()
  };
});

export const TEACHER_SUBSCRIPTION_FEATURES = [
  "ملف الإنجاز الشامل (70 صفحة / 8 فصول / 11 عنصر تقييم وزاري بالأوزان) جاهز للطباعة و PDF",
  "جميع قوالب تقارير شواهد الأداء الجاهزة (311 قالباً في 6 تصنيفات) معبأة ومصاغة بالكامل",
  "سجل الخطة العلاجية والإثرائية التفاعلي مع القياس القبلي والبعدي وحساب نسب الإتقان",
  "مكتبة صور الشواهد الجاهزة (50 نموذجاً مصوراً) ومنشئ التقارير بالذكاء الاصطناعي والإملاء الصوتي",
  "إزالة العلامة المائية وسطر التجربة من كافة التقارير وصفحات ملف الإنجاز بمقاس A4"
];

export const TEACHER_CONFIG = {
  price: 90,
  termPrice: 49,
  period: "سنة",
  whatsapp: "0539571077",
  waNumber: "966539571077",
  waLink:
    "https://wa.me/966539571077?text=" +
    encodeURIComponent("السلام عليكم، أرغب بالاشتراك في منصة زيد الرقمية للمعلم (90 ريال / سنة أو 49 ريال / فصل دراسي)")
};

export { FAWRN_311_TEMPLATES, FAWRN_PHOTO_LIBRARY_50, PORTFOLIO_70_PAGES, ELEVEN_EVALUATION_ELEMENTS };
export type { FawrnReadyTemplate, FawrnTemplateField };
