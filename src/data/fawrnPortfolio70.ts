/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EvaluationElement11 {
  id: string;
  number: number;
  title: string;
  weight: string;
  weightValue: number;
  detailPage: number;
  evidencePage: number;
  description: string;
  verificationIndicators: string[];
  procedures: string[];
  defaultEvidenceTitle: string;
  defaultEvidenceSummary: string;
  defaultEvidenceSource: string;
}

export interface PortfolioChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  startPage: number;
  endPage: number;
}

export type PortfolioPageType =
  | "cover"
  | "identity"
  | "profile"
  | "career"
  | "introduction-objectives"
  | "direction"
  | "contents"
  | "chapter-divider"
  | "tasks-schedule"
  | "annual-plan"
  | "evaluation-overview"
  | "performance-covenant"
  | "element-detail"
  | "element-evidence"
  | "ethics-assignments"
  | "awards-achievements"
  | "certificates-thanks"
  | "training-workshops"
  | "conferences-memberships"
  | "plc-visits"
  | "self-evaluation"
  | "parents-communication"
  | "parent-meeting-minutes"
  | "student-followup-form"
  | "strategies-differentiation"
  | "lesson-execution-plan"
  | "tech-media-log"
  | "learning-env-checklist"
  | "classroom-management-plan"
  | "student-classification"
  | "learning-loss-remedial"
  | "results-analysis-periods"
  | "pre-post-test-analysis"
  | "student-honoring-log"
  | "assessment-tools-log"
  | "milestone-performance-review"
  | "individual-pd-plan"
  | "linked-evidence-index"
  | "final-portfolio-report"
  | "completion-approval"
  | "closing-page";

export interface PortfolioPageDef {
  pageNumber: number;
  id: string;
  title: string;
  subtitle: string;
  chapterNumber: number; // 0 for intro pages 1-7, 1..8 for chapters
  type: PortfolioPageType;
  elementNumber?: number; // 1..11 for chapter 2 element pages
  isQuickModeIncluded?: boolean;
}

export interface PhotoLibraryItem {
  id: string;
  number: number;
  title: string;
  category: "مبادرات مدرسية" | "أيام عالمية" | "استراتيجيات" | "وسائل تعليمية";
  badge: string;
  accentColor: string;
  iconType: "ai" | "national" | "strategy" | "media" | "green" | "award" | "reading" | "safety";
  fallbackImage: string;
  caption: string;
}

