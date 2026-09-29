import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  X, 
  Check, 
  Copy, 
  FileText, 
  Layers, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Calendar,
  School,
  UserCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { MOCK_STUDENTS, SAMPLE_EXAM_QUESTIONS } from '../../data/mockData';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillDimensions: Array<{
    name: string;
    scoreRate: number;
    benchmark: number;
    status: string;
  }>;
  classMistakesTop: Array<{
    qNum: number;
    stem: string;
    type: string;
    accuracy: string;
    wrongOptionDist: string;
    cureStrategy: string;
  }>;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  skillDimensions,
  classMistakesTop
}) => {
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'excel'>('pdf');
  const [colorMode, setColorMode] = useState<'color' | 'ink_saver'>('color');
  const [includeSections, setIncludeSections] = useState({
    summaryKpi: true,
    radarSkills: true,
    rosterTable: true,
    commonMistakes: true,
    teacherNotes: true
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Print PDF Trigger
  const handlePrint = () => {
    document.body.classList.add('printing-class-report');
    
    // Safety cleanup handler
    const cleanup = () => {
      document.body.classList.remove('printing-class-report');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    // Call print
    setTimeout(() => {
      window.print();
      // Fallback cleanup if afterprint does not fire in some environments
      setTimeout(() => {
        document.body.classList.remove('printing-class-report');
      }, 1000);
    }, 150);
  };

  // Generate Excel (.xls) file
  const handleDownloadExcel = () => {
    const examTitle = '2026学年第一学期高二外语综合质量检测';
    const className = '高二外语特色(1)班';
    const exportDate = new Date().toISOString().split('T')[0];

    // Build formatted HTML table spreadsheet
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
          body { font-family: "Microsoft YaHei", Arial, sans-serif; font-size: 11pt; }
          table { border-collapse: collapse; margin-bottom: 25px; width: 100%; }
          th { background-color: #4F46E5; color: #FFFFFF; font-weight: bold; border: 1px solid #CBD5E1; padding: 8px 12px; text-align: center; }
          td { border: 1px solid #CBD5E1; padding: 6px 10px; text-align: center; }
          .left { text-align: left; }
          .title { font-size: 16pt; font-weight: bold; text-align: center; background-color: #F8FAFC; color: #1E293B; border: none; padding: 12px; }
          .subtitle { font-size: 10pt; color: #64748B; text-align: center; border: none; }
          .section-header { font-size: 12pt; font-weight: bold; background-color: #EEF2FF; color: #3730A3; text-align: left; padding: 8px; border: 1px solid #CBD5E1; }
          .kpi-num { font-size: 13pt; font-weight: bold; color: #4F46E5; }
          .badge-weak { color: #DC2626; font-weight: bold; }
          .badge-good { color: #16A34A; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr><td colspan="6" class="title">${className} · 学情综合诊断与成绩总表</td></tr>
          <tr><td colspan="6" class="subtitle">考试科目：综合外语 | 诊断生成时间：${exportDate} | 导出系统：LinguaMark 语测通</td></tr>
        </table>

        <!-- Section 1: KPIs -->
        <table>
          <tr><td colspan="6" class="section-header">一、 考情核心数据与基准比对概览</td></tr>
          <tr>
            <th>应考人数</th>
            <th>实考人数 / 缺考</th>
            <th>班级平均分 (实考)</th>
            <th>客观题正确率</th>
            <th>最高分 / 最低分</th>
            <th>与年级常模比对</th>
          </tr>
          <tr>
            <td>4 人</td>
            <td>3 人 / 1 人缺考</td>
            <td class="kpi-num">21.0 / 27.5 分</td>
            <td class="kpi-num">73.3%</td>
            <td>25.5 / 16.5 分</td>
            <td class="badge-good">+1.8 分 (领先)</td>
          </tr>
        </table>

        <!-- Section 2: Student Roster -->
        <table>
          <tr><td colspan="7" class="section-header">二、 班级学员成绩分项花名册 (总分由高到低)</td></tr>
          <tr>
            <th>班级排名</th>
            <th>考生姓名</th>
            <th>考试准考证号</th>
            <th>客观题得分 (8分)</th>
            <th>主观题得分 (19.5分)</th>
            <th>全卷总分 (27.5分)</th>
            <th>考情与作答状态</th>
          </tr>
    `;

    MOCK_STUDENTS.forEach((std, idx) => {
      const isMissing = std.status === 'missing';
      const rank = isMissing ? '免计' : `${idx + 1}`;
      const statusText = isMissing ? '病假缺考 (不计入分母)' : std.status === 'abnormal' ? '异常已复核改判' : '正常';
      const subjScore = isMissing ? 0 : (std.subjectiveScore !== null ? std.subjectiveScore : '阅卷中');
      const total = isMissing ? 0 : std.totalScore;

      html += `
        <tr>
          <td>${rank}</td>
          <td class="left"><b>${std.name}</b></td>
          <td>${std.examNo}</td>
          <td>${isMissing ? 0 : std.objectiveScore}</td>
          <td>${subjScore}</td>
          <td style="font-weight:bold; color:#4F46E5;">${total}</td>
          <td>${statusText}</td>
        </tr>
      `;
    });

    html += `
        </table>

        <!-- Section 3: Skill Dimensions -->
        <table>
          <tr><td colspan="5" class="section-header">三、 外语五维核心素养能力得分率矩阵</td></tr>
          <tr>
            <th>核心素养考查维度</th>
            <th>涉及小题范围</th>
            <th>班级平均得分率</th>
            <th>年级常模基准得分率</th>
            <th>薄弱等级评估</th>
          </tr>
    `;

    skillDimensions.forEach((dim) => {
      const isWeak = dim.status.includes('薄弱');
      html += `
        <tr>
          <td class="left"><b>${dim.name}</b></td>
          <td>第 1 ~ 7 题对应模块</td>
          <td style="font-weight:bold;">${dim.scoreRate}%</td>
          <td>${dim.benchmark}%</td>
          <td class="${isWeak ? 'badge-weak' : 'badge-good'}">${dim.status}</td>
        </tr>
      `;
    });

    html += `
        </table>

        <!-- Section 4: Common Mistakes -->
        <table>
          <tr><td colspan="6" class="section-header">四、 班级共性错题 Top 诊断与教学反哺建议</td></tr>
          <tr>
            <th>错题次序</th>
            <th>题号与考点</th>
            <th>题干简述</th>
            <th>班级正确率</th>
            <th>典型错误陷阱分布</th>
            <th>教学反哺与讲评策略</th>
          </tr>
    `;

    classMistakesTop.forEach((mistake, i) => {
      html += `
        <tr>
          <td>Top ${i + 1}</td>
          <td>第 ${mistake.qNum} 题<br/>(${mistake.type})</td>
          <td class="left">${mistake.stem}</td>
          <td class="badge-weak">${mistake.accuracy}</td>
          <td class="left">${mistake.wrongOptionDist}</td>
          <td class="left">${mistake.cureStrategy}</td>
        </tr>
      `;
    });

    html += `
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `高二外语特色1班_学情诊断与成绩总表_${exportDate}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage('Excel 报表已成功下载！包含考情概览、成绩花名册、五维雷达及共性错题4大表格。');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  // Generate plain CSV file
  const handleDownloadCSV = () => {
    const exportDate = new Date().toISOString().split('T')[0];
    let csvContent = '\uFEFF';
    csvContent += '班级排名,姓名,准考证号,客观题得分(8分),主观题得分(19.5分),全卷总分(27.5分),作答状态\n';
    
    MOCK_STUDENTS.forEach((std, idx) => {
      const isMissing = std.status === 'missing';
      const rank = isMissing ? '免计' : `${idx + 1}`;
      const statusText = isMissing ? '缺考' : std.status === 'abnormal' ? '异常已复核' : '正常';
      const subjScore = isMissing ? '0' : (std.subjectiveScore !== null ? `${std.subjectiveScore}` : '评阅中');
      const total = isMissing ? '0' : `${std.totalScore}`;
      
      csvContent += `"${rank}","${std.name}","${std.examNo}","${isMissing ? 0 : std.objectiveScore}","${subjScore}","${total}","${statusText}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `高二外语特色1班_成绩花名册流水_${exportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage('CSV 流水数据已成功导出！');
    setTimeout(() => setDownloadSuccessMessage(null), 3000);
  };

  // Copy TSV to clipboard
  const handleCopyTSV = () => {
    let tsv = '班级排名\t姓名\t准考证号\t客观得分\t主观得分\t全卷总分\t状态\n';
    MOCK_STUDENTS.forEach((std, idx) => {
      const isMissing = std.status === 'missing';
      const rank = isMissing ? '免计' : `${idx + 1}`;
      const statusText = isMissing ? '缺考' : std.status === 'abnormal' ? '异常已复核' : '正常';
      const subjScore = isMissing ? '0' : (std.subjectiveScore !== null ? `${std.subjectiveScore}` : '评阅中');
      const total = isMissing ? '0' : `${std.totalScore}`;
      tsv += `${rank}\t${std.name}\t${std.examNo}\t${isMissing ? 0 : std.objectiveScore}\t${subjScore}\t${total}\t${statusText}\n`;
    });

    navigator.clipboard.writeText(tsv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  导出学情诊断分析报告
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  支持 A4 打印与 Excel 导出
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                高二外语特色(1)班 · 2026学年综合外语质量检测
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: PDF vs Excel */}
        <div className="px-6 pt-3 pb-2 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setActiveFormat('pdf')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeFormat === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>PDF 报告 (A4 打印友好排版)</span>
            </button>
            <button
              onClick={() => setActiveFormat('excel')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeFormat === 'excel'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel 电子表格 (.xls / .csv)</span>
            </button>
          </div>

          {/* Quick Action in Header */}
          {activeFormat === 'pdf' ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500 mr-2">
                <span>打印色彩：</span>
                <button
                  onClick={() => setColorMode('color')}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    colorMode === 'color' 
                      ? 'bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950 dark:text-indigo-300' 
                      : 'text-slate-500 hover:bg-slate-200/50'
                  }`}
                >
                  全彩展示
                </button>
                <button
                  onClick={() => setColorMode('ink_saver')}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    colorMode === 'ink_saver' 
                      ? 'bg-slate-200 text-slate-800 font-bold dark:bg-slate-700 dark:text-slate-200' 
                      : 'text-slate-500 hover:bg-slate-200/50'
                  }`}
                >
                  黑白省墨
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>调起系统打印 / 保存为 PDF</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyTSV}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制表格文本' : '复制数据 (Ctrl+V)'}</span>
              </button>

              <button
                onClick={handleDownloadExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>导出完整 Excel 报表 (.xls)</span>
              </button>
            </div>
          )}
        </div>

        {/* Feedback Alert if Downloaded */}
        {downloadSuccessMessage && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Body Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
          
          {/* TAB 1: PDF Printable View */}
          {activeFormat === 'pdf' && (
            <div className="space-y-4">
              {/* Optional Section Filters */}
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  定制报告包含模块：
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSections.summaryKpi}
                      onChange={(e) => setIncludeSections({...includeSections, summaryKpi: e.target.checked})}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">核心考情指标</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSections.radarSkills}
                      onChange={(e) => setIncludeSections({...includeSections, radarSkills: e.target.checked})}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">五维素养得分率</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSections.commonMistakes}
                      onChange={(e) => setIncludeSections({...includeSections, commonMistakes: e.target.checked})}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">共性错题 Top 3 诊断</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSections.rosterTable}
                      onChange={(e) => setIncludeSections({...includeSections, rosterTable: e.target.checked})}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">学员成绩总表</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSections.teacherNotes}
                      onChange={(e) => setIncludeSections({...includeSections, teacherNotes: e.target.checked})}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300">备课反思与教研签字区</span>
                  </label>
                </div>
              </div>

              {/* The Actual Printable Canvas: #printable-class-report */}
              <div 
                id="printable-class-report"
                className={`bg-white text-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto space-y-6 transition-all ${
                  colorMode === 'ink_saver' ? 'filter grayscale contrast-125' : ''
                }`}
                style={{ minHeight: '1050px', width: '100%' }}
              >
                {/* Official Report Header */}
                <div className="border-b-2 border-slate-900 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 uppercase tracking-widest">
                        <School className="w-4 h-4 text-indigo-600" />
                        <span>外语教学教研中心 · 内部学业水平质量监测诊断报告</span>
                      </div>
                      <h1 className="text-2xl font-black text-slate-900 mt-1">
                        高二外语特色(1)班 · 考试学情综合诊断与教学反哺报告
                      </h1>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                      <div>报告编号：<span className="font-mono font-bold text-slate-800">LM-2026-F01</span></div>
                      <div>生成时间：<span className="font-mono">2026-09-24 14:00</span></div>
                      <div className="text-emerald-700 font-semibold">● 阅卷已归档锁定</div>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500">执教教师：</span>
                      <span className="font-bold text-slate-800">外语教研组</span>
                    </div>
                    <div>
                      <span className="text-slate-500">试卷满分：</span>
                      <span className="font-bold text-slate-800">27.5 分 (7题)</span>
                    </div>
                    <div>
                      <span className="text-slate-500">应考人数：</span>
                      <span className="font-bold text-slate-800">4 人</span>
                    </div>
                    <div>
                      <span className="text-slate-500">实考 / 缺考：</span>
                      <span className="font-bold text-slate-800">3 人 / 1 人缺考</span>
                    </div>
                  </div>
                </div>

                {/* Section 1: KPI Statistics */}
                {includeSections.summaryKpi && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-l-4 border-indigo-600 pl-2">
                      一、 班级核心考情关键指标
                    </h3>
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-[11px] text-slate-500">班级平均分</div>
                        <div className="text-lg font-black text-indigo-700 font-mono mt-0.5">21.0 分</div>
                        <div className="text-[10px] text-emerald-600 font-bold">高于年级 +1.8 分</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-[11px] text-slate-500">客观题正确率</div>
                        <div className="text-lg font-black text-slate-900 font-mono mt-0.5">73.3%</div>
                        <div className="text-[10px] text-slate-500">听力与阅读稳健</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-[11px] text-slate-500">全卷得分率</div>
                        <div className="text-lg font-black text-slate-900 font-mono mt-0.5">76.4%</div>
                        <div className="text-[10px] text-slate-500">中上等水平</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-[11px] text-slate-500">极值与标准差</div>
                        <div className="text-sm font-black text-slate-900 font-mono mt-1">25.5 / 16.5</div>
                        <div className="text-[10px] text-slate-500">标准差：4.5 分</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Skill Dimensions */}
                {includeSections.radarSkills && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-l-4 border-indigo-600 pl-2">
                      二、 外语五维素养能力得分率与基准比对表
                    </h3>
                    <table className="w-full text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700">
                          <th className="border border-slate-300 p-2 text-left">考查素养维度</th>
                          <th className="border border-slate-300 p-2 text-center">对应题型模块</th>
                          <th className="border border-slate-300 p-2 text-center">班级得分率</th>
                          <th className="border border-slate-300 p-2 text-center">年级常模基准</th>
                          <th className="border border-slate-300 p-2 text-center">差距幅度</th>
                          <th className="border border-slate-300 p-2 text-center">诊断结论</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skillDimensions.map((dim, i) => {
                          const diff = dim.scoreRate - dim.benchmark;
                          return (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="border border-slate-300 p-2 font-bold text-slate-800">{dim.name}</td>
                              <td className="border border-slate-300 p-2 text-center text-slate-500">
                                {i === 0 ? '听力单选 (第1-2题)' : i === 1 ? '词汇辨析 (第4题)' : i === 2 ? '倒装语法 (第3,6题)' : i === 3 ? '阅读推断 (第5题)' : '写作与翻译 (第7题)'}
                              </td>
                              <td className="border border-slate-300 p-2 text-center font-bold font-mono text-indigo-700">
                                {dim.scoreRate}%
                              </td>
                              <td className="border border-slate-300 p-2 text-center font-mono text-slate-600">
                                {dim.benchmark}%
                              </td>
                              <td className="border border-slate-300 p-2 text-center font-mono">
                                <span className={diff >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                                  {diff >= 0 ? `+${diff}%` : `${diff}%`}
                                </span>
                              </td>
                              <td className="border border-slate-300 p-2 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  dim.status === '严重薄弱' 
                                    ? 'bg-rose-100 text-rose-800' 
                                    : dim.status === '良好'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-800'
                                }`}>
                                  {dim.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Section 3: Class Common Mistakes Top */}
                {includeSections.commonMistakes && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-l-4 border-rose-600 pl-2">
                      三、 班级共性错题 Top 3 深度归因与反哺教案
                    </h3>
                    <div className="space-y-2.5">
                      {classMistakesTop.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-300 bg-slate-50/60 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-rose-700 flex items-center gap-1">
                              <span className="w-4 h-4 rounded bg-rose-600 text-white text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span>第 {item.qNum} 题 · {item.type}</span>
                            </span>
                            <span className="text-rose-600 font-mono">班级正确率仅: {item.accuracy}</span>
                          </div>
                          <div className="p-1.5 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                            {item.stem}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                              <strong>【典型错因陷阱】</strong> {item.wrongOptionDist}
                            </div>
                            <div className="text-indigo-900 bg-indigo-50 p-2 rounded border border-indigo-200">
                              <strong>【课堂讲评策略】</strong> {item.cureStrategy}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: Student Roster Sheet */}
                {includeSections.rosterTable && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-l-4 border-indigo-600 pl-2">
                      四、 班级学员成绩分项花名册 (打印存档版)
                    </h3>
                    <table className="w-full text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700">
                          <th className="border border-slate-300 p-1.5 text-center">排名</th>
                          <th className="border border-slate-300 p-1.5 text-left">姓名</th>
                          <th className="border border-slate-300 p-1.5 text-center">考号</th>
                          <th className="border border-slate-300 p-1.5 text-center">客观题 (8分)</th>
                          <th className="border border-slate-300 p-1.5 text-center">主观题 (19.5分)</th>
                          <th className="border border-slate-300 p-1.5 text-center">全卷总分</th>
                          <th className="border border-slate-300 p-1.5 text-center">考情与复核状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_STUDENTS.map((std, idx) => {
                          const isMissing = std.status === 'missing';
                          return (
                            <tr key={std.id} className="hover:bg-slate-50">
                              <td className="border border-slate-300 p-1.5 text-center font-bold">
                                {isMissing ? '免计' : idx + 1}
                              </td>
                              <td className="border border-slate-300 p-1.5 font-bold text-slate-800">
                                {std.name}
                              </td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono text-slate-500">
                                {std.examNo}
                              </td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono">
                                {isMissing ? 0 : std.objectiveScore}
                              </td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono">
                                {isMissing ? 0 : (std.subjectiveScore !== null ? std.subjectiveScore : '阅卷中')}
                              </td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono font-black text-indigo-700">
                                {isMissing ? 0 : std.totalScore}
                              </td>
                              <td className="border border-slate-300 p-1.5 text-center text-[10px]">
                                {isMissing ? (
                                  <span className="text-slate-500 font-bold">病假缺考 (不计入均分)</span>
                                ) : std.status === 'abnormal' ? (
                                  <span className="text-amber-700 font-bold">异常已人工复核改判</span>
                                ) : (
                                  <span className="text-emerald-700">正常</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Section 5: Teacher Reflection & Signatures */}
                {includeSections.teacherNotes && (
                  <div className="space-y-2 pt-2 border-t-2 border-slate-900">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      五、 任课教师学情讲评反思与教研组审核栏 (手写/盖章留存)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 border border-dashed border-slate-400 rounded-xl bg-slate-50/50 space-y-3">
                        <strong className="text-slate-700 block">【任课教师备课讲评要点记录】</strong>
                        <div className="h-14 text-slate-400 text-[11px] leading-relaxed">
                          1. 计划于下周二早自习开展“否定倒装句”微专题 15 分钟专项强化训练；<br/>
                          2. 针对第 2 梯队学生重点纠偏中译英主句助动词提前逻辑。
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                          <span>任课教师签字：___________</span>
                          <span>日期：2026年___月___日</span>
                        </div>
                      </div>

                      <div className="p-3 border border-dashed border-slate-400 rounded-xl bg-slate-50/50 space-y-3">
                        <strong className="text-slate-700 block">【外语教研组长复核与备课组评语】</strong>
                        <div className="h-14 text-slate-400 text-[11px] leading-relaxed">
                          同意教学反思方案。本次听力与阅读基本盘扎实，下周重点联合备课组攻坚倒装语法与书面表达高级句式应用。
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                          <span>教研组长签字：___________</span>
                          <span>审核盖章：(教研章)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Print Timestamp */}
                <div className="text-[10px] text-slate-400 text-center pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span>LinguaMark 语测通 · 外语考试学情数字化系统</span>
                  <span>第 1 页 / 共 1 页 (A4 打印推荐)</span>
                  <span>内部教研文档 · 阅后妥善归档</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Excel Electronic Spreadsheet View */}
          {activeFormat === 'excel' && (
            <div className="space-y-6">
              {/* Quick Actions Panel */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    导出包含全量学情多维结构化数据的 Excel 表格
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    已内置 UTF-8 BOM 防乱码编码，完全适配 Microsoft Excel、WPS Office、Numbers 及教务系统导入。
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下载纯 CSV 流水</span>
                  </button>

                  <button
                    onClick={handleDownloadExcel}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>立即下载完整 Excel 报表 (.xls)</span>
                  </button>
                </div>
              </div>

              {/* Excel Preview Tables */}
              <div className="space-y-4">
                {/* Preview 1: Student Score Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      表格数据预览：学员全科分项成绩总表 (Sheet 1)
                    </span>
                    <span className="text-[11px] text-slate-400">共 4 条记录 (按全卷总分降序)</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                          <th className="p-2.5">排名</th>
                          <th className="p-2.5">姓名</th>
                          <th className="p-2.5">准考证号</th>
                          <th className="p-2.5">客观题得分 (8分)</th>
                          <th className="p-2.5">主观题得分 (19.5分)</th>
                          <th className="p-2.5">全卷总分 (27.5分)</th>
                          <th className="p-2.5">考情标记</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                        {MOCK_STUDENTS.map((std, idx) => {
                          const isMissing = std.status === 'missing';
                          return (
                            <tr key={std.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                              <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                                {isMissing ? '免计' : idx + 1}
                              </td>
                              <td className="p-2.5 font-sans font-bold text-slate-900 dark:text-white">
                                {std.name}
                              </td>
                              <td className="p-2.5 text-slate-500">{std.examNo}</td>
                              <td className="p-2.5">{isMissing ? 0 : std.objectiveScore}</td>
                              <td className="p-2.5">
                                {isMissing ? 0 : (std.subjectiveScore !== null ? std.subjectiveScore : '阅卷中')}
                              </td>
                              <td className="p-2.5 font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                                {isMissing ? 0 : std.totalScore}
                              </td>
                              <td className="p-2.5 font-sans text-[11px]">
                                {isMissing ? (
                                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    缺考
                                  </span>
                                ) : std.status === 'abnormal' ? (
                                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                    异常已改判
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                    正常
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Preview 2: Skill Dimension Stats */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      表格数据预览：外语五维核心素养得分率与常模对比 (Sheet 2)
                    </span>
                    <span className="text-[11px] text-slate-400">5 个核心考查维度</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                          <th className="p-2.5">考查素养维度</th>
                          <th className="p-2.5">班级得分率</th>
                          <th className="p-2.5">年级基准得分率</th>
                          <th className="p-2.5">与常模差距</th>
                          <th className="p-2.5">诊断结论</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {skillDimensions.map((dim, i) => {
                          const diff = dim.scoreRate - dim.benchmark;
                          return (
                            <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                              <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">{dim.name}</td>
                              <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{dim.scoreRate}%</td>
                              <td className="p-2.5 font-mono text-slate-500">{dim.benchmark}%</td>
                              <td className="p-2.5 font-mono">
                                <span className={diff >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                  {diff >= 0 ? `+${diff}%` : `${diff}%`}
                                </span>
                              </td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  dim.status === '严重薄弱' 
                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' 
                                    : dim.status === '良好'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  {dim.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>纸质打印推荐使用 A4 纵向 (Portrait) 标准规格</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 font-medium transition-all"
            >
              关闭
            </button>
            {activeFormat === 'pdf' ? (
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>调起打印 (PDF)</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadExcel}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 Excel</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
