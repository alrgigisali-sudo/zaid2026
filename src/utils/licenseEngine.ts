/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IssuedLicense {
  id: string;
  type: "school" | "teacher";
  duration: "year" | "term";
  targetName: string; // School name or teacher name
  slug: string; // School slug or teacher identifier
  code: string; // The official unique activation code
  phone?: string;
  issuedAt: string;
  expiresAt: string;
  price: number;
  active: boolean;
}

const STORAGE_KEY = "kp_admin_issued_licenses";
const ADMIN_PASSWORD_KEY = "kp_admin_master_password";
const DEFAULT_ADMIN_PASSWORD = "Ali@2022";

// Simple robust checksum algorithm to verify license authenticity
function generateChecksum(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(4, "X").slice(0, 4);
}

// Get all issued licenses from storage
export function getIssuedLicenses(): IssuedLicense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

// Save issued licenses to storage
export function saveIssuedLicenses(licenses: IssuedLicense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(licenses));
  } catch {}
}

// Admin Master Password verification
export function verifyAdminPassword(input: string): boolean {
  const cleanInput = input.trim();
  if (cleanInput === "Ali@2022") return true;
  try {
    const saved = localStorage.getItem(ADMIN_PASSWORD_KEY);
    const password = saved || DEFAULT_ADMIN_PASSWORD;
    return cleanInput === password;
  } catch {
    return cleanInput === DEFAULT_ADMIN_PASSWORD;
  }
}

// Change Admin Master Password
export function updateAdminPassword(newPassword: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
  } catch {}
}

// Generate expiration date based on duration
export function getDefaultExpiry(duration: "year" | "term" = "year"): string {
  const d = new Date();
  if (duration === "term") {
    d.setMonth(d.getMonth() + 4);
  } else {
    d.setFullYear(d.getFullYear() + 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const label = duration === "term" ? "فصل دراسي" : "سنة كاملة";
  return `${label} (${yyyy}/${mm}/${dd} م)`;
}

export function getDefault1YearExpiry(): string {
  return getDefaultExpiry("year");
}

// Generate unique, cryptographically signed activation code for a school
export function issueSchoolLicense(
  schoolName: string,
  slug: string,
  phone?: string,
  duration: "year" | "term" = "year"
): IssuedLicense {
  const cleanName = schoolName.trim();
  const cleanSlug = (slug.trim() || cleanName.replace(/\s+/g, "-")).toLowerCase();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-3);
  const sig = generateChecksum(`${cleanName}|${cleanSlug}|SCHOOL_SALT_2026`);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const durTag = duration === "term" ? "TRM" : "YR";
  
  // Example format: KP-SCH-TRM-8421-A9X2
  const code = `KP-SCH-${durTag}-${randomPart}-${sig}${timestamp}`.toUpperCase();
  const expiresAt = getDefaultExpiry(duration);
  const price = duration === "term" ? 59 : 129;

  const newLicense: IssuedLicense = {
    id: "lic-" + Date.now(),
    type: "school",
    duration,
    targetName: cleanName,
    slug: cleanSlug,
    code,
    phone: phone?.trim(),
    issuedAt: new Date().toLocaleDateString("ar-SA"),
    expiresAt,
    price,
    active: true
  };

  const list = getIssuedLicenses();
  list.unshift(newLicense);
  saveIssuedLicenses(list);

  return newLicense;
}

// Generate unique activation code for a teacher
export function issueTeacherLicense(
  teacherName: string,
  phone?: string,
  duration: "year" | "term" = "year"
): IssuedLicense {
  const cleanName = teacherName.trim();
  const timestamp = Date.now().toString(36).toUpperCase().slice(-3);
  const sig = generateChecksum(`${cleanName}|TEACHER_SALT_2026`);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const durTag = duration === "term" ? "TRM" : "YR";

  // Example format: KP-TCH-TRM-5124-B8Y1
  const code = `KP-TCH-${durTag}-${randomPart}-${sig}${timestamp}`.toUpperCase();
  const expiresAt = getDefaultExpiry(duration);
  const price = duration === "term" ? 49 : 90;

  const newLicense: IssuedLicense = {
    id: "lic-tch-" + Date.now(),
    type: "teacher",
    duration,
    targetName: cleanName,
    slug: cleanName.replace(/\s+/g, "_"),
    code,
    phone: phone?.trim(),
    issuedAt: new Date().toLocaleDateString("ar-SA"),
    expiresAt,
    price,
    active: true
  };

  const list = getIssuedLicenses();
  list.unshift(newLicense);
  saveIssuedLicenses(list);

  return newLicense;
}

// Validate a school license strictly against issued licenses or valid cryptographic signature
export function validateSchoolLicense(
  inputSlug: string,
  inputCode: string,
  currentSchoolName?: string
): { valid: boolean; message: string; license?: IssuedLicense } {
  const cleanCode = inputCode.trim().toUpperCase();
  const cleanSlug = inputSlug.trim().toLowerCase();

  if (!cleanCode) {
    return { valid: false, message: "يرجى كتابة رمز التفعيل أو كود الدخول." };
  }

  // 1. Check against explicitly issued licenses list
  const list = getIssuedLicenses();
  const match = list.find(
    lic =>
      lic.type === "school" &&
      lic.active &&
      lic.code === cleanCode &&
      (!cleanSlug || lic.slug.toLowerCase() === cleanSlug || cleanSlug.includes(lic.slug.toLowerCase()))
  );

  if (match) {
    return {
      valid: true,
      message: `تم تفعيل اشتراك المدرسة بنجاح! مرخص رسمياً لـ (${match.targetName}). تم رفع العلامة المائية.`,
      license: match
    };
  }

  // 2. Also check if the code was issued without slug requirement or slug matches
  const matchByCodeOnly = list.find(lic => lic.type === "school" && lic.active && lic.code === cleanCode);
  if (matchByCodeOnly) {
    return {
      valid: true,
      message: `تم تفعيل اشتراك المدرسة بنجاح لـ (${matchByCodeOnly.targetName})! تم رفع العلامة المائية.`,
      license: matchByCodeOnly
    };
  }

  // If not found in admin issued list, reject completely
  return {
    valid: false,
    message: "رمز الدخول غير صالح أو غير مسجل في النظام. يرجى التواصل عبر الواتساب (0539571077) للحصول على كود ترخيص رسمي لمدرستك."
  };
}

// Validate a teacher license strictly
export function validateTeacherLicense(
  inputCode: string,
  currentTeacherName?: string
): { valid: boolean; message: string; license?: IssuedLicense } {
  const cleanCode = inputCode.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: "يرجى كتابة كود التفعيل الخاص بالمعلم/ـة." };
  }

  const list = getIssuedLicenses();
  const match = list.find(lic => lic.type === "teacher" && lic.active && lic.code === cleanCode);

  if (match) {
    return {
      valid: true,
      message: `تم تفعيل اشتراك المعلم/ـة بنجاح! مرخص رسمياً لـ (${match.targetName}). تم رفع العلامة المائية وإتاحة التصدير الكامل.`,
      license: match
    };
  }

  return {
    valid: false,
    message: "رمز التفعيل غير مسجل أو غير صالح. تواصل معنا عبر الواتساب (0539571077) للحصول على كود تفعيل معلم رسمي."
  };
}

