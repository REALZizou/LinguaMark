import React from 'react';
import { useExam } from '../data/ExamContext';
import { 
  FileText, 
  CheckCircle2, 
  Layers, 
  Copy, 
  Download, 
  Share2, 
  Sparkles,
  Printer,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'prd' | 'review' | 'prototype';
  setActiveTab: (tab: 'prd' | 'review' | 'prototype') => void;
  onCopyPRD: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onCopyPRD,
  copied
}) => {
  const { resetToDemo } = useExam();

  const handleReset = () => {
    if (confirm('确认将考卷、45 份考卷切片与学情数据恢复为默认示范状态吗？')) {
      resetToDemo();
      alert('示范数据已重置就绪！');
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-black text-white tracking-tighter">LM</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  语测通 (LinguaMark)
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  v1.0 系统就绪 · 可交互试用
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                外语纸笔考试 · 听力音频绑定 · OMR客观题识别 · 主观题流水阅卷 · 学情闭环
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('prototype')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                activeTab === 'prototype'
                  ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>🚀 系统工作台 (试用体验)</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('prd')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'prd'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>需求文档 (PRD)</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'review'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>技术架构与评审</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="重置全套考试与学情数据为出厂示范状态"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">重置沙箱</span>
            </button>

            <button
              onClick={onCopyPRD}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="复制完整 Markdown 格式 PRD"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{copied ? '已复制PRD' : '复制文档'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="打印或另存为 PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
