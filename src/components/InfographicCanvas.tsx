import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  Download,
  Palette,
  Maximize2,
  Sparkles,
  Layers,
  FileImage,
  FileText,
  QrCode as QrIcon,
  Check,
  RefreshCw,
  Edit3
} from 'lucide-react';
import {
  BookMetadata,
  CoverAnalysis,
  ContentAnalysis,
  InfographicDesignVariant,
  CanvasDimensionId,
  DimensionOption,
  LibraryConfig,
  ImageEnhancement
} from '../types';
import { DynamicIcon } from './DynamicIcon';

interface InfographicCanvasProps {
  metadata: BookMetadata;
  coverImage: string | null;
  coverAnalysis: CoverAnalysis;
  contentAnalysis: ContentAnalysis;
  variants: InfographicDesignVariant[];
  libraryConfig: LibraryConfig;
  enhancement: ImageEnhancement;
}

const DIMENSIONS: DimensionOption[] = [
  {
    id: '1080x1350',
    label: '4:5 Dọc (Chuẩn FB / Insta)',
    subLabel: '1080 × 1350 px',
    width: 1080,
    height: 1350,
    aspectRatioLabel: '4/5',
  },
  {
    id: '1080x1080',
    label: '1:1 Vuông',
    subLabel: '1080 × 1080 px',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1/1',
  },
  {
    id: '1080x1920',
    label: '9:16 Story / Reel / Banner',
    subLabel: '1080 × 1920 px',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9/16',
  },
  {
    id: 'a4-v',
    label: 'A4 Dọc (In ấn / Poster)',
    subLabel: '210 × 297 mm',
    width: 1240,
    height: 1754,
    aspectRatioLabel: '1/1.414',
  },
  {
    id: 'a4-h',
    label: 'A4 Ngang (Trình chiếu)',
    subLabel: '297 × 210 mm',
    width: 1754,
    height: 1240,
    aspectRatioLabel: '1.414/1',
  },
];

