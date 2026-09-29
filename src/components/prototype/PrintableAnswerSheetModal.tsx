import React, { useRef } from 'react';
import { Printer, Download, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useExam } from '../../data/ExamContext';

interface PrintableAnswerSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableAnswerSheetModal: React.FC<PrintableAnswerSheetModalProps> = ({
  isOpen,
  onClose
}) => {
  const { exam } = useExam();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header (Hidden on print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <span>标准 A4 外语答题卡打印预览</span>
                <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
                  80g 双胶纸标准
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                可直接使用工位激光打印机打印，拿 2B 铅笔随意划涂，用手机拍照即可现场实测 OMR 识别！
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>立即调起打印机 (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Sheet Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/60 dark:bg-slate-950 flex justify-center">
          {/* Exact A4 Sheet Representation */}
          <div 
            ref={printRef}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-6 sm:p-8 shadow-xl border border-slate-300 relative flex flex-col justify-between print:m-0 print:p-6 print:shadow-none print:border-none print:w-full"
            style={{ fontFamily: 'SimSun, STSong, serif' }}
          >
            {/* 4 Corner Black Anchors (8mm x 8mm Finder Patterns) */}
            <div className="absolute top-4 left-4 w-6 h-6 bg-black" title="左上定位角标" />
            <div className="absolute top-4 right-4 w-6 h-6 bg-black" title="右上定位角标" />
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-black" title="左下定位角标" />
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-black" title="右下定位角标" />

            {/* Top Sheet Header */}
            <div className="text-center pt-2 space-y-1 border-b-2 border-black pb-3">
              <h1 className="text-xl font-black tracking-widest text-slate-900">
                {exam.title || '2026年春季外语统考标准答题卡'}
              </h1>
              <div className="text-xs font-sans text-slate-700 flex justify-center gap-6">
                <span>科目：外语 (英语)</span>
                <span>满分：100 分</span>
                <span>卡型：A4 单面标准</span>
                <span>版本号：LM-A4-50Q-V1</span>
              </div>
            </div>

            {/* Student Info & Barcode Zone */}
            <div className="grid grid-cols-12 gap-3 my-3 text-xs font-sans">
              {/* Left: Handwritten Info */}
              <div className="col-span-7 border border-black p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">姓名：</span>
                    <div className="w-24 border-b border-black text-center font-bold">张子涵</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">班级：</span>
                    <div className="w-24 border-b border-black text-center font-bold">高二(1)班</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="font-bold">准考证号 (手写填涂)：</span>
                  <div className="flex gap-1 font-mono font-bold text-sm">
                    {['2', '0', '2', '6', '1', '0', '1', '0', '1'].map((num, i) => (
                      <div key={i} className="w-5 h-6 border border-black flex items-center justify-center bg-slate-50">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-1.5 bg-slate-100 border border-slate-300 text-[10px] text-slate-600 leading-tight">
                  <strong>注意事项：</strong>
                  1. 选择题必须用 2B 铅笔规范填涂；非选择题用 0.5mm 黑色中性笔在方框内作答。
                  2. 保持卡面清洁，严禁折叠、破损，切勿弄脏定位黑标。
                </div>
              </div>

              {/* Right: Barcode Sticker Zone */}
              <div className="col-span-5 border-2 border-dashed border-slate-400 p-2 flex flex-col items-center justify-center text-center bg-slate-50/50">
                <span className="text-[11px] font-bold text-slate-500 mb-1">此处粘贴考生准考证条形码</span>
                {/* Simulated Code128 Barcode */}
                <div className="bg-white p-2 border border-slate-300 shadow-sm flex flex-col items-center">
                  <div className="flex items-center space-x-0.5 h-9">
                    {[2,1,3,1,2,3,1,2,1,3,2,1,2,2,3,1,1,3,2,1,2,3,1,1,2,3].map((w, i) => (
                      <div key={i} className="bg-black h-full" style={{ width: `${w * 1.5}px` }} />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] tracking-wider mt-0.5 font-bold">202610101</span>
                </div>
              </div>
            </div>

            {/* Objective Questions Bubble Area (Q1 ~ Q20) */}
            <div className="border-2 border-black p-3 my-2 font-sans">
              <div className="text-xs font-black bg-black text-white px-2 py-0.5 inline-block mb-2">
                一、 单项选择题 (请用 2B 铅笔将对应选项的信息点涂满、涂黑)
              </div>

              <div className="grid grid-cols-4 gap-x-4 gap-y-1.5 text-xs">
                {Array.from({ length: 20 }, (_, idx) => {
                  const qNum = idx + 1;
                  return (
                    <div key={qNum} className="flex items-center space-x-1.5 border-b border-slate-200 pb-1">
                      <span className="w-5 font-bold text-slate-700 font-mono text-right">{qNum}.</span>
                      <div className="flex space-x-1 text-[11px] font-mono">
                        {['A', 'B', 'C', 'D'].map((opt) => (
                          <div 
                            key={opt}
                            className="w-4 h-3.5 border border-black rounded-[2px] flex items-center justify-center text-[9px] font-bold text-slate-800"
                          >
                            [{opt}]
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subjective Translation Area (Q21) */}
            <div className="border border-black p-3 my-2 flex-1 flex flex-col font-sans">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold bg-slate-800 text-white px-2 py-0.5">
                  二、 中译英翻译题 (共 5 分)
                </span>
                <span className="text-[10px] text-slate-500">【主观题评阅切片区，严禁答出框外】</span>
              </div>
              <div className="text-[11px] text-slate-700 mb-1">
                21. 只有掌握了扎实的语法基础，学生才能更流利、准确地进行跨文化学术交流。（要求使用倒装句）
              </div>
              {/* Lined write area */}
              <div className="flex-1 min-h-[70px] border-t border-dashed border-slate-300 flex flex-col justify-around py-1">
                <div className="border-b border-slate-300 w-full h-6" />
                <div className="border-b border-slate-300 w-full h-6" />
                <div className="border-b border-slate-300 w-full h-6" />
              </div>
            </div>

            {/* Subjective Writing Area (Q22) */}
            <div className="border border-black p-3 my-2 flex-1 flex flex-col font-sans">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-bold bg-slate-800 text-white px-2 py-0.5">
                  三、 书面表达作文 (共 15 分，120-150词)
                </span>
                <span className="text-[10px] text-slate-500">【双盲流水切片区】</span>
              </div>
              <div className="flex-1 min-h-[140px] border-t border-dashed border-slate-300 flex flex-col justify-around py-1">
                <div className="border-b border-slate-300 w-full h-6" />
                <div className="border-b border-slate-300 w-full h-6" />
                <div className="border-b border-slate-300 w-full h-6" />
                <div className="border-b border-slate-300 w-full h-6" />
                <div className="border-b border-slate-300 w-full h-6" />
              </div>
            </div>

            {/* Bottom Footer Area */}
            <div className="text-center text-[10px] font-mono text-slate-500 pt-2 border-t border-black flex justify-between px-2">
              <span>LinguaMark OMR Engine v1.0 Standard Grid</span>
              <span>第 1 页 (共 1 页)</span>
              <span>准考防伪特征码: #LM-2026-A4-998</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