export const ELEVEN_EVALUATION_ELEMENTS: EvaluationElement11[] = [
  {
    id: "elem-1",
    number: 1,
    title: "أداء الواجبات الوظيفية",
    weight: "10%",
    weightValue: 10,
    detailPage: 14,
    evidencePage: 15,
    description: "الالتزام بالدوام الرسمي، وتأدية الحصص الدراسية وفق الجدول، والمشاركة الفاعلة في الإشراف اليومي والاحتياط واللجان المدرسية.",
    verificationIndicators: [
      "الانتظام في الحضور والانصراف وفق سجلات الدوام الرسمية.",
      "تنفيذ الحصص الدراسية وحصص الانتظار والإشراف اليومي والمناوبة بكفاءة.",
      "المشاركة الفاعلة في اللجان والأنشطة المدرسية المسندة.",
      "الالتزام بالأنظمة والتعاميم الوزارية واللوائح التنظيمية."
    ],
    procedures: [
      "توثيق سجل الحضور والانصراف الشهري ونسبة الانضباط (100%).",
      "تفعيل الإشراف الصباحي والفسح والمناوبة وفق الجدول المدرسي.",
      "تنفيذ مهام اللجان المدرسية وإعداد تقارير الإنجاز الدورية.",
      "أرشفة خطابات التكليف الرسمية ومحاضر الاجتماعات."
    ],
    defaultEvidenceTitle: "توثيق الانضباط الوظيفي والمشاركة في الإشراف واللجان المدرسية",
    defaultEvidenceSummary: "تم الالتزام الكامل بالدوام الرسمي وتنفيذ كافة حصص الجدول الدراسي والإشراف اليومي والمشاركة في اللجان المدرسية المعتمدة.",
    defaultEvidenceSource: "سجل الدوام الرسمي + خطابات التكليف الإدارية"
  },
  {
    id: "elem-2",
    number: 2,
    title: "التفاعل مع المجتمع المهني",
    weight: "10%",
    weightValue: 10,
    detailPage: 16,
    evidencePage: 17,
    description: "المشاركة الفاعلة في مجتمعات التعلم المهنية، وتبادل الزيارات الصفية، وحضور الدورات التدريبية وورش العمل التربوية.",
    verificationIndicators: [
      "المشاركة النشطة في لقاءات مجتمعات التعلم المهنية (PLC) بالتخصص.",
      "تنفيذ زيارات صفية تبادلية مع الزملاء لتبادل الخبرات التدريسية.",
      "تقديم أو حضور دروس تطبيقية وورش عمل تطويرية داخل المدرسة أو خارجها.",
      "الإسهام في نشر المعرفة التربوية والممارسات التعليمية المتميزة."
    ],
    procedures: [
      "حضور وتوثيق جلسات مجتمعات التعلم المهنية الأسبوعية والشهرية.",
      "تنفيذ زيارتين تبادليتين على الأقل في كل فصل دراسي وتدوين التوصيات.",
      "المشاركة في البرامج التدريبية المعتمدة من المعهد الوطني للتطوير المهني.",
      "إعداد حقيبة أو نشرة تربوية رقمية ومشاركتها مع معلمي التخصص."
    ],
    defaultEvidenceTitle: "تقرير المشاركة في مجتمعات التعلم المهنية وتبادل الزيارات الصفية",
    defaultEvidenceSummary: "تم عقد لقاءات مهنية تشاركية وتبادل الزيارات الصفية مع الزملاء في التخصص لمناقشة استراتيجيات التدريس الحديثة وتطوير أدوات التقويم.",
    defaultEvidenceSource: "سجل مجتمعات التعلم المهنية + استمارات الزيارات التبادلية"
  },
  {
    id: "elem-3",
    number: 3,
    title: "التفاعل مع أولياء الأمور",
    weight: "10%",
    weightValue: 10,
    detailPage: 18,
    evidencePage: 19,
    description: "التواصل الإيجابي والمنتظم مع أولياء الأمور لإطلاعهم على مستوى تحصيل أبنائهم وسلوكهم، وإشراكهم في الخطط العلاجية والإثرائية.",
    verificationIndicators: [
      "تفعيل قنوات التواصل المعتمدة (منصة مدرستي، الرسائل، اللقاءات الحضورية).",
      "تزويد أولياء الأمور بتقارير دورية عن المستوى التحصيلي والسلوكي للمتعلمين.",
      "المشاركة الفاعلة في الجمعية العمومية ومجالس أولياء الأمور بالمدرسة.",
      "التنسيق مع الموجه الطلابي وأولياء الأمور في معالجة التحديات الدراسية."
    ],
    procedures: [
      "إرسال إشعارات تفوق وتحفيز دورية لأولياء أمور الطلاب المتميزين.",
      "عقد لقاءات فردية مع أولياء أمور الطلاب المستهدفين بالخطط العلاجية.",
      "توثيق المراسلات والاجتماعات في سجل الشراكة الأسرية.",
      "إشراك الأسرة في متابعة المهمات الأدائية والواجبات المنزلية."
    ],
    defaultEvidenceTitle: "تقرير تفعيل الشراكة الأسرية ومجلس أولياء الأمور",
    defaultEvidenceSummary: "تم التواصل المستمر مع أولياء الأمور عبر منصة مدرستي واللقاءات الفردية لإطلاعهم على الخطط الفصلية ومستويات التقدم الدراسي.",
    defaultEvidenceSource: "سجل التواصل مع أولياء الأمور + منصة مدرستي"
  },
  {
    id: "elem-4",
    number: 4,
    title: "التنويع في استراتيجيات التدريس",
    weight: "10%",
    weightValue: 10,
    detailPage: 20,
    evidencePage: 21,
    description: "توظيف استراتيجيات تدريس متنوعة وحديثة تركز على المتعلم، وتراعي الفروق الفردية وأنماط التعلم المختلفة وتنمي مهارات التفكير العليا.",
    verificationIndicators: [
      "تطبيق استراتيجيات التعلم النشط والتعلم التعاوني بفاعلية داخل الحصة.",
      "مراعاة الفروق الفردية وتطبيق التدريس المتمايز وفق مستويات المتعلمين.",
      "تفعيل استراتيجيات تنمية التفكير الناقد والإبداعي وحل المشكلات.",
      "ارتباط الاستراتيجية المختارة بأهداف الدرس ومخرجات التعلم المستهدفة."
    ],
    procedures: [
      "إعداد مصفوفة استراتيجيات التدريس المطبقة في وحدات المقرر الدراسي.",
      "تطبيق استراتيجيات (الخرائط الذهنية، سكامبر، التدريس التبادلي، القبعات الست).",
      "تصميم أوراق عمل متمايزة تناسب أنماط التعلم البصرية والسمعية والحركية.",
      "توثيق تفاعل الطلاب ومخرجات المجموعات التعاونية بالصور والتقارير."
    ],
    defaultEvidenceTitle: "تقرير تطبيق استراتيجيات التعلم النشط والتدريس المتمايز",
    defaultEvidenceSummary: "تم توظيف مجموعة متنوعة من استراتيجيات التعلم النشط والتفكير الناقد بما يراعي الفروق الفردية ويرفع مستوى المشاركة الإيجابية.",
    defaultEvidenceSource: "سجل استراتيجيات التدريس + نماذج أوراق العمل"
  },
  {
    id: "elem-5",
    number: 5,
    title: "تحسين نتائج المتعلمين",
    weight: "10%",
    weightValue: 10,
    detailPage: 22,
    evidencePage: 23,
    description: "بناء وتنفيذ خطط علاجية وإثرائية فاعلة بناءً على نتائج التشخيص لرفع مستوى التحصيل الدراسي ومعالجة الفاقد التعليمي.",
    verificationIndicators: [
      "تشخيص الفاقد التعليمي والمهارات الأساسية غير المتقنة بدقة.",
      "تصميم وتنفيذ خطط علاجية فردية وجماعية للطلاب دون مستوى الإتقان.",
      "تقديم برامج ومهام إثرائية للطلاب المتفوقين والموهوبين.",
      "تحقق نمو ملموس في نتائج المتعلمين بين الاختبارين القبلي والبعدي."
    ],
    procedures: [
      "إجراء اختبار تشخيصي قبلي في بداية الفصل الدراسي وتحديد الفجوات المهارية.",
      "تنفيذ حصص دعم علاجي وأوراق عمل تفريدية ومتابعة التقدم أسبوعياً.",
      "تطبيق قياس بعدي مقنن وحساب نسبة التحسن في إتقان المهارات.",
      "تكريم الطلاب المتحسنين والمتفوقين لتعزيز الدافعية الذاتية."
    ],
    defaultEvidenceTitle: "تقرير تنفيذ الخطة العلاجية والإثرائية وقياس التحسن البعدي",
    defaultEvidenceSummary: "أظهرت نتائج القياس البعدي تحسناً ملموساً في مستوى إتقان المهارات المستهدفة بعد تطبيق الخطة العلاجية والأنشطة الإثرائية.",
    defaultEvidenceSource: "سجل الخطة العلاجية والإثرائية + كشوف درجات القبلي والبعدي"
  },
  {
    id: "elem-6",
    number: 6,
    title: "إعداد وتنفيذ خطة التعلم",
    weight: "10%",
    weightValue: 10,
    detailPage: 24,
    evidencePage: 25,
    description: "التخطيط المتكامل للدروس والالتزام بتوزيع المنهج الدراسي، وصياغة أهداف سلوكية قابلة للقياس، وتضمين الواجبات والأنشطة الإثرائية.",
    verificationIndicators: [
      "اكتمال توزيع المقرر الدراسي على أسابيع الفصل الدراسي وفق التقويم الوزاري.",
      "إعداد خطط الدروس اليومية إلكترونياً عبر منصة مدرستي قبل وقت كافٍ.",
      "صياغة أهداف تعليمية واضحة ومرتبطة بجدول المواصفات ومخرجات التعلم.",
      "تضمين خطة الدرس للتهيئة الحافزة، والأنشطة، والتقويم المرحلي والختامي، والواجبات."
    ],
    procedures: [
      "إعداد واعتماد خطة توزيع المنهج الفصلي والجدول الدراسي الأسبوعي.",
      "تحضير الدروس المتكاملة في منصة مدرستي وإرفاق الإثراءات والواجبات.",
      "ربط أنشطة الدرس بمهارات القرن الحادي والعشرين والقيم الوطنية.",
      "مراجعة مدى التقدم في تنفيذ الخطة الدراسية أسبوعياً."
    ],
    defaultEvidenceTitle: "توثيق إعداد خطط التعلم وتوزيع المقرر والتحضير في منصة مدرستي",
    defaultEvidenceSummary: "تم إعداد خطط التعلم الفصلية واليومية مكتملة العناصر (الأهداف، الاستراتيجيات، الإثراءات، الواجبات، التقويم) بنسبة إنجاز 100%.",
    defaultEvidenceSource: "منصة مدرستي + سجل التخطيط وتوزيع المنهج"
  },
  {
    id: "elem-7",
    number: 7,
    title: "توظيف تقنيات ووسائل التعلم المناسبة",
    weight: "10%",
    weightValue: 10,
    detailPage: 26,
    evidencePage: 27,
    description: "دمج التقنيات الرقمية والمنصات التفاعلية والوسائل التعليمية السمعية والبصرية والذكاء الاصطناعي في التدريس لتعزيز الفهم.",
    verificationIndicators: [
      "التوظيف الفاعل لأدوات منصة مدرستي والمحتوى الرقمي التفاعلي.",
      "استخدام السبورة الذكية والعروض التقديمية والمحاكاة الرقمية في الشرح.",
      "تفعيل تطبيقات التقويم التفاعلي والمسابقات الرقمية (Quizizz, Kahoot, Nearpod).",
      "تنويع الوسائل التعليمية المحسوسة والرقمية بما يناسب طبيعة الدرس."
    ],
    procedures: [
      "تصميم أنشطة واختبارات تفاعلية عبر البرامج التقنية الحديثة.",
      "توظيف أدوات الذكاء الاصطناعي والوسائط المتعددة في تبسيط المفاهيم.",
      "توثيق استخدام المعامل الافتراضية ومصادر التعلم والسبورة التفاعلية.",
      "حصر الوسائل التعليمية والتقنية المطبقة خلال الفصل الدراسي."
    ],
    defaultEvidenceTitle: "تقرير توظيف التقنيات الرقمية والسبورة التفاعلية والمنصات الذكية",
    defaultEvidenceSummary: "تم دمج المنصات التفاعلية والعروض المرئية والسبورة الذكية في الحصص الدراسية مما ساهم في جذب انتباه المتعلمين وتعميق الفهم.",
    defaultEvidenceSource: "سجل التقنيات والوسائل التعليمية + تقارير البرامج التقنية"
  },
  {
    id: "elem-8",
    number: 8,
    title: "تهيئة بيئة تعليمية",
    weight: "5%",
    weightValue: 5,
    detailPage: 28,
    evidencePage: 29,
    description: "توفير بيئة صفية آمنة، جاذبة، ومحفزة نفسياً ومادياً، تدعم التعلم التعاوني وتراعي احتياجات المتعلمين وتشجع على الإبداع.",
    verificationIndicators: [
      "تنظيم البيئة المادية للفصل بما يدعم العمل الجماعي وسهولة الحركة.",
      "توفير مناخ صفي آمن نفسياً يقوم على الاحترام المتبادل والتقدير.",
      "تفعيل أركان التعلم ولوحات الشرف والتعزيز والتحفيز داخل الصف.",
      "مراعاة اشتراطات الأمن والسلامة والنظافة والترتيب داخل القاعة الصفية."
    ],
    procedures: [
      "تطبيق قائمة فحص جاهزية وتهيئة البيئة الصفية في بداية كل فصل دراسي.",
      "تخصيص لوحة تعزيز وإشادة بأعمال وإبداعات الطلاب المتميزة.",
      "تنويع ترتيب المقاعد (مجموعات تعاونية، حرف U، أركان تعلم) حسب النشاط.",
      "تفعيل مبادرات البيئة المدرسية الجاذبة والاحتفاء بالمناسبات الوطنية."
    ],
    defaultEvidenceTitle: "تقرير تهيئة البيئة التعليمية الصفية المحفزة والجاذبة",
    defaultEvidenceSummary: "تم تنظيم القاعة الصفية وتجهيز أركان التعلم ولوحات التعزيز وتوفير مناخ تربوي آمن ومحفز يدعم المشاركة والإبداع.",
    defaultEvidenceSource: "قائمة تهيئة البيئة التعليمية + الشواهد المصورة للفصل"
  },
  {
    id: "elem-9",
    number: 9,
    title: "الإدارة الصفية",
    weight: "5%",
    weightValue: 5,
    detailPage: 30,
    evidencePage: 31,
    description: "قيادة الصف بكفاءة، واستثمار زمن التعلم الفعلي، وبناء القواعد الصفية التشاركية، وتعزيز الانضباط السلوكي الإيجابي.",
    verificationIndicators: [
      "وضع ميثاق وقواعد صفية واضحة بالتشارك مع المتعلمين والالتزام بها.",
      "الإدارة الفاعلة لزمن الحصة الدراسية وتوزيع الوقت بدقة بين عناصر الدرس.",
      "استخدام أساليب التعزيز الإيجابي المتنوعة وضبط السلوك بأساليب تربوية.",
      "الحفاظ على انتباه الطلاب وحيويتهم طوال وقت الحصة الدراسية."
    ],
    procedures: [
      "إعداد وتوقيع ميثاق القواعد الصفية وعقود الشرف الأسبوعية مع الطلاب.",
      "تطبيق استراتيجيات الإدارة الصفية الحديثة (الإشارات المتفق عليها، التحدي الموقوت، لوحة الشرف).",
      "استثمار الدقائق الخمس الأولى في التهيئة الجاذبة والدقائق الأخيرة في الغلق التقويمي.",
      "رصد ومتابعة الانضباط السلوكي والالتزام الصفي يومياً."
    ],
    defaultEvidenceTitle: "تقرير تطبيق استراتيجيات الإدارة الصفية والتعزيز الإيجابي",
    defaultEvidenceSummary: "تم بناء القواعد الصفية التشاركية وتوظيف استراتيجيات التعزيز الإيجابي وإدارة زمن التعلم بكفاءة عالية طوال الحصة الدراسية.",
    defaultEvidenceSource: "خطة الإدارة الصفية + تقارير استراتيجيات ضبط الصف"
  },
  {
    id: "elem-10",
    number: 10,
    title: "تحليل نتائج المتعلمين وتشخيص مستوياتهم",
    weight: "10%",
    weightValue: 10,
    detailPage: 32,
    evidencePage: 33,
    description: "إجراء تحليل إحصائي ونوعي لنتائج الاختبارات التشخيصية والفترية والنهائية، وتصنيف المتعلمين وفق مستويات الإتقان لبناء خطط التدخل.",
    verificationIndicators: [
      "تحليل نتائج الاختبارات الفترية والنهائية إحصائياً (المتوسط، نسبة الإتقان، التقديرات).",
      "تصنيف المتعلمين بدقة إلى فئات (متفوق، متقن، بحاجة إلى دعم) بناءً على البيانات.",
      "تحديد المهارات والفقرات الأكثر صعوبة وتفسير أسباب التعثر الدراسي.",
      "توظيف مخرجات التحليل في تعديل طرق التدريس وبناء الخطط العلاجية."
    ],
    procedures: [
      "إصدار بطاقات تحليل النتائج عقب كل فترة تقويمية لكل فصل دراسي.",
      "رسم المؤشرات البيانية لمقارنة أداء الشعب الدراسية ونسب التقدم.",
      "حصر الطلاب حسب مستويات التحصيل وتوثيق قوائم المستهدفين بالدعم والإثراء.",
      "مناقشة نتائج التحليل مع إدارة المدرسة والموجه الطلابي."
    ],
    defaultEvidenceTitle: "تقرير التحليل الإحصائي لنتائج المتعلمين وتصنيف مستويات التحصيل",
    defaultEvidenceSummary: "تم تحليل نتائج الاختبارات التشخيصية والفترية إحصائياً وتصنيف المتعلمين وفق مستويات الإتقان لتوجيه خطط الدعم والإثراء.",
    defaultEvidenceSource: "جداول تحليل النتائج الإحصائية + استمارة تصنيف المتعلمين"
  },
  {
    id: "elem-11",
    number: 11,
    title: "تنوع أساليب وأدوات التقويم",
    weight: "10%",
    weightValue: 10,
    detailPage: 34,
    evidencePage: 35,
    description: "استخدام أساليب وأدوات تقويم متنوعة (قبلية، تكوينية، ختامية) تشمل الاختبارات، المهمات الأدائية، المشروعات، قوائم الشطب، وسلالم التقدير.",
    verificationIndicators: [
      "التنويع بين أدوات التقويم التشخيصي والتكويني والختامي والبديل.",
      "تصميم مهمات أدائية ومشاريع عملية تقيس الفهم العميق وتطبيق المعرفة.",
      "استخدام سلالم التقدير اللفظية والرقمية (Rubrics) وقوائم الملاحظة.",
      "تقديم تغذية راجعة فورية وبناءة للمتعلمين تساعدهم على تحسين أدائهم."
    ],
    procedures: [
      "إعداد سجل شامل لأساليب وأدوات التقويم المطبقة في المقرر الدراسي.",
      "بناء اختبارات قصيرة وفترية وفق جدول المواصفات ومعايير الجودة.",
      "تفعيل ملفات إنجاز الطلاب والمهمات الأدائية والتقويم الذاتي وتقويم الأقران.",
      "توثيق نماذج من أوراق الاختبارات والمهمات الأدائية المصححة مع التغذية الراجعة."
    ],
    defaultEvidenceTitle: "تقرير تنويع أساليب وأدوات التقويم والمهمات الأدائية وسلالم التقدير",
    defaultEvidenceSummary: "تم تطبيق منظومة تقويم متكاملة شملت الاختبارات المقننة، المهمات الأدائية، المشاريع التطبيقية، وسلالم التقدير مع تغذية راجعة مستمرة.",
    defaultEvidenceSource: "سجل أساليب وأدوات التقويم + نماذج المهمات الأدائية والاختبارات"
  }
];

