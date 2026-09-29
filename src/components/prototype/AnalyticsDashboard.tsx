import React, { useState } from 'react';
import { useExam } from '../../data/ExamContext';
import { SAMPLE_EXAM_QUESTIONS } from '../../data/mockData';
import { ExportReportModal } from './ExportReportModal';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  AlertOctagon, 
  Sparkles, 
  Presentation, 
  Check, 
  Users,
  Target,
  ShieldCheck,
  Lock,
  Unlock,
  History,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { students, auditLogs, isLocked, lockExam, unlockExam, exam } = useExam();
  const [activeTab, setActiveTab] = useState<'class_report' | 'mistake_top' | 'student_book' | 'slide_deck' | 'audit_trail'>('class_report');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_01');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [unlockReason, setUnlockReason] = useState<string>('');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Dynamic Class Stats
  const classAvg = (students.reduce((acc, s) => acc + s.totalScore, 0) / (students.length || 1)).toFixed(1);
  const maxScore = students.length ? Math.max(...students.map(s => s.totalScore)) : 0;
  const minScore = students.length ? Math.min(...students.map(s => s.totalScore)) : 0;
  const passRate = students.length ? Math.round((students.filter(s => s.totalScore >= 60).length / students.length) * 100) : 0;

  // Foreign language 5 skill dimensions
  const skillDimensions = [
    { name: '听力理解 (Listening)', scoreRate: 85, benchmark: 78, status: '良好' },
    { name: '词汇辨析 (Vocabulary)', scoreRate: 72, benchmark: 75, status: '持平' },
    { name: '语法倒装句法 (Grammar)', scoreRate: 54, benchmark: 68, status: '严重薄弱' },
    { name: '阅读理解 (Reading)', scoreRate: 80, benchmark: 76, status: '良好' },
    { name: '书面表达与中译英 (Writing)', scoreRate: 64, benchmark: 70, status: '需强化' },
  ];

  // Class common errors Top
  const classMistakesTop = [
    {
      qNum: 3,
      stem: 'Hardly ______ the presentation when the power suddenly went out.',
      type: '语法倒装 / 时态辨析',
      accuracy: '38%',
      wrongOptionDist: '58% 误选了 B (he had started)，未形成倒装助动词提前',
      cureStrategy: '重点复习否定词 Hardly / Scarcely / Seldom 置于句首时的部分倒装语序。'
    },
    {
      qNum: 5,
      stem: 'What is the author’s primary attitude toward relying exclusively on automated translation tools?',
      type: '阅读主旨与情感态度',
      accuracy: '45%',
      wrongOptionDist: '36% 误选了 A (Fully optimistic)，漏看了转折段中关于文化细微差别的质疑',
      cureStrategy: '强化定位议论文末段观点句与作者审慎态度（cautiously skeptical）的同义替换辨识。'
    },
    {
      qNum: 6,
      stem: '【中译英】只有掌握了扎实的语法基础，学生才能更流利、准确地进行跨文化学术交流。',
      type: 'Only+状语从句倒装',
      accuracy: '50%',
      wrongOptionDist: '62% 学员在从句后忘记主句倒装（写成 they can 代替 can they）',
      cureStrategy: '背诵句型：Only when + 状从, + can/will/do + 主语 + 谓语。'
    }
  ];

  const handleConfirmUnlock = () => {
    if (!unlockReason.trim()) {
      alert('请必须填写特批解锁原因（例如：复核发现第3题漏记得分）！');
      return;
    }
    unlockExam(unlockReason);
    setShowUnlockModal(false);
    setUnlockReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
              学情诊断与错题闭环中心
            </span>
            <span className="text-xs text-slate-500">
              班级学情 · 个人错题本 · 共性错题 Top · 一键讲评课件
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            高二外语特色(1)班 · 考试学情综合诊断看板
          </h2>
        </div>

        {/* Right Actions & Sub-view switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Machine Lock/Unlock Status */}
          {isLocked ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 px-3 py-1.5 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">已终审锁定</span>
              <button
                onClick={() => setShowUnlockModal(true)}
                className="ml-1 text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-semibold"
              >
                特批解锁
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (confirm('确认终审并锁定当前考试成绩吗？\n\n锁定后全卷客观题与主观题得分将进入只读防篡改状态，后续如需改分必须经过特批并留存审计日志。')) {
                  lockExam();
                }
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              title="终审锁定全卷成绩，防止误触篡改"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>终审锁定成绩</span>
            </button>
          )}

          {/* Main Export Action Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:shadow-emerald-500/20 active:scale-95"
            title="导出诊断报告为 PDF 打印版或 Excel 电子表格"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出诊断报告 (PDF / Excel)</span>
          </button>

          {/* Sub-view switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('class_report')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'class_report'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              班级综合学情
            </button>
            <button
              onClick={() => setActiveTab('mistake_top')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'mistake_top'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              共性错题 Top
            </button>
            <button
              onClick={() => setActiveTab('slide_deck')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'slide_deck'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-500" />
              <span>一键讲评课件</span>
            </button>
            <button
              onClick={() => setActiveTab('student_book')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'student_book'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              个人错题本 (原题+解析)
            </button>
            <button
              onClick={() => setActiveTab('audit_trail')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'audit_trail'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-500" />
              <span>审计流水 ({auditLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Class Report */}
      {activeTab === 'class_report' && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">实考人数 / 缺考</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                3 人 / <span className="text-amber-500">1 人缺考</span>
              </div>
              <span className="text-[11px] text-slate-400">应考 4 人 · 到考率 75%</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">班级平均分 (实考)</span>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                21.0 <span className="text-xs font-normal">/ 27.5 分</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">高于年级常模 +1.8分</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">客观题平均正确率</span>
              <div className="text-xl font-black text-emerald-600 mt-1">
                73.3%
              </div>
              <span className="text-[11px] text-slate-400">听力与阅读发挥稳定</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">最高分 / 最低分</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                25.5 / <span className="text-slate-500">16.5 分</span>
              </div>
              <span className="text-[11px] text-slate-400">标准差：4.5 分</span>
            </div>
          </div>

          {/* 5-Dimensional Skill Radar & Weakness Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  外语五维核心素养得分率分析 (与年级基准比对)
                </h3>
                <span className="text-xs text-slate-400">雷达维度分解</span>
              </div>

              <div className="space-y-4">
                {skillDimensions.map((dim, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {dim.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">基准 {dim.benchmark}%</span>
                        <strong className="text-indigo-600 dark:text-indigo-400">{dim.scoreRate}%</strong>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          dim.status === '严重薄弱' 
                            ? 'bg-rose-100 text-rose-700' 
                            : dim.status === '良好'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {dim.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          dim.scoreRate < 60 
                            ? 'bg-rose-500' 
                            : dim.scoreRate >= 80 
                            ? 'bg-emerald-500' 
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${dim.scoreRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Roster Table */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  班级成绩总表 (按总分降序)
                </h3>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="导出完整 Excel 与成绩明细"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>导出报表</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {students.map((std, idx) => (
                  <div 
                    key={std.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {std.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {std.examNo}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {std.status === 'missing' ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-bold">
                          缺考 (免计)
                        </span>
                      ) : (
                        <div>
                          <div className="font-black text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                            {std.totalScore} 分
                          </div>
                          <div className="text-[10px] text-slate-400">
                            客 {std.objectiveScore} + 主 {std.subjectiveScore || 0}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Class Common Error Top */}
      {activeTab === 'mistake_top' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                班级共性错题 Top 榜与错因深度归因
              </h3>
              <p className="text-xs text-slate-500">
                统计全班答错率最高的关键试题，自动拆解干扰选项分布与靶向巩固建议
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                title="导出打印版错题诊断教案或 Excel 统计表"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-500" />
                <span>打印/导出错题报告</span>
              </button>
              <button
                onClick={() => setActiveTab('slide_deck')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>一键生成备课讲评 PPT</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {classMistakesTop.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                      Top {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      第 {item.qNum} 题 · {item.type}
                    </span>
                  </div>

                  <div className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                    班级正确率仅: {item.accuracy}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono">
                  {item.stem}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                    <strong className="text-amber-800 dark:text-amber-400 block mb-1">
                      【典型错误陷阱分布】
                    </strong>
                    <p className="text-slate-700 dark:text-slate-300">{item.wrongOptionDist}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50">
                    <strong className="text-indigo-800 dark:text-indigo-400 block mb-1">
                      【教学反哺与巩固策略】
                    </strong>
                    <p className="text-slate-700 dark:text-slate-300">{item.cureStrategy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Classroom Lecture Slide Deck */}
      {activeTab === 'slide_deck' && (
        <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-8 shadow-2xl max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">
                高二(1)班外语错题讲评课件 · 投屏模式 (Slide 1/3)
              </span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印/导出讲义</span>
            </button>
          </div>

          <div className="p-8 bg-slate-900 rounded-xl border border-slate-800 space-y-6">
            <div className="space-y-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                常错核心语法聚焦 · 倒装句陷阱
              </span>
              <h2 className="text-2xl font-black text-white">
                Hardly ______ the presentation when the power suddenly went out.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                ✔ A. had he started (标准正确答案)
              </div>
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300">
                ✖ B. he had started (班级 58% 同学误选陷阱)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <strong className="text-indigo-400 text-sm block">💡 老师黑板精讲点拨：</strong>
              <p>1. 牢记规则：否定副词 Hardly / No sooner / Scarcely 位于句首时，主句必须采用<strong>部分倒装</strong>，将助动词提前！</p>
              <p>2. 时态锚定：动作“刚刚开始”发生在停电（went out）之前，属于“过去的过去”，必用过去完成时 had done。</p>
              <p className="text-emerald-400 font-bold">✨ 即学即练：No sooner ________ (she, arrive) at the station than the train left.</p>
            </div>
          </div>
        </div>
      )}

      {/* View 4: Student Mistake Notebook */}
      {activeTab === 'student_book' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                学员个人专属错题集 (原题 + 错选手迹 + 权威解析)
              </h3>
              <p className="text-xs text-slate-500">
                支持生成 A4 错题复习卷，左侧为原始错题与错因，右侧留白供学生线下重练
              </p>
            </div>

            {/* Student Picker */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">切换学员：</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs font-bold py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.examNo})
                  </option>
                ))}
              </select>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>导出个人错题卷</span>
              </button>
            </div>
          </div>

          {/* Student Mistake Details */}
          <div className="space-y-6">
            {SAMPLE_EXAM_QUESTIONS.slice(1, 4).map((q, idx) => (
              <div 
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    错题 #{idx + 1} (第 {q.id} 题)
                  </span>
                  <div className="text-xs text-slate-500">
                    考查点：{q.knowledgePoint}
                  </div>
                </div>

                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {q.stem}
                </div>

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {q.options.map((opt, i) => (
                      <div 
                        key={i} 
                        className={`p-2 rounded-lg border ${
                          opt.startsWith(q.correctAnswer)
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="text-slate-700 dark:text-slate-300">
                    <strong>学生所选答案：</strong>
                    <span className="text-rose-600 font-bold font-mono">
                      {idx === 0 ? 'C (选错，扣1.5分)' : idx === 1 ? 'B (误选陷阱，扣1.5分)' : '漏涂放弃作答'}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    <strong>官方试题解析：</strong>{q.analysis}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 5: Audit Trail Logs */}
      {activeTab === 'audit_trail' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  全流程改分只读审计流水 (Audit Trail)
                </h3>
                <span className="px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                  共 {auditLogs.length} 条不可篡改记录
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                根据 PRD 7.0 规范，系统完整留存每一次 OMR 识别、客观题人工改判、主观题赋分与终审锁定的操作轨迹，数据库层禁止物理删除。
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                isLocked 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              }`}>
                {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isLocked ? '当前考卷：已终审锁定' : '当前考卷：评阅复核中'}
              </span>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3">日志流水 ID</th>
                  <th className="py-2.5 px-3">时间戳</th>
                  <th className="py-2.5 px-3">操作人</th>
                  <th className="py-2.5 px-3">操作动作</th>
                  <th className="py-2.5 px-3">修改目标</th>
                  <th className="py-2.5 px-3">改前值 ➔ 改后值</th>
                  <th className="py-2.5 px-3">改分/操作原因备注</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-500">{log.id}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{log.operator}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">{log.target}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                        <span className="text-slate-400 line-through">{log.oldValue || '空'}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-emerald-600 font-bold">{log.newValue}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={log.reason}>
                      {log.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unlock Special Request Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                申请特批解除成绩锁定
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              当前考试已经终审锁定并归档。根据校务纪律与系统防篡改规范，解锁后允许二次改分，但<strong>操作人、修改前后值与解锁原因将被永久记入审计流水</strong>。
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                特批解锁与改分原因 <span className="text-rose-500">* (必填)</span>
              </label>
              <textarea
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
                placeholder="例如：教研组复核发现第 6 题中译英有 1 处得分点漏给，申请复查纠正..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px]"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowUnlockModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleConfirmUnlock}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md"
              >
                确认特批解锁并记录审计
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        skillDimensions={skillDimensions}
        classMistakesTop={classMistakesTop}
      />
    </div>
  );
};
