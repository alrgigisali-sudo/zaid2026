/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PlatformProvider, usePlatform } from "./context/PlatformContext";
import { DgaAppShell } from "./components/common/DgaAppShell";
import {
  PlatformOverviewHome,
  PlatformSubscriptionSection
} from "./components/common/PlatformOverviewHome";
import { SchoolHome } from "./components/school/SchoolHome";
import { SchoolModelViewer } from "./components/school/SchoolModelViewer";
import { SchoolRulesView } from "./components/school/SchoolRulesView";
import { SchoolCommitteesView } from "./components/school/SchoolCommitteesView";
import { SchoolJobsView } from "./components/school/SchoolJobsView";
import { SchoolPlansView } from "./components/school/SchoolPlansView";
import { SchoolFollowupView } from "./components/school/SchoolFollowupView";
import { SchoolMonthlyAttendanceView } from "./components/school/SchoolMonthlyAttendanceView";
import { SchoolCoverMakerView } from "./components/school/SchoolCoverMakerView";
import { SchoolSettingsView } from "./components/school/SchoolSettingsView";
import { SchoolContactView } from "./components/school/SchoolContactView";

import { TeacherLanding } from "./components/teacher/TeacherLanding";
import { TeacherSmartWitness } from "./components/teacher/TeacherSmartWitness";
import { TeacherTemplates } from "./components/teacher/TeacherTemplates";
import { TeacherPortfolio } from "./components/teacher/TeacherPortfolio";
import { TeacherCurriculumView } from "./components/teacher/TeacherCurriculumView";
import { TeacherRemedialRegister } from "./components/teacher/TeacherRemedialRegister";
import { TeacherPhotoLibrary } from "./components/teacher/TeacherPhotoLibrary";
import { TeacherMyWitnesses } from "./components/teacher/TeacherMyWitnesses";
import { TeacherSubscribeView } from "./components/teacher/TeacherSubscribeView";
import { TeacherProfileModal } from "./components/teacher/TeacherProfileModal";

import { SubscriptionModal } from "./components/common/SubscriptionModal";
import { AdminLicenseManagerModal } from "./components/admin/AdminLicenseManagerModal";

import {
  BEHAVIOR_MODELS,
  GUIDANCE_MODELS,
  HEALTH_MODELS,
  ADMIN_FORMS_MODELS,
  PARENTS_MODELS,
  STAFF_MODELS,
  QUALITY_MODELS,
  SAFETY_MODELS,
  REGISTERS_MODELS,
  KINDERGARTEN_MODELS,
  READINESS_MODELS,
  GIFTED_MODELS,
  DISCIPLINE_MODELS,
  AUTHORITY_MODELS
} from "./data/schoolModels";

