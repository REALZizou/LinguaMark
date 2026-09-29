import React, { useState } from 'react';
import { PRD_SECTIONS, APP_NAMING_PROPOSALS } from '../data/prdContent';
import { 
  BookOpen, 
  Search, 
  Tag, 
  ChevronRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  FileCheck,
  Award
} from 'lucide-react';

export const PRDViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('sec-1');

  const filteredSections = PRD_SECTIONS.filter(sec => 
    sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sec.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sec.subsections?.some(sub => sub.title.toLowerCase().includes(searchTerm.toLowerCase()) || sub.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner: App Name Recommendation */}
      <div className="mb-8 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 官方推荐应用名称确定
              </span>
              <span className="text-xs text-slate-400">已通过业务契合度与记忆度多维评审</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>语测通 (LinguaMark)</span>
              <span className="text-sm font-normal text-indigo-300 bg-indigo-900/40 px-3 py-1 rounded-lg border border-indigo-700/50">
                Slogan：连接一张纸笔，洞悉语言教学全链路
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              立足于保留外语纸笔考试（听力、拼写书写、阅读深度专注）的核心优势，以纯本地轻量 OMR 扫描识别与在线流水切题阅卷为抓手，一键打通考后学情诊断与错题讲评。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <a
              href="#sec-naming-list"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md text-center"
            >
              查看5组命名策略对比
            </a>
          </div>
        </div>
      </div>

      {/* Main Container: Sidebar + PRD Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Table of Contents */}
        <aside className="lg:col-span-3 sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              快速查找 PRD 规范
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索题库、OMR、切题..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 px-2 py-1">PRD 核心章节导航</div>
            {PRD_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeSectionId === sec.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="truncate">
                  <span className="text-slate-400 mr-1.5">{sec.number}</span>
                  {sec.title}
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>标准一期交付规范 · 闭环可落地</span>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-9 space-y-8">
          {/* Naming comparison section */}
          <div id="sec-naming-list" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                备选应用名称深度评审方案 (5 组)
              </h2>
              <span className="text-xs text-slate-500">依据业务场景、传播度与技术气质综合打分</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {APP_NAMING_PROPOSALS.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    item.isRecommended
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400/50 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {item.name}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        item.isRecommended
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.isRecommended ? '🌟 首选推荐' : item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                    {item.rationale}
                  </p>
                  <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800 inline-block">
                    宣传口号：{item.slogan}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed PRD Sections */}
          {filteredSections.map((sec) => (
            <article
              key={sec.id}
              id={sec.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    {sec.number}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {sec.title}
                  </h2>
                </div>
                {sec.badge && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {sec.badge}
                  </span>
                )}
              </div>

              {/* Main Content */}
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6 font-sans">
                {sec.content}
              </div>

              {/* Subsections if available */}
              {sec.subsections && sec.subsections.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  {sec.subsections.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
                    >
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        {sub.title}
                      </h3>
                      <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {sub.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </main>
      </div>
    </div>
  );
};