export const PORTFOLIO_CHAPTERS: PortfolioChapter[] = [
  {
    id: "ch-0",
    number: 0,
    title: "المقدمات والهوية والفهرس العام",
    subtitle: "الغلاف، الهوية، السيرة الذاتية، المقدمة، الرؤية والرسالة، وفهرس الفصول",
    startPage: 1,
    endPage: 7
  },
  {
    id: "ch-1",
    number: 1,
    title: "الفصل الأول: البيانات الأساسية والخطة السنوية",
    subtitle: "المهام التعليمية والتكليفات والجدول الدراسي وخطة العمل السنوية والفصلية",
    startPage: 8,
    endPage: 10
  },
  {
    id: "ch-2",
    number: 2,
    title: "الفصل الثاني: إدارة أداء المعلم والعناصر الـ 11",
    subtitle: "ميثاق الأداء وتفصيل وشواهد جميع عناصر تقييم الأداء الوظيفي الـ 11 بأوزانها النسبية",
    startPage: 11,
    endPage: 35
  },
  {
    id: "ch-3",
    number: 3,
    title: "الفصل الثالث: الواجبات المهنية وأخلاقيات المهنة",
    subtitle: "ميثاق أخلاقيات المهنة، سجل التكليفات، الجوائز والإنجازات، وشهادات الشكر والتقدير",
    startPage: 36,
    endPage: 41
  },
  {
    id: "ch-4",
    number: 4,
    title: "الفصل الرابع: المجتمع المهني والتطوير",
    subtitle: "الدورات التدريبية، المؤتمرات والندوات، مجتمعات التعلم المهنية، والتقويم الذاتي",
    startPage: 42,
    endPage: 46
  },
  {
    id: "ch-5",
    number: 5,
    title: "الفصل الخامس: الشراكة مع أولياء الأمور",
    subtitle: "سجل التواصل مع أولياء الأمور، محاضر الاجتماعات الفردية، واستمارة متابعة طالب",
    startPage: 47,
    endPage: 50
  },
  {
    id: "ch-6",
    number: 6,
    title: "الفصل السادس: التعليم والتعلم",
    subtitle: "تنويع الاستراتيجيات، خطة تنفيذ درس، سجل التقنيات والوسائل، تهيئة البيئة، والإدارة الصفية",
    startPage: 51,
    endPage: 56
  },
  {
    id: "ch-7",
    number: 7,
    title: "الفصل السابع: نتائج المتعلمين وخطط التحسين",
    subtitle: "تصنيف المتعلمين، حصر الفاقد التعليمي، تحليل النتائج الفترية والقبلية والبعدية، وسجل التكريم",
    startPage: 57,
    endPage: 62
  },
  {
    id: "ch-8",
    number: 8,
    title: "الفصل الثامن: التقويم والإنجازات والتقييم الختامي",
    subtitle: "سجل أدوات التقويم، المراجعة المرحلية، خطة التطوير الفردية، فهرس الشواهد، التقرير الختامي والاعتماد",
    startPage: 63,
    endPage: 70
  }
];

