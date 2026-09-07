/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepCoverUpload } from './components/StepCoverUpload';
import { StepBookDetails } from './components/StepBookDetails';
import { StepBookContent } from './components/StepBookContent';
import { StepBranding } from './components/StepBranding';
import { InfographicCanvas } from './components/InfographicCanvas';
import { MediaContentPackageView } from './components/MediaContentPackageView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  BookMetadata,
  ImageEnhancement,
  LibraryConfig,
  GeneratedInfographicPackage,
} from './types';
import { BOOK_PRESETS, BookPreset } from './data/presets';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const [activeTab, setActiveTab] = useState<'creator' | 'result' | 'media' | 'branding'>('creator');

  // Form State
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [enhancement, setEnhancement] = useState<ImageEnhancement>({
    sharpen: false,
    brightness: 0,
    contrast: 0,
    cleanBackground: false,
    perspectiveFix: false,
  });

  const [metadata, setMetadata] = useState<BookMetadata>({
    title: '',
    author: '',
    publisher: '',
    publishYear: '',
    pageCount: '',
    genre: '',
    targetAudience: '',
    keywords: '',
    qrUrl: '',
  });

  const [summaryText, setSummaryText] = useState<string>('');

  const [libraryConfig, setLibraryConfig] = useState<LibraryConfig>({
    logoUrl: null,
    organizationName: 'Thư viện Học viện Chính trị CAND',
    footerText: 'Nguồn: Thư viện Học viện Chính trị Công an nhân dân',
    showWatermark: false,
  });

  // Loading & Generation State
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [ocrStatusMsg, setOcrStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [generatedPackage, setGeneratedPackage] = useState<GeneratedInfographicPackage | null>(null);

  // Quick Preset Selection
  const handleSelectPreset = (preset: BookPreset) => {
    setMetadata(preset.metadata);
    setSummaryText(preset.summaryText);
    setErrorMsg(null);
  };

  // OCR Auto Extraction
  const handleOcrExtract = async () => {
    if (!coverImage && !summaryText) {
      setErrorMsg('Vui lòng tải ảnh bìa hoặc dán văn bản tóm tắt trước khi trích xuất OCR.');
      return;
    }
// Khởi tạo thư viện bằng API Key lấy từ Vite Environment
try {
  setIsOcrLoading(true);
  setErrorMsg(null);
  setOcrStatusMsg("Đang kết nối Google AI...");

  // Chuẩn bị dữ liệu ảnh
  let base64Data = coverImage;
  let mimeType = "image/jpeg";
  if (coverImage && coverImage.startsWith("data:")) {
    const matches = coverImage.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      base64Data = matches[2];
    }
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
  
  const prompt = `Phân tích hình ảnh bìa sách và trích xuất các thông tin chi tiết (tên sách, tác giả, nhà xuất bản...). Kết hợp với dữ liệu sau nếu có: ${summaryText || ''}`;
  
const imageParts = base64Data ? [{
      inlineData: {
        data: base64Data,
        mimeType
      }
    }] : [];
    // BẮT ĐẦU TỪ ĐÂY: Thêm đoạn code xử lý kết quả
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    const extractedText = text || "Không tìm thấy thông tin hợp lệ.";
    
    // Cập nhật text vào metadata của bạn (điều chỉnh tên hàm setMetadata cho khớp với code của bạn)
    setMetadata(prev => ({ ...prev, description: extractedText })); 
    // KẾT THÚC ĐOẠN THÊM MỚI

  } catch (error) {
    console.error("Lỗi Google AI:", error);
    setErrorMsg(`Lỗi xử lý AI: ${error.message}`);
  } finally {
    setIsOcrLoading(false);
  }
  }; // Dấu này đóng hàm handleOcrExtract. Hãy xóa các dấu } thừa bên dưới nó nếu có.
  // Main Infographic & Package Generation
  const handleGenerateInfographic = async () => {
    if (!metadata.title?.trim()) {
      setErrorMsg('Vui lòng nhập tên sách trước khi tạo Infographic.');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMsg(null);

      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
      
      let base64Data = coverImage;
      let mimeType = "image/jpeg";
      if (coverImage && coverImage.startsWith("data:")) {
        const matches = coverImage.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }

      const imageParts = base64Data ? [{
        inlineData: {
          data: base64Data,
          mimeType
        }
      }] : [];

      const prompt = `Bạn là một chuyên gia tạo nội dung Infographic giới thiệu sách.
      Dựa vào các thông tin sau, hãy viết nội dung chi tiết cho một Infographic.
      Yêu cầu trả về MỘT CHUỖI JSON DUY NHẤT có cấu trúc như sau (không kèm markdown \`\`\`json):
      {
        "title": "Tiêu đề cuốn sách",
        "author": "Tên tác giả",
        "mainQuote": "Một câu trích dẫn hay ho",
        "keyPoints": ["Điểm chính 1", "Điểm chính 2", "Điểm chính 3"],
        "summary": "Tóm tắt ngắn gọn",
        "targetAudience": "Đối tượng đọc phù hợp"
      }

      Thông tin đầu vào:
      - Metadata: ${JSON.stringify(metadata)}
      - Tóm tắt: ${summaryText || 'Không có'}
      - Thư viện: ${JSON.stringify(libraryConfig)}
      `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      const cleanJsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedData = JSON.parse(cleanJsonString);

      setGeneratedPackage(generatedData);
      setActiveTab('result');

    } catch (err: any) {
      console.error('Generation Error:', err);
      setErrorMsg(err.message || 'Đã xảy ra lỗi khi kết nối với máy chủ AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background Decor - Frosted Glass Lighting Spots */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-orange-500/20 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed top-[35%] right-[15%] w-[35%] h-[35%] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasResult={Boolean(generatedPackage)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in shadow-lg backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <div className="flex items-center space-x-3 shrink-0 self-end sm:self-auto">
              <button
                onClick={handleGenerateInfographic}
                disabled={isGenerating}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Thử lại ngay</span>
              </button>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* OCR Success Notification */}
        {ocrStatusMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-2xl flex items-center space-x-2 text-xs sm:text-sm shadow-md backdrop-blur-md animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{ocrStatusMsg}</span>
          </div>
        )}

        {/* TAB 1: CREATOR FORM */}
        {activeTab === 'creator' && (
          <div className="space-y-8">
            {/* Step 1: Cover Photo & Enhancement */}
            <StepCoverUpload
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              enhancement={enhancement}
              setEnhancement={setEnhancement}
              onOcrExtract={handleOcrExtract}
              isOcrLoading={isOcrLoading}
              onSelectPreset={handleSelectPreset}
              setMetadata={setMetadata}
              setSummaryText={setSummaryText}
            />

            {/* Step 2: Book Metadata Details */}
            <StepBookDetails metadata={metadata} setMetadata={setMetadata} />

            {/* Step 3: Book Content Summary */}
            <StepBookContent summaryText={summaryText} setSummaryText={setSummaryText} />

            {/* Main Action Bar */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <span>Sẵn sàng tạo Infographic & Truyền thông Sách</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  AI sẽ tự động phân tích màu sắc, tạo 3 phiên bản Infographic và biên soạn bài viết truyền thông
                </p>
              </div>

              <button
                onClick={handleGenerateInfographic}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <span>TẠO INFOGRAPHIC NGAY</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INFOGRAPHIC CANVAS RESULT */}
        {activeTab === 'result' && generatedPackage && (
          <div className="space-y-6">
            <InfographicCanvas
              metadata={metadata}
              coverImage={coverImage}
              coverAnalysis={generatedPackage.coverAnalysis}
              contentAnalysis={generatedPackage.contentAnalysis}
              variants={generatedPackage.variants}
              libraryConfig={libraryConfig}
              enhancement={enhancement}
            />
          </div>
        )}

        {/* TAB 3: MEDIA CONTENT HUB */}
        {activeTab === 'media' && generatedPackage && (
          <div className="space-y-6">
            <MediaContentPackageView
              mediaPackage={generatedPackage.mediaPackage}
              metadata={metadata}
            />
          </div>
        )}

        {/* TAB 4: BRANDING SETUP */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <StepBranding libraryConfig={libraryConfig} setLibraryConfig={setLibraryConfig} />

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab(generatedPackage ? 'result' : 'creator')}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-colors shadow-lg shadow-indigo-600/20"
              >
                Lưu & Quay lại
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Loading Modal */}
      <LoadingOverlay isOpen={isGenerating} />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <span className="font-semibold text-white">BookInfo AI</span>
            <span>•</span>
            <span>{libraryConfig.footerText}</span>
          </p>
          <p className="text-slate-500 font-mono text-[11px]">Frosted Glass Edition • Gemini 3.8 Flash</p>
        </div>
      </footer>
    </div>
  );
}
