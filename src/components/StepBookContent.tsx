import React, { useRef, useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface StepBookContentProps {
  summaryText: string;
  setSummaryText: (text: string) => void;
  onAutoSummarize?: (rawText: string) => void;
}

export const StepBookContent: React.FC<StepBookContentProps> = ({ summaryText, setSummaryText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [readingFile, setReadingFile] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileError(null);
    setReadingFile(true);

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setSummaryText(text);
        setReadingFile(false);
      };
      reader.onerror = () => {
        setFileError('Không thể đọc file TXT này.');
        setReadingFile(false);
      };
      reader.readAsText(file, 'UTF-8');
    } else if (ext === 'pdf' || ext === 'docx') {
      // For PDF / DOCX, we attempt client text extraction or send raw text snippet
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        // Clean non-printable text characters if binary
        const readableText = result.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
        const snippet = readableText.slice(0, 8000).trim();
        if (snippet.length > 50) {
          setSummaryText(snippet);
        } else {
          setSummaryText(`[Đã nhận file ${file.name}]. AI sẽ tự đọc nội dung sách và tổng hợp các thông điệp nổi bật.`);
        }
        setReadingFile(false);
      };
      reader.onerror = () => {
        setFileError('Lỗi đọc tập tin. Vui lòng dán văn bản trực tiếp.');
        setReadingFile(false);
      };
      reader.readAsText(file);
    } else {
      setFileError('Định dạng tập tin chưa được hỗ trợ. Vui lòng chọn .txt, .pdf hoặc .docx');
      setReadingFile(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Nội Dung & Tóm Tắt Sách</h2>
            <p className="text-xs text-slate-400">Dán tóm tắt nội dung hoặc tải tập tin (PDF, DOCX, TXT) để AI phân tích bài học & giá trị</p>
          </div>
        </div>

        {/* File Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-medium transition-colors border border-white/10 flex items-center space-x-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload File PDF/DOCX/TXT</span>
          </button>
        </div>
      </div>

      {fileName && (
        <div className="flex items-center space-x-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">Đã tải: <strong>{fileName}</strong> {readingFile ? '(Đang đọc dữ liệu...)' : ''}</span>
        </div>
      )}

      {fileError && (
        <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Summary textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
          <span>Văn bản tóm tắt nội dung / Lời tựa / Đoạn trích tiêu biểu</span>
          <span className="text-[11px] text-slate-400">Nếu nhập ngắn, AI sẽ tự động mở rộng thông tin hợp lý</span>
        </label>
        <textarea
          rows={6}
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          placeholder="Dán tóm tắt cuốn sách, lời tựa hoặc các chương chính ở đây... AI sẽ rút ra các thông điệp chính, giá trị cốt lõi và các câu trích dẫn đắt giá nhất để đưa lên Infographic!"
          className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors placeholder:text-slate-500 leading-relaxed font-sans resize-y"
        />
      </div>
    </div>
  );
};
