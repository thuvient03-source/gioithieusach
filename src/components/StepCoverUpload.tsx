import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Sliders, Wand2, RefreshCw, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { ImageEnhancement, BookMetadata } from '../types';
import { BOOK_PRESETS, BookPreset } from '../data/presets';

interface StepCoverUploadProps {
  coverImage: string | null;
  setCoverImage: (url: string | null) => void;
  enhancement: ImageEnhancement;
  setEnhancement: React.Dispatch<React.SetStateAction<ImageEnhancement>>;
  onOcrExtract: () => void;
  isOcrLoading: boolean;
  onSelectPreset: (preset: BookPreset) => void;
  setMetadata: React.Dispatch<React.SetStateAction<BookMetadata>>;
  setSummaryText: (text: string) => void;
}

export const StepCoverUpload: React.FC<StepCoverUploadProps> = ({
  coverImage,
  setCoverImage,
  enhancement,
  setEnhancement,
  onOcrExtract,
  isOcrLoading,
  onSelectPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setCoverImage(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setCoverImage(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>Bìa Sách & Hình Ảnh</span>
              <span className="text-xs font-normal text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                JPG, PNG, WEBP
              </span>
            </h2>
            <p className="text-xs text-slate-400">Tải ảnh bìa sách để AI tự phân tích màu sắc, phong cách và trích xuất dữ liệu</p>
          </div>
        </div>

        {/* Presets quick loader */}
        <div className="hidden lg:flex items-center space-x-2">
          <span className="text-xs text-slate-400">Mẫu có sẵn:</span>
          {BOOK_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p)}
              className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl transition-colors flex items-center space-x-1 border border-white/10"
            >
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span>{p.metadata.title.slice(0, 14)}...</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Dropzone & Preview area */}
        <div className="md:col-span-6 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {!coverImage ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600/80 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/70 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center min-h-[260px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                Nhấp để chọn ảnh bìa sách hoặc kéo thả vào đây
              </h3>
              <p className="text-xs text-slate-400 mt-1">Hỗ trợ định dạng JPG, PNG, WEBP tối đa 15MB</p>
            </div>
          ) : (
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 p-3 text-center">
              <div className="relative mx-auto max-w-[200px] sm:max-w-[220px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={coverImage}
                  alt="Bìa sách"
                  className="w-full h-auto object-contain rounded-xl transition-all duration-300"
                  style={{
                    filter: `brightness(${100 + enhancement.brightness}%) contrast(${100 + enhancement.contrast}%) ${
                      enhancement.sharpen ? 'sharpen(1.2)' : ''
                    }`,
                  }}
                />

                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900/90 text-white text-xs font-medium rounded-lg hover:bg-slate-800 border border-white/20 shadow"
                  >
                    Đổi ảnh
                  </button>
                  <button
                    onClick={() => setCoverImage(null)}
                    className="px-3 py-1.5 bg-red-950/90 text-red-300 text-xs font-medium rounded-lg hover:bg-red-900 border border-red-800 shadow"
                  >
                    Xóa
                  </button>
                </div>
              </div>

              {/* OCR Action Trigger */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  onClick={onOcrExtract}
                  disabled={isOcrLoading}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {isOcrLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang AI OCR phân tích bìa...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Trích xuất thông tin tự động bằng AI OCR</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Enhancement Controls */}
        <div className="md:col-span-6 space-y-4 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-slate-300 font-medium text-xs border-b border-white/10 pb-2">
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <span>AI Tinh Chỉnh & Xử Lý Ảnh Bìa Mờ / Tối / Nền Xấu</span>
          </div>

          <div className="space-y-3">
            {/* Brightness slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Độ sáng (Tăng sáng nếu bìa tối)</span>
                <span className="text-indigo-400 font-mono">{enhancement.brightness > 0 ? `+${enhancement.brightness}` : enhancement.brightness}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={enhancement.brightness}
                onChange={(e) => setEnhancement((prev) => ({ ...prev, brightness: Number(e.target.value) }))}
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Contrast slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Độ tương phản</span>
                <span className="text-indigo-400 font-mono">{enhancement.contrast > 0 ? `+${enhancement.contrast}` : enhancement.contrast}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={enhancement.contrast}
                onChange={(e) => setEnhancement((prev) => ({ ...prev, contrast: Number(e.target.value) }))}
                className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Checkbox toggles */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enhancement.sharpen}
                  onChange={(e) => setEnhancement((prev) => ({ ...prev, sharpen: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/30"
                />
                <span>Làm nét chi tiết</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enhancement.cleanBackground}
                  onChange={(e) => setEnhancement((prev) => ({ ...prev, cleanBackground: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/30"
                />
                <span>Làm sạch nền thừa</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none col-span-2">
                <input
                  type="checkbox"
                  checked={enhancement.perspectiveFix}
                  onChange={(e) => setEnhancement((prev) => ({ ...prev, perspectiveFix: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/30"
                />
                <span>Nắn thẳng khung bìa (Perspective Fix)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
