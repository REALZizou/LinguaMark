import React, { useState } from 'react';
import { Header } from './components/Header';
import { PRDViewer } from './components/PRDViewer';
import { ReviewAnalysis } from './components/ReviewAnalysis';
import { OMRSimulator } from './components/prototype/OMRSimulator';
import { GradingStation } from './components/prototype/GradingStation';
import { ExamPaperDesigner } from './components/prototype/ExamPaperDesigner';
import { AnalyticsDashboard } from './components/prototype/AnalyticsDashboard';
import { PRD_SECTIONS } from './data/prdContent';
import { 
  Scan, 
  PenTool, 
  FileText, 
  BarChart2, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prd' | 'review' | 'prototype'>('prototype');
  const [activePrototypeModule, setActivePrototypeModule] = useState<'designer' | 'omr' | 'grading' | 'analytics'>('designer');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate full markdown PRD for copying
  const handleCopyPRD = () => {
    let md = `# LinguaMark 语测通 - 内部外语考试与学情分析系统\n`;
    md += `> 产品需求文档 (PRD v1.0 Standard)\n\n`;
    md += `## 推荐应用名称\n`;
    md += `**首选推荐**：语测通 (LinguaMark)\n`;
    md += `**宣传标语**：连接一张纸笔，洞悉语言教学全链路\n\n`;
    md += `----\n\n`;

    PRD_SECTIONS.forEach((sec) => {
      md += `## ${sec.number} ${sec.title}\n\n`;
      md += `${sec.content}\n\n`;
      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          md += `### ${sub.title}\n\n`;
          md += `${sub.content}\n\n`;
        });
      }
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyPRD={handleCopyPRD}
        copied={copied}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* Tab 1: PRD Document */}
        {activeTab === 'prd' && <PRDViewer />}

        {/* Tab 2: Review & Technical Feasibility */}
        {activeTab === 'review' && <ReviewAnalysis />}

        {/* Tab 3: Interactive Prototype Sandbox */}
        {activeTab === 'prototype' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Quick Pilot Tour Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    教师 3 分钟极速试用沙箱 (Live Pilot Sandbox)
                  </span>
                  <span className="text-xs text-slate-300 hidden sm:inline">
                    已预置 45 份真实考卷切片、异常样例与五维素养数据，免录入即开即试
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200">
                  请按下方考务时序体验完整闭环：
                  <span className="text-indigo-300 font-bold ml-1">
                    【1. 试卷设计】➔ 【2. 拍照识别与复核】➔ 【3. 主观题流水阅卷】➔ 【4. 学情诊断与错题本】
                  </span>
                </p>
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => {
                    const order: ('designer' | 'omr' | 'grading' | 'analytics')[] = ['designer', 'omr', 'grading', 'analytics'];
                    const nextIdx = (order.indexOf(activePrototypeModule) + 1) % order.length;
                    setActivePrototypeModule(order[nextIdx]);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                >
                  <span>下一步体验</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Prototype Sub-Module Navigation Bar (Chronological 1->2->3->4) */}
            <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-2">
              <button
                onClick={() => setActivePrototypeModule('designer')}
                className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activePrototypeModule === 'designer'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. 试卷设计、听力音频与制卡</span>
              </button>

              <button
                onClick={() => setActivePrototypeModule('omr')}
                className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activePrototypeModule === 'omr'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Scan className="w-4 h-4" />
                <span>2. 手机拍照、OMR 识别与复核改判</span>
              </button>

              <button
                onClick={() => setActivePrototypeModule('grading')}
                className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activePrototypeModule === 'grading'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>3. 主观题按题连续切片流水阅卷</span>
              </button>

              <button
                onClick={() => setActivePrototypeModule('analytics')}
                className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  activePrototypeModule === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>4. 班级学情大屏、错题本与导出</span>
              </button>
            </div>

            {/* Prototype Module Viewports */}
            <div>
              {activePrototypeModule === 'designer' && <ExamPaperDesigner />}
              {activePrototypeModule === 'omr' && <OMRSimulator />}
              {activePrototypeModule === 'grading' && <GradingStation />}
              {activePrototypeModule === 'analytics' && <AnalyticsDashboard />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">LinguaMark 语测通</span>
            <span>· 纸笔考试数字化闭环系统</span>
          </div>
          <div className="text-[11px] text-slate-400">
            首期标准交付边界：纯电脑端 Web · 纯本地 OpenCV OMR · 无外部 API 依赖 · 交付全部源代码与数据库
          </div>
        </div>
      </footer>
    </div>
  );
}
