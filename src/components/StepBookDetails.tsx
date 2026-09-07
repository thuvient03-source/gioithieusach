import React from 'react';
import { BookMetadata } from '../types';
import { BookOpen, User, Building2, Calendar, FileText, Tag, Users, QrCode } from 'lucide-react';

interface StepBookDetailsProps {
  metadata: BookMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<BookMetadata>>;
}

export const StepBookDetails: React.FC<StepBookDetailsProps> = ({ metadata, setMetadata }) => {
  const handleChange = (field: keyof BookMetadata, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Section Header */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
          2
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Thông Tin Chi Tiết Cuốn Sách</h2>
          <p className="text-xs text-slate-400">Điền thông tin xuất bản hoặc tự động cập nhật từ OCR</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Title */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tên sách <span className="text-red-400">*</span></span>
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ví dụ: Đắc Nhân Tâm, Hồ Chí Minh - Hành Trình Tìm Đường Cứu Nước..."
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Author */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tác giả <span className="text-red-400">*</span></span>
          </label>
          <input
            type="text"
            value={metadata.author}
            onChange={(e) => handleChange('author', e.target.value)}
            placeholder="Ví dụ: Dale Carnegie, Viện Lịch Sử..."
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Publisher */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nhà xuất bản</span>
          </label>
          <input
            type="text"
            value={metadata.publisher}
            onChange={(e) => handleChange('publisher', e.target.value)}
            placeholder="Ví dụ: NXB Chính Trị Quốc Gia Sự Thật"
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Publish Year */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Năm xuất bản</span>
          </label>
          <input
            type="text"
            value={metadata.publishYear}
            onChange={(e) => handleChange('publishYear', e.target.value)}
            placeholder="Ví dụ: 2023"
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Page Count */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Số trang</span>
          </label>
          <input
            type="text"
            value={metadata.pageCount}
            onChange={(e) => handleChange('pageCount', e.target.value)}
            placeholder="Ví dụ: 320"
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Genre */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thể loại sách</span>
          </label>
          <input
            type="text"
            value={metadata.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            placeholder="Ví dụ: Kỹ năng sống, Lịch sử, Kinh tế..."
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Đối tượng đọc</span>
          </label>
          <input
            type="text"
            value={metadata.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
            placeholder="Ví dụ: Cán bộ, chiến sĩ, giáo viên, học sinh sinh viên..."
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1.5 sm:col-span-3">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>Từ khóa chính (phân cách bằng dấu phẩy)</span>
          </label>
          <input
            type="text"
            value={metadata.keywords}
            onChange={(e) => handleChange('keywords', e.target.value)}
            placeholder="Ví dụ: Giao tiếp, Lãnh đạo, Thành công, Đọc sách..."
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Smart QR Link */}
        <div className="space-y-1.5 sm:col-span-3">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>Link Tra Cứu Thư Viện / Mã QR Thông Minh (Tùy chọn)</span>
          </label>
          <input
            type="url"
            value={metadata.qrUrl || ''}
            onChange={(e) => handleChange('qrUrl', e.target.value)}
            placeholder="https://thuvien.hcvp.edu.vn/sach-hay-123"
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};
