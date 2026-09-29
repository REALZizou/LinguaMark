import React, { useState } from 'react';
import { useExam } from '../../data/ExamContext';
import { MOCK_STUDENTS } from '../../data/mockData';
import { ManualExamCreator } from './ManualExamCreator';
import { PrintableAnswerSheetModal } from './PrintableAnswerSheetModal';
import { 
  FileText, 
  Volume2, 
  Printer, 
  Barcode, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Filter, 
  Play, 
  Pause,
  Download,
  BookOpen,
  FilePlus,
  Sliders
} from 'lucide-react';

export const ExamPaperDesigner: React.FC = () => {
  const { exam, updateExam, questions } = useExam();
  const [examMode, setExamMode] = useState<'item_bank' | 'manual_exam'>(exam.mode || 'item_bank');
  const [activeSubTab, setActiveSubTab] = useState<'paper' | 'answersheet' | 'barcodes'>('paper');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPrintSheetModalOpen, setIsPrintSheetModalOpen] = useState<boolean>(false);

  const handleModeChange = (mode: 'item_bank' | 'manual_exam') => {
    setExamMode(mode);
    updateExam({ mode });
  };

  const togglePlayAudio = (url?: string) => {
    if (!url) return;
    if (isPlayingAudio) {
      audioElement?.pause();
      setIsPlayingAudio(false);
    } else {
      const audio = new Audio(url);
      audio.play();
      setAudioElement(audio);
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Dual Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              考前准备与试卷中心 (双轨建卷模式)
            </span>
            <span className="text-xs text-slate-500">
              题库抽题组卷 · 外部试卷极速创建 · 标杆答题卡 OMR 提取
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {examMode === 'item_bank' 
              ? '模式 A：题库智能组卷与试卷答题卡排版 (2026年春季外语统考卷 A)'
              : '模式 B：非题库极速创建考试与标杆答题卡拍照提取 (支持外部统考试卷)'}
          </h2>
        </div>

        {/* Primary Dual-Mode Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => handleModeChange('item_bank')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              examMode === 'item_bank'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>模式 A：智能题库组卷</span>
          </button>

          <button
            onClick={() => handleModeChange('manual_exam')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 relative ${
              examMode === 'manual_exam'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>模式 B：非题库快速建考 (标杆卡提取)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
          </button>
        </div>
      </div>

      {/* RENDER MODE B: Manual Exam Creator */}
      {examMode === 'manual_exam' && (
        <ManualExamCreator />
      )}

      {/* RENDER MODE A: Item Bank Exam Designer */}
      {examMode === 'item_bank' && (
        <div className="space-y-6">
          {/* Sub-view switcher for Item Bank Mode */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveSubTab('paper')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSubTab === 'paper'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>试卷与听力音频预览</span>
              </button>
              <button
                onClick={() => setActiveSubTab('answersheet')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSubTab === 'answersheet'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>标准答题卡排版 (PDF)</span>
              </button>
              <button
                onClick={() => setActiveSubTab('barcodes')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeSubTab === 'barcodes'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Barcode className="w-3.5 h-3.5" />
                <span>学员考号条码贴纸 (A4批量打印)</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 hidden sm:block">
              已选试题：7 题 (客观5题+主观2题)
            </div>
          </div>

      {/* View 1: Exam Paper Preview */}
      {activeSubTab === 'paper' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Paper Information & Sections */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                绝密 ★ 启用前
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                2026 年初三/高二年级英语第一次教学质量诊断试卷
              </h1>
              <p className="text-xs text-slate-500 mt-2">
                考试时长：100分钟 | 满分：120分 (本卷节选27.5分核心题型示范) | 命题审定：外语教研组
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q) => (
                <div 
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        第 {q.id} 题
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {q.unit} · {q.knowledgePoint}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">难度: {q.difficulty}</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        ({q.score} 分)
                      </span>
                    </div>
                  </div>

                  {/* Audio binding indicator if listening */}
                  {q.audioUrl && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
                      <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-medium">
                        <Volume2 className="w-4 h-4 text-indigo-600 animate-pulse" />
                        <span>听力音频已关联：Section_A_airport_announcement.mp3</span>
                      </div>
                      <button
                        onClick={() => togglePlayAudio(q.audioUrl)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                      >
                        {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isPlayingAudio ? '暂停试听' : '在线试听'}</span>
                      </button>
                    </div>
                  )}

                  {/* Stem */}
                  <div className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                    {q.stem}
                  </div>

                  {/* Options if choice */}
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {q.options.map((opt: string, i: number) => (
                        <div key={i} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reference Answer & Explanation */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs flex items-start gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      【参考答案与解析】：
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>标准答案: {q.correctAnswer}</strong>。{q.analysis}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Paper Specifications & PDF Actions */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                试卷属性概览
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">试卷题量：</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">7 题 (客观5题+主观2题)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">客观/主观分比例：</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">7.5 分 : 20.0 分</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">预估难度系数：</span>
                  <span className="font-bold text-emerald-600">0.72 (适中偏拔高)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">听力音频包状态：</span>
                  <span className="font-bold text-indigo-600">已串联校验 (无杂音)</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>导出试卷与评分细则 (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Answer Sheet Layout Preview */}
      {activeSubTab === 'answersheet' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                一期固定 A4 标准答题卡排版视图
              </h3>
              <p className="text-xs text-slate-500">
                与试卷题号、选项、分值 1:1 严格锚定，四角黑标 8×8mm，80g 双胶纸规范
              </p>
            </div>
            <button
              onClick={() => setIsPrintSheetModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              title="打开全尺寸标准 A4 答题卡，可直接连接办公室打印机打印测试"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印标准 A4 答题卡</span>
            </button>
          </div>

          {/* Answer sheet visual page */}
          <div className="border-2 border-black dark:border-slate-400 p-8 rounded-lg bg-white text-black font-sans relative">
            {/* 4 Black Corner Marks */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-black"></div>
            <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-black"></div>
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-black"></div>
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-black"></div>

            <div className="text-center pb-4 border-b-2 border-black mb-6">
              <h2 className="text-xl font-bold tracking-wider">
                2026 年初三/高二外语综合检测答题卡
              </h2>
              <div className="flex justify-between items-center text-xs mt-3 px-4">
                <span>班级：_____________</span>
                <span>姓名：_____________</span>
                <span>考号：_____________</span>
                <span className="border border-black px-2 py-0.5">缺考标记 [ ] (监考员填涂)</span>
              </div>
            </div>

            {/* Top Barcode and Instructions */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-7 border border-black p-3 text-[11px] leading-relaxed">
                <strong>填涂注意事项：</strong><br />
                1. 答题前，考生务必将姓名、考号填写清楚，并在右侧框内粘贴条形码。<br />
                2. 客观题必须使用 2B 铅笔填涂；修改时，用橡皮擦干净，不得使用涂改液。<br />
                3. 主观题请在各题目的答题区域内作答，超出黑色边框的答案无效。
              </div>

              <div className="col-span-5 border-2 border-dashed border-black flex flex-col items-center justify-center p-4">
                <Barcode className="w-8 h-8 text-black opacity-80" />
                <span className="text-xs font-bold mt-1">准考证条形码粘贴处</span>
              </div>
            </div>

            {/* Objective Grid */}
            <div className="border border-black p-4 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-black mb-3">
                <div className="text-xs font-bold">
                  一、客观题填涂区 (单选 1 - 5 题，含听力 1-2 题与词汇语法 3-5 题，每题 1.5 分)
                </div>
                <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                  统一 2B 气泡框 · 听力题复用通用卡槽
                </span>
              </div>
              <div className="grid grid-cols-5 gap-3 text-xs font-mono">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} className="flex flex-col items-center space-y-1">
                    <span className="font-bold">
                      {n} {n <= 2 ? <span className="text-[9px] font-normal text-indigo-700">(听力)</span> : ''}
                    </span>
                    <div className="space-y-1">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <div key={opt} className="border border-black px-2 py-0.5 text-center text-[10px]">
                          [{opt}]
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjective Bounding Box */}
            <div className="border-2 border-black p-4 mb-4">
              <div className="text-xs font-bold mb-2">
                二、主观题答题区 (第6题：中译英 5分；第7题：书面表达 15分)
              </div>
              <div className="h-44 border-t border-dashed border-gray-400 p-2 text-gray-400 text-xs">
                【请在此区域内用黑色签字笔书写，严禁超出黑色外框】
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-500">
              - 语测通 LinguaMark 标准 A4 答题卡模板 (第 1 页，共 1 页) -
            </div>
          </div>
        </div>
      )}

      {/* View 3: Student Barcode Sticker Batch Print Preview */}
      {activeSubTab === 'barcodes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                学员专属考号条形码不干胶标签 (A4 24格标准排版)
              </h3>
              <p className="text-xs text-slate-500">
                可直接使用不干胶标签纸（如 Avery 70×37mm）批量打印，考前发放供粘贴于答题卡
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>批量打印当前班级条码贴纸</span>
            </button>
          </div>

          {/* Barcode Labels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_STUDENTS.map((std) => (
              <div 
                key={std.id}
                className="p-3 border-2 border-slate-800 dark:border-slate-600 rounded-xl bg-white text-black font-sans shadow-sm flex flex-col items-center justify-between text-center"
              >
                <div className="text-[11px] font-bold text-slate-900">
                  {std.className}
                </div>
                <div className="text-xs font-black my-1 text-slate-900">
                  {std.name}
                </div>

                {/* Simulated Barcode Lines */}
                <div className="py-1 w-full flex flex-col items-center">
                  <div className="flex items-center justify-center space-x-0.5 h-9 w-36 bg-white px-2">
                    {[3,1,2,1,3,1,1,2,3,1,2,2,1,3,1,2,1,3,2,1,1].map((w, idx) => (
                      <span 
                        key={idx} 
                        className="bg-black h-full inline-block"
                        style={{ width: `${w * 1.5}px` }}
                      ></span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-slate-700 mt-1 font-bold">
                    *{std.examNo}*
                  </span>
                </div>

                <div className="text-[9px] text-slate-500 mt-1 border-t border-slate-200 pt-1 w-full">
                  考号: {std.examNo} | 试卷条码验证
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </div>
      )}

      {/* Printable Answer Sheet Modal */}
      <PrintableAnswerSheetModal
        isOpen={isPrintSheetModalOpen}
        onClose={() => setIsPrintSheetModalOpen(false)}
      />
    </div>
  );
};
