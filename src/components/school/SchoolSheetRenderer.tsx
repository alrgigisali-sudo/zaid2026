/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { usePlatform, StudentItem } from "../../context/PlatformContext";
import { SchoolForm, FormBlock, KHADAMATI_CONFIG } from "../../data/schoolModels";
import { Printer, Upload } from "lucide-react";
import { executeCalibratedPrint, PrintAndPdfActions } from "../common/PrintAndPdfActions";
import { PlatformWatermark } from "../common/PlatformLogo";

interface Props {
  form: SchoolForm;
  student?: StudentItem | null;
  pageNumber?: number;
  totalPages?: number;
}

export function triggerPrint(landscape?: boolean) {
  executeCalibratedPrint({ landscape: Boolean(landscape), mode: "print" });
}

export function PrintButton({
  landscape,
  children = "طباعة النموذج",
  pdfLabel = "حفظ PDF",
  documentTitle,
}: {
  landscape?: boolean;
  children?: React.ReactNode;
  pdfLabel?: string;
  documentTitle?: string;
}) {
  const labelText = typeof children === "string" ? children : "طباعة النموذج";
  return (
    <PrintAndPdfActions
      landscape={landscape}
      printLabel={labelText}
      pdfLabel={pdfLabel}
      documentTitle={documentTitle}
      variant="school"
    />
  );
}

