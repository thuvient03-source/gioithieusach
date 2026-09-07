import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, BookOpen } from 'lucide-react';

interface LoadingOverlayProps {
  isOpen: boolean;
}

const STEPS = [
  'Đang gửi dữ liệu đến Gemini 3.6 Flash Server...',
  'BƯỚC 1: Phân tích bìa sách (Màu sắc chủ đạo, phong cách & cảm xúc)...',
  'BƯỚC 2: Phân tích nội dung (Thông điệp, bài học cốt lõi & trích dẫn)...',
  'BƯỚC 3: Thiết kế Infographic 3 phiên bản phong cách...',
  'BƯỚC 4: Viết bài giới thiệu sách 300-500 từ truyền cảm hứng...',
  'BƯỚC 5: Sinh 10 Slogan & 20 Hashtag truyền thông...',
  'BƯỚC 6: Biên soạn Caption Facebook, Zalo & Bài đăng Website chuẩn SEO...',
  'Đang hoàn tất và xuất dữ liệu hình ảnh...'
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isOpen }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-red-600 to-rose-600 animate-spin opacity-40 blur-md"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl">
            <BookOpen className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
            <span>BookInfo AI Đang Xử Lý...</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">Vui lòng chờ giây lát, AI đang sáng tạo infographic và truyền thông bài viết</p>
        </div>

        {/* Progress List */}
        <div className="space-y-2.5 text-left bg-slate-950/60 border border-slate-800 rounded-2xl p-4 max-h-56 overflow-y-auto">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 text-xs transition-opacity duration-300 ${
                  isDone
                    ? 'text-emerald-400 font-medium'
                    : isCurrent
                    ? 'text-amber-300 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0 mt-0.5"></div>
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
