import React, { useState } from 'react';
import { REVIEW_POINTS } from '../data/prdContent';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Cpu, 
  Layers, 
  Camera, 
  Printer, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  FileSearch,
  Zap,
  Activity,
  Compass,
  Rocket,
  Shield,
  Target,
  BarChart3,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Eye,
  Server
} from 'lucide-react';

export const ReviewAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'review' | 'competitive' | 'roadmap'>('review');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');

  const filteredPoints = selectedDimension === 'all' 
    ? REVIEW_POINTS 
    : REVIEW_POINTS.filter(p => p.dimension === selectedDimension);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-indigo-500" />
            系统深度论证中心：需求审查、竞品对标与演进路线图
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            严密推演业务闭环与系统边界，全方位对标行业典型竞品，明确 V1.0 MVP 到 V2.0/V3.0 的技术演进阶梯。
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-300 dark:border-emerald-800">
            MVP 闭环验证：100% 达成
          </span>
        </div>
      </div>

      {/* Main Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setActiveTab('review')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'review'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>1. 需求漏洞审查与头脑风暴</span>
        </button>

        <button
          onClick={() => setActiveTab('competitive')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'competitive'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>2. 行业竞品全景对比与护城河</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'roadmap'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>3. 后续扩展与迭代演进路线图 (V2~V3)</span>
        </button>
      </div>

      {/* TAB 1: Review & Brainstorming */}
      {activeTab === 'review' && (
        <div className="space-y-8">
          {/* 3 Metric Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  1. 业务逻辑 (Logic)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold">
                  严密 · 98%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                试卷生成、条码赋码、线下涂卡、手机 OMR、在线切题阅卷、学情输出全链路形成良性闭环。已通过“防串页双重校验码”和“成绩状态机”补齐业务并发冲突。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  2. 需求完整度 (Completeness)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold">
                  全闭环 · 96%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                新增“非题库外部试卷模式与标杆答题卡 OMR 提取”，彻底化解学校使用外部纸卷时的建考难题；听力音频在线试听与整卷打包导出已完整闭环。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  3. 工程可执行性 (Feasibility)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold">
                  高可行 · 98%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                严格恪守首期边界（纯电脑端 Web、不做 App、不做 AI 自动主观题批改）。OMR 采用纯本地算法，0 外部 API 依赖，手机拍照自愈算法全面落地。
              </p>
            </div>
          </div>

          {/* OMR Technical Specification deep-dive */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-indigo-900/60 mb-6 gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
                  <Cpu className="w-3.5 h-3.5" /> 核心技术专题答辩 (OMR & 图像处理)
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  OMR 方案选型、纸张印刷要求与异常容错落地细则
                </h2>
              </div>
              <div className="text-xs text-indigo-300 bg-indigo-900/40 px-3 py-1.5 rounded-xl border border-indigo-800">
                回应需求第3项重点关切
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-800/70 p-5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-indigo-300 text-base">
                  <Zap className="w-4 h-4 text-amber-400" />
                  1. OMR 技术方案：纯本地 OpenCV + ZXing（不依赖第三方）
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  坚持使用 <strong className="text-white">纯本地 C++/Python/WebAssembly OpenCV 算法体系</strong>，坚决不依赖公有云商业 OCR。
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg text-xs space-y-1.5 border border-slate-800">
                  <div className="text-slate-400 font-mono text-[11px]">• 算法流水线：图像输入 ➔ 高斯平滑 ➔ 透视仿射变换 (Warp Perspective 矫正 ≤20° 倾斜) ➔ 定位黑标网格映射 ➔ Sauvola 局部自适应灰度积分。</div>
                  <div className="text-slate-400 font-mono text-[11px]">• 条码识别：基于本地开源 ZXing 库解码 Code128，单张耗时 &lt; 50ms。</div>
                  <div className="text-emerald-400 font-medium">• 优势总结：全私有化可离线运行、0 持续 API 费用、学生姓名试卷数据 100% 不出内网。</div>
                </div>
              </div>

              <div className="bg-slate-800/70 p-5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-indigo-300 text-base">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  2. 答题卡印刷质量规范（关键防错）
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li><strong className="text-white">纸张克重要求：</strong>必须 ≥ 80g 双胶纸（A4）。严禁使用 70g 或轻型草稿纸，防止双面书写或反面油墨透光导致正面误判。</li>
                  <li><strong className="text-white">定位锚点印刷：</strong>卡面四个角各印制一个 8mm×8mm 纯黑（K100%）定位实心方块，边缘间距 ≥ 10mm，印刷缩放比例公差控制在 ±1% 以内。</li>
                  <li><strong className="text-white">选项填涂气泡框：</strong>气泡框边框线条粗细为 0.5pt，灰度 30%~40%，确保铅笔填涂后与背景对比度显著放大。</li>
                </ul>
              </div>

              <div className="bg-slate-800/70 p-5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-indigo-300 text-base">
                  <Camera className="w-4 h-4 text-blue-400" />
                  3. 初期核心：手机拍照为主的图像预处理与抗干扰重构方案
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li><strong className="text-white">业务场景定位：</strong>初期学校不具备采购昂贵专业扫描仪条件，系统 100% 以教师普通智能手机拍照上传为主链路，支持免登录扫码快速连拍直传与电脑端 ZIP 批量导入。</li>
                  <li><strong className="text-white">梯形形变与倾斜自愈：</strong>采用 Canny 边缘定位 4 个定位黑标，通过双线性插值 WarpPerspective 算法将 ≤20° 的俯拍倾斜和梯形畸变秒速拉平为标准矩形。</li>
                  <li><strong className="text-white">手影自适应滤除 (CLAHE)：</strong>采用形态学大核开运算估计背景光照场并做差分扣除，彻底解决手机拍照时手部暗影造成的二值化暗区误判问题。</li>
                  <li><strong className="text-white">条码反光手写兜底：</strong>顶灯反光致 Code128 条码损坏时，系统自动切出学生手写考号，教师 1 秒点选对齐，绝不阻断整批作业。</li>
                </ul>
              </div>

              <div className="bg-slate-800/70 p-5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 font-bold text-indigo-300 text-base">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  4. 异常处理：绝对阻断与人机快速复核
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200">
                    <strong>铁律原则：</strong>异常试卷（漏页、条码无法识别、未配对、严重污损）<strong>一律不得进入正式班级统计与学情大屏</strong>，直接打入“异常挂起队列”。
                  </div>
                  <p className="text-[12px] leading-relaxed text-slate-300">
                    系统在管理端提供“左右分屏复核台”：左侧展示原始试卷高清局部放大切片，右侧直接支持老师一键选改（如将多涂改选为B、将条码模糊答题卡手动匹配考号），复核确认后方可释放进入总分流。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Brainstorming Review Points Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6 gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  需求漏洞排查与头脑风暴完善建议 (Brainstorming)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  针对原始需求的 7 大关键逻辑与业务细节进行补充强化，保障一期高质量无痛上线。
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {['all', '逻辑严密性', '完整性', '可执行性', '安全与风控'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedDimension(tab)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedDimension === tab
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab === 'all' ? '全部维度' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Points List */}
            <div className="space-y-4">
              {filteredPoints.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {item.dimension}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 已纳进正式 PRD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                    <div className="lg:col-span-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                      <div className="font-bold text-slate-500 mb-1">【原需求简要】</div>
                      <p className="text-slate-700 dark:text-slate-300 italic">{item.currentBrief}</p>
                    </div>

                    <div className="lg:col-span-4 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                      <div className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> 存在漏洞或执行盲区
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.critique}</p>
                    </div>

                    <div className="lg:col-span-5 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
                      <div className="font-bold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        头脑风暴完善策略（PRD 落地标准）
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {item.brainstormSolution}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Competitive Analysis */}
      {activeTab === 'competitive' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              行业三大典型竞品横向全景对标矩阵
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
              面对目前市面上“传统统考阅卷系统（重型且昂贵）”、“公有云题库批改 SaaS（数据出公网且持续扣费）”以及“通用打孔识卡 App（功能残缺无主观题）”三大阵营，语测通 (LinguaMark) 确立了极度聚焦的错位竞争优势。
            </p>
          </div>

          {/* Matrix Comparison Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold">
                    <th className="p-4 w-44">竞争核心维度</th>
                    <th className="p-4 w-56 text-slate-500">传统校级统考系统<br/><span className="text-[10px] font-normal">(科大讯飞/海云天)</span></th>
                    <th className="p-4 w-56 text-slate-500">公有云作业批改 SaaS<br/><span className="text-[10px] font-normal">(极课大数据/好分数)</span></th>
                    <th className="p-4 w-48 text-slate-500">通用打孔识别 App<br/><span className="text-[10px] font-normal">(ZipGrade/闪电阅卷)</span></th>
                    <th className="p-4 w-64 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-l border-indigo-200 dark:border-indigo-800">
                      ★ 语测通 (LinguaMark)<br/><span className="text-[10px] font-normal">本产品定位</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      1. 初期硬件门槛
                    </td>
                    <td className="p-4 text-rose-600">
                      <strong>极高</strong>：必须采购工业级 ADF 扫描仪（单台 2~5 万元），否则无法运行。
                    </td>
                    <td className="p-4 text-amber-600">
                      <strong>较高</strong>：依赖指定型号的高速扫描仪，常态化维护复杂。
                    </td>
                    <td className="p-4 text-emerald-600">
                      <strong>极低</strong>：纯手机单机拍照。
                    </td>
                    <td className="p-4 bg-indigo-50/30 dark:bg-indigo-950/20 font-bold text-emerald-600 border-l border-indigo-100 dark:border-indigo-800">
                      ✔ 零硬件门槛：手机拍照为主（自适应去手影+透视拉平），完全向下兼容扫描仪。
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      2. 数据隐私与持续费用
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      私有化部署，但一次性软件采购费 10~30 万元，升级运维费用昂贵。
                    </td>
                    <td className="p-4 text-rose-600">
                      <strong>存在合规风险</strong>：试卷与学生信息传至公网，按生按次年费计费（50~150元/生/年）。
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      单机单App，少许订阅费，数据无法校级聚合。
                    </td>
                    <td className="p-4 bg-indigo-50/30 dark:bg-indigo-950/20 font-bold text-emerald-600 border-l border-indigo-100 dark:border-indigo-800">
                      ✔ 100% 数据不出校：纯本地 OpenCV，0 外部 API 调用费，内网极速安全。
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      3. 外部统考试卷扩展性
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      配卷复杂，需专业考务人员划框切题，耗费半天。
                    </td>
                    <td className="p-4 text-rose-600">
                      <strong>强绑定自身题库</strong>：外部试卷若无对应题库资源，必须耗费教师数小时手工打字录入。
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      仅能在手机上逐个小题手动点选 ABCD 答案。
                    </td>
                    <td className="p-4 bg-indigo-50/30 dark:bg-indigo-950/20 font-bold text-indigo-700 dark:text-indigo-300 border-l border-indigo-200 dark:border-indigo-800">
                      ✔ 标杆卡 OMR 提取：手涂一张标准卡拍照 0.3 秒自动提取 Answer Key，免录入题库！
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      4. 外语学科专业度
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      通用大平台，无专门外语听力统考音频管理与词法语法维度。
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      侧重数理化等理科公式识别，外语书面表达与倒装句评语粗糙。
                    </td>
                    <td className="p-4 text-rose-600">
                      <strong>完全不支持主观题</strong>：无中译英、无作文流水评阅。
                    </td>
                    <td className="p-4 bg-indigo-50/30 dark:bg-indigo-950/20 font-bold text-indigo-700 dark:text-indigo-300 border-l border-indigo-200 dark:border-indigo-800">
                      ✔ 听力音频绑定/导出 + 主观题切题密评印章 + 五维外语素养雷达图。
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                      5. 教学反哺与闭环深度
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      偏向宏观教育局/校级行政报表，教师无法一键讲评。
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      提供正答率曲线，但个人错题重做卷需额外收费或排版混乱。
                    </td>
                    <td className="p-4 text-rose-600">
                      无错题本，无讲评材料，无雷达图。
                    </td>
                    <td className="p-4 bg-indigo-50/30 dark:bg-indigo-950/20 font-bold text-emerald-600 border-l border-indigo-100 dark:border-indigo-800">
                      ✔ 直击教学前线：秒级生成千人千面 A4 错题本 + 课前讲评 PPT + 导出双格式。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Core Moats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Shield,
                title: '护城河 1: 纯本地抗干扰算法',
                desc: '透视拉平 ≤20°、背景场估计去手影、条码反光快速补绑，完全摆脱公有云依赖与额外扫描仪采购。'
              },
              {
                icon: Zap,
                title: '护城河 2: 双轨极速建考机制',
                desc: '模式 A 题库组卷 + 模式 B 非题库标杆卡 0.3 秒提取 Answer Key，轻松拿下校外纸卷与统考卷。'
              },
              {
                icon: Compass,
                title: '护城河 3: 外语学科深度模型',
                desc: '听力统考音频绑定与一键导出、倒装句式采分点印章、五维核心素养雷达图，懂外语教学。'
              },
              {
                icon: Rocket,
                title: '护城河 4: 真正贯通“评教”闭环',
                desc: '阅卷完成不仅出分，更直接赋能学生二次订正（A4错题本）与教师精准备课（课堂讲评PPT）。'
              }
            ].map((moat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <moat.icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{moat.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">{moat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Roadmap (V2.0 ~ V3.0) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-500" />
              后续演进阶梯：从 MVP 闭环到智能化教学资产沉淀
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
              遵循“首期抓刚需、二期提效能、三期建生态”的务实演进原则。每一阶段迭代均建立在已有功能之上，不破坏系统的极简易用性。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* V1.0 Current */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    当前版本已达成 (V1.0 MVP)
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">最小可用业务闭环</h3>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>

              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400 list-disc list-inside">
                <li><strong className="text-slate-800 dark:text-slate-200">纯 Web 响应式架构：</strong>免装客户端，0 外部 API。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">双轨建考模式：</strong>题库组卷 + 非题库标杆卡 OMR 提取。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">手机拍照优先：</strong>透视拉平 ≤20°、CLAHE 去手影、反光手写兜底。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">主观题双盲流水批改：</strong>全键盘赋分 + 常用印章 + 全卷悬浮回溯。</li>
                <li><strong className="text-slate-800 dark:text-slate-200">四合一教学反哺：</strong>个人错题本、讲评 PPT、五维雷达图、PDF/Excel 导出。</li>
              </ul>
            </div>

            {/* V2.0 Short-Term */}
            <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border-2 border-indigo-500/40 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-200 dark:border-indigo-800">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    下一阶段迭代 (V2.0 效能升级)
                  </span>
                  <h3 className="text-base font-black text-indigo-950 dark:text-indigo-200 mt-1">智能辅助与硬件扩展</h3>
                </div>
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>

              <ul className="text-xs space-y-2.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold shrink-0">•</span>
                  <span><strong>AI 语法拼写辅助初筛：</strong>英文书面表达自动用波浪线预警主谓不一致、时态错用，教师 100% 确认后赋分，提效 40%。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold shrink-0">•</span>
                  <span><strong>USB 便携高拍仪直连：</strong>免驱 UVC 协议直连桌面视频展台，脚踏开关 1.5 秒连续快拍，达 25 页/分钟。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold shrink-0">•</span>
                  <span><strong>主观题双评与分差仲裁机制：</strong>面向期末校际统考，单题支持两名教师背靠背双评，分差超标自动流转组长三评。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold shrink-0">•</span>
                  <span><strong>班级批量错题本一键打包：</strong>全班 50 名学生的个人错题集 PDF 自动按学号合并打包，便于集中双面打印。</span>
                </li>
              </ul>
            </div>

            {/* V3.0 Medium/Long-Term */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    未来生态扩展 (V3.0 深度沉淀)
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">知识图谱与教学资产</h3>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>

              <ul className="text-xs space-y-2.5 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">•</span>
                  <span><strong>可视化所见即所得制卡器：</strong>支持 A3 双面大卷、中高考仿真折叠答题卡、小语种特殊排版自由拖拽设计。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">•</span>
                  <span><strong>学期纵向成长轨迹模型：</strong>将历次月考的五维雷达图串联为发展趋势折线，生成学生个人学期提分白皮书。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">•</span>
                  <span><strong>试卷二维码免登录错题微课：</strong>错题纸底端一卷一码，学生微信扫码即听 1 分钟名师原音解析与听力重听，0 App 负担。</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold shrink-0">•</span>
                  <span><strong>校级外语优质试题沉淀池：</strong>通过高频错题归因，自动沉淀高质量外语母题与变式题库，形成校本教学数字资产。</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
