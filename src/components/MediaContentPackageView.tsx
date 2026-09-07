import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Share2,
  Sparkles,
  MessageSquare,
  Globe,
  Tag,
  Download,
  BookOpen
} from 'lucide-react';
import { MediaContentPackage, BookMetadata } from '../types';

interface MediaContentPackageViewProps {
  mediaPackage: MediaContentPackage;
  metadata: BookMetadata;
}

export const MediaContentPackageView: React.FC<MediaContentPackageViewProps> = ({ mediaPackage, metadata }) => {
  const [activeTab, setActiveTab] = useState<'review' | 'slogans' | 'facebook' | 'zalo' | 'website' | 'hashtags'>('review');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadWordText = (content: string, title: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${metadata.title}_${title}.txt`;
    link.click();
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Bộ Truyền Thông & Bài Viết Giới Thiệu Sách AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Bài giới thiệu văn học, caption mạng xã hội, bài viết website SEO & slogans</p>
        </div>

        <button
          onClick={() => {
            const fullPackageText = `=== GIỚI THIỆU SÁCH: ${metadata.title} ===
Tác giả: ${metadata.author}

--- 1. BÀI GIỚI THIỆU SÁCH (300-500 TỪ) ---
${mediaPackage.bookReviewEssay}

--- 2. 10 SLOGAN TRUYỀN THÔNG ---
${mediaPackage.slogans.map((s, i) => `${i + 1}. ${s}`).join('\n')}

--- 3. CAPTION FACEBOOK ---
${mediaPackage.facebookCaption}

--- 4. BÀI ĐĂNG ZALO ---
${mediaPackage.zaloPost}

--- 5. BÀI VIẾT WEBSITE SEO ---
${mediaPackage.websiteArticle}

--- 6. HASHTAGS ---
${mediaPackage.hashtags.join(' ')}
`;
            handleCopy(fullPackageText, 'full-package');
          }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
        >
          {copiedKey === 'full-package' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copiedKey === 'full-package' ? 'Đã sao chép toàn bộ!' : 'Sao chép Trọn bộ Content'}</span>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('review')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'review'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Lời Giới Thiệu (300-500 từ)</span>
        </button>

        <button
          onClick={() => setActiveTab('slogans')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'slogans'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>10 Slogan</span>
        </button>

        <button
          onClick={() => setActiveTab('facebook')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'facebook'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Caption Facebook</span>
        </button>

        <button
          onClick={() => setActiveTab('zalo')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'zalo'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          <span>Bài đăng Zalo</span>
        </button>

        <button
          onClick={() => setActiveTab('website')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'website'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>Bài Website SEO (600 từ)</span>
        </button>

        <button
          onClick={() => setActiveTab('hashtags')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'hashtags'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-indigo-400" />
          <span>20 Hashtags</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
        {/* Tab 1: Book Review Essay */}
        {activeTab === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-indigo-300">
                Bài Giới Thiệu Sách Giàu Cảm Hứng & Văn Học (300–500 Từ)
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(mediaPackage.bookReviewEssay, 'review')}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
                >
                  {copiedKey === 'review' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'review' ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
                <button
                  onClick={() => handleDownloadWordText(mediaPackage.bookReviewEssay, 'Loi_Gioi_Thieu')}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tải File .TXT</span>
                </button>
              </div>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line font-serif bg-slate-950/60 p-4 rounded-xl border border-white/5">
              {mediaPackage.bookReviewEssay}
            </div>
          </div>
        )}

        {/* Tab 2: Slogans */}
        {activeTab === 'slogans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-indigo-300">10 Khẩu Hiệu (Slogan) Truyền Thông Ấn Tượng</h3>
              <button
                onClick={() => handleCopy(mediaPackage.slogans.join('\n'), 'slogans')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
              >
                {copiedKey === 'slogans' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'slogans' ? 'Đã sao chép tất cả' : 'Sao chép 10 Slogan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mediaPackage.slogans.map((slogan, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-white/5 hover:border-indigo-500/50 rounded-xl p-3.5 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-200 italic">"{slogan}"</span>
                  </div>
                  <button
                    onClick={() => handleCopy(slogan, `slogan-${idx}`)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-white transition-opacity cursor-pointer"
                    title="Sao chép câu này"
                  >
                    {copiedKey === `slogan-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Facebook Caption */}
        {activeTab === 'facebook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-indigo-300">Caption Facebook (~250 Từ Kèm Emojis & CTA)</h3>
              <button
                onClick={() => handleCopy(mediaPackage.facebookCaption, 'facebook')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
              >
                {copiedKey === 'facebook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'facebook' ? 'Đã sao chép' : 'Sao chép Caption FB'}</span>
              </button>
            </div>

            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {mediaPackage.facebookCaption}
            </div>
          </div>
        )}

        {/* Tab 4: Zalo Post */}
        {activeTab === 'zalo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-indigo-300">Bài Đăng Zalo Tinh Gọn (~150 Từ)</h3>
              <button
                onClick={() => handleCopy(mediaPackage.zaloPost, 'zalo')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
              >
                {copiedKey === 'zalo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'zalo' ? 'Đã sao chép' : 'Sao chép Bài Zalo'}</span>
              </button>
            </div>

            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {mediaPackage.zaloPost}
            </div>
          </div>
        )}

        {/* Tab 5: Website SEO Article */}
        {activeTab === 'website' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-indigo-300">Bài Viết Website Chuẩn SEO (~600 Từ)</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(mediaPackage.websiteArticle, 'website')}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
                >
                  {copiedKey === 'website' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'website' ? 'Đã sao chép' : 'Sao chép Bài Web'}</span>
                </button>
                <button
                  onClick={() => handleDownloadWordText(mediaPackage.websiteArticle, 'Bai_Website_SEO')}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tải File .TXT</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-5 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {mediaPackage.websiteArticle}
            </div>
          </div>
        )}

        {/* Tab 6: Hashtags */}
        {activeTab === 'hashtags' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-indigo-300">20 Hashtags Truyền Thông & Văn Hóa Đọc</h3>
              <button
                onClick={() => handleCopy(mediaPackage.hashtags.join(' '), 'hashtags')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg flex items-center space-x-1 border border-white/10 cursor-pointer"
              >
                {copiedKey === 'hashtags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'hashtags' ? 'Đã sao chép 20 Hashtags' : 'Sao chép Tất Cả'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {mediaPackage.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  onClick={() => handleCopy(tag, `tag-${idx}`)}
                  className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-400 text-indigo-300 rounded-xl text-xs font-mono cursor-pointer transition-colors flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  {copiedKey === `tag-${idx}` && <Check className="w-3 h-3 text-emerald-400" />}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
