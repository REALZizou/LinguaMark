import React, { useState } from 'react';
import { 
  Camera, 
  Sun, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Smartphone, 
  Maximize2, 
  RotateCw, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Info,
  Zap,
  Printer,
  Eye,
  HelpCircle
} from 'lucide-react';

interface CameraCaptureGuideProps {
  onBackToSimulator?: () => void;
  onApplyPreset?: (preset: 'normal' | 'shadow' | 'skew' | 'glare') => void;
}

export const CameraCaptureGuide: React.FC<CameraCaptureGuideProps> = ({
  onBackToSimulator,
  onApplyPreset
}) => {
  // Interactive Simulator Controls
  const [shootingAngle, setShootingAngle] = useState<number>(85); // 90 is directly overhead, 60 is heavily tilted
  const [lightingCondition, setLightingCondition] = useState<'diffuse' | 'hand_shadow' | 'overhead_glare'>('diffuse');
  const [cornerVisible, setCornerVisible] = useState<boolean>(true);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'interactive_sim' | 'do_and_dont' | 'checklist'>('interactive_sim');

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    flat: true,
    no_flash: true,
    corners_in: true,
    angle_good: true,
    no_glare: true,
  });

  const toggleChecklist = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  // Real-time quality evaluation based on simulator parameters
  const isAngleGood = shootingAngle >= 75;
  const isAngleAcceptable = shootingAngle >= 68 && shootingAngle < 75;
  const isAngleBad = shootingAngle < 68;

  const hasLightingIssue = lightingCondition !== 'diffuse' || flashEnabled;
  const isBarcodeAtRisk = lightingCondition === 'overhead_glare' || flashEnabled;

  const getReadinessScore = () => {
    let score = 100;
    if (isAngleBad) score -= 35;
    else if (isAngleAcceptable) score -= 15;
    if (lightingCondition === 'hand_shadow') score -= 20;
    if (lightingCondition === 'overhead_glare') score -= 30;
    if (flashEnabled) score -= 35;
    if (!cornerVisible) score -= 45;
    return Math.max(10, score);
  };

  const currentScore = getReadinessScore();

  return (
    <div className="space-y-6">
      {/* Guide Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 初期专属拍摄指南 · 免扫描仪也能 99.8% 识别
              </span>
              <span className="text-xs text-slate-400">
                针对手机拍照环境的“光线、角度对齐与防反光”交互式指引
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              手机拍摄高质量答卷交互式指南
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              项目初期无需添置专用高速扫描仪。只需掌握 3 个简单拍摄微动作（避开顶灯反光、四角入镜、侧光防手影），即可让普通手机拍出的试卷达到工业级扫描效果！
            </p>
          </div>

          {onBackToSimulator && (
            <button
              onClick={onBackToSimulator}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <span>返回 OMR 仿真工作台</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setActiveTab('interactive_sim')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'interactive_sim'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. 手机取景拍摄实时模拟器</span>
        </button>

        <button
          onClick={() => setActiveTab('do_and_dont')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'do_and_dont'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. 正确 vs 错误拍摄典型对比</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'checklist'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>3. 教师课桌连拍 5 秒自检清单</span>
        </button>
      </div>

      {/* TAB 1: Interactive Camera Viewfinder Simulator */}
      {activeTab === 'interactive_sim' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Simulated Phone Viewfinder Canvas */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  手机实时取景框模拟器 (Camera Viewfinder Live Sim)
                </span>
              </div>

              {/* Dynamic Status Pill */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400">预估识别率：</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  currentScore >= 90
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : currentScore >= 70
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {currentScore}% · {currentScore >= 90 ? '完美入闸' : currentScore >= 70 ? '需轻度算法自愈' : '高风险阻断'}
                </span>
              </div>
            </div>

            {/* Smartphone Outer Shell */}
            <div className="max-w-md mx-auto bg-slate-950 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 relative">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Camera Screen Viewport */}
              <div className="relative bg-slate-900 rounded-[32px] overflow-hidden aspect-[3/4] flex items-center justify-center p-4 border border-slate-800 select-none">
                
                {/* 3x3 Rule-of-Thirds Grid Overlay */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-20">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>

                {/* Simulated Desktop Surface inside Viewfinder */}
                <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center overflow-hidden">
                  
                  {/* Paper Sheet Representation */}
                  <div 
                    className="w-[84%] bg-white rounded-lg p-3 text-slate-900 shadow-2xl transition-all duration-300 relative border border-slate-300"
                    style={{
                      transform: `perspective(600px) rotateX(${90 - shootingAngle}deg) ${
                        !cornerVisible ? 'scale(1.2) translate(-20px, -20px)' : 'scale(1)'
                      }`
                    }}
                  >
                    {/* Simulated Hand Shadow Layer */}
                    {lightingCondition === 'hand_shadow' && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-900/40 to-transparent z-20 pointer-events-none rounded-lg flex items-end p-2">
                        <span className="text-[9px] text-white bg-black/80 px-1.5 py-0.5 rounded font-mono">
                          ⚠️ 手臂暗影遮挡区 (需CLAHE去阴影)
                        </span>
                      </div>
                    )}

                    {/* Simulated Flashlight or Ceiling Glare on Barcode */}
                    {(lightingCondition === 'overhead_glare' || flashEnabled) && (
                      <div className="absolute top-6 right-3 w-20 h-10 bg-white/95 rounded-full blur-md z-30 pointer-events-none flex items-center justify-center">
                        <div className="w-12 h-6 bg-amber-200/90 rounded-full blur-sm" />
                      </div>
                    )}

                    {/* 4 Finder Corner Patterns */}
                    <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-black" />
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-black" />
                    <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-black" />
                    <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-black" />

                    {/* Green Alignment Reticles around 4 anchors (if corners are visible) */}
                    {cornerVisible && (
                      <>
                        <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-emerald-500 pointer-events-none" />
                        <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-emerald-500 pointer-events-none" />
                        <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-emerald-500 pointer-events-none" />
                        <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-emerald-500 pointer-events-none" />
                      </>
                    )}

                    {/* Mock Card Content */}
                    <div className="text-center pb-1.5 border-b border-slate-300">
                      <div className="text-[8px] font-black tracking-widest text-slate-800">
                        外语综合素质测评答题卡 (A4)
                      </div>
                    </div>

                    {/* Barcode & Student Info */}
                    <div className="flex items-center justify-between my-2 p-1.5 bg-slate-50 rounded border border-slate-200 text-[8px]">
                      <div>
                        <div>考生：陈思宇</div>
                        <div className="font-mono text-indigo-700">202610101</div>
                      </div>
                      <div className="p-1 bg-white rounded border border-slate-300 text-center font-mono text-[7px] relative">
                        {isBarcodeAtRisk ? (
                          <span className="text-rose-600 font-bold">反光无法解码 ❌</span>
                        ) : (
                          <span className="text-emerald-700 font-bold">|||||||||| BC101 ✔</span>
                        )}
                      </div>
                    </div>

                    {/* Mock Bubbles */}
                    <div className="space-y-1 text-[8px] font-mono">
                      {[1, 2, 3, 4].map(q => (
                        <div key={q} className="flex items-center space-x-2">
                          <span className="w-4 text-slate-500">Q{q}.</span>
                          <div className="flex space-x-1">
                            {['A', 'B', 'C', 'D'].map(opt => (
                              <div
                                key={opt}
                                className={`w-4 h-3 rounded-[2px] flex items-center justify-center text-[7px] font-bold border ${
                                  opt === 'B' 
                                    ? 'bg-slate-900 text-white border-slate-900' 
                                    : 'border-slate-300 text-slate-400'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subjective Box */}
                    <div className="mt-2 p-2 border border-dashed border-slate-400 rounded bg-slate-50 text-[7px] text-center text-slate-500">
                      主观题手迹书写框 (自动留 8% 缓冲)
                    </div>
                  </div>
                </div>

                {/* Viewfinder Status Overlay UI */}
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/90 z-20 font-mono">
                  <div className="flex items-center space-x-1.5 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>角度：{shootingAngle}° {isAngleGood ? '(垂直优)' : isAngleAcceptable ? '(可用)' : '(过倾)'}</span>
                  </div>

                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                    cornerVisible ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
                  }`}>
                    {cornerVisible ? '✔ 4黑标锁定' : '✖ 黑标出框'}
                  </div>
                </div>

                {/* Bottom Viewfinder Warnings */}
                <div className="absolute bottom-3 left-4 right-4 z-20">
                  {hasLightingIssue && (
                    <div className="bg-amber-950/90 text-amber-200 border border-amber-500/50 p-2 rounded-xl text-[10px] space-y-0.5 backdrop-blur-sm">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>检测到光照隐患提示：</span>
                      </div>
                      <p>
                        {flashEnabled && '强开闪光灯造成中央眩光！请关闭闪光灯。'}
                        {lightingCondition === 'hand_shadow' && '单侧手影遮挡，建议侧方站立微调角度。'}
                        {lightingCondition === 'overhead_glare' && '吸顶灯直射条码反光，建议微斜 3° 避开白斑。'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Phone Bar */}
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
            </div>
          </div>

          {/* Right: Interactive Sliders & Troubleshooting */}
          <div className="lg:col-span-5 space-y-4">
            {/* Interactive Control Sliders */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                互动式调参：模拟不同环境下的拍照动作
              </h3>

              {/* Slider 1: Shooting Angle */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    1. 手机俯拍角度（建议 ≥ 75°）：
                  </span>
                  <span className={`font-mono font-bold ${
                    isAngleGood ? 'text-emerald-600' : isAngleAcceptable ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {shootingAngle}° {shootingAngle === 90 ? '(绝对垂直)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="90"
                  value={shootingAngle}
                  onChange={(e) => setShootingAngle(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>60° (过斜·梯形严重)</span>
                  <span>75° (透视校正安全线)</span>
                  <span>90° (平视垂直)</span>
                </div>
              </div>

              {/* Control 2: Lighting & Shadow Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  2. 课桌光照与阴影形态：
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setLightingCondition('diffuse')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      lightingCondition === 'diffuse'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ✔ 侧光/漫反射
                  </button>

                  <button
                    onClick={() => setLightingCondition('hand_shadow')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      lightingCondition === 'hand_shadow'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ⚠️ 手臂投影暗影
                  </button>

                  <button
                    onClick={() => setLightingCondition('overhead_glare')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      lightingCondition === 'overhead_glare'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ✖ 顶灯条码反光
                  </button>
                </div>
              </div>

              {/* Control 3: Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <span className="text-slate-700 dark:text-slate-300">4角黑标完整入镜：</span>
                  <input
                    type="checkbox"
                    checked={cornerVisible}
                    onChange={(e) => setCornerVisible(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <span className="text-slate-700 dark:text-slate-300">强制开启闪光灯：</span>
                  <input
                    type="checkbox"
                    checked={flashEnabled}
                    onChange={(e) => setFlashEnabled(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                </label>
              </div>

              {/* Real-time Guidance Verdict */}
              <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                currentScore >= 90
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : currentScore >= 70
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}>
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  {currentScore >= 90 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  <span>{currentScore >= 90 ? '状态优秀：可直接秒级入闸' : currentScore >= 70 ? '基本合格：算法将自动去阴影/透视拉平' : '风险预警：可能无法顺利过闸'}</span>
                </div>
                <p className="leading-relaxed text-[11px] opacity-90">
                  {currentScore >= 90 && '拍摄垂直、光照柔和、四角黑标清晰定位。系统 OpenCV 透视拉平与条码识别耗时将在 200ms 以内完成！'}
                  {currentScore < 90 && currentScore >= 70 && '存在轻微阴影或倾斜，系统形态学去手影算法与双线性透视校正将自动生效完成修复。'}
                  {currentScore < 70 && '存在黑标丢失、闪光灯大面积眩光或倾斜角过大。极易导致条码校验失败或透视矩阵计算失败，请立即调整！'}
                </p>
              </div>
            </div>

            {/* Quick 3-Second Golden Rule */}
            <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-2">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                教师课桌拍照“三字口诀”：平 · 侧 · 框
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                <strong>【平】</strong>答卷放平，双手握机，视线垂直；<br/>
                <strong>【侧】</strong>侧方光源，手不挡光，严禁开闪光灯；<br/>
                <strong>【框】</strong>4 个黑块全部进框，四周留有一指宽桌面。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Do & Don't Side-by-Side Comparisons */}
      {activeTab === 'do_and_dont' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Comparison 1: Lighting & Hand Shadows */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  技巧 1：光线与手部阴影
                </span>
                <span className="text-[10px] text-slate-400">光照均匀度</span>
              </div>

              {/* Wrong Practice */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
                <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>❌ 错误做法：背光拍摄 / 正上方遮挡</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  身体背对光源，或手机与手臂直接处于答题卡正上方，将浓重手影投射在客观题气泡区。易导致局部二值化将暗影误识别为铅笔填涂。
                </p>
              </div>

              {/* Correct Practice */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2 text-xs">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>✔ 正确做法：侧光站立 / 漫反射均匀</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  面朝窗户或侧对教室光源；双手左右两侧握持手机，使手臂阴影落在桌面外侧，整张答卷光照均匀无反差死角。
                </p>
              </div>
            </div>

            {/* Comparison 2: Angle & Corner Alignment */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-indigo-500" />
                  技巧 2：拍摄角度与四角定位
                </span>
                <span className="text-[10px] text-slate-400">几何完整性</span>
              </div>

              {/* Wrong Practice */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
                <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>❌ 错误做法：斜拍过大 / 手指压住黑标</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  手机与纸张夹角 &lt; 65°，产生严重梯形形变；或者教师按住试卷时手指遮盖了卡面四角实心黑标（Finder Pattern），导致算法无法计算透视矩阵。
                </p>
              </div>

              {/* Correct Practice */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2 text-xs">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>✔ 正确做法：俯拍 ≥75° / 四周留白2cm</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  尽量垂直平视俯拍；屏幕取景框内完整收纳 4 个黑色锚点方块，答题卡四周边沿留出 2~3cm 桌面纯色边距，利于轮廓自动扣取。
                </p>
              </div>
            </div>

            {/* Comparison 3: Anti-Glare & Barcode Clarity */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  技巧 3：防反光白斑与条码对齐
                </span>
                <span className="text-[10px] text-slate-400">考号解码率</span>
              </div>

              {/* Wrong Practice */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
                <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>❌ 错误做法：开启闪光灯 / 顶灯镜面反射</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  在教室日光灯管下方直射拍摄，覆膜条码产生镜面高光白斑；或者近距离开启手机闪光灯，强反光破坏条码黑白条纹对比度，致校验失败。
                </p>
              </div>

              {/* Correct Practice */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2 text-xs">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>✔ 正确做法：关闭闪光灯 / 倾斜3°避反光</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  务必在拍照前关闭闪光灯；若天花板顶灯反光落在条码上，只需稍向前后微倾斜 3~5° 即可错开镜面反射角，条码瞬间清晰解码。
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: Interactive 5-Second Teacher Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                教师课桌连拍 5 秒自检清单 (Checklist)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                在开始批量拍摄全班 30~50 份答题卡前，花 5 秒钟自检当前课桌环境，可使整批试卷 100% 自动过闸，免去后续人工复核改判时间！
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">已达标：</span>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl font-mono font-bold text-sm border border-indigo-200 dark:border-indigo-800">
                {completedCount} / 5 项
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'flat',
                title: '1. 纸张平整无卷角',
                desc: '答题卡平铺在平整课桌上，折叠角已轻抚捋平，四周无笔袋、文具压挡文字。'
              },
              {
                id: 'no_flash',
                title: '2. 手机闪光灯处于关闭状态',
                desc: '确认手机相机处于 Flash OFF 模式，避免纸面中央泛白过曝。'
              },
              {
                id: 'corners_in',
                title: '3. 四角 8mm 黑色方块全部入镜',
                desc: '手机屏幕中完整包含卡面四个角点的定位黑标，手指未压在任何黑块上。'
              },
              {
                id: 'angle_good',
                title: '4. 手机视线大致水平垂直 (≥75°)',
                desc: '站在侧边双手握机，视线俯视卡面，无大仰角，手臂影子未投在客观题气泡上。'
              },
              {
                id: 'no_glare',
                title: '5. 观察条码处无刺眼日光灯白斑',
                desc: '右上角学生条码黑白相间清晰可见，若有反光白斑，轻微移动手机避开直射角度。'
              },
            ].map(item => (
              <div 
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 select-none ${
                  checkedItems[item.id]
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  checkedItems[item.id] ? 'bg-emerald-600 text-white' : 'border border-slate-400 bg-white dark:bg-slate-900'
                }`}>
                  {checkedItems[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-1">
                  <div className={`font-bold text-xs ${
                    checkedItems[item.id] ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Prompt */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-700 dark:text-slate-300">
              <strong className="text-indigo-700 dark:text-indigo-300 block mb-0.5">
                {completedCount === 5 ? '🎉 环境达标！恭喜你已具备 100% 免复核拍摄条件' : '💡 提示：建议勾选全部 5 项以获得最佳 OCR 自动识别效果'}
              </strong>
              <span>可随时返回 OMR 仿真沙盘，测试不同异常答题卡的智能纠错机制。</span>
            </div>

            {onBackToSimulator && (
              <button
                onClick={onBackToSimulator}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <span>立即进入 OMR 沙盘实操</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
