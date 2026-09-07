import React, { useRef } from 'react';
import { LibraryConfig } from '../types';
import { Building2, Upload, ShieldCheck, Check, Trash2 } from 'lucide-react';

interface StepBrandingProps {
  libraryConfig: LibraryConfig;
  setLibraryConfig: React.Dispatch<React.SetStateAction<LibraryConfig>>;
}

export const StepBranding: React.FC<StepBrandingProps> = ({ libraryConfig, setLibraryConfig }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setLibraryConfig((prev) => ({ ...prev, logoUrl: evt.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Bộ Nhận Diện Thương Hiệu Thư Viện / Đơn Vị</h2>
          <p className="text-xs text-slate-400">Tùy chỉnh logo, tên cơ quan và thông tin bản quyền chèn vào Footer của Infographic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Logo Upload */}
        <div className="md:col-span-5 space-y-3">
          <label className="text-xs font-medium text-slate-300 block">Logo Đơn vị / Thư viện</label>
          <input
            type="file"
            ref={logoInputRef}
            onChange={handleLogoUpload}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
          />

          {libraryConfig.logoUrl ? (
            <div className="flex items-center space-x-4 bg-slate-900/50 border border-white/10 p-3 rounded-xl">
              <div className="w-16 h-16 rounded-lg bg-slate-900 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                <img src={libraryConfig.logoUrl} alt="Logo Thư viện" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-indigo-300 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã chèn logo
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
                  >
                    Thay logo
                  </button>
                  <button
                    onClick={() => setLibraryConfig((prev) => ({ ...prev, logoUrl: null }))}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600/80 hover:border-indigo-500 bg-slate-900/40 hover:bg-slate-900/70 rounded-xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-1.5"
            >
              <Upload className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-medium text-slate-300">Bấm để tải Logo Thư viện</span>
              <span className="text-[10px] text-slate-400">PNG trong suốt, SVG hoặc JPG</span>
            </div>
          )}
        </div>

        {/* Text Fields */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Tên Thư viện / Cơ quan</label>
            <input
              type="text"
              value={libraryConfig.organizationName}
              onChange={(e) => setLibraryConfig((prev) => ({ ...prev, organizationName: e.target.value }))}
              placeholder="VD: Thư viện Học viện Chính trị CAND"
              className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">Dòng Nguồn / Footer Infographic</label>
            <input
              type="text"
              value={libraryConfig.footerText}
              onChange={(e) => setLibraryConfig((prev) => ({ ...prev, footerText: e.target.value }))}
              placeholder="Nguồn: Thư viện Học viện Chính trị Công an nhân dân"
              className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </div>

          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={libraryConfig.showWatermark}
              onChange={(e) => setLibraryConfig((prev) => ({ ...prev, showWatermark: e.target.checked }))}
              className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500/30"
            />
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chèn khung chìm bảo mật bản quyền đơn vị</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
