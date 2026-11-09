/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { SEED_WITNESSES, SavedWitness } from "../data/teacherData";
import { validateSchoolLicense, validateTeacherLicense } from "../utils/licenseEngine";

export type PortalType = "overview" | "school" | "teacher" | "subscription";

export type SchoolRoute =
  | "home"
  | "settings"
  | "contact"
  | "behavior"
  | "followup"
  | "monthly-attendance"
  | "quality"
  | "safety"
  | "staff"
  | "parents"
  | "guidance"
  | "health"
  | "plans"
  | "admin-forms"
  | "registers"
  | "kindergarten"
  | "readiness"
  | "gifted"
  | "discipline"
  | "authority"
  | "committees"
  | "jobs"
  | "rules"
  | "cover-maker";

export type TeacherTab =
  | "landing"
  | "portfolio"
  | "curriculum"
  | "templates"
  | "smart-witness"
  | "remedial-register"
  | "photo-library"
  | "my-witnesses"
  | "subscribe";

export interface SchoolSettings {
  schoolType: "boys" | "girls" | "early";
  stage: "kg" | "primary" | "middle" | "secondary" | "multi";
  calendar: "all" | "makkah";
  admin: string;
  office: string;
  schoolName: string;
  managerName: string;
  deputySchool: string;
  deputyStudents: string;
  deputyEdu: string;
  counselor: string;
  healthMentor: string;
  schoolLogo: string;
  slug: string;
  code: string;
}

export interface TeacherProfile {
  name: string;
  subject: string;
  stage: string;
  school: string;
  educationAdmin: string;
  principalName: string;
  qualification: string;
  professionalRank: string;
  experienceYears: string;
  hireDate: string;
  weeklyClasses: string;
  phone: string;
  email: string;
  xAccount: string;
  licenseNumber: string;
  code: string;
  designId: string;
}

export interface StudentItem {
  id: string;
  name: string;
  nid?: string;
  phone?: string;
  grade: string;
  cls: string;
}

export interface GenderWords {
  student: string;
  studentSlash: string;
  guardian: string;
  manager: string;
  deputyStudents: string;
  counselor: string;
  healthMentor: string;
  female: boolean;
}

interface PlatformContextType {
  // Navigation
  portal: PortalType;
  setPortal: (p: PortalType) => void;
  schoolRoute: SchoolRoute;
  setSchoolRoute: (r: SchoolRoute) => void;
  teacherTab: TeacherTab;
  setTeacherTab: (t: TeacherTab) => void;

  // Selected template slug for jumping from 311 Catalog to Smart Witness Builder
  activeTemplateSlug: string | null;
  setActiveTemplateSlug: (slug: string | null) => void;
  openTemplateInBuilder: (slug: string) => void;

  // School
  schoolSettings: SchoolSettings;
  updateSchoolSettings: (updates: Partial<SchoolSettings>) => void;
  isSchoolSubscribed: boolean;
  schoolExpiresAt: string;
  schoolDaysLeft: number;
  activateSchoolLicense: (slug: string, code: string) => { ok: boolean; message: string };
  resetSchoolLicense: () => void;
  genderWords: GenderWords;
  replaceGenderText: (text: string) => string;

  // Students
  students: StudentItem[];
  addStudent: (s: Omit<StudentItem, "id">) => void;
  removeStudent: (id: string) => void;
  setStudentsList: (list: StudentItem[]) => void;

  // Teacher
  teacherProfile: TeacherProfile;
  updateTeacherProfile: (updates: Partial<TeacherProfile>) => void;
  isTeacherSubscribed: boolean;
  teacherExpiresAt: string;
  activateTeacherLicense: (code: string) => { ok: boolean; message: string };
  resetTeacherLicense: () => void;

  // Witnesses
  savedWitnesses: SavedWitness[];
  saveWitness: (w: SavedWitness) => void;
  deleteWitness: (id: string) => void;

  // Active witness for modal preview
  previewWitness: SavedWitness | null;
  setPreviewWitness: (w: SavedWitness | null) => void;

  // Subscription modal
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  openSubscriptionModal: () => void;

  // Secret Admin Manager modal
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  openAdminModal: () => void;

  // Backup & Privacy Management
  exportBackupData: () => void;
  importBackupData: (jsonStr: string) => { ok: boolean; message: string };
  clearAllPlatformData: () => void;
}

const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  schoolType: "boys",
  stage: "primary",
  calendar: "all",
  admin: "الإدارة العامة للتعليم بمنطقة الرياض",
  office: "مكتب التعليم بالوسط",
  schoolName: "مدرسة الأندلس الابتدائية",
  managerName: "عبد الله بن محمد السالم",
  deputySchool: "خالد بن عبد الرحمن القرني",
  deputyStudents: "سعد بن إبراهيم الدوسري",
  deputyEdu: "فهد بن سليمان التميمي",
  counselor: "عمر بن عبدالعزيز الشمري",
  healthMentor: "أحمد بن ناصر الغامدي",
  schoolLogo: "",
  slug: "",
  code: ""
};

