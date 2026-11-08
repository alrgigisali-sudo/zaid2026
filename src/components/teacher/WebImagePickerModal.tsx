import React, { useState, useEffect } from "react";
import { Search, Globe, Link2, Check, X, Loader2, Image as ImageIcon } from "lucide-react";

interface WebImage {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string;
}

interface WebImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  initialQuery?: string;
}

export const WebImagePickerModal: React.FC<WebImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  initialQuery = "",
}) => {
  const [tab, setTab] = useState<"search" | "url">("search");
  const [searchQuery, setSearchQuery] = useState(initialQuery || "تعليم مدرسي");
  const [directUrl, setDirectUrl] = useState("");
  const [urlPreviewError, setUrlPreviewError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<WebImage[]>([]);

  // Search function
  const handleSearch = async (queryToSearch: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/web/search-images?q=${encodeURIComponent(queryToSearch || "تعليم")}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch (e) {
      console.error("Failed to fetch web images", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleSearch(searchQuery);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onSelectImage(url);
    onClose();
  };

  const handleApplyUrl = () => {
    if (!directUrl.trim()) return;
    onSelectImage(directUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs no-print text-right" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">إضافة صورة من الويب للشاهد</h3>
              <p className="text-xs text-slate-500">اختر من مكتبة الويب التعليمية أو أضف رابط صورة مباشر</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1">
          <button
            type="button"
            onClick={() => setTab("search")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === "search" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>البحث في صور الويب التعليمية</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === "url" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>رابط صورة مباشر (URL)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {tab === "search" && (
            <div className="space-y-4">
              {/* Search bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchQuery);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن: فصل، مختبر، تكريم، نشاط، ورشة عمل..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-9 pl-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "بحث"}
                </button>
              </form>

              {/* Suggestions chips */}
              <div className="flex flex-wrap gap-1.5 items-center text-xs">
                <span className="text-slate-500 font-bold text-[11px]">مقترحات:</span>
                {["بيئة الصف", "معمل العلوم", "التعليم الرقمي", "تكريم وتفوق", "تطوير مهني", "مسابقات طلابية"].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSearchQuery(chip);
                      handleSearch(chip);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Images Grid */}
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-700" />
                  <span className="text-xs">جاري تحميل الصور من الويب...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => handleSelect(img.url)}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-500 bg-slate-100 h-32 cursor-pointer transition-all hover:shadow-md"
                    >
                      <img
                        src={img.thumbnail}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-2 opacity-90 group-hover:opacity-100">
                        <span className="text-white text-[10px] font-bold line-clamp-1">{img.title}</span>
                        <span className="text-sky-300 text-[9px] font-medium">{img.category}</span>
                      </div>
                      <div className="absolute top-2 left-2 bg-sky-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "url" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ألصق رابط الصورة المباشر من الإنترنت:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={directUrl}
                    onChange={(e) => {
                      setDirectUrl(e.target.value);
                      setUrlPreviewError(false);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    disabled={!directUrl.trim() || urlPreviewError}
                    className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    إدراج
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  يدعم صيغ الصور المباشرة (JPG, PNG, WebP).
                </span>
              </div>

              {/* Direct URL Live Preview */}
              {directUrl.trim() && (
                <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-700 mb-2 self-start">معاينة الصورة:</span>
                  <div className="w-full max-w-sm h-48 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
                    <img
                      src={directUrl}
                      alt="معاينة"
                      className="w-full h-full object-contain"
                      onError={() => setUrlPreviewError(true)}
                    />
                  </div>
                  {urlPreviewError && (
                    <span className="text-xs text-rose-600 font-bold mt-2">
                      تعذر تحميل الصورة من هذا الرابط. تأكد من أن الرابط مباشر وينتهي بصيغة صورة.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebImagePickerModal;