export const InfographicCanvas: React.FC<InfographicCanvasProps> = ({
  metadata,
  coverImage,
  coverAnalysis,
  contentAnalysis,
  variants,
  libraryConfig,
  enhancement,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedDimensionId, setSelectedDimensionId] = useState<CanvasDimensionId>('1080x1350');
  const [activeVariantId, setActiveVariantId] = useState<string>('modern');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  // Custom visual overrides
  const [customPrimary, setCustomPrimary] = useState<string>('');
  const [customAccent, setCustomAccent] = useState<string>('');
  const [customCardBg, setCustomCardBg] = useState<string>('');
  const [titleFont, setTitleFont] = useState<string>('charm');

  const currentDimension = DIMENSIONS.find((d) => d.id === selectedDimensionId) || DIMENSIONS[0];

  const getTitleStyle = () => {
    switch (titleFont) {
      case 'charm':
        return {
          fontFamily: "'Charm', 'Dancing Script', 'Playfair Display', cursive, serif",
          fontWeight: 700,
        };
      case 'dancing':
        return {
          fontFamily: "'Dancing Script', 'Charm', cursive, serif",
          fontWeight: 700,
        };
      case 'playfair':
        return {
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 800,
        };
      case 'bevietnam':
      default:
        return {
          fontFamily: "'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
        };
    }
  };

  // Active design variant fallback
  const activeVariant =
    variants.find((v) => v.id === activeVariantId) ||
    variants[0] || {
      id: 'modern',
      name: 'Hiện đại',
      description: 'Phong cách tối giản, bố cục cân đối',
      primaryColor: coverAnalysis.primaryColor || '#1e3a8a',
      secondaryColor: coverAnalysis.secondaryColor || '#f59e0b',
      accentColor: coverAnalysis.accentColor || '#ef4444',
      cardBgColor: '#ffffff',
      textColor: '#0f172a',
      subtextColor: '#475569',
      fontFamily: 'sans',
      headerStyle: 'gradient',
      badgeStyle: 'pill',
      layoutPattern: 'balanced',
    };

  const primaryColor = customPrimary || activeVariant.primaryColor || coverAnalysis.primaryColor || '#1e3a8a';
  const accentColor = customAccent || activeVariant.accentColor || coverAnalysis.accentColor || '#f59e0b';
  const cardBgColor = customCardBg || activeVariant.cardBgColor || '#ffffff';

  // Generate QR code data URL if URL provided
  useEffect(() => {
    if (metadata.qrUrl) {
      QRCode.toDataURL(metadata.qrUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: primaryColor,
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => setQrCodeDataUrl(null));
    } else {
      setQrCodeDataUrl(null);
    }
  }, [metadata.qrUrl, primaryColor]);

  // Export as Image (PNG/JPG)
  const handleExportImage = async (format: 'png' | 'jpeg') => {
    if (!canvasContainerRef.current) return;
    try {
      setIsExporting(true);
      setExportSuccessMsg('Đang tạo hình ảnh 300 DPI...');

      const exportOptions = {
        quality: 0.95,
        pixelRatio: 2.5,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
      };

      const dataUrl = format === 'png'
        ? await toPng(canvasContainerRef.current, exportOptions)
        : await toJpeg(canvasContainerRef.current, exportOptions);

      const link = document.createElement('a');
      const filename = `${metadata.title.replace(/\s+/g, '_')}_Infographic.${format}`;
      link.href = dataUrl;
      link.download = filename;
      link.click();

      setExportSuccessMsg(`Đã tải xuống ${filename}`);
      setTimeout(() => setExportSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Export image error:', err);
      alert('Đã xảy ra lỗi khi tạo file ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export as PDF
  const handleExportPDF = async () => {
    if (!canvasContainerRef.current) return;
    try {
      setIsExporting(true);
      setExportSuccessMsg('Đang xuất bản file PDF chất lượng cao...');

      const exportOptions = {
        quality: 0.95,
        pixelRatio: 2.5,
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
      };

      const dataUrl = await toPng(canvasContainerRef.current, exportOptions);

      const orientation = currentDimension.width > currentDimension.height ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [currentDimension.width, currentDimension.height],
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, currentDimension.width, currentDimension.height);
      const filename = `${metadata.title.replace(/\s+/g, '_')}_Infographic.pdf`;
      pdf.save(filename);

      setExportSuccessMsg(`Đã xuất PDF: ${filename}`);
      setTimeout(() => setExportSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Export PDF error:', err);
      alert('Không thể xuất file PDF. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Dimensions, Variants & Export */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Dimension selector */}
          <div className="space-y-1.5 w-full lg:w-auto">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kích Thước Khung Infographic</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DIMENSIONS.map((dim) => (
                <button
                  key={dim.id}
                  onClick={() => setSelectedDimensionId(dim.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedDimensionId === dim.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/30 border border-white/20'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {dim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => handleExportImage('png')}
              disabled={isExporting}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Tải PNG (300 DPI)</span>
            </button>

            <button
              onClick={() => handleExportImage('jpeg')}
              disabled={isExporting}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl transition-all border border-white/15 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              <FileImage className="w-3.5 h-3.5 text-indigo-300" />
              <span>Tải JPG</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tải PDF</span>
            </button>
          </div>
        </div>

        {/* Style Variant Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-white">3 Phương Án Thiết Kế AI:</span>
            <div className="flex flex-wrap gap-2">
              {variants.map((varItem) => (
                <button
                  key={varItem.id}
                  onClick={() => {
                    setActiveVariantId(varItem.id);
                    setCustomPrimary('');
                    setCustomAccent('');
                    setCustomCardBg('');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 border cursor-pointer ${
                    activeVariantId === varItem.id
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 font-bold shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: varItem.primaryColor }}
                  ></span>
                  <span>{varItem.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Font & Custom Color Overrides */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            {/* Title Font Style Selector */}
            <div className="flex items-center space-x-2">
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chữ tiêu đề sách:</span>
              <select
                value={titleFont}
                onChange={(e) => setTitleFont(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              >
                <option value="charm">✍️ Thư Pháp Trang Trọng (Charm)</option>
                <option value="dancing">✍️ Cursive Nghệ Thuật (Dancing Script)</option>
                <option value="playfair">🏛️ Serif Cổ Điển (Playfair Display)</option>
                <option value="bevietnam">✨ Phông Chuẩn Rõ Nét (Be Vietnam Pro)</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Màu:</span>
              </span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  title="Đổi màu chính"
                />
                <span>Chính</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setCustomAccent(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  title="Đổi màu nhấn"
                />
                <span>Nhấn</span>
              </label>
            </div>
          </div>
        </div>

        {exportSuccessMsg && (
          <div className="text-xs text-center text-emerald-300 font-medium bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl animate-fade-in backdrop-blur-md">
            {exportSuccessMsg}
          </div>
        )}
      </div>

      {/* Main Canvas Container Preview Box */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 sm:p-8 flex items-center justify-center overflow-x-auto shadow-2xl">
        <div
          ref={canvasContainerRef}
          style={{
            width: `${currentDimension.width}px`,
            minHeight: `${currentDimension.height}px`,
            backgroundColor: coverAnalysis.backgroundColor || '#f8fafc',
            fontFamily: activeVariant.fontFamily === 'serif' ? 'Playfair Display, Georgia, serif' : "'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif",
          }}
          className="relative text-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between p-8 sm:p-12 border border-slate-300/40 rounded-xl transition-all duration-300"
        >
          {/* Watermark overlay if enabled */}
          {libraryConfig.showWatermark && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none rotate-[-30deg]">
              <span className="text-7xl font-black uppercase text-slate-900 tracking-widest text-center leading-none">
                {libraryConfig.organizationName || 'THƯ VIỆN HỌC VIỆN CHÍNH TRỊ CAND'}
              </span>
            </div>
          )}

          {/* TOP HEADER BRAND BANNER */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-5 text-white shadow-md flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 70%, ${accentColor} 100%)`,
              }}
            >
              <div className="flex items-center space-x-4">
                {libraryConfig.logoUrl ? (
                  <div className="w-14 h-14 rounded-xl bg-white p-1.5 shadow flex items-center justify-center overflow-hidden">
                    <img src={libraryConfig.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 block">
                    {libraryConfig.organizationName || 'THƯ VIỆN HỌC VIỆN CHÍNH TRỊ CAND'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white drop-shadow">
                    GIỚI THIỆU SÁCH MỚI
                  </h2>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: accentColor, color: '#ffffff' }}
                >
                  {metadata.genre || 'Sách Hay'}
                </span>
              </div>
            </div>

            {/* HERO BOOK BANNER SECTION */}
            <div
              className="rounded-2xl p-6 sm:p-8 border shadow-lg grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              style={{ backgroundColor: cardBgColor, borderColor: `${primaryColor}22` }}
            >
              {/* Cover Image */}
              <div className="md:col-span-5 flex justify-center">
                {coverImage ? (
                  <div className="relative group max-w-[220px] sm:max-w-[260px] rounded-xl overflow-hidden shadow-2xl border-4 border-white transition-transform duration-300 hover:scale-[1.02]">
                    <img
                      src={coverImage}
                      alt={metadata.title}
                      className="w-full h-auto object-cover rounded-lg"
                      style={{
                        filter: `brightness(${100 + enhancement.brightness}%) contrast(${100 + enhancement.contrast}%)`,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-48 h-64 rounded-xl flex flex-col items-center justify-center text-white p-4 text-center shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
                  >
                    <span className="text-xs uppercase font-semibold text-white/80">{metadata.genre}</span>
                    <h3 className="text-xl font-bold mt-2 leading-tight" style={getTitleStyle()}>{metadata.title}</h3>
                    <p className="text-xs font-medium text-white/90 mt-1">{metadata.author}</p>
                  </div>
                )}
              </div>

              {/* Book Details & Core Tagline */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span
                    className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-xs"
                    style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                  >
                    {metadata.genre ? `SÁCH ${metadata.genre.toUpperCase()}` : 'TÁC PHẨM GIỚI THIỆU'}
                  </span>
                  <h1
                    className="text-3xl sm:text-4xl font-bold leading-tight my-1 tracking-normal transition-all"
                    style={{
                      ...getTitleStyle(),
                      color: primaryColor,
                    }}
                  >
                    {metadata.title}
                  </h1>
                  <p className="text-sm font-semibold text-slate-700 mt-1 flex items-center gap-1">
                    <span>Tác giả:</span>
                    <span style={{ color: primaryColor }}>{metadata.author}</span>
                  </p>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {metadata.publisher && (
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      🏛️ {metadata.publisher}
                    </span>
                  )}
                  {metadata.publishYear && (
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      📅 Năm {metadata.publishYear}
                    </span>
                  )}
                  {metadata.pageCount && (
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      📖 {metadata.pageCount} trang
                    </span>
                  )}
                </div>

                {/* Tagline / Core Message Hook */}
                <div
                  className="p-4 rounded-xl border-l-4 shadow-sm"
                  style={{
                    backgroundColor: `${primaryColor}08`,
                    borderColor: primaryColor,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Thông Điệp Cốt Lõi</p>
                  <p className="text-sm font-medium text-slate-800 italic mt-0.5 leading-relaxed">
                    "{contentAnalysis.tagline || contentAnalysis.coreMessage}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN INFOGRAPHIC BODY CONTENT */}
          <div className="my-6 space-y-6">
            {/* VALUE PROPOSITION & HIGHLIGHTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: 4 Key Highlights */}
              <div
                className="rounded-2xl p-5 sm:p-6 border shadow-md space-y-4"
                style={{ backgroundColor: cardBgColor, borderColor: `${primaryColor}20` }}
              >
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                  <div
                    className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ★
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                    Nội Dung Nổi Bật & Giá Trị Độc Đáo
                  </h3>
                </div>

                <div className="space-y-3">
                  {contentAnalysis.highlights.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div
                        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${primaryColor}14`, color: primaryColor }}
                      >
                        <DynamicIcon name={point.icon} className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">{point.title}</h4>
                        <p className="text-xs text-slate-600 leading-normal">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Key Lessons & Quotes */}
              <div className="space-y-4">
                {/* Key Lessons Card */}
                <div
                  className="rounded-2xl p-5 border shadow-md space-y-3"
                  style={{ backgroundColor: cardBgColor, borderColor: `${primaryColor}20` }}
                >
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2.5">
                    <span className="text-base">💡</span>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                      Bài Học Giá Trị Rút Ra
                    </h3>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {contentAnalysis.keyLessons.map((lesson, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span style={{ color: accentColor }} className="font-bold">✓</span>
                        <span className="leading-snug">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Audience & Quote Box */}
                <div
                  className="rounded-2xl p-5 text-white shadow-md space-y-3"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}ee)` }}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                      Đối tượng đọc phù hợp
                    </span>
                    <p className="text-xs font-medium text-white/95 mt-1 leading-relaxed">
                      {contentAnalysis.targetAudienceDesc || metadata.targetAudience}
                    </p>
                  </div>

                  {contentAnalysis.notableQuotes.length > 0 && (
                    <div className="border-t border-white/20 pt-3">
                      <p className="text-[11px] font-medium italic text-amber-200 leading-relaxed">
                        "{contentAnalysis.notableQuotes[0]}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER & SMART QR CODE */}
          <div
            className="rounded-2xl p-4 sm:p-5 border shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-4"
            style={{ backgroundColor: cardBgColor, borderColor: `${primaryColor}22` }}
          >
            {/* Library Branding Footer Text */}
            <div className="flex items-center space-x-3 text-center sm:text-left">
              {libraryConfig.logoUrl && (
                <img src={libraryConfig.logoUrl} alt="Logo Thư viện" className="w-10 h-10 object-contain shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {libraryConfig.footerText || 'Nguồn: Thư viện Học viện Chính trị Công an nhân dân'}
                </p>
                <p className="text-[11px] text-slate-500">
                  BookInfo AI • Giới thiệu & Tuyên truyền Văn hóa Đọc
                </p>
              </div>
            </div>

            {/* Smart QR Code Box */}
            {qrCodeDataUrl && (
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-12 h-12 object-contain" />
                <div className="text-[10px]">
                  <span className="font-bold text-slate-900 block">QUÉT MÃ QR</span>
                  <span className="text-slate-500">Xem chi tiết thư viện</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