function build70Pages(): PortfolioPageDef[] {
  const pages: PortfolioPageDef[] = [
    // Intro Pages 1-7
    {
      pageNumber: 1,
      id: "p-01-cover",
      title: "غلاف ملف إنجاز المعلم",
      subtitle: "ملف إنجاز المعلم وفق عناصر تقييم الأداء الوظيفي المعتمدة",
      chapterNumber: 0,
      type: "cover",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 2,
      id: "p-02-identity",
      title: "هوية ملف الإنجاز المهني",
      subtitle: "بطاقة تعريف الملف والبيانات الرسمية للمدرسة وإدارة التعليم",
      chapterNumber: 0,
      type: "identity"
    },
    {
      pageNumber: 3,
      id: "p-03-profile",
      title: "بيانات المعلم والسيرة الذاتية المهنية",
      subtitle: "المؤهل العلمي، الرتبة المهنية، سنوات الخبرة، تاريخ المباشرة، والنصاب التدريسي",
      chapterNumber: 0,
      type: "profile",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 4,
      id: "p-04-career",
      title: "ملخص السيرة المهنية والمهارات واللغات",
      subtitle: "الخبرات السابقة، المهارات التقنية والتربوية، والركائز المهنية",
      chapterNumber: 0,
      type: "career"
    },
    {
      pageNumber: 5,
      id: "p-05-intro",
      title: "المقدمة والأهداف العامة لملف الإنجاز",
      subtitle: "فلسفة توثيق الأداء المهني وأهداف الملف خلال العام الدراسي",
      chapterNumber: 0,
      type: "introduction-objectives"
    },
    {
      pageNumber: 6,
      id: "p-06-direction",
      title: "الرؤية والرسالة والقيم المهنية",
      subtitle: "المنطلقات التربوية للمعلم في ضوء مستهدفات وزارة التعليم ورؤية 2030",
      chapterNumber: 0,
      type: "direction",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 7,
      id: "p-07-contents",
      title: "فهرس محتويات ملف الإنجاز (الفصول الثمانية)",
      subtitle: "خريطة شاملة لصفحات الملف الـ 70 وتوزيع الفصول والعناصر",
      chapterNumber: 0,
      type: "contents",
      isQuickModeIncluded: true
    },

    // Chapter 1: Pages 8-10
    {
      pageNumber: 8,
      id: "p-08-ch1-div",
      title: "الفصل الأول: البيانات الأساسية والخطة السنوية",
      subtitle: "فاصل الفصل الأول — المهام التعليمية والجدول الدراسي والخطة السنوية",
      chapterNumber: 1,
      type: "chapter-divider"
    },
    {
      pageNumber: 9,
      id: "p-09-tasks",
      title: "البيانات الأساسية والمهام التعليمية والجدول الدراسي",
      subtitle: "جدول الحصص الأسبوعي والمقررات المسندة واللجان المدرسية",
      chapterNumber: 1,
      type: "tasks-schedule",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 10,
      id: "p-10-annual-plan",
      title: "خطة العمل السنوية والفصلية وتوزيع المنهج",
      subtitle: "مصفوفة توزيع الوحدات الدراسية والأنشطة المصاحبة على أسابيع الفصل",
      chapterNumber: 1,
      type: "annual-plan",
      isQuickModeIncluded: true
    },

    // Chapter 2: Pages 11-35
    {
      pageNumber: 11,
      id: "p-11-ch2-div",
      title: "الفصل الثاني: إدارة أداء المعلم والعناصر الـ 11",
      subtitle: "فاصل الفصل الثاني — ميثاق الأداء وتوثيق عناصر التقييم الوظيفي الـ 11",
      chapterNumber: 2,
      type: "chapter-divider"
    },
    {
      pageNumber: 12,
      id: "p-12-eval-overview",
      title: "نظرة عامة على منظومة تقييم الأداء الوظيفي للمعلم",
      subtitle: "آلية التقييم، مستويات الإتقان، ودور الشواهد الموثقة في تحقيق التميز",
      chapterNumber: 2,
      type: "evaluation-overview"
    },
    {
      pageNumber: 13,
      id: "p-13-covenant",
      title: "ملخص ميثاق الأداء وعناصر التقييم الـ 11 والأوزان النسبية",
      subtitle: "جدول الأوزان النسبية المعتمد (100%) ومؤشرات الإنجاز لكل عنصر",
      chapterNumber: 2,
      type: "performance-covenant",
      isQuickModeIncluded: true
    }
  ];

  // Pages 14 to 35: 2 pages per element (11 elements * 2 = 22 pages)
  ELEVEN_EVALUATION_ELEMENTS.forEach((elem) => {
    pages.push({
      pageNumber: elem.detailPage,
      id: `p-${elem.detailPage}-elem-${elem.number}-detail`,
      title: `العنصر (${elem.number}): ${elem.title} — الوزن النسبي (${elem.weight})`,
      subtitle: "بطاقة تفصيل العنصر، معايير التحقق، الإجراءات المنفذة، وتقدير الأداء",
      chapterNumber: 2,
      type: "element-detail",
      elementNumber: elem.number,
      isQuickModeIncluded: true
    });
    pages.push({
      pageNumber: elem.evidencePage,
      id: `p-${elem.evidencePage}-elem-${elem.number}-evidence`,
      title: `شواهد العنصر (${elem.number}): ${elem.title}`,
      subtitle: "توثيق الشواهد الفوتوغرافية والنماذج المرفقة ومصدر التحقق والتاريخ",
      chapterNumber: 2,
      type: "element-evidence",
      elementNumber: elem.number,
      isQuickModeIncluded: true
    });
  });

  // Chapter 3: Pages 36-41
  pages.push(
    {
      pageNumber: 36,
      id: "p-36-ch3-div",
      title: "الفصل الثالث: الواجبات المهنية وأخلاقيات المهنة",
      subtitle: "فاصل الفصل الثالث — ميثاق أخلاقيات المهنة والتكليفات والجوائز وشهادات الشكر",
      chapterNumber: 3,
      type: "chapter-divider"
    },
    {
      pageNumber: 37,
      id: "p-37-ethics",
      title: "ميثاق أخلاقيات مهنة التعليم وسجل التكليفات الرسمية",
      subtitle: "الإقرار بميثاق التعليم ورصد التكليفات الإدارية والمدرسية خلال العام",
      chapterNumber: 3,
      type: "ethics-assignments"
    },
    {
      pageNumber: 38,
      id: "p-38-awards",
      title: "سجل الجوائز والإنجازات والمساهمات المهنية النوعية",
      subtitle: "توثيق المبادرات التربوية والجوائز والمشاركات المتميزة",
      chapterNumber: 3,
      type: "awards-achievements"
    },
    {
      pageNumber: 39,
      id: "p-39-awards-ev",
      title: "شواهد الجوائز والإنجازات والمبادرات التربوية",
      subtitle: "مرفقات وصور الدروع والمبادرات المنفذة على مستوى المدرسة والإدارة",
      chapterNumber: 3,
      type: "awards-achievements"
    },
    {
      pageNumber: 40,
      id: "p-40-certs",
      title: "سجل شهادات الشكر والتقدير",
      subtitle: "بيان بخطابات وشهادات الشكر والتقدير الصادرة من إدارة المدرسة والإشراف",
      chapterNumber: 3,
      type: "certificates-thanks",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 41,
      id: "p-41-certs-ev",
      title: "شواهد ومرفقات شهادات الشكر والتقدير",
      subtitle: "نسخ مصورة من شهادات الشكر والتقدير المعتمدة",
      chapterNumber: 3,
      type: "certificates-thanks"
    }
  );

  // Chapter 4: Pages 42-46
  pages.push(
    {
      pageNumber: 42,
      id: "p-42-ch4-div",
      title: "الفصل الرابع: المجتمع المهني والتطوير",
      subtitle: "فاصل الفصل الرابع — الدورات التدريبية والندوات ومجتمعات التعلم المهنية",
      chapterNumber: 4,
      type: "chapter-divider"
    },
    {
      pageNumber: 43,
      id: "p-43-training",
      title: "سجل الدورات التدريبية وورش العمل المهنية",
      subtitle: "البرامج التدريبية المعتمدة وساعات التطوير المهني وأثرها في التدريس",
      chapterNumber: 4,
      type: "training-workshops",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 44,
      id: "p-44-conferences",
      title: "المؤتمرات والندوات واللقاءات التربوية والعضويات العلمية",
      subtitle: "المشاركات العلمية والملتقيات التربوية واللجان التخصصية",
      chapterNumber: 4,
      type: "conferences-memberships"
    },
    {
      pageNumber: 45,
      id: "p-45-plc",
      title: "مشاركات مجتمعات التعلم المهنية (PLC) وتبادل الزيارات",
      subtitle: "استمارة الزيارات التبادلية والدروس التطبيقية وحلقات النقاش المهني",
      chapterNumber: 4,
      type: "plc-visits"
    },
    {
      pageNumber: 46,
      id: "p-46-self-eval",
      title: "استمارة التقويم الذاتي للممارسة المهنية للمعلم",
      subtitle: "تأمل مهني في نقاط القوة وفرص التحسين ومستوى تحقق الأهداف",
      chapterNumber: 4,
      type: "self-evaluation"
    }
  );

  // Chapter 5: Pages 47-50
  pages.push(
    {
      pageNumber: 47,
      id: "p-47-ch5-div",
      title: "الفصل الخامس: الشراكة مع أولياء الأمور",
      subtitle: "فاصل الفصل الخامس — التواصل الأسري ومحاضر الاجتماعات ومتابعة الطلاب",
      chapterNumber: 5,
      type: "chapter-divider"
    },
    {
      pageNumber: 48,
      id: "p-48-parents-log",
      title: "سجل التواصل مع أولياء الأمور والشراكة الأسرية",
      subtitle: "رصد قنوات التواصل الدورية وموضوعات الاستشارات التربوية والأكاديمية",
      chapterNumber: 5,
      type: "parents-communication"
    },
    {
      pageNumber: 49,
      id: "p-49-parent-meeting",
      title: "محضر اجتماع فردي مع ولي أمر طالب/ـة",
      subtitle: "توثيق اللقاء الإرشادي والأكاديمي والاتفاقيات المشتركة لدعم المتعلم",
      chapterNumber: 5,
      type: "parent-meeting-minutes"
    },
    {
      pageNumber: 50,
      id: "p-50-student-followup",
      title: "استمارة متابعة طالب/ـة (تحصيلياً وسلوكياً)",
      subtitle: "بطاقة متابعة دورية لمستوى الانضباط والواجبات والمشاركة الصفية",
      chapterNumber: 5,
      type: "student-followup-form"
    }
  );

  // Chapter 6: Pages 51-56
  pages.push(
    {
      pageNumber: 51,
      id: "p-51-ch6-div",
      title: "الفصل السادس: التعليم والتعلم",
      subtitle: "فاصل الفصل السادس — الاستراتيجيات وتنفيذ الدروس والتقنيات والبيئة الصفية",
      chapterNumber: 6,
      type: "chapter-divider"
    },
    {
      pageNumber: 52,
      id: "p-52-strategies",
      title: "سجل تنويع استراتيجيات التدريس ومراعاة الفروق الفردية",
      subtitle: "مصفوفة الاستراتيجيات الحديثة المطبقة وأثرها في تفاعل المتعلمين",
      chapterNumber: 6,
      type: "strategies-differentiation"
    },
    {
      pageNumber: 53,
      id: "p-53-lesson-plan",
      title: "نموذج خطة إعداد وتنفيذ درس نموذجي",
      subtitle: "تخطيط متكامل للأهداف والتهيئة والاستراتيجيات والتقويم والغلق",
      chapterNumber: 6,
      type: "lesson-execution-plan"
    },
    {
      pageNumber: 54,
      id: "p-54-tech-log",
      title: "سجل توظيف التقنيات والوسائل التعليمية والمنصات الرقمية",
      subtitle: "حصر البرامج التفاعلية والوسائل السمعية والبصرية الموظفة في الحصص",
      chapterNumber: 6,
      type: "tech-media-log"
    },
    {
      pageNumber: 55,
      id: "p-55-env-checklist",
      title: "قائمة تهيئة البيئة التعليمية الصفية",
      subtitle: "معايير الجاهزية المادية والنفسية والأمن والسلامة وأركان التحفيز",
      chapterNumber: 6,
      type: "learning-env-checklist"
    },
    {
      pageNumber: 56,
      id: "p-56-class-mgmt",
      title: "خطة الإدارة الصفية وميثاق القواعد الصفية",
      subtitle: "آليات ضبط الصف، توزيع زمن التعلم، ومنظومة التعزيز الإيجابي",
      chapterNumber: 6,
      type: "classroom-management-plan"
    }
  );

  // Chapter 7: Pages 57-62
  pages.push(
    {
      pageNumber: 57,
      id: "p-57-ch7-div",
      title: "الفصل السابع: نتائج المتعلمين وخطط التحسين",
      subtitle: "فاصل الفصل السابع — تشخيص المستويات والخطط العلاجية وتحليل النتائج",
      chapterNumber: 7,
      type: "chapter-divider"
    },
    {
      pageNumber: 58,
      id: "p-58-classification",
      title: "تصنيف المتعلمين وفق مستوياتهم التحصيلية",
      subtitle: "فرز الطلاب إلى فئات (متفوق / متقن / بحاجة لدعم) بناءً على التشخيص",
      chapterNumber: 7,
      type: "student-classification"
    },
    {
      pageNumber: 59,
      id: "p-59-learning-loss",
      title: "استمارة حصر الفاقد التعليمي وخطة المعالجة والإثراء",
      subtitle: "تحديد المهارات الحرجة والإجراءات العلاجية والجدول الزمني للتنفيذ",
      chapterNumber: 7,
      type: "learning-loss-remedial"
    },
    {
      pageNumber: 60,
      id: "p-60-results-periods",
      title: "تحليل نتائج المتعلمين خلال الفترات التقويمية",
      subtitle: "مؤشرات الإتقان والمتوسطات الحسابية وتوزيع التقديرات للفصول",
      chapterNumber: 7,
      type: "results-analysis-periods",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 61,
      id: "p-61-pre-post",
      title: "تحليل نتائج الاختبار القبلي والبعدي وقياس الأثر",
      subtitle: "مقارنة نسب الإتقان قبل وبعد التدخل العلاجي وحساب فرق التقدم",
      chapterNumber: 7,
      type: "pre-post-test-analysis"
    },
    {
      pageNumber: 62,
      id: "p-62-honoring",
      title: "سجل التكريم والتحفيز للمتعلمين المتميزين والمتحسنين",
      subtitle: "توثيق مبادرات تشجيع الطلاب ولوحات الشرف وشهادات التفوق",
      chapterNumber: 7,
      type: "student-honoring-log"
    }
  );

  // Chapter 8: Pages 63-70
  pages.push(
    {
      pageNumber: 63,
      id: "p-63-ch8-div",
      title: "الفصل الثامن: التقويم والإنجازات والتقييم الختامي",
      subtitle: "فاصل الفصل الثامن — أدوات التقويم والمراجعة المرحلية والتقرير الختامي",
      chapterNumber: 8,
      type: "chapter-divider"
    },
    {
      pageNumber: 64,
      id: "p-64-assessment-log",
      title: "سجل تنوع أساليب وأدوات التقويم والمهمات الأدائية",
      subtitle: "توثيق الاختبارات، السلالم التقديرية، المشاريع، وملفات إنجاز الطلاب",
      chapterNumber: 8,
      type: "assessment-tools-log"
    },
    {
      pageNumber: 65,
      id: "p-65-milestone-review",
      title: "نموذج المراجعة المرحلية للأداء الوظيفي (منتصف العام)",
      subtitle: "تقييم مرحلي لمستوى التقدم في تحقيق مؤشرات عناصر الأداء الـ 11",
      chapterNumber: 8,
      type: "milestone-performance-review"
    },
    {
      pageNumber: 66,
      id: "p-66-pd-plan",
      title: "خطة التطوير المهني الفردية للمعلم",
      subtitle: "الجدارات المستهدفة بالتطوير والأنشطة التدريبية المقترحة ومؤشرات الإنجاز",
      chapterNumber: 8,
      type: "individual-pd-plan"
    },
    {
      pageNumber: 67,
      id: "p-67-evidence-index",
      title: "فهرس الشواهد المربوط تلقائياً بعناصر التقييم",
      subtitle: "قائمة مرجعية بجميع الشواهد والتقارير الموثقة داخل ملف الإنجاز",
      chapterNumber: 8,
      type: "linked-evidence-index"
    },
    {
      pageNumber: 68,
      id: "p-68-final-report",
      title: "التقرير الختامي لملف الإنجاز المهني",
      subtitle: "ملخص شامل لأبرز المنجزات، ومؤشرات الأداء المتحققة، والتوصيات المستقبلية",
      chapterNumber: 8,
      type: "final-portfolio-report"
    },
    {
      pageNumber: 69,
      id: "p-69-completion",
      title: "قائمة فحص اكتمال الملف والاعتماد الرسمي",
      subtitle: "مراجعة استيفاء جميع الفصول والعناصر وتوقيع المعلم والمشرف ومدير المدرسة",
      chapterNumber: 8,
      type: "completion-approval",
      isQuickModeIncluded: true
    },
    {
      pageNumber: 70,
      id: "p-70-closing",
      title: "خاتمة ملف الإنجاز المهني",
      subtitle: "صفحة ختامية رسمية لملف إنجاز المعلم للعام الدراسي",
      chapterNumber: 8,
      type: "closing-page"
    }
  );

  return pages;
}