const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  name: "فاطمة بنت عبد الله الهاشمي",
  subject: "المهارات الرقمية",
  stage: "المرحلة الثانوية",
  school: "ثانوية اليرموك الأهلية",
  educationAdmin: "الإدارة العامة للتعليم بمنطقة الرياض",
  principalName: "أ. سارة بنت عبد الله المنصور",
  qualification: "بكالوريوس تربوي + دبلوم عالي",
  professionalRank: "معلم متقدم",
  experienceYears: "9 سنوات",
  hireDate: "1438/01/15 هـ",
  weeklyClasses: "18 حصة",
  phone: "0501234567",
  email: "f.alhashmi@moe.gov.sa",
  xAccount: "@Yarmouk_School",
  licenseNumber: "LIC-98421045",
  code: "",
  designId: "moe-1448"
};

const SAMPLE_STUDENTS: StudentItem[] = [
  { id: "1", name: "محمد عبد الله السالم", grade: "الصف السادس", cls: "6/1", nid: "1098765432", phone: "0501234567" },
  { id: "2", name: "إبراهيم خالد القحطاني", grade: "الصف السادس", cls: "6/1", nid: "1087654321", phone: "0502345678" },
  { id: "3", name: "عمر فهد الدوسري", grade: "الصف السادس", cls: "6/1", nid: "1076543210", phone: "0503456789" },
  { id: "4", name: "سعود فيصل المطيري", grade: "الصف الخامس", cls: "5/2", nid: "1065432109", phone: "0504567890" },
  { id: "5", name: "ريان صالح التميمي", grade: "الصف الخامس", cls: "5/2", nid: "1054321098", phone: "0505678901" },
  { id: "6", name: "عبد العزيز ناصر العتيبي", grade: "الصف الرابع", cls: "4/1", nid: "1043210987", phone: "0506789012" }
];

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [portal, setPortal] = useState<PortalType>("overview");
  const [schoolRoute, setSchoolRoute] = useState<SchoolRoute>("home");
  const [teacherTab, setTeacherTab] = useState<TeacherTab>("landing");
  const [activeTemplateSlug, setActiveTemplateSlug] = useState<string | null>(null);

  // School state
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem("kp-school-settings");
      if (saved) return { ...DEFAULT_SCHOOL_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SCHOOL_SETTINGS;
  });

  const [isSchoolSubscribed, setIsSchoolSubscribed] = useState<boolean>(() => {
    try {
      const sub = localStorage.getItem("kp-school-license");
      if (sub) {
        const parsed = JSON.parse(sub);
        return parsed.active === true;
      }
    } catch {}
    return false;
  });

  const [schoolExpiresAt, setSchoolExpiresAt] = useState<string>("1448/02/01 هـ (2026/08/15 م)");
  const [schoolDaysLeft, setSchoolDaysLeft] = useState<number>(280);

  // Teacher state
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem("kp-teacher-profile-v2");
      if (saved) return { ...DEFAULT_TEACHER_PROFILE, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_TEACHER_PROFILE;
  });

  const [isTeacherSubscribed, setIsTeacherSubscribed] = useState<boolean>(() => {
    try {
      const sub = localStorage.getItem("kp-teacher-license");
      if (sub) {
        const parsed = JSON.parse(sub);
        return parsed.active === true;
      }
    } catch {}
    return false;
  });

  const [teacherExpiresAt, setTeacherExpiresAt] = useState<string>("1448/02/01 هـ (2026/08/15 م)");

  // Students
  const [students, setStudents] = useState<StudentItem[]>(() => {
    try {
      const saved = localStorage.getItem("kp-school-students");
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_STUDENTS;
  });

  // Saved witnesses
  const [savedWitnesses, setSavedWitnesses] = useState<SavedWitness[]>(() => {
    try {
      const saved = localStorage.getItem("kp-saved-witnesses-v2");
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_WITNESSES;
  });

  const [previewWitness, setPreviewWitness] = useState<SavedWitness | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Sync school settings to storage
  useEffect(() => {
    try {
      localStorage.setItem("kp-school-settings", JSON.stringify(schoolSettings));
    } catch {}
  }, [schoolSettings]);

  // Sync teacher profile to storage
  useEffect(() => {
    try {
      localStorage.setItem("kp-teacher-profile-v2", JSON.stringify(teacherProfile));
    } catch {}
  }, [teacherProfile]);

  // Sync students to storage
  useEffect(() => {
    try {
      localStorage.setItem("kp-school-students", JSON.stringify(students));
    } catch {}
  }, [students]);

  // Sync saved witnesses to storage
  useEffect(() => {
    try {
      localStorage.setItem("kp-saved-witnesses-v2", JSON.stringify(savedWitnesses));
    } catch {}
  }, [savedWitnesses]);

  const openTemplateInBuilder = (slug: string) => {
    setActiveTemplateSlug(slug);
    setTeacherTab("smart-witness");
  };

  const updateSchoolSettings = (updates: Partial<SchoolSettings>) => {
    setSchoolSettings(prev => ({ ...prev, ...updates }));
  };

  const updateTeacherProfile = (updates: Partial<TeacherProfile>) => {
    setTeacherProfile(prev => ({ ...prev, ...updates }));
  };

  const activateSchoolLicense = (slug: string, code: string) => {
    const result = validateSchoolLicense(slug, code, schoolSettings.schoolName);
    if (result.valid) {
      setIsSchoolSubscribed(true);
      const expires = result.license?.expiresAt || "1448/03/01 هـ (2026/08/15 م)";
      setSchoolExpiresAt(expires);
      setSchoolDaysLeft(365);
      if (result.license?.targetName && (!schoolSettings.schoolName || schoolSettings.schoolName.includes("اسم المدرسة"))) {
        setSchoolSettings(prev => ({ ...prev, schoolName: result.license!.targetName }));
      }
      try {
        localStorage.setItem(
          "kp-school-license",
          JSON.stringify({
            active: true,
            slug: result.license?.slug || slug,
            code: result.license?.code || code,
            schoolName: result.license?.targetName,
            expiresAt: expires
          })
        );
      } catch {}
      return { ok: true, message: result.message };
    }
    return { ok: false, message: result.message };
  };

  const resetSchoolLicense = () => {
    setIsSchoolSubscribed(false);
    try {
      localStorage.removeItem("kp-school-license");
    } catch {}
  };

  const activateTeacherLicense = (code: string) => {
    const result = validateTeacherLicense(code, teacherProfile.name);
    if (result.valid) {
      setIsTeacherSubscribed(true);
      const expires = result.license?.expiresAt || "1448/03/01 هـ (2026/08/15 م)";
      setTeacherExpiresAt(expires);
      if (result.license?.targetName && (!teacherProfile.name || teacherProfile.name.includes("معلم"))) {
        setTeacherProfile(prev => ({ ...prev, name: result.license!.targetName }));
      }
      try {
        localStorage.setItem(
          "kp-teacher-license",
          JSON.stringify({
            active: true,
            code: result.license?.code || code,
            teacherName: result.license?.targetName,
            expiresAt: expires
          })
        );
      } catch {}
      return { ok: true, message: result.message };
    }
    return { ok: false, message: result.message };
  };

  const resetTeacherLicense = () => {
    setIsTeacherSubscribed(false);
    try {
      localStorage.removeItem("kp-teacher-license");
    } catch {}
  };

  const addStudent = (s: Omit<StudentItem, "id">) => {
    setStudents(prev => [...prev, { ...s, id: Date.now().toString() }]);
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const setStudentsList = (list: StudentItem[]) => {
    setStudents(list);
  };

  const saveWitness = (w: SavedWitness) => {
    setSavedWitnesses(prev => {
      const idx = prev.findIndex(item => item.id === w.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = w;
        return copy;
      }
      return [w, ...prev];
    });
  };

  const deleteWitness = (id: string) => {
    setSavedWitnesses(prev => prev.filter(w => w.id !== id));
  };

  // Gender computations
  const isFemale = schoolSettings.schoolType === "girls" || schoolSettings.schoolType === "early";
  const genderWords: GenderWords = {
    female: isFemale,
    student: isFemale ? "الطالبة" : "الطالب",
    studentSlash: isFemale ? "الطالبة" : "الطالب/ـة",
    guardian: isFemale ? "ولي أمر الطالبة" : "ولي أمر الطالب",
    manager: isFemale ? "مديرة المدرسة" : "مدير المدرسة",
    deputyStudents: isFemale ? "وكيلة شؤون الطالبات" : "وكيل شؤون الطلاب",
    counselor: isFemale ? "الموجهة الطلابية" : "الموجه الطلابي",
    healthMentor: isFemale ? "الموجهة الصحية" : "الموجه الصحي"
  };

  const replaceGenderText = (text: string): string => {
    if (!text) return "";
    return text
      .replace(/{student}/g, genderWords.student)
      .replace(/{guardian}/g, genderWords.guardian)
      .replace(/{manager}/g, genderWords.manager)
      .replace(/{deputyStudents}/g, genderWords.deputyStudents)
      .replace(/{counselor}/g, genderWords.counselor)
      .replace(/{healthMentor}/g, genderWords.healthMentor);
  };

  const exportBackupData = () => {
    const backupObj = {
      app: "ZAID_DIGITAL_PLATFORM",
      version: "1.0",
      timestamp: new Date().toISOString(),
      schoolSettings,
      teacherProfile,
      students,
      savedWitnesses,
      licenses: {
        school: isSchoolSubscribed ? localStorage.getItem("kp-school-license") : null,
        teacher: isTeacherSubscribed ? localStorage.getItem("kp-teacher-license") : null,
      },
      customCurriculumEdits: localStorage.getItem("zaid-primary-curriculum-edits-v1"),
      customWeeklyPlanMeta: localStorage.getItem("zaid-primary-weekly-meta-v1"),
    };

    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `zaid-platform-backup-${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackupData = (jsonStr: string): { ok: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== "object") {
        return { ok: false, message: "ملف النسخة الاحتياطية غير صالح." };
      }

      if (data.schoolSettings) {
        setSchoolSettings({ ...DEFAULT_SCHOOL_SETTINGS, ...data.schoolSettings });
      }
      if (data.teacherProfile) {
        setTeacherProfile({ ...DEFAULT_TEACHER_PROFILE, ...data.teacherProfile });
      }
      if (Array.isArray(data.students)) {
        setStudents(data.students);
      }
      if (Array.isArray(data.savedWitnesses)) {
        setSavedWitnesses(data.savedWitnesses);
      }
      if (data.customCurriculumEdits) {
        localStorage.setItem(
          "zaid-primary-curriculum-edits-v1",
          typeof data.customCurriculumEdits === "string"
            ? data.customCurriculumEdits
            : JSON.stringify(data.customCurriculumEdits)
        );
      }
      if (data.customWeeklyPlanMeta) {
        localStorage.setItem(
          "zaid-primary-weekly-meta-v1",
          typeof data.customWeeklyPlanMeta === "string"
            ? data.customWeeklyPlanMeta
            : JSON.stringify(data.customWeeklyPlanMeta)
        );
      }
      if (data.licenses) {
        if (data.licenses.school) {
          localStorage.setItem(
            "kp-school-license",
            typeof data.licenses.school === "string"
              ? data.licenses.school
              : JSON.stringify(data.licenses.school)
          );
          setIsSchoolSubscribed(true);
        }
        if (data.licenses.teacher) {
          localStorage.setItem(
            "kp-teacher-license",
            typeof data.licenses.teacher === "string"
              ? data.licenses.teacher
              : JSON.stringify(data.licenses.teacher)
          );
          setIsTeacherSubscribed(true);
        }
      }

      return { ok: true, message: "تمت استعادة النسخة الاحتياطية بنجاح وتحديث كافة بياناتك." };
    } catch (err) {
      return { ok: false, message: "فشل استيراد الملف: صيغة الملف غير مدموجة أو تالفة." };
    }
  };

  const clearAllPlatformData = () => {
    try {
      localStorage.clear();
    } catch {}
    setSchoolSettings(DEFAULT_SCHOOL_SETTINGS);
    setTeacherProfile(DEFAULT_TEACHER_PROFILE);
    setStudents(SAMPLE_STUDENTS);
    setSavedWitnesses(SEED_WITNESSES);
    setIsSchoolSubscribed(false);
    setIsTeacherSubscribed(false);
  };

  return (
    <PlatformContext.Provider
      value={{
        portal,
        setPortal,
        schoolRoute,
        setSchoolRoute,
        teacherTab,
        setTeacherTab,
        activeTemplateSlug,
        setActiveTemplateSlug,
        openTemplateInBuilder,
        schoolSettings,
        updateSchoolSettings,
        isSchoolSubscribed,
        schoolExpiresAt,
        schoolDaysLeft,
        activateSchoolLicense,
        resetSchoolLicense,
        genderWords,
        replaceGenderText,
        students,
        addStudent,
        removeStudent,
        setStudentsList,
        teacherProfile,
        updateTeacherProfile,
        isTeacherSubscribed,
        teacherExpiresAt,
        activateTeacherLicense,
        resetTeacherLicense,
        savedWitnesses,
        saveWitness,
        deleteWitness,
        previewWitness,
        setPreviewWitness,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        openSubscriptionModal: () => setIsSubscriptionModalOpen(true),
        isAdminModalOpen,
        setIsAdminModalOpen,
        openAdminModal: () => setIsAdminModalOpen(true),
        exportBackupData,
        importBackupData,
        clearAllPlatformData,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
}