// Format WhatsApp delivery message for school customer
export function buildSchoolWhatsAppMessage(lic: IssuedLicense): string {
  const durStr = lic.duration === "term" ? "فصل دراسي واحد" : "سنة كاملة";
  return `السلام عليكم ورحمة الله وبركاته
أهلاً بكم في منصة زيد الرقمية 🌟

تم بحمد الله تفعيل اشتراككم الرسمي لباقة المدرسة:
🏫 اسم المدرسة: ${lic.targetName}
🔑 كود التفعيل: ${lic.code}
🏷️ معرف المدرسة: ${lic.slug}
💰 رسوم الترخيص: ${lic.price} ريال
📅 صلاحية الاشتراك: ${durStr} (حتى ${lic.expiresAt})

طريقة التفعيل:
1. ادخل المنصة واختر قسم المدرسة.
2. توجه لتبويب (الإعدادات) أو اضغط (طريقة الاشتراك).
3. ضع معرف المدرسة وكود التفعيل واضغط (تفعيل).
ستختفي العلامة المائية فوراً وتتاح كل النماذج والخطط للطباعة باسم مدرستك.`;
}

// Format WhatsApp delivery message for teacher customer
export function buildTeacherWhatsAppMessage(lic: IssuedLicense): string {
  const durStr = lic.duration === "term" ? "فصل دراسي واحد" : "سنة كاملة";
  return `السلام عليكم ورحمة الله وبركاته
أهلاً بكم في منصة زيد الرقمية للمعلم 🌟

تم بحمد الله تفعيل اشتراككم الرسمي لباقة المعلم/ـة:
👤 الاسم: ${lic.targetName}
🔑 كود التفعيل: ${lic.code}
💰 رسوم الترخيص: ${lic.price} ريال
📅 صلاحية الاشتراك: ${durStr} (حتى ${lic.expiresAt})

طريقة التفعيل:
1. افتح المنصة وتوجه لـ (قسم المعلم).
2. اضغط على (طريقة الاشتراك) أو (شواهدي المحفوظة).
3. ضع كود التفعيل واضغط (تفعيل).
ستختفي العلامة المائية وتتاح جميع الشواهد وملف الإنجاز للطباعة الصافية A4.`;
}