export const PORTFOLIO_70_PAGES: PortfolioPageDef[] = build70Pages();

const RAW_50_SAMPLES: { id: string; title: string; category: PhotoLibraryItem["category"] }[] = [
  { id: "sample-01", title: "مبادرة الذكاء الاصطناعي في التعليم", category: "مبادرات مدرسية" },
  { id: "sample-02", title: "اليوم الوطني السعودي", category: "أيام عالمية" },
  { id: "sample-03", title: "تنفيذ استراتيجية تعليمية", category: "استراتيجيات" },
  { id: "sample-04", title: "استخدام وسيلة تعليمية (السبورة الذكية)", category: "وسائل تعليمية" },
  { id: "sample-05", title: "مبادرة حفظ النعمة", category: "مبادرات مدرسية" },
  { id: "sample-06", title: "يوم التأسيس", category: "أيام عالمية" },
  { id: "sample-07", title: "استراتيجية ساعي البريد", category: "استراتيجيات" },
  { id: "sample-08", title: "مبادرة سقيا الماء", category: "مبادرات مدرسية" },
  { id: "sample-09", title: "اليوم العالمي للتوحد", category: "أيام عالمية" },
  { id: "sample-10", title: "استراتيجية قراءة الصورة", category: "استراتيجيات" },
  { id: "sample-11", title: "مبادرة الانضباط المدرسي", category: "مبادرات مدرسية" },
  { id: "sample-12", title: "اليوم العالمي لمتلازمة داون", category: "أيام عالمية" },
  { id: "sample-13", title: "استراتيجية البطاقات الملونة", category: "استراتيجيات" },
  { id: "sample-14", title: "مبادرة كسوة الشتاء", category: "مبادرات مدرسية" },
  { id: "sample-15", title: "اليوم الدولي للغات الإشارة", category: "أيام عالمية" },
  { id: "sample-16", title: "استراتيجية سكامبر (SCAMPER)", category: "استراتيجيات" },
  { id: "sample-17", title: "مبادرة مهارات المستقبل", category: "مبادرات مدرسية" },
  { id: "sample-18", title: "الأسبوع العربي للصم", category: "أيام عالمية" },
  { id: "sample-19", title: "استراتيجية الخرائط الذهنية", category: "استراتيجيات" },
  { id: "sample-20", title: "مبادرة مدرستي خضراء", category: "مبادرات مدرسية" },
  { id: "sample-21", title: "اليوم الخليجي لصعوبات التعلّم", category: "أيام عالمية" },
  { id: "sample-22", title: "استراتيجية التدريس التبادلي", category: "استراتيجيات" },
  { id: "sample-23", title: "مبادرة الخط العربي", category: "مبادرات مدرسية" },
  { id: "sample-24", title: "استراتيجية مخطط فن (Venn)", category: "استراتيجيات" },
  { id: "sample-25", title: "مبادرة القراءة", category: "مبادرات مدرسية" },
  { id: "sample-26", title: "استراتيجية فجوة المعلومات", category: "استراتيجيات" },
  { id: "sample-27", title: "مبادرة القدرات والتحصيلي", category: "مبادرات مدرسية" },
  { id: "sample-28", title: "استراتيجية حوض السمك", category: "استراتيجيات" },
  { id: "sample-29", title: "مبادرة النظافة المدرسية", category: "مبادرات مدرسية" },
  { id: "sample-30", title: "استراتيجية التدوين البصري", category: "استراتيجيات" },
  { id: "sample-31", title: "مبادرة كبار السن", category: "مبادرات مدرسية" },
  { id: "sample-32", title: "استراتيجية السبب والنتيجة", category: "استراتيجيات" },
  { id: "sample-33", title: "مبادرة التحول الرقمي", category: "مبادرات مدرسية" },
  { id: "sample-34", title: "استراتيجية البطاقات المروحية", category: "استراتيجيات" },
  { id: "sample-35", title: "مبادرة الرياضيات الممتعة", category: "مبادرات مدرسية" },
  { id: "sample-36", title: "استراتيجية القراءة الموجهة", category: "استراتيجيات" },
  { id: "sample-37", title: "مبادرة المقصف المدرسي الصحي", category: "مبادرات مدرسية" },
  { id: "sample-38", title: "استراتيجية الكلمات المتقاطعة", category: "استراتيجيات" },
  { id: "sample-39", title: "مبادرة الأمن والسلامة المدرسية", category: "مبادرات مدرسية" },
  { id: "sample-40", title: "استراتيجية شجرة المشكلات", category: "استراتيجيات" },
  { id: "sample-41", title: "مبادرة الطاقة الشمسية", category: "مبادرات مدرسية" },
  { id: "sample-42", title: "استراتيجية التعليم التعاوني", category: "استراتيجيات" },
  { id: "sample-43", title: "مبادرة الطالبة المثالية", category: "مبادرات مدرسية" },
  { id: "sample-44", title: "استراتيجية التعليم الذاتي", category: "استراتيجيات" },
  { id: "sample-45", title: "مبادرة الصلاة", category: "مبادرات مدرسية" },
  { id: "sample-46", title: "مبادرة الحقيبة المدرسية", category: "مبادرات مدرسية" },
  { id: "sample-47", title: "مبادرة ترشيد الكهرباء", category: "مبادرات مدرسية" },
  { id: "sample-48", title: "مبادرة السعودية الخضراء", category: "مبادرات مدرسية" },
  { id: "sample-49", title: "مبادرة السلة الرمضانية للأسر المحتاجة", category: "مبادرات مدرسية" },
  { id: "sample-50", title: "مبادرة التوعية بسرطان الثدي", category: "مبادرات مدرسية" }
];

