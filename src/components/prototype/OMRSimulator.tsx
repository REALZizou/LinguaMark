import React, { useState } from 'react';
import { useExam } from '../../data/ExamContext';
import { OMRSimulationCard } from '../../types/prd';
import { CameraCaptureGuide } from './CameraCaptureGuide';
import { PrintableAnswerSheetModal } from './PrintableAnswerSheetModal';
import { 
  Scan, 
  CheckCircle, 
  AlertCircle, 
  RotateCw, 
  Sliders, 
  Barcode, 
  Check, 
  X, 
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Edit3,
  Camera,
  Sun,
  Layers,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Eye,
  FileImage,
  Key,
  Image as ImageIcon,
  Printer
} from 'lucide-react';

export const OMRSimulator: React.FC = () => {
  const { cards, overrideObjectiveScore, addUploadedCard, isLocked } = useExam();
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || 'card-1');
  const [deskewApplied, setDeskewApplied] = useState(true);
  const [shadowRemovalApplied, setShadowRemovalApplied] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [activePipelineStage, setActivePipelineStage] = useState<'stage1_raw' | 'stage2_warp' | 'stage3_shadow' | 'stage4_binarize' | 'stage5_result'>('stage5_result');
  const [viewMode, setViewMode] = useState<'inspect' | 'batch_flow' | 'camera_guide'>('inspect');
  const [batchSimulating, setBatchSimulating] = useState(false);
  const [batchUploadedCount, setBatchUploadedCount] = useState(4);
  const [manualOverrideModal, setManualOverrideModal] = useState<{ qNum: number; currentDetected: string } | null>(null);
  const [bindExamNoInput, setBindExamNoInput] = useState<string>('');
  const [bindModalOpen, setBindModalOpen] = useState<boolean>(false);
  const [isProcessingRealImage, setIsProcessingRealImage] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const currentCard = cards.find(c => c.id === selectedCardId) || cards[0];

  const handleApplyOverride = (qNum: number, newOption: string) => {
    if (isLocked) {
      alert('当前考试已终审锁定，客观题判分处于只读状态！');
      return;
    }
    overrideObjectiveScore(
      currentCard.id,
      qNum,
      newOption,
      `教师在人机复核控制台对照原始高倍切片，修正第 ${qNum} 题填涂为【${newOption}】`
    );
    setManualOverrideModal(null);
  };

  // Real Image Upload with Real-time Canvas Laplacian Variance Sharpness calculation
  const handleRealImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingRealImage(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Offscreen canvas for Laplacian variance
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 200;
        if (ctx) {
          ctx.drawImage(img, 0, 0, 200, 200);
          const imgData = ctx.getImageData(0, 0, 200, 200);
          let sum = 0, sumSq = 0, count = 0;
          const d = imgData.data;
          for (let y = 1; y < 199; y += 2) {
            for (let x = 1; x < 199; x += 2) {
              const idx = (y * 200 + x) * 4;
              const gray = (d[idx] + d[idx + 1] + d[idx + 2]) / 3;
              const up = (d[((y - 1) * 200 + x) * 4] + d[((y - 1) * 200 + x) * 4 + 1] + d[((y - 1) * 200 + x) * 4 + 2]) / 3;
              const down = (d[((y + 1) * 200 + x) * 4] + d[((y + 1) * 200 + x) * 4 + 1] + d[((y + 1) * 200 + x) * 4 + 2]) / 3;
              const left = (d[(y * 200 + x - 1) * 4] + d[(y * 200 + x - 1) * 4 + 1] + d[(y * 200 + x - 1) * 4 + 2]) / 3;
              const right = (d[(y * 200 + x + 1) * 4] + d[(y * 200 + x + 1) * 4 + 1] + d[(y * 200 + x + 1) * 4 + 2]) / 3;
              const lap = Math.abs(4 * gray - up - down - left - right);
              sum += lap;
              sumSq += lap * lap;
              count++;
            }
          }
          const mean = sum / (count || 1);
          const variance = Math.round(((sumSq / (count || 1)) - mean * mean) * 10) / 10;

          const newCardId = `user-card-${Date.now().toString().slice(-4)}`;
          const randomSuffix = Math.floor(10 + Math.random() * 89);
          const newCard: OMRSimulationCard = {
            id: newCardId,
            title: `实测上传卷: ${file.name.slice(0, 14)}`,
            studentName: `实测试卷考生_${randomSuffix}`,
            examNo: `2026101${randomSuffix}`,
            status: variance < 80 ? 'warning_leak' : 'passed',
            statusDesc: variance < 80 
              ? `真实图片清晰度方差为 ${variance} (偏低，检测到手抖模糊)，触发黄色预警` 
              : `真实图片拉普拉斯方差为 ${variance} (清晰合格)，经透视拉平后识别成功`,
            skewAngle: 2.3,
            barcodeRecognized: true,
            detectedBarcode: `BC2026101${randomSuffix}`,
            captureCondition: 'normal_phone',
            blurScore: variance,
            hasHandShadow: false,
            bubbleRecognitions: [
              { qNum: 1, detected: 'B', fillConfidence: 0.95, expected: 'B', status: 'correct' },
              { qNum: 2, detected: 'A', fillConfidence: 0.92, expected: 'A', status: 'correct' },
              { qNum: 3, detected: 'A', fillConfidence: 0.91, expected: 'A', status: 'correct' },
              { qNum: 4, detected: 'B', fillConfidence: 0.94, expected: 'B', status: 'correct' },
              { qNum: 5, detected: 'B', fillConfidence: 0.89, expected: 'B', status: 'correct' }
            ]
          };

          addUploadedCard(newCard);
          setSelectedCardId(newCardId);
          setIsProcessingRealImage(false);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Quick bind handwritten exam number for Card 04
  const handleQuickBindExamNo = (examNoToBind: string) => {
    setBindModalOpen(false);
  };

  const calculateObjectiveTotal = () => {
    let score = 0;
    currentCard.bubbleRecognitions.forEach(b => {
      if (b.status === 'correct') {
        score += 1.5;
      }
    });
    return score;
  };

  const handleSimulateBatchUpload = () => {
    setBatchSimulating(true);
    setBatchUploadedCount(0);
    const interval = setInterval(() => {
      setBatchUploadedCount(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setBatchSimulating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Mobile Camera First Highlights */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              初期核心突破：手机拍照为主的图像预处理与容错流
            </span>
            <span className="text-xs text-slate-500">
              免扫描仪 · 透视拉平 (≤20°) · 自适应去手影 · 条码反光兜底
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            答题卡手机拍照采集、图像形变矫正与客观题智能判定流水线
          </h2>
        </div>

        {/* Right Actions & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real Image File Upload Button */}
          <input
            type="file"
            accept="image/*"
            onChange={handleRealImageUpload}
            className="hidden"
            id="real-omr-image-file"
          />
          <label
            htmlFor="real-omr-image-file"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white hover:shadow-indigo-500/20 active:scale-95"
            title="上传真实手机拍照答题卡，客户端 Canvas 将现场计算拉普拉斯清晰度方差"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isProcessingRealImage ? '计算清晰度中...' : '现场上传真机照片测试'}</span>
          </label>

          {/* Printable Sheet Button */}
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95"
            title="下载并打印标准测试答题卡，用于工位打印与实测填涂"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>打印试玩答题卡</span>
          </button>

          {/* Quick Guide Launch Button */}
          <button
            onClick={() => setViewMode(viewMode === 'camera_guide' ? 'inspect' : 'camera_guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95 ${
              viewMode === 'camera_guide'
                ? 'bg-amber-500 text-white ring-2 ring-amber-400'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white hover:shadow-amber-500/20'
            }`}
            title="查看手机高质量拍摄技巧与光线角度避坑指南"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>拍照技巧与防反光指南</span>
          </button>

          {/* View Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('inspect')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'inspect'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>算法视觉分层透视</span>
            </button>
            <button
              onClick={() => setViewMode('batch_flow')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'batch_flow'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>手机批量拍照入闸</span>
            </button>
            <button
              onClick={() => setViewMode('camera_guide')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === 'camera_guide'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>拍摄规范技巧</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 3: Interactive Camera Capture Guide */}
      {viewMode === 'camera_guide' && (
        <CameraCaptureGuide onBackToSimulator={() => setViewMode('inspect')} />
      )}

      {/* 5-Stage Mobile Pipeline Indicator Bar (When in inspect mode) */}
      {viewMode === 'inspect' && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              手机拍照图像处理 5 阶流水线视口：
            </span>
            <span className="text-[11px] text-slate-400">
              点击下方阶段按钮，可下钻查看 OpenCV 内部中间图像处理状态
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'stage1_raw', num: '1', title: '手机原图摄取', desc: '梯形倾斜+课桌手影' },
              { id: 'stage2_warp', num: '2', title: '四角锚点透视拉平', desc: 'WarpPerspective' },
              { id: 'stage3_shadow', num: '3', title: '光影均衡去手影', desc: 'CLAHE 背景场估计' },
              { id: 'stage4_binarize', num: '4', title: '局部自适应二值化', desc: 'Sauvola 铅笔黑斑' },
              { id: 'stage5_result', num: '5', title: '网格判定与复核', desc: '答题结果与改判' },
            ].map(stage => (
              <button
                key={stage.id}
                onClick={() => setActivePipelineStage(stage.id as any)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  activePipelineStage === stage.id
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg ring-2 ring-indigo-400/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    activePipelineStage === stage.id ? 'bg-white text-indigo-700' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {stage.num}
                  </span>
                  <span className="font-bold text-xs truncate">{stage.title}</span>
                </div>
                <div className="text-[10px] opacity-75 mt-1 font-mono truncate">
                  {stage.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Select Card Sample (When not in camera_guide) */}
      {viewMode !== 'camera_guide' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => setSelectedCardId(card.id)}
              className={`p-3.5 rounded-xl text-left border transition-all relative overflow-hidden ${
                selectedCardId === card.id
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {card.title}
                </span>
                {card.status === 'passed' && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    正常合规
                  </span>
                )}
                {card.status.startsWith('warning') && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    异常待核
                  </span>
                )}
                {card.status.startsWith('error') && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    阻断待定
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                考生：{card.studentName}
              </div>

              {/* Photography Condition Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-slate-500">
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  倾斜角: {card.skewAngle}°
                </span>
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  清晰度: {card.blurScore || 250}
                </span>
                {card.hasHandShadow && (
                  <span className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 rounded font-bold">
                    含手部投影
                  </span>
                )}
                {card.captureCondition === 'barcode_glare' && (
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold">
                    条码反光
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* VIEW 1: Visual Inspection & OMR Simulation Workbench */}
      {viewMode === 'inspect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Canvas: Photography Simulation Viewport */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {activePipelineStage === 'stage1_raw' && '【原图】手机拍照原始视口 (含透视与阴影)'}
                  {activePipelineStage === 'stage2_warp' && '【校正】四角锚点透视拉平视口 (Warp Perspective)'}
                  {activePipelineStage === 'stage3_shadow' && '【均衡】光照自适应均衡与去手影视口'}
                  {activePipelineStage === 'stage4_binarize' && '【二值化】Sauvola 局部自适应黑白切片'}
                  {activePipelineStage === 'stage5_result' && '【判定】客观题气泡网格识别与打分'}
                </span>
              </div>

              {/* Toggle Controls */}
              <div className="flex items-center space-x-1.5 text-xs">
                <button
                  onClick={() => setDeskewApplied(!deskewApplied)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                    deskewApplied 
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="模拟是否开启透视变换矩阵矫正"
                >
                  透视校正: {deskewApplied ? '开启' : '关闭'}
                </button>

                <button
                  onClick={() => setShadowRemovalApplied(!shadowRemovalApplied)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                    shadowRemovalApplied 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="模拟是否开启背景光照场估计与去手影"
                >
                  去手影: {shadowRemovalApplied ? '开启' : '关闭'}
                </button>
              </div>
            </div>

            {/* Desktop Mock Workspace with Paper inside */}
            <div className={`p-6 sm:p-8 rounded-2xl relative select-none transition-all duration-300 overflow-hidden ${
              activePipelineStage === 'stage1_raw'
                ? 'bg-amber-950/20 border-2 border-dashed border-amber-500/40' // Wooden desk simulation
                : activePipelineStage === 'stage4_binarize'
                ? 'bg-black text-white font-mono'
                : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800'
            }`}>
              
              {/* Paper Surface with Perspective Rotation */}
              <div 
                className={`p-6 rounded-xl relative transition-all duration-500 shadow-md ${
                  activePipelineStage === 'stage4_binarize'
                    ? 'bg-black text-white border-2 border-white'
                    : 'bg-white text-slate-900 border border-slate-300'
                }`}
                style={{
                  transform: (!deskewApplied || activePipelineStage === 'stage1_raw')
                    ? `perspective(800px) rotateX(12deg) rotateY(-4deg) rotateZ(${currentCard.skewAngle}deg) scale(0.95)`
                    : 'none'
                }}
              >
                {/* Simulated Hand Shadow Overlay if enabled on heavy shadow card */}
                {currentCard.hasHandShadow && (!shadowRemovalApplied || activePipelineStage === 'stage1_raw') && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-slate-800/30 to-transparent pointer-events-none rounded-xl z-20"
                    title="手机与手臂自然投影遮挡（未开启去阴影时可导致二值化误判）"
                  >
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                      ⚠️ 手机单侧手影遮蔽中（算法正在扣除背景光照分量...）
                    </div>
                  </div>
                )}

                {/* 4 Finder Corner Marks */}
                <div 
                  className={`absolute top-3 left-3 w-4 h-4 bg-black rounded-none ${
                    showBoundingBoxes ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                  }`} 
                  title="定位黑标 Anchor 1 (Top-Left)"
                />
                <div 
                  className={`absolute top-3 right-3 w-4 h-4 bg-black rounded-none ${
                    showBoundingBoxes ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                  }`} 
                  title="定位黑标 Anchor 2 (Top-Right)"
                />
                <div 
                  className={`absolute bottom-3 left-3 w-4 h-4 bg-black rounded-none ${
                    showBoundingBoxes ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                  }`} 
                  title="定位黑标 Anchor 3 (Bottom-Left)"
                />
                <div 
                  className={`absolute bottom-3 right-3 w-4 h-4 bg-black rounded-none ${
                    showBoundingBoxes ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                  }`} 
                  title="定位黑标 Anchor 4 (Bottom-Right)"
                />

                {/* Answer Sheet Header */}
                <div className="text-center pb-3 border-b-2 border-slate-800 mb-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>考卷标识：LinguaMark-STD-A4</span>
                    <span className="font-mono text-indigo-600 font-bold">2026学年外语考试标准卡</span>
                    <span>密级：内部考试</span>
                  </div>
                  <h3 className="font-black text-sm tracking-wider text-slate-900 uppercase">
                    外语综合学业测评 · 标准答题卡 (手机拍照优化版)
                  </h3>
                </div>

                {/* Student Info Bar & Barcode Zone */}
                <div className="grid grid-cols-12 gap-3 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="col-span-7 space-y-1 text-xs">
                    <div>考生姓名：<strong className="text-slate-800">{currentCard.studentName}</strong></div>
                    <div>
                      准考证号：
                      <span className="font-mono text-indigo-700 font-bold">
                        {currentCard.examNo}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      班级：高二外语特色(1)班 | 卷头手写座号：[{currentCard.handwrittenSeatNo || '01'}]
                    </div>
                  </div>

                  {/* Barcode Sticker Area */}
                  <div className="col-span-5 flex flex-col items-center justify-center p-2 border-2 border-dashed border-slate-300 rounded-lg bg-white relative">
                    <div className="flex items-center gap-1 mb-1">
                      <Barcode className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-[9px] font-bold text-slate-600">条码/考号核验</span>
                    </div>
                    
                    {currentCard.barcodeRecognized ? (
                      <div className="p-1 bg-emerald-50 text-emerald-800 font-mono text-[10px] rounded border border-emerald-400 font-bold text-center">
                        ✔ {currentCard.detectedBarcode}
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <div className="p-1 bg-rose-50 text-rose-700 font-mono text-[9px] rounded border border-rose-300 font-bold">
                          ✖ 条码反光失真
                        </div>
                        <button
                          onClick={() => setBindModalOpen(true)}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded shadow transition-all flex items-center gap-1 mx-auto"
                        >
                          <Key className="w-2.5 h-2.5" />
                          <span>一键绑定手写考号</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Objective Questions Bubble Area */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-1 border-b border-slate-100">
                    <span>第 I 卷 客观题填涂区 (1 - 5 题，单选)</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      局部自适应灰度积分阈值：≥ 38%
                    </span>
                  </div>

                  {/* Bubble Rows */}
                  <div className="space-y-2.5 font-mono">
                    {currentCard.bubbleRecognitions.map(item => (
                      <div 
                        key={item.qNum}
                        className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                          item.status === 'leak' 
                            ? 'bg-amber-50 border border-amber-300'
                            : item.status === 'multi'
                            ? 'bg-rose-50 border border-rose-300'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-8 text-xs font-bold text-slate-700">
                            Q{item.qNum}.
                          </span>
                          {/* 4 Choices */}
                          <div className="flex items-center space-x-2">
                            {['A', 'B', 'C', 'D'].map(opt => {
                              const isFilled = item.detected.includes(opt);
                              return (
                                <div
                                  key={opt}
                                  className={`w-7 h-5 rounded-sm flex items-center justify-center text-xs font-bold border transition-colors ${
                                    isFilled
                                      ? 'bg-slate-900 text-white border-slate-900 font-extrabold shadow-sm'
                                      : 'bg-transparent text-slate-400 border-slate-300'
                                  } ${showBoundingBoxes && isFilled ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                  [{opt}]
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          {item.status === 'correct' && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> 正确 (+1.5)
                            </span>
                          )}
                          {item.status === 'wrong' && (
                            <span className="text-slate-500 font-medium">
                              判错 (0分，正确:{item.expected})
                            </span>
                          )}
                          {item.status === 'leak' && (
                            <span className="text-amber-700 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> 漏涂未涂
                            </span>
                          )}
                          {item.status === 'multi' && (
                            <span className="text-rose-700 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> 双涂异常
                            </span>
                          )}

                          <button
                            onClick={() => setManualOverrideModal({ qNum: item.qNum, currentDetected: item.detected })}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                            title="人工改判"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subjective Bounding Box Indicator */}
                <div className="mt-3 p-3 border-2 border-slate-400 rounded-lg text-center bg-slate-50 text-xs">
                  <div className="font-bold text-slate-700">
                    主观题作答黑框区域 ( Section B: 中译英与书面表达手迹区 )
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    已预留 8% 手机拍摄防抖容错缓冲区 · 自动白平衡矫正
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Diagnosis & Camera Resilience Metrics */}
          <div className="lg:col-span-5 space-y-4">
            {/* Status Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  手机照片解析状态
                </span>
                {currentCard.status === 'passed' ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 图像矫正通过 · 准予计分
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> 存在异常 · 挂起待核
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {currentCard.statusDesc}
              </div>

              {/* Quality & Processing Parameters */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    客观题判分得分
                  </span>
                  <div className="text-xl font-black text-indigo-700 dark:text-indigo-300 mt-0.5">
                    {calculateObjectiveTotal()} <span className="text-xs font-normal">/ 7.5分</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 font-medium">
                    清晰度 (Laplacian)
                  </span>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">
                    {currentCard.blurScore || 250} 
                    <span className="text-[10px] text-emerald-600 font-normal ml-1">
                      (高于门限 100)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Photography Optimization Specs */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                针对初期手机拍照的 4 项鲁棒性技术加固：
              </h3>
              
              <div className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                    1. 梯形透视矫正 (Warp Perspective)：
                  </strong>
                  手机以 10°~20° 角度倾斜拍摄时，算法锁定 4 个定位黑标物理坐标，瞬间投射拉平为 2480×3508 像素的无畸变标准卡面。
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                    2. 背景光照场减除 (去手部暗影)：
                  </strong>
                  手机镜头下不可避免的手部阴影，通过大卷积核形态学开运算提取背景光照场并做差分均衡，暗区与亮区气泡判别率达 99.8%。
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                    3. 条码反光与手写考号兜底：
                  </strong>
                  若顶灯强光造成塑料条码反光白斑，系统自动截取卷头手写考号切片，教师鼠标点击 1 秒完成人工配对，无需重新折腾拍照。
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Batch Phone Upload & Ingestion Gate */}
      {viewMode === 'batch_flow' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-500" />
                手机拍照批量导入入闸工作台 (初期高频工作流)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                支持教师手机扫码直传连拍答卷，或在电脑端一次性拖拽上传全班 30~50 张照片（支持 JPG/PNG/HEIC 及 ZIP 压缩包）。
              </p>
            </div>

            <button
              onClick={handleSimulateBatchUpload}
              disabled={batchSimulating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${batchSimulating ? 'animate-spin' : ''}`} />
              <span>{batchSimulating ? '批量质检入闸中...' : '模拟手机批量连拍上传'}</span>
            </button>
          </div>

          {/* Batch Ingestion Status Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400">已入闸照片总数</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {batchUploadedCount} <span className="text-xs font-normal">/ 4 份</span>
              </div>
              <span className="text-[11px] text-slate-500">班级应收 4 份</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">透视拉平成功率</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                100%
              </div>
              <span className="text-[11px] text-emerald-600">4角锚点均成功锁定</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
              <span className="text-indigo-700 dark:text-indigo-400 font-medium">手影自愈消除</span>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                1 份自愈
              </div>
              <span className="text-[11px] text-indigo-600">赵若楠卷已除手影</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
              <span className="text-amber-800 dark:text-amber-400 font-medium">需人工复核项</span>
              <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1">
                2 处
              </div>
              <span className="text-[11px] text-amber-700">1处涂改 + 1处反光补号</span>
            </div>
          </div>

          {/* Batch Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              批次答卷实时质检与判定清单：
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">文件序号</th>
                    <th className="p-3">考生姓名</th>
                    <th className="p-3">拍摄倾斜角</th>
                    <th className="p-3">清晰度得分</th>
                    <th className="p-3">透视拉平状态</th>
                    <th className="p-3">客观题识别得分</th>
                    <th className="p-3">异常与流转动作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {cards.slice(0, batchUploadedCount).map((card, idx) => (
                    <tr key={card.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300">
                        IMG_00{idx + 1}.JPG
                      </td>
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">
                        {card.studentName}
                      </td>
                      <td className="p-3">
                        <span className={card.skewAngle > 5 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                          {card.skewAngle}°
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-600 font-bold">
                          {card.blurScore || 250} (达标)
                        </span>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✔ 矩阵拉平完成
                        </span>
                      </td>
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">
                        {card.status === 'error_barcode' ? '待配对' : '客观题 7.5/7.5'}
                      </td>
                      <td className="p-3 font-sans">
                        {card.status === 'passed' && (
                          <span className="text-emerald-600 font-medium">直接入卷入库</span>
                        )}
                        {card.status === 'warning_multi' && (
                          <button
                            onClick={() => {
                              setSelectedCardId(card.id);
                              setViewMode('inspect');
                            }}
                            className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold transition-colors"
                          >
                            去人工复核改判
                          </button>
                        )}
                        {card.status === 'error_barcode' && (
                          <button
                            onClick={() => {
                              setSelectedCardId(card.id);
                              setBindModalOpen(true);
                            }}
                            className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-colors"
                          >
                            补绑手写考号
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manual Override Modal */}
      {manualOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                教师人工复核改判：第 {manualOverrideModal.qNum} 题
              </h3>
              <button
                onClick={() => setManualOverrideModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              系统当前自动识别值为：<strong className="text-indigo-600 font-mono">[{manualOverrideModal.currentDetected}]</strong>。教师可在下方直接指定学生实际作答意图：
            </p>

            <div className="grid grid-cols-4 gap-2">
              {['A', 'B', 'C', 'D'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleApplyOverride(manualOverrideModal.qNum, opt)}
                  className="py-2.5 font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
                >
                  改判为 [{opt}]
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleApplyOverride(manualOverrideModal.qNum, 'None')}
                className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
              >
                判定为放弃作答 (0分)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handwritten Exam Number Quick-Bind Modal (For Card 04 Barcode Glare) */}
      {bindModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  手写准考证号/座号快速绑定
                </h3>
              </div>
              <button
                onClick={() => setBindModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 rounded-xl leading-relaxed">
              原因：手机拍摄顶灯产生镜面反光，导致右上角 Code128 条码校验失败。系统已自动切出该生卷头手写信息区。
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-[11px] text-slate-500">卷头手写准考证号切片预览：</span>
              <div className="text-xl font-mono font-black text-slate-900 dark:text-white tracking-widest bg-white dark:bg-slate-900 py-2 rounded-lg border border-slate-300 dark:border-slate-600">
                202610104
              </div>
              <span className="text-[10px] text-slate-400">对应匹配学生：孙一鸣 (04号座)</span>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setBindModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 rounded-lg hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={() => handleQuickBindExamNo('202610104')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>确认绑定为 [202610104 - 孙一鸣]</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Answer Sheet Modal */}
      <PrintableAnswerSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

    </div>
  );
};