function MainContent() {
  const {
    portal,
    schoolRoute,
    teacherTab,
    isAdminModalOpen,
    setIsAdminModalOpen
  } = usePlatform();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <DgaAppShell onOpenTeacherProfile={() => setIsProfileModalOpen(true)}>
        {portal === "overview" ? (
          <PlatformOverviewHome onOpenTeacherProfile={() => setIsProfileModalOpen(true)} />
        ) : portal === "subscription" ? (
          <PlatformSubscriptionSection />
        ) : portal === "school" ? (
          <>
            {schoolRoute === "home" && <SchoolHome />}
            {schoolRoute === "settings" && <SchoolSettingsView />}
            {schoolRoute === "contact" && <SchoolContactView />}
            {schoolRoute === "rules" && <SchoolRulesView />}
            {schoolRoute === "committees" && <SchoolCommitteesView />}
            {schoolRoute === "jobs" && <SchoolJobsView />}
            {schoolRoute === "plans" && <SchoolPlansView />}
            {schoolRoute === "followup" && <SchoolFollowupView />}
            {schoolRoute === "monthly-attendance" && <SchoolMonthlyAttendanceView />}
            {schoolRoute === "cover-maker" && <SchoolCoverMakerView />}

            {/* Model-based categories */}
            {schoolRoute === "behavior" && (
              <SchoolModelViewer
                title="نماذج السلوك والمواظبة"
                intro="اطبع النموذج باسم الطالب أو مفرغًا للتعبئة اليدوية. يمكنك أيضًا الكتابة مباشرة داخل الحقول المخططة وجداول الرصد."
                forms={BEHAVIOR_MODELS}
              />
            )}
            {schoolRoute === "guidance" && (
              <SchoolModelViewer
                title="نماذج وسجلات التوجيه الطلابي"
                intro="الخطة العامة والجلسات الإرشادية وحصر الحالات والغياب والتواصل مع الأسرة، بترويسة مدرستك وجاهزة للتعبئة والطباعة."
                forms={GUIDANCE_MODELS}
              />
            )}
            {schoolRoute === "health" && (
              <SchoolModelViewer
                title="نماذج وسجلات الموجه الصحي"
                intro="التكليف والخطط واللجنة وسجلات الحالات الصحية ومتابعة البيئة المدرسية، بترويسة مدرستك وجاهزة للتعبئة والطباعة."
                forms={HEALTH_MODELS}
              />
            )}
            {schoolRoute === "admin-forms" && (
              <SchoolModelViewer
                title="الإدارة والتعاميم"
                intro="خطابات وتعاميم وتكليفات ونماذج إدارية بترويسة مدرستك، قابلة للتعبئة داخل المعاينة أو للطباعة مفرغة."
                forms={ADMIN_FORMS_MODELS}
              />
            )}
            {schoolRoute === "parents" && (
              <SchoolModelViewer
                title="سجلات أولياء الأمور"
                intro="الزيارات والتواصل ومجلس أولياء الأمور والشراكة الأسرية والمجتمعية، بترويسة مدرستك وجاهزة للتعبئة والطباعة."
                forms={PARENTS_MODELS}
              />
            )}
            {schoolRoute === "staff" && (
              <SchoolModelViewer
                title="اللجان والموظفون"
                intro="قرارات اللجان ومحاضرها وخططها، وبطاقات الموظفين والاستئذان والمساءلة والنمو المهني ومجتمعات التعلم، بترويسة مدرستك."
                forms={STAFF_MODELS}
              />
            )}
            {schoolRoute === "quality" && (
              <SchoolModelViewer
                title="الجودة والمتابعة"
                intro="تبادل الزيارات ومتابعة الدروس والأعمال التحريرية، واستمارات رضا المستفيد، والتقويم الذاتي والمؤشرات، بترويسة مدرستك."
                forms={QUALITY_MODELS}
              />
            )}
            {schoolRoute === "safety" && (
              <SchoolModelViewer
                title="الأمن والسلامة والمخاطر والصندوق"
                intro="خطة السلامة وتجربة الإخلاء وتقييم المخاطر، وحماية حقوق المتعلمين، والصندوق المدرسي والصيانة، بترويسة مدرستك."
                forms={SAFETY_MODELS}
              />
            )}
            {schoolRoute === "registers" && (
              <SchoolModelViewer
                title="سجلات الوكلاء والدليل الإجرائي"
                intro="استئذان الطلاب والموظفين، وكشوف الحضور اليومية، ومتابعة السجلات وفهرسها، ونماذج الدليل الإجرائي المعتمد."
                forms={REGISTERS_MODELS}
              />
            )}
            {schoolRoute === "kindergarten" && (
              <SchoolModelViewer
                title="نماذج وسجلات رياض الأطفال"
                intro="بطاقة الطفل المكتملة، وحضور وغياب الأطفال، واستمارة ملاحظة النمو، والخطة الأسبوعية، والتقارير الدورية."
                forms={KINDERGARTEN_MODELS}
              />
            )}
            {schoolRoute === "readiness" && (
              <SchoolModelViewer
                title="الاستعداد والتهيئة والأسبوع التمهيدي"
                intro="ملف الاستعداد للعام الدراسي حسب المسؤوليات، وخطة الأسبوع التمهيدي للصف الأول الابتدائي والأسبوع التهييئي."
                forms={READINESS_MODELS}
              />
            )}
            {schoolRoute === "gifted" && (
              <SchoolModelViewer
                title="سجل معلم الموهوبين"
                intro="لجنة رعاية الموهوبين، الخطة الفصلية، بطاقة ترشيح الطالب الموهوب، وبرامج موهبة وإبداع ومنافسات أذكى."
                forms={GIFTED_MODELS}
              />
            )}
            {schoolRoute === "discipline" && (
              <SchoolModelViewer
                title="الانضباط المدرسي وتعزيز السلوك والأزمات"
                intro="خطة الانضباط المدرسي، تعزيز السلوك الإيجابي وقياس الأثر، وإدارة الأزمات والمخاطر الطارئة في المدرسة."
                forms={DISCIPLINE_MODELS}
              />
            )}
            {schoolRoute === "authority" && (
              <SchoolModelViewer
                title="الصلاحيات والتكليفات والأداء الوظيفي"
                intro="قرارات تفويض الصلاحيات، سجل التكليفات المدرسية، نماذج طلبات نظام فارس، وبطاقات تقويم الأداء الوظيفي المعتمدة."
                forms={AUTHORITY_MODELS}
              />
            )}
          </>
        ) : (
          <>
            {teacherTab === "landing" && (
              <TeacherLanding onOpenProfile={() => setIsProfileModalOpen(true)} />
            )}
            {teacherTab === "portfolio" && (
              <TeacherPortfolio onOpenProfile={() => setIsProfileModalOpen(true)} />
            )}
            {teacherTab === "curriculum" && <TeacherCurriculumView />}
            {teacherTab === "templates" && <TeacherTemplates />}
            {teacherTab === "smart-witness" && <TeacherSmartWitness />}
            {teacherTab === "remedial-register" && <TeacherRemedialRegister />}
            {teacherTab === "photo-library" && <TeacherPhotoLibrary />}
            {teacherTab === "my-witnesses" && <TeacherMyWitnesses />}
            {teacherTab === "subscribe" && <TeacherSubscribeView />}
          </>
        )}
      </DgaAppShell>

      {/* Teacher Profile Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Global Comprehensive Subscription Modal */}
      <SubscriptionModal />

      {/* Secret Admin License Manager Modal */}
      <AdminLicenseManagerModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <MainContent />
    </PlatformProvider>
  );
}