// Generate crisp SVG data URLs so every single one of the 50 library photos renders a rich educational visual card immediately and prints cleanly in A4/PDF
function createEducationalSvgDataUrl(title: string, category: string, index: number): string {
  const palettes = [
    { bg1: "#080C3A", bg2: "#111A5E", accent: "#9EB1E5", badgeBg: "#EEF1FA", badgeText: "#080C3A" },
    { bg1: "#1E3A8A", bg2: "#0284C7", accent: "#38BDF8", badgeBg: "#F0F9FF", badgeText: "#075985" },
    { bg1: "#0B1247", bg2: "#1E338A", accent: "#6E88D4", badgeBg: "#EEF1FA", badgeText: "#111A5E" },
    { bg1: "#312E81", bg2: "#4F46E5", accent: "#818CF8", badgeBg: "#EEF2FF", badgeText: "#3730A3" }
  ];
  const p = palettes[index % palettes.length];
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCat = category.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="800" height="560">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.bg1}" />
        <stop offset="100%" stop-color="${p.bg2}" />
      </linearGradient>
    </defs>
    <rect width="800" height="560" rx="24" fill="url(#g)" />
    <circle cx="110" cy="110" r="140" fill="${p.accent}" fill-opacity="0.12" />
    <circle cx="690" cy="450" r="180" fill="${p.accent}" fill-opacity="0.1" />
    <rect x="36" y="36" width="728" height="488" rx="18" fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="2" />
    
    <!-- Classroom / Board Illustration -->
    <rect x="130" y="95" width="540" height="230" rx="14" fill="#FFFFFF" fill-opacity="0.96" />
    <rect x="150" y="115" width="500" height="32" rx="6" fill="${p.badgeBg}" />
    <text x="400" y="137" font-family="Cairo, Tajawal, sans-serif" font-size="16" font-weight="700" fill="${p.badgeText}" text-anchor="middle">وزارة التعليم — توثيق الشواهد التعليمية المدرسية</text>
    
    <rect x="170" y="168" width="210" height="125" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
    <circle cx="275" cy="212" r="24" fill="${p.bg2}" fill-opacity="0.15" />
    <path d="M263 212 l8 8 l18 -18" stroke="${p.bg2}" stroke-width="4" fill="none" stroke-linecap="round" />
    <text x="275" y="265" font-family="Cairo, Tajawal, sans-serif" font-size="14" font-weight="700" fill="#334155" text-anchor="middle">تطبيق عملي موثق</text>

    <rect x="405" y="168" width="225" height="24" rx="6" fill="#E2E8F0" />
    <rect x="445" y="204" width="185" height="18" rx="5" fill="#F1F5F9" />
    <rect x="425" y="232" width="205" height="18" rx="5" fill="#F1F5F9" />
    <rect x="465" y="260" width="165" height="24" rx="6" fill="${p.badgeBg}" />
    <text x="547" y="277" font-family="Cairo, Tajawal, sans-serif" font-size="13" font-weight="700" fill="${p.badgeText}" text-anchor="middle">${safeCat}</text>

    <!-- Title Banner -->
    <rect x="90" y="360" width="620" height="118" rx="16" fill="#0F172A" fill-opacity="0.45" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.5" />
    <text x="400" y="405" font-family="Cairo, Tajawal, sans-serif" font-size="25" font-weight="800" fill="#FFFFFF" text-anchor="middle">${safeTitle}</text>
    <text x="400" y="445" font-family="Cairo, Tajawal, sans-serif" font-size="16" font-weight="600" fill="#E2E8F0" text-anchor="middle">شاهد توثيقي معتمد — نموذج رقم (${index + 1}) — ${safeCat}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const FAWRN_PHOTO_LIBRARY_50: PhotoLibraryItem[] = RAW_50_SAMPLES.map((item, idx) => ({
  id: item.id,
  number: idx + 1,
  title: item.title,
  category: item.category,
  badge: `نموذج ${idx + 1}`,
  accentColor: idx % 2 === 0 ? "#080C3A" : "#111A5E",
  iconType:
    item.category === "مبادرات مدرسية"
      ? "award"
      : item.category === "أيام عالمية"
      ? "national"
      : item.category === "استراتيجيات"
      ? "strategy"
      : "media",
  fallbackImage: createEducationalSvgDataUrl(item.title, item.category, idx),
  caption: `توثيق مصور: ${item.title} (${item.category})`
}));
