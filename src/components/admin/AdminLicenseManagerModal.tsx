/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  KeyRound,
  Lock,
  Unlock,
  Plus,
  Copy,
  Check,
  Trash2,
  X,
  School,
  GraduationCap,
  Calendar,
  Phone,
  MessageCircle,
  HelpCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  IssuedLicense,
  getIssuedLicenses,
  saveIssuedLicenses,
  verifyAdminPassword,
  updateAdminPassword,
  issueSchoolLicense,
  issueTeacherLicense,
  buildSchoolWhatsAppMessage,
  buildTeacherWhatsAppMessage
} from "../../utils/licenseEngine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLicenseManagerModal({ isOpen, onClose }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Active Tab: "school" | "teacher" | "history" | "security"
  const [activeTab, setActiveTab] = useState<"school" | "teacher" | "history" | "security">("school");

  // School form
  const [schoolName, setSchoolName] = useState("");
  const [schoolSlug, setSchoolSlug] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolDuration, setSchoolDuration] = useState<"year" | "term">("year");
  const [lastIssuedSchool, setLastIssuedSchool] = useState<IssuedLicense | null>(null);

  // Teacher form
  const [teacherName, setTeacherName] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [teacherDuration, setTeacherDuration] = useState<"year" | "term">("year");
  const [lastIssuedTeacher, setLastIssuedTeacher] = useState<IssuedLicense | null>(null);

  // Change password form
  const [newPassword, setNewPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  // Search in history
  const [searchHistory, setSearchHistory] = useState("");
  const [licensesList, setLicensesList] = useState<IssuedLicense[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLicensesList(getIssuedLicenses());
    }
  }, [isOpen, lastIssuedSchool, lastIssuedTeacher]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(adminPasswordInput)) {
      setIsAuthenticated(true);
      setLoginError(false);
      setAdminPasswordInput("");
    } else {
      setLoginError(true);
    }
  };

  // Auto-generate slug when school name changes
  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val);
    if (!schoolSlug || schoolSlug === schoolName.trim().replace(/\s+/g, "-").toLowerCase()) {
      setSchoolSlug(val.trim().replace(/\s+/g, "-").toLowerCase());
    }
  };

  // Issue School License
  const handleIssueSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;
    const lic = issueSchoolLicense(schoolName, schoolSlug, schoolPhone, schoolDuration);
    setLastIssuedSchool(lic);
    setLicensesList(getIssuedLicenses());
    setSchoolName("");
    setSchoolSlug("");
    setSchoolPhone("");
  };

  // Issue Teacher License
  const handleIssueTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;
    const lic = issueTeacherLicense(teacherName, teacherPhone, teacherDuration);
    setLastIssuedTeacher(lic);
    setLicensesList(getIssuedLicenses());
    setTeacherName("");
    setTeacherPhone("");
  };

  // Toggle active status
  const handleToggleStatus = (id: string) => {
    const list = getIssuedLicenses().map(lic => {
      if (lic.id === id) {
        return { ...lic, active: !lic.active };
      }
      return lic;
    });
    saveIssuedLicenses(list);
    setLicensesList(list);
  };

  // Delete license
  const handleDeleteLicense = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الترخيص نهائياً؟")) {
      const list = getIssuedLicenses().filter(lic => lic.id !== id);
      saveIssuedLicenses(list);
      setLicensesList(list);
    }
  };

  // Copy helper
  const handleCopyText = (text: string, type: "code" | "msg", identifier: string) => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(identifier);
      setTimeout(() => setCopiedCode(null), 2500);
    } else {
      setCopiedMsg(identifier);
      setTimeout(() => setCopiedMsg(null), 2500);
    }
  };

  // Change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length >= 4) {
      updateAdminPassword(newPassword.trim());
      setPasswordFeedback("تم تحديث كلمة مرور المدير بنجاح!");
      setNewPassword("");
      setTimeout(() => setPasswordFeedback(null), 3000);
    }
  };

  const filteredLicenses = licensesList.filter(lic =>
    (lic.targetName + lic.code + (lic.slug || "")).toLowerCase().includes(searchHistory.toLowerCase())
  );

  const schoolLicensesCount = licensesList.filter(l => l.type === "school" && l.active).length;
  const teacherLicensesCount = licensesList.filter(l => l.type === "teacher" && l.active).length;
  const totalRevenue = licensesList.filter(l => l.active).reduce((sum, l) => sum + (l.price || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs no-print text-right" dir="rtl">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <KeyRound className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">لوحة تحكم المدير وتوليد التراخيص</h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  لوحة سرية خاصة بالمالك
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">التحكم الحصري في إصدار أكواد المدارس والمعلمين وربطها بالاسم والصلاحية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lock Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">هذه المنطقة مخصصة لإدارة المنصة فقط</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                يرجى إدخال رمز المرور الرئيسي الخاص بك كمالك للمنصة لفتح لوحة توليد الأكواد وإدارة التراخيص.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                value={adminPasswordInput}
                onChange={e => {
                  setAdminPasswordInput(e.target.value);
                  setLoginError(false);
                }}
                placeholder="أدخل رمز المرور الرئيسي..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-center text-sm font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                autoFocus
              />

              {loginError && (
                <div className="text-xs text-rose-600 font-bold flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>رمز المرور غير صحيح! (الرمز: Ali@2022)</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-2xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>دخول لوحة التحكم</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-center text-xs">
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5 font-medium">المدارس النشطة</span>
                <b className="text-lg font-black text-sky-900">{schoolLicensesCount} مدرسة</b>
                <span className="text-[10px] text-slate-400 block">(99 ر.س / مدرسة)</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5 font-medium">المعلمون النشطون</span>
                <b className="text-lg font-black text-emerald-800">{teacherLicensesCount} معلماً</b>
                <span className="text-[10px] text-slate-400 block">(49 ر.س / معلم)</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5 font-medium">إجمالي الإيرادات المتوقعة</span>
                <b className="text-lg font-black text-amber-600">{totalRevenue} ر.س</b>
                <span className="text-[10px] text-slate-400 block">سنوياً</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("school")}
                className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "school" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <School className="w-4 h-4" />
                <span>إصدار ترخيص مدرسة (99 ر.س)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("teacher")}
                className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "teacher" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>إصدار ترخيص معلم (49 ر.س)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "history" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>سجل التراخيص الصادرة ({licensesList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`py-2 px-3 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "security" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="تغيير كلمة مرور المدير"
              >
                <Lock className="w-4 h-4" />
                <span>الأمان</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* TAB 1: ISSUE SCHOOL LICENSE */}
              {activeTab === "school" && (
                <div className="space-y-6">
                  <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50 space-y-4">
                    <div className="flex items-center gap-2 text-sky-950 font-black">
                      <School className="w-5 h-5 text-sky-800" />
                      <h4>إصدار كود اشتراك رسمي لمدرسة جديدة:</h4>
                    </div>

                    <form onSubmit={handleIssueSchool} className="space-y-4">
                      {/* Duration selector */}
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                          مدة الترخيص المطلوب:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setSchoolDuration("year")}
                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                              schoolDuration === "year"
                                ? "bg-sky-900 text-white border-sky-900 shadow-sm"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <span className="font-bold block text-xs">اشتراك سنة كاملة 🌟</span>
                            <span className="text-[11px] opacity-80">129 ريال سعودي / سنة</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSchoolDuration("term")}
                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                              schoolDuration === "term"
                                ? "bg-sky-900 text-white border-sky-900 shadow-sm"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <span className="font-bold block text-xs">اشتراك فصل دراسي واحد 📚</span>
                            <span className="text-[11px] opacity-80">59 ريال سعودي / فصل</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            اسم المدرسة الرسمي: <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: مدرسة الملك فهد الابتدائية"
                            value={schoolName}
                            onChange={e => handleSchoolNameChange(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 text-right focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            معرف المدرسة (Slug بالإنجليزية أو مختصر):
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: king-fahad-school"
                            value={schoolSlug}
                            onChange={e => setSchoolSlug(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 text-right focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">
                          رقم جوال المشترك / مدير المدرسة (اختياري للتوثيق):
                        </label>
                        <input
                          type="tel"
                          placeholder="مثال: 0501234567"
                          value={schoolPhone}
                          onChange={e => setSchoolPhone(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 text-right focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-900 hover:bg-sky-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md cursor-pointer transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          توليد كود التفعيل الرسمي للمدرسة ({schoolDuration === "term" ? "فصل دراسي 59 ر.س" : "سنة كاملة 129 ر.س"})
                        </span>
                      </button>
                    </form>
                  </div>

                  {/* Last Issued School Card */}
                  {lastIssuedSchool && (
                    <div className="border-2 border-emerald-500/50 rounded-3xl p-6 bg-emerald-50/60 space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <h4 className="text-sm font-black text-emerald-950">تم توليد ترخيص المدرسة بنجاح!</h4>
                        </div>
                        <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                          {lastIssuedSchool.price} ر.س ({lastIssuedSchool.duration === "term" ? "فصل دراسي" : "سنة كاملة"})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-2xl border border-emerald-200">
                        <div>
                          <span className="text-slate-400 block mb-0.5">اسم المدرسة:</span>
                          <b className="text-slate-900 text-sm">{lastIssuedSchool.targetName}</b>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">معرف المدرسة (Slug):</span>
                          <b className="text-sky-800 font-mono text-sm">{lastIssuedSchool.slug}</b>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">تاريخ الانتهاء:</span>
                          <b className="text-slate-700">{lastIssuedSchool.expiresAt}</b>
                        </div>
                      </div>

                      {/* Code Banner */}
                      <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-amber-400 block font-bold mb-0.5">كود التفعيل الرسمي:</span>
                          <span className="font-mono text-lg font-black tracking-wider text-amber-300">
                            {lastIssuedSchool.code}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyText(lastIssuedSchool.code, "code", lastIssuedSchool.id)}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedCode === lastIssuedSchool.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCode === lastIssuedSchool.id ? "تم النسخ" : "نسخ الكود"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyText(buildSchoolWhatsAppMessage(lastIssuedSchool), "msg", lastIssuedSchool.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            {copiedMsg === lastIssuedSchool.id ? <Check className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                            <span>{copiedMsg === lastIssuedSchool.id ? "تم نسخ رسالة الواتساب!" : "نسخ رسالة الواتساب للعميل"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ISSUE TEACHER LICENSE */}
              {activeTab === "teacher" && (
                <div className="space-y-6">
                  <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-950 font-black">
                      <GraduationCap className="w-5 h-5 text-emerald-700" />
                      <h4>إصدار كود اشتراك رسمي لمعلم/ـة (شواهد وملف إنجاز):</h4>
                    </div>

                    <form onSubmit={handleIssueTeacher} className="space-y-4">
                      {/* Duration selector */}
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                          مدة الترخيص المطلوب:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setTeacherDuration("year")}
                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                              teacherDuration === "year"
                                ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <span className="font-bold block text-xs">اشتراك سنة كاملة 🌟</span>
                            <span className="text-[11px] opacity-80">90 ريال سعودي / سنة</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTeacherDuration("term")}
                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                              teacherDuration === "term"
                                ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <span className="font-bold block text-xs">اشتراك فصل دراسي واحد 📚</span>
                            <span className="text-[11px] opacity-80">49 ريال سعودي / فصل</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            اسم المعلم/ـة: <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: أ. عبد الرحمن الشهري"
                            value={teacherName}
                            onChange={e => setTeacherName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 text-right focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            رقم الجوال (اختياري للتوثيق):
                          </label>
                          <input
                            type="tel"
                            placeholder="مثال: 0551234567"
                            value={teacherPhone}
                            onChange={e => setTeacherPhone(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 text-right focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md cursor-pointer transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          توليد كود التفعيل الرسمي للمعلم ({teacherDuration === "term" ? "فصل دراسي 49 ر.س" : "سنة كاملة 90 ر.س"})
                        </span>
                      </button>
                    </form>
                  </div>

                  {/* Last Issued Teacher Card */}
                  {lastIssuedTeacher && (
                    <div className="border-2 border-emerald-500/50 rounded-3xl p-6 bg-emerald-50/60 space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <h4 className="text-sm font-black text-emerald-950">تم توليد ترخيص المعلم/ـة بنجاح!</h4>
                        </div>
                        <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                          {lastIssuedTeacher.price} ر.س ({lastIssuedTeacher.duration === "term" ? "فصل دراسي" : "سنة كاملة"})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-emerald-200">
                        <div>
                          <span className="text-slate-400 block mb-0.5">اسم المعلم/ـة:</span>
                          <b className="text-slate-900 text-sm">{lastIssuedTeacher.targetName}</b>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">تاريخ الانتهاء:</span>
                          <b className="text-slate-700">{lastIssuedTeacher.expiresAt}</b>
                        </div>
                      </div>

                      {/* Code Banner */}
                      <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-amber-400 block font-bold mb-0.5">كود تفعيل المعلم الرسمي:</span>
                          <span className="font-mono text-lg font-black tracking-wider text-amber-300">
                            {lastIssuedTeacher.code}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyText(lastIssuedTeacher.code, "code", lastIssuedTeacher.id)}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedCode === lastIssuedTeacher.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCode === lastIssuedTeacher.id ? "تم النسخ" : "نسخ الكود"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyText(buildTeacherWhatsAppMessage(lastIssuedTeacher), "msg", lastIssuedTeacher.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            {copiedMsg === lastIssuedTeacher.id ? <Check className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                            <span>{copiedMsg === lastIssuedTeacher.id ? "تم نسخ رسالة الواتساب!" : "نسخ رسالة الواتساب للعميل"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LICENSES HISTORY TABLE */}
              {activeTab === "history" && (
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ابحث في التراخيص بالاسم، الكود، أو المعرف..."
                      value={searchHistory}
                      onChange={e => setSearchHistory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>

                  {filteredLicenses.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">النوع</th>
                            <th className="p-3">الاسم المعتمد</th>
                            <th className="p-3">كود التفعيل</th>
                            <th className="p-3">المعرف</th>
                            <th className="p-3">صالح حتى</th>
                            <th className="p-3">الحالة</th>
                            <th className="p-3 text-center">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredLicenses.map(lic => (
                            <tr key={lic.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3">
                                {lic.type === "school" ? (
                                  <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                                    مدرسة
                                  </span>
                                ) : (
                                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    معلم
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-bold text-slate-900">{lic.targetName}</td>
                              <td className="p-3 font-mono font-bold text-slate-800">
                                <div className="flex items-center gap-1.5">
                                  <span>{lic.code}</span>
                                  <button
                                    onClick={() => handleCopyText(lic.code, "code", lic.id)}
                                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                    title="نسخ الكود"
                                  >
                                    {copiedCode === lic.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 font-mono text-slate-500">{lic.slug || "—"}</td>
                              <td className="p-3 text-slate-600">{lic.expiresAt}</td>
                              <td className="p-3">
                                {lic.active ? (
                                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    نشط
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                                    ملغي
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleToggleStatus(lic.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                      lic.active ? "bg-amber-100 hover:bg-amber-200 text-amber-900" : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
                                    }`}
                                  >
                                    {lic.active ? "إيقاف" : "تنشيط"}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteLicense(lic.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      لا توجد تراخيص صادرة حتى الآن. استخدم التبويب أعلاه لتوليد أول ترخيص.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SECURITY SETTINGS */}
              {activeTab === "security" && (
                <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50 space-y-4 max-w-lg">
                  <div className="flex items-center gap-2 text-slate-900 font-black">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <h4>تغيير رمز المرور الرئيسي للوحة المدير:</h4>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        رمز المرور الجديد:
                      </label>
                      <input
                        type="password"
                        placeholder="أدخل كلمة مرور جديدة قوية..."
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden"
                      />
                    </div>

                    {passwordFeedback && (
                      <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{passwordFeedback}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={newPassword.trim().length < 4}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                    >
                      حفظ كلمة المرور الجديدة
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                🔒 يتم حفظ التراخيص في مستودع المنصة المحمي للتحقق التلقائي عند دخول المدارس.
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLicenseManagerModal;
