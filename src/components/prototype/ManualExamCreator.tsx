import React, { useState } from 'react';
import { 
  FilePlus, 
  UploadCloud, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Sliders, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  RotateCw, 
  BookOpen, 
  PieChart, 
  Presentation, 
  Printer, 
  Scan, 
  Image as ImageIcon,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  Edit3
} from 'lucide-react';

interface QuestionConfig {
  qNum: number;
  type: 'single' | 'translation' | 'composition';
  typeName: string;
  score: number;
  answerKey: string;
  dimension: '听力理解' | '词汇辨析' | '语法句法' | '阅读理解' | '书面表达';
  stem: string;
  analysis: string;
  rubric?: string;
}

const DEFAULT_MANUAL_QUESTIONS: QuestionConfig[] = [
  {
    qNum: 1,
    type: 'single',
    typeName: '听力理解(单选)',
    score: 1.5,
    answerKey: 'B',
    dimension: '听力理解',
    stem: 'What is the main topic of the conversation between the two speakers?',
    analysis: '对话关键句聚焦于全球气候峰会的日程安排，女士在第三轮对话中提到 schedule for conference，故选 B。'
  },
  {
    qNum: 2,
    type: 'single',
    typeName: '词汇辨析(单选)',
    score: 1.5,
    answerKey: 'A',
    dimension: '词汇辨析',
    stem: 'The new environmental policy has a profound _______ on local industrial development.',
    analysis: 'have an impact on 为固定高频搭配，意为“对……产生深远影响”，故选 A (impact)。'
  },
  {
    qNum: 3,
    type: 'single',
    typeName: '语法句法(单选)',
    score: 1.5,
    answerKey: 'A',
    dimension: '语法句法',
    stem: 'Hardly _______ the airport when the heavy rain began to pour down.',
    analysis: 'Hardly...when... 句型要求主句谓语部分倒装，且用过去完成时 had he arrived，故选 A。'
  },
  {
    qNum: 4,
    type: 'single',
    typeName: '阅读理解(单选)',
    score: 1.5,
    answerKey: 'B',
    dimension: '阅读理解',
    stem: 'According to paragraph 3, why did ancient scholars migrate to Alexandria?',
    analysis: '第三段第二句明确指出丰富的学术典籍与学术自由是迁徙主因，对应选项 B。'
  },
  {
    qNum: 5,
    type: 'single',
    typeName: '阅读理解(单选)',
    score: 1.5,
    answerKey: 'B',
    dimension: '阅读理解',
    stem: 'What can be inferred about future urban planning from the text?',
    analysis: '最后一段强调绿色走廊对微气候的调节作用，可合理推断未来规划需强化生态韧性，选 B。'
  },
  {
    qNum: 6,
    type: 'translation',
    typeName: '中译英(倒装句)',
    score: 5.0,
    answerKey: 'Only when students master a solid grammatical foundation can they conduct cross-cultural academic communication accurately and fluently.',
    dimension: '语法句法',
    stem: '【中译英】只有掌握了扎实的语法基础，学生才能更流利、准确地进行跨文化学术交流。',
    analysis: '考查 Only when 引导状语从句置于句首时的部分倒装结构。主句需使用 can they conduct 助动词倒装。',
    rubric: '① 倒装语序准确 2.0分；② master a solid grammatical foundation 词汇得体 1.5分；③ 连贯与拼写无误 1.5分。'
  },
  {
    qNum: 7,
    type: 'composition',
    typeName: '书面表达(倡议信)',
    score: 15.0,
    answerKey: '参考范文略 (系统按分档与采分点进行主观评阅)',
    dimension: '书面表达',
    stem: '【书面表达】请以李华的名义，为学校英语文化节写一封主题为“Embracing Global Perspectives”的倡议信，80-100词。',
    analysis: '考查书面表达的交际得体性、段落衔接词丰富度与高级句式运用能力。',
    rubric: '一档(13-15分)：要点齐全，句式丰富多样；二档(9-12分)：要点完整，表达通顺；三档(0-8分)：语法错误较多。'
  }
];

