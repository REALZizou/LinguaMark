import React, { useState, useEffect } from 'react';
import { useExam } from '../../data/ExamContext';
import { StudentExamRecord } from '../../types/prd';
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  History, 
  Tag, 
  Save, 
  Eye, 
  EyeOff, 
  PenTool,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';

export const GradingStation: React.FC = () => {
  const { students, submitSubjectiveScore, isLocked } = useExam();
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(6); // Q6 translation (5pts) or Q7 writing (15pts)
  const [studentIndex, setStudentIndex] = useState<number>(0);
  const [inputScore, setInputScore] = useState<string>('');
  const [inputComment, setInputComment] = useState<string>('');
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const [blindGrading, setBlindGrading] = useState<boolean>(true); // 匿名密评
  const [auditLog, setAuditLog] = useState<{ time: string; text: string }[]>([
    { time: '10:14:22', text: '张老师 初评 学员(202610101) 第6题：4.5分' },
    { time: '10:19:05', text: '张老师 初评 学员(202610102) 第6题：3.0分' }
  ]);

  const activeStudent = students[studentIndex] || students[0];
  const activeSubAnswer = activeStudent?.subjectiveAnswers?.find(s => s.questionId === selectedQuestionId);

  // Sync state when student or question changes
  useEffect(() => {
    if (activeSubAnswer) {
      setInputScore(activeSubAnswer.awardedScore !== null && activeSubAnswer.awardedScore !== undefined ? String(activeSubAnswer.awardedScore) : '');
      setInputComment(activeSubAnswer.comment || '');
      setSelectedStamps(activeSubAnswer.annotations || []);
    }
  }, [studentIndex, selectedQuestionId, activeSubAnswer]);

  const maxScore = selectedQuestionId === 6 ? 5.0 : 15.0;

  const handleScoreSubmit = (scoreToSave?: number) => {
    if (isLocked) {
      alert('当前考试成绩已终审锁定，成绩处于只读防篡改状态！如需改分请先在考务中心申请解锁。');
      return;
    }
    const finalScore = scoreToSave !== undefined ? scoreToSave : parseFloat(inputScore);
    if (isNaN(finalScore) || finalScore < 0 || finalScore > maxScore) {
      alert(`请输入 0 ~ ${maxScore} 范围内的有效分值！`);
      return;
    }

    submitSubjectiveScore(activeStudent.id, selectedQuestionId, finalScore, inputComment, selectedStamps);

    // Add to audit trail
    setAuditLog(prev => [
      {
        time: new Date().toLocaleTimeString(),
        text: `张老师 评阅 学员(${blindGrading ? '密评' + activeStudent.examNo.slice(-3) : activeStudent.name}) 第${selectedQuestionId}题: ${finalScore}分 (评语: ${inputComment || '无'})`
      },
      ...prev
    ]);

    // Smoothly go to next student
    if (studentIndex < students.length - 1) {
      setStudentIndex(prev => prev + 1);
    }
  };

  const handleAddPresetAnnotation = (preset: string) => {
    const newComment = inputComment ? `${inputComment}；${preset}` : preset;
    setInputComment(newComment);
  };

  // Preset feedback tags tailored for foreign language
  const foreignLanguageStamps = selectedQuestionId === 6 ? [
    '倒装语序准确(+1.5)',
    '助动词遗漏(-1)',
    '时态不一致(-0.5)',
    '词汇搭配得体'
  ] : [
    '论证层次清晰(+2)',
    '句式多样丰富(+1.5)',
    '第三人称单数动词有误(-1)',
    '字数不足120词(-2)',
    '衔接连贯词运用优秀'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
              主观题流水阅卷工作台
            </span>
            <span className="text-xs text-slate-500">
              按题连续批改 · 盲评密评 · 键盘秒速打分 · 留痕审计
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            “同一道题连续批改所有学员” 高效批阅流水线
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Question Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedQuestionId(6)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedQuestionId === 6
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              第6题：中译英 (5分)
            </button>
            <button
              onClick={() => setSelectedQuestionId(7)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedQuestionId === 7
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              第7题：书面表达 (15分)
            </button>
          </div>

          <button
            onClick={() => setBlindGrading(!blindGrading)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="开启/关闭匿名密评"
          >
            {blindGrading ? <EyeOff className="w-3.5 h-3.5 text-indigo-500" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span>{blindGrading ? '匿名盲评：开启' : '显示考生姓名'}</span>
          </button>
        </div>
      </div>

      {/* Main Flow: Student Navigation + Cut Image + Scoring Dock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Student Answer Cutout View */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          {/* Progress & Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-500">
                批改进度：<strong className="text-slate-900 dark:text-white">{studentIndex + 1}</strong> / {students.length}
              </span>
              <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300" 
                  style={{ width: `${((studentIndex + 1) / students.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-500">
              考生代码：{blindGrading ? `密评编号 #${activeStudent.id.slice(-4)}` : `${activeStudent.name} (${activeStudent.examNo})`}
            </div>
          </div>

          {/* Prompt / Rubric Guide */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {selectedQuestionId === 6 ? '【第6题 中译英评分标准】' : '【第7题 议论文书面表达评分标准】'}
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedQuestionId === 6
                ? 'Only when students master a solid grammatical foundation can they communicate across cultures fluently and accurately. (倒装结构2分，语法基础1.5分，跨文化流利交流1.5分)'
                : '满分15分：内容切题(5分) + 词汇句式多样性(4分) + 语法拼写准确度(3分) + 篇章逻辑连贯(3分)。'
              }
            </p>
          </div>

          {/* High-res Cutout Simulated Image Container */}
          <div className="relative rounded-xl border-2 border-slate-800 dark:border-slate-700 overflow-hidden bg-amber-50/20">
            <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
              答题卡主观题切片 (坐标裁切+5%容错)
            </div>

            <div className="p-6 min-h-[220px] flex flex-col justify-center items-center text-center">
              {activeStudent.status === 'missing' ? (
                <div className="py-12 text-slate-400 font-medium text-sm">
                  该学员【缺考】，答题卡未回收，系统已自动标记 0 分。
                </div>
              ) : (
                <div className="space-y-4 w-full">
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-300 dark:border-slate-700 font-serif text-slate-800 dark:text-slate-200 text-left text-sm leading-relaxed shadow-inner">
                    {selectedQuestionId === 6 ? (
                      studentIndex === 0 
                        ? 'Only when students master a solid grammatical foundation can they communicate across cultures fluently and accurately.'
                        : studentIndex === 1
                        ? 'Only when students master solid grammer foundation, they can communicate cross culture fluent and accurate.'
                        : 'Only when students master solid grammatical base can they communication across cultures fluently.'
                    ) : (
                      <div className="space-y-2 text-xs">
                        <p>With the globalization of academic research, mastering a foreign language is no longer a luxury but an absolute prerequisite.</p>
                        <p>In my perspective, rote memorization merely lays the bricks, while real-world immersive practice cements the structure. Without authentic immersion, acquired vocabulary remains inert knowledge that cannot be retrieved during actual communications.</p>
                        <p>Therefore, we should strike a harmonious balance between deliberate lexical memorization and spontaneous contextual discourse.</p>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    手迹高清影像已自动消除阴影，如需查看全卷答题卡上下文，可按快捷键 [V] 展开全图
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Student Pager */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStudentIndex(Math.max(0, studentIndex - 1))}
              disabled={studentIndex === 0}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>上一位学员 [←]</span>
            </button>

            <span className="text-xs text-slate-400">
              支持全键盘无鼠标批改：数字键打分 + Enter 保存下一份
            </span>

            <button
              onClick={() => setStudentIndex(Math.min(students.length - 1, studentIndex + 1))}
              disabled={studentIndex === students.length - 1}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40"
            >
              <span>下一位学员 [→]</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Scoring Box, Quick Stamps, Audit Log */}
        <div className="lg:col-span-4 space-y-4">
          {/* Scoring Input Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                本题赋分 (满分 {maxScore} 分)
              </span>
              {activeSubAnswer?.awardedScore !== null && activeSubAnswer?.awardedScore !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                  已批阅
                </span>
              )}
            </div>

            {/* Score Input Box */}
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={maxScore}
                  value={inputScore}
                  onChange={(e) => setInputScore(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleScoreSubmit();
                    }
                  }}
                  placeholder="输入得分..."
                  className="w-full text-2xl font-black text-center py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 focus:outline-none focus:border-indigo-600"
                />
                <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">分</span>
              </div>

              <button
                onClick={() => handleScoreSubmit()}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>保存 & 下一份</span>
              </button>
            </div>

            {/* Fast Score Click Buttons */}
            <div>
              <div className="text-[11px] text-slate-400 mb-1.5 font-medium">常用分值快捷键：</div>
              <div className="grid grid-cols-4 gap-1.5">
                {selectedQuestionId === 6 
                  ? [5.0, 4.5, 3.5, 2.0].map(s => (
                    <button
                      key={s}
                      onClick={() => { setInputScore(String(s)); handleScoreSubmit(s); }}
                      className="py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {s}分
                    </button>
                  ))
                  : [15.0, 13.5, 12.0, 10.0, 8.5, 6.0].map(s => (
                    <button
                      key={s}
                      onClick={() => { setInputScore(String(s)); handleScoreSubmit(s); }}
                      className="py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {s}分
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Foreign Language Quick Feedback Stamps */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-2">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>一键植入外语评语印章：</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {foreignLanguageStamps.map(stamp => (
                  <button
                    key={stamp}
                    onClick={() => handleAddPresetAnnotation(stamp)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all text-left"
                  >
                    + {stamp}
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher comment input */}
            <div>
              <textarea
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
                placeholder="教师手写评语 / 错因点拨 (将同步展示在学生个人错题集内)..."
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Audit Trail Log */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-indigo-500" />
                改分与操作留痕流水 (审计合规)
              </span>
              <span className="text-[10px] text-slate-400">只读不可篡改</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-600 dark:text-slate-400">
              {auditLog.map((log, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-400 shrink-0">{log.time}</span>
                  <span className="truncate">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
