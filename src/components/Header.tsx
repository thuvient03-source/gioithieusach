import React from 'react';
import { BookOpen, Sparkles, Layers, FileText, Settings, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'creator' | 'result' | 'media' | 'branding';
  setActiveTab: (tab: 'creator' | 'result' | 'media' | 'branding') => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, hasResult }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 text-white shadow-xl relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('creator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center">
                  BookInfo <span className="text-indigo-400 ml-1">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                  v2.5 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Tạo Infographic Giới thiệu Sách & Truyền thông Thư viện
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('creator')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'creator'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 border border-white/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nhập liệu & Tạo</span>
            </button>

            {hasResult && (
              <>
                <button
                  onClick={() => setActiveTab('result')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'result'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Xem Infographic</span>
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'media'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Bài viết & Media</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('branding')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'branding'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title="Cấu hình Thương hiệu Thư viện"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Thương hiệu</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