export function SchoolSheetRenderer({ form, student, pageNumber = 1, totalPages = 1 }: Props) {
  const { schoolSettings, isSchoolSubscribed, replaceGenderText, genderWords } = usePlatform();

  const formattedTitle = replaceGenderText(form.title);

  return (
    <section className={`sheet ${form.landscape ? "landscape" : "portrait"} relative`}>
      {/* Confidential badge if present */}
      {form.confidential && (
        <div className="conf-badge">
          {form.confidential}
        </div>
      )}

      {/* Watermark for preview mode */}
      {!isSchoolSubscribed && (
        <PlatformWatermark subtitle={`نسخة تجريبية — ${KHADAMATI_CONFIG.nameEn}`} />
      )}

      {/* Sheet Head */}
      <div className="sheet-head">
        <div className="sheet-head-right">
          <div>المملكة العربية السعودية</div>
          <div>وزارة التعليم</div>
          <div>{schoolSettings.admin || "الإدارة العامة للتعليم بمنطقة ........................"}</div>
          <div>{schoolSettings.schoolName || "اسم المدرسة ........................"}</div>
        </div>

        <div className="sheet-head-center">
          <img src="/moe-logo.png" alt="شعار وزارة التعليم" />
          {formattedTitle && <h2>{formattedTitle}</h2>}
        </div>

        <div className="sheet-head-left">
          {schoolSettings.schoolLogo ? (
            <img src={schoolSettings.schoolLogo} alt="شعار المدرسة" />
          ) : (
            <div className="w-12 h-12" />
          )}
        </div>
      </div>

      {/* Sheet Body */}
      <div className="sheet-body space-y-2">
        {form.blocks.map((block, idx) => (
          <BlockRenderer
            key={idx}
            block={block}
            student={student}
            replaceText={replaceGenderText}
            schoolSettings={schoolSettings}
            genderWords={genderWords}
          />
        ))}
      </div>

      {/* Sheet Foot */}
      <div className="sheet-foot">
        <div>
          {totalPages > 1 ? <span>صفحة {pageNumber} / {totalPages}</span> : <span></span>}
        </div>
        <div>
          {!isSchoolSubscribed && (
            <span className="free-note text-slate-500">
              {KHADAMATI_CONFIG.freeFooter}
              <small className="no-print"> — {KHADAMATI_CONFIG.freeFooterHint}</small>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function BlockRenderer({
  block,
  student,
  replaceText,
  schoolSettings,
  genderWords
}: {
  block: FormBlock;
  student?: StudentItem | null;
  replaceText: (t: string) => string;
  schoolSettings: any;
  genderWords: any;
}) {
  switch (block.type) {
    case "row":
      return (
        <div className="f-row">
          {block.fields?.map((f, i) => {
            let label = f;
            let val = "";

            if (f === "@student") {
              label = `اسم ${genderWords.student}`;
              val = student?.name || "";
            } else if (f === "@grade") {
              label = "الصف";
              val = student?.grade || "";
            } else if (f === "@class") {
              label = "الفصل";
              val = student?.cls || "";
            } else {
              label = replaceText(f);
            }

            return (
              <div key={i}>
                <b>{label}:</b>
                <span className="fill" contentEditable suppressContentEditableWarning>
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      );

    case "sec":
      return <div className="sec-title">{replaceText(block.text || "")}</div>;

    case "area":
      return (
        <div
          className="area"
          style={{ minHeight: block.h || 70 }}
          contentEditable
          suppressContentEditableWarning
        />
      );

    case "text":
      return <p className="note-line">{replaceText(block.text || "")}</p>;

    case "table": {
      const rowCount = block.rows || 6;
      const cols = block.cols || [];
      return (
        <table className="t">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={i}>{replaceText(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rIdx) => (
              <tr key={rIdx} style={{ height: block.rowH || 26 }}>
                {cols.map((_, cIdx) => {
                  let defaultText = "";
                  if (block.numbered && cIdx === 0) {
                    defaultText = String(rIdx + 1);
                  } else if (block.prefill && cIdx === (block.prefillCol ?? 1) && block.prefill[rIdx]) {
                    defaultText = replaceText(block.prefill[rIdx]);
                  } else if (block.data && block.data[rIdx]?.[cIdx]) {
                    defaultText = replaceText(block.data[rIdx][cIdx]);
                  }

                  return (
                    <td key={cIdx} contentEditable suppressContentEditableWarning>
                      {defaultText}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    case "check":
      return (
        <div className="f-row" style={{ flexWrap: "wrap" }}>
          <b>{replaceText(block.label || "")}:</b>
          {block.options?.map((opt, i) => (
            <span key={i} style={{ marginInlineEnd: 14 }}>
              ☐ {replaceText(opt)}
            </span>
          ))}
        </div>
      );

    case "blank":
      return <div style={{ height: block.h || 300 }} />;

    case "cover":
      return (
        <div className="cover">
          <div className="cover-title" contentEditable suppressContentEditableWarning>
            {replaceText(block.title || "")}
          </div>
          {block.sub && (
            <div className="cover-sub" contentEditable suppressContentEditableWarning>
              {replaceText(block.sub)}
            </div>
          )}
          <div className="cover-meta">
            <div>
              <b>اسم المدرسة:</b>
              <span className="fill" contentEditable suppressContentEditableWarning>
                {schoolSettings.schoolName}
              </span>
            </div>
            <div>
              <b>العام الدراسي:</b>
              <span className="fill" contentEditable suppressContentEditableWarning>
                ١٤٤٦ / ١٤٤٧هـ
              </span>
            </div>
            <div>
              <b>{block.owner || "المسؤول"}:</b>
              <span className="fill" contentEditable suppressContentEditableWarning>
                {block.ownerKey ? schoolSettings[block.ownerKey] || "" : ""}
              </span>
            </div>
          </div>
        </div>
      );

    case "photos":
      return (
        <div className="photo-grid">
          {Array.from({ length: block.count || 4 }).map((_, i) => (
            <PhotoSlot key={i} />
          ))}
        </div>
      );

    case "sign":
      return (
        <div className="sign-row">
          {block.who?.map((w, i) => {
            const roleName = replaceText(w);
            return (
              <div key={i}>
                <b>{roleName}</b>
                <div>
                  الاسم: <span className="fill" contentEditable suppressContentEditableWarning />
                </div>
                <div className="line" />
                <small>التوقيع</small>
              </div>
            );
          })}
        </div>
      );

    default:
      return null;
  }
}

function PhotoSlot() {
  const [imgUrl, setImgUrl] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setImgUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="photo-slot relative group hover:border-sky-500 transition-colors"
      title="انقر لرفع صورة الشاهد أو الفعالية"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {imgUrl ? (
        <img src={imgUrl} alt="صورة الشاهد" className="w-full h-full object-contain" />
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-slate-400 group-hover:text-sky-600">
          <Upload className="w-6 h-6 mb-1" />
          <span className="text-[11px] font-semibold">انقر لإدراج صورة الشاهد</span>
        </div>
      )}
    </div>
  );
}