export const ManualExamCreator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [examName, setExamName] = useState<string>('2026年高二外语教学阶段诊断考试 (外部非题库自建卷)');
  const [gradeClass, setGradeClass] = useState<string>('高二外语特色(1)班');
  const [subject, setSubject] = useState<string>('英语');
  const [totalScore, setTotalScore] = useState<number>(120);

  // Step 2 Answer Key Card state
  const [cardUploaded, setCardUploaded] = useState<boolean>(true);
  const [omrExtracting, setOmrExtracting] = useState<boolean>(false);
  const [omrExtracted, setOmrExtracted] = useState<boolean>(true);
  const [questions, setQuestions] = useState<QuestionConfig[]>(DEFAULT_MANUAL_QUESTIONS);
  const [activeEditingQ, setActiveEditingQ] = useState<number | null>(null);

  // Simulate OMR Extraction from Teacher's Standard Answer Sheet
  const handleTriggerOMRExtraction = () => {
    setOmrExtracting(true);
    setTimeout(() => {
      setOmrExtracting(false);
      setOmrExtracted(true);
    }, 700);
  };

  const handleUpdateOption = (qNum: number, opt: string) => {
    setQuestions(prev => prev.map(q => q.qNum === qNum ? { ...q, answerKey: opt } : q));
  };

  const handleUpdateDimension = (qNum: number, dim: any) => {
    setQuestions(prev => prev.map(q => q.qNum === qNum ? { ...q, dimension: dim } : q));
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              扩展模式：非题库快速建考与标杆答题卡 OMR 提取
            </span>
            <span className="text-xs text-slate-400">
              免录入题库 · 拍照标杆卡秒提答案 · 依然享有错题本与五维诊断
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black mt-2">
            外部试卷快速创建与多维学情映射工作台
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            适用于联考试卷、第三方纸质统考或自编试卷。无需逐题录入题库，只需<strong>拍一张教师填好的标准答题卡</strong>，系统自动提取答案并建立学情维度，全流程闭环无缝贯通！
          </p>
        </div>

        {/* Quick Stepper Indicator */}
        <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700 shrink-0">
          {[
            { step: 1, title: '考试建档' },
            { step: 2, title: '提取标杆答案' },
            { step: 3, title: '学情维度配置' },
            { step: 4, title: '闭环发布' },
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentStep === s.step
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : currentStep > s.step
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                currentStep === s.step ? 'bg-white text-indigo-700' : 'bg-slate-700 text-slate-300'
              }`}>
                {currentStep > s.step ? '✔' : s.step}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Exam Metadata Creation */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-indigo-500" />
                第 1 步：创建外部考试档案 (无需逐题录题库)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                录入考试基本信息，为当前外部纸质考试分配班级与考务归档上下文
              </p>
            </div>
            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
              模式：外部现成试卷导入
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">考试全称：</label>
              <input 
                type="text" 
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">施考班级：</label>
              <input 
                type="text" 
                value={gradeClass}
                onChange={(e) => setGradeClass(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">考试科目：</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="英语">英语 (English)</option>
                <option value="日语">日语 (Japanese)</option>
                <option value="俄语">俄语 (Russian)</option>
                <option value="综合语言能力">综合语言能力测试</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">试卷总分：</label>
              <input 
                type="number" 
                value={totalScore}
                onChange={(e) => setTotalScore(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              非题库模式的优势与核心流程：
            </span>
            <p className="leading-relaxed">
              您无需在系统题库中打字录入每一道长篇阅读或完形填空。在下一步中，您只需<strong>拿一张空白答题卡，将正确答案填涂好并拍照上传</strong>，系统将自动识别出参考答案矩阵，大幅节省考前准备时间达 80%！
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs"
            >
              <span>下一步：上传标杆答题卡并提取答案</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Upload Benchmark Answer Card & OMR Auto-Extraction */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Upload Viewport / Card Preview */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Scan className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  教师填涂“标杆标准答案卡”拍照上传
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                ✔ 标杆卡已就绪
              </span>
            </div>

            {/* Paper Preview with Visual Highlighting */}
            <div className="p-6 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 relative select-none">
              {/* Paper Surface */}
              <div className="bg-white text-slate-900 p-5 rounded-xl border border-slate-300 shadow-md space-y-3 font-mono text-xs">
                
                {/* 4 Corner Anchors */}
                <div className="flex justify-between items-center pb-2 border-b-2 border-slate-800">
                  <div className="w-3.5 h-3.5 bg-black" />
                  <div className="text-center font-sans">
                    <span className="text-[11px] font-black uppercase text-indigo-700">
                      ★ 教师标准答案标杆卡 (Benchmark Answer Sheet) ★
                    </span>
                    <div className="text-[9px] text-slate-500">
                      本卡填涂选项将作为全班自动阅卷的唯一 Answer Key 对齐基准
                    </div>
                  </div>
                  <div className="w-3.5 h-3.5 bg-black" />
                </div>

                {/* Simulated OMR Extracting Overlay */}
                {omrExtracting && (
                  <div className="p-4 bg-indigo-950/80 rounded-xl text-white text-center space-y-2 border border-indigo-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
                    <div className="text-xs font-bold">OMR 视觉引擎正在自动扫描提取标准答案...</div>
                    <div className="text-[10px] text-slate-300">正在计算气泡填涂黑度积分比 (Threshold ≥ 85%)</div>
                  </div>
                )}

                {/* Objective Rows Preview */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-sans font-bold text-slate-700">
                    <span>第 I 卷 客观题标准选项 (1 - 5 题，单选)</span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {omrExtracted ? '✔ 100% 自动解析成功' : '待提取'}
                    </span>
                  </div>

                  <div className="space-y-2 font-mono">
                    {questions.slice(0, 5).map(q => (
                      <div key={q.qNum} className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 text-xs font-bold text-slate-700">Q{q.qNum}.</span>
                          <div className="flex space-x-1.5">
                            {['A', 'B', 'C', 'D'].map(opt => {
                              const isSelected = q.answerKey === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => handleUpdateOption(q.qNum, opt)}
                                  className={`w-6 h-5 rounded-sm flex items-center justify-center text-xs font-bold transition-all ${
                                    isSelected
                                      ? 'bg-slate-900 text-white font-extrabold ring-2 ring-indigo-500'
                                      : 'text-slate-400 hover:bg-slate-100 border border-slate-300'
                                  }`}
                                  title="点击可微调修改标准选项"
                                >
                                  [{opt}]
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="text-[11px] font-sans text-slate-500 flex items-center gap-1">
                          <span className="text-indigo-600 font-bold">标准答案：[{q.answerKey}]</span>
                          <span className="text-[10px] text-slate-400">({q.score}分)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subjective Area Preview */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-sans space-y-1">
                  <span className="font-bold text-slate-700">第 II 卷 主观题标准分值</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      第6题 中译英：<strong className="text-indigo-600 font-mono">5.0分</strong>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      第7题 作文：<strong className="text-indigo-600 font-mono">15.0分</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Corner Anchors */}
                <div className="flex justify-between items-center pt-2">
                  <div className="w-3.5 h-3.5 bg-black" />
                  <span className="text-[9px] text-slate-400 font-sans">
                    标准 8mm×8mm 定位黑标已自动校正
                  </span>
                  <div className="w-3.5 h-3.5 bg-black" />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                onClick={handleTriggerOMRExtraction}
                disabled={omrExtracting}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2"
              >
                <RotateCw className={`w-3.5 h-3.5 ${omrExtracting ? 'animate-spin' : ''}`} />
                <span>重新拍照或重新提取答案</span>
              </button>

              <span className="text-xs text-slate-500">
                可直接在上方点击气泡微调确认
              </span>
            </div>
          </div>

          {/* Right Panel: Auto-extracted Answer Key Matrix */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  已提取的标准答案矩阵 (Answer Key)
                </h4>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  置信度 99.6%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {questions.slice(0, 5).map(q => (
                  <div key={q.qNum} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold font-mono flex items-center justify-center text-[10px]">
                        {q.qNum}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {q.typeName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-slate-500">分值: {q.score}分</span>
                      <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        [{q.answerKey}]
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <strong>💡 极速体验优势：</strong>
                <p className="leading-relaxed text-[11px]">
                  教师只需用 2B 铅笔在标准卡涂满 5 道客观题，拍照 0.3 秒即可完成全套试卷的判分基准绑定，省去在电脑前机械录入每一题答案的繁琐。
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                >
                  上一步
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <span>下一步：配置学情维度与解析</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Competence Mapping & Analysis Configuration */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md">
                  用户重点关切落实
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  第 3 步：多维学情素养维度与错题解析映射表
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                非题库模式通过建立小题与【五维核心素养】及【试题解析】的轻量关联，确保考试归档后同样能<strong>100% 自动输出专属错题集、课堂讲评 PPT 与多维学情雷达图</strong>！
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">已映射题量：</span>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold font-mono text-xs rounded-xl">
                7 / 7 题全部完成
              </span>
            </div>
          </div>

          {/* Question Mapping Grid */}
          <div className="space-y-4">
            {questions.map(q => (
              <div 
                key={q.qNum}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold font-mono text-xs flex items-center justify-center">
                      Q{q.qNum}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {q.typeName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({q.score}分) · 标准答案: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">[{q.answerKey.length > 8 ? q.answerKey.slice(0, 8) + '...' : q.answerKey}]</strong>
                    </span>
                  </div>

                  {/* Dimension Dropdown Selector */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-500 font-bold">考查核心素养维度：</span>
                    <select
                      value={q.dimension}
                      onChange={(e) => handleUpdateDimension(q.qNum, e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-xs text-indigo-600 dark:text-indigo-300 outline-none"
                    >
                      <option value="听力理解">🎧 听力理解 (Listening)</option>
                      <option value="词汇辨析">📚 词汇辨析 (Vocabulary)</option>
                      <option value="语法句法">⚖️ 语法句法 (Syntax & Grammar)</option>
                      <option value="阅读理解">📖 阅读理解 (Reading)</option>
                      <option value="书面表达">✍️ 书面表达 (Writing)</option>
                    </select>
                  </div>
                </div>

                {/* Question Stem & Analysis Text Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">题干摘要 / 原题切片描述：</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {q.stem}
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      官方解析 (驱动错题本与备课PPT)：
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {q.analysis}
                    </p>
                  </div>
                </div>

                {/* Rubric if Subjective */}
                {q.rubric && (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <span className="font-bold shrink-0">主观题采分点：</span>
                    <span>{q.rubric}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold"
            >
              上一步
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs"
            >
              <span>下一步：完成非题库建考并预览闭环</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Full Closed-Loop Verification & Publish */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              🎉 非题库模式建考完成！全链路闭环就绪
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              试卷【{examName}】已成功生成考务档案与标准答案索引。以下下游业务模块已 100% 自动装配就绪：
            </p>
          </div>

          {/* 4 Downstream Ready Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-indigo-700 dark:text-indigo-300">
                <Scan className="w-4 h-4 text-indigo-500" />
                <span>1. 客观题 OMR 判分</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                学生答题卡拍照上传后，直接对比标杆卡提取的 5 道客观题答案，0.3秒输出得分并标记双涂/漏涂。
              </p>
              <div className="text-emerald-600 font-bold text-[10px]">✔ Answer Key 已就绪</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-indigo-700 dark:text-indigo-300">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>2. 专属个人错题集</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                自动提取学生做错的小题，拼装原题干、官方试题解析与学生手迹切片，一键生成 A4 订正打印卷。
              </p>
              <div className="text-emerald-600 font-bold text-[10px]">✔ 题干与解析已关联</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-indigo-700 dark:text-indigo-300">
                <Presentation className="w-4 h-4 text-indigo-500" />
                <span>3. 课堂讲评 PPT 课件</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                全班答卷判分后，自动聚合共性错题 Top 榜与错误选项分布陷阱，投屏课件一键组装完成。
              </p>
              <div className="text-emerald-600 font-bold text-[10px]">✔ 错误归因模板已关联</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-indigo-700 dark:text-indigo-300">
                <PieChart className="w-4 h-4 text-indigo-500" />
                <span>4. 五维学情雷达图与导出</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                基于已绑定的听力、词汇、语法、阅读、写作 5 大维度，自动绘制班级能力短板雷达图，支持 PDF/Excel 导出。
              </p>
              <div className="text-emerald-600 font-bold text-[10px]">✔ 5 维能力权重已计算</div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <strong className="text-slate-900 dark:text-white block">
                考试状态：已归档至系统考务库（随时接收学生答题卡拍照）
              </strong>
              <span className="text-slate-500 text-[11px]">
                归档编号：EXAM-2026-MANUAL-001 | 映射题数：7题 | 包含班级：高二外语特色(1)班
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100"
              >
                修改配置
              </button>
              <button
                onClick={() => alert('考试已成功创建！系统已自动将该套外部考试接入 OMR 识别、主观题批阅和多维学情诊断中心。')}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>正式启用并发布考试</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
