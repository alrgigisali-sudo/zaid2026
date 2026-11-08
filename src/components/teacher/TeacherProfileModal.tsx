/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SAUDI_REGIONS } from "../../data/schoolModels";
import { DESIGN_THEMES } from "../../data/teacherData";
import { X, Save, User } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherProfileModal({ isOpen, onClose }: Props) {
  const { teacherProfile, updateTeacherProfile } = usePlatform();

  const [formData, setFormData] = useState({
    name: teacherProfile.name,
    subject: teacherProfile.subject,
    stage: teacherProfile.stage,
    school: teacherProfile.school,
    educationAdmin: teacherProfile.educationAdmin,
    principalName: teacherProfile.principalName,
    qualification: teacherProfile.qualification || "بكالوريوس تربوي",
    professionalRank: teacherProfile.professionalRank || "معلم ممارس",
    experienceYears: teacherProfile.experienceYears || "8 سنوات",
    hireDate: teacherProfile.hireDate || "1439/01/15 هـ",
    weeklyClasses: teacherProfile.weeklyClasses || "18 حصة",
    phone: teacherProfile.phone || "0501234567",
    email: teacherProfile.email || "teacher@moe.gov.sa",
    xAccount: teacherProfile.xAccount || "@School_MOE",
    licenseNumber: teacherProfile.licenseNumber || "LIC-98421045",
    designId: teacherProfile.designId || "moe-1448"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-right"
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-black text-white">بياناتي — بيانات المعلم والمدرسة والترويسة</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                تُكتب مرة واحدة وتنعكس تلقائياً في صفحات ملف الإنجاز الـ 70 وجميع قوالب الشواهد الـ 311
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">اسم المعلم / المعلمة الكامل:</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-right"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">المادة / التخصص التدريسي:</label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">المرحلة الدراسية:</label>
              <input
                type="text"
                value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">المؤهل العلمي:</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">الرتبة المهنية:</label>
              <select
                value={formData.professionalRank}
                onChange={e => setFormData({ ...formData, professionalRank: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              >
                <option value="معلم">معلم</option>
                <option value="معلم ممارس">معلم ممارس</option>
                <option value="معلم متقدم">معلم متقدم</option>
                <option value="معلم خبير">معلم خبير</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">سنوات الخبرة:</label>
              <input
                type="text"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">تاريخ المباشرة:</label>
              <input
                type="text"
                value={formData.hireDate}
                onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">نصاب الحصص الأسبوعي:</label>
              <input
                type="text"
                value={formData.weeklyClasses}
                onChange={e => setFormData({ ...formData, weeklyClasses: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">رقم الرخصة المهنية:</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-800 block mb-1">اسم المدرسة:</label>
              <input
                type="text"
                value={formData.school}
                onChange={e => setFormData({ ...formData, school: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-right"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">إدارة التعليم:</label>
              <select
                value={formData.educationAdmin}
                onChange={e => setFormData({ ...formData, educationAdmin: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              >
                {SAUDI_REGIONS.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">اسم مدير/ة المدرسة (للاعتماد):</label>
            <input
              type="text"
              value={formData.principalName}
              onChange={e => setFormData({ ...formData, principalName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">رقم الجوال (للسيرة الذاتية):</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-right"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">البريد الإلكتروني المهني:</label>
              <input
                type="text"
                dir="ltr"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-left"
              />
            </div>
          </div>

          {/* Design Theme Selector */}
          <div className="pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 block mb-2">نمط تصميم الترويسة المعتمد:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DESIGN_THEMES.map(t => (
                <label
                  key={t.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                    formData.designId === t.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="designId"
                      value={t.id}
                      checked={formData.designId === t.id}
                      onChange={() => setFormData({ ...formData, designId: t.id })}
                      className="text-emerald-600"
                    />
                    <span>{t.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{t.badge}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
            >
              إغلاق
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ البيانات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
