export interface PRDSection {
  id: string;
  number: string;
  title: string;
  badge?: string;
  content: string;
  subsections?: {
    id: string;
    title: string;
    content: string;
    rules?: string[];
  }[];
}

export interface ReviewPoint {
  dimension: '逻辑严密性' | '完整性' | '可执行性' | '安全与风控';
  title: string;
  status: 'passed' | 'warning' | 'enhanced';
  currentBrief: string;
  critique: string;
  brainstormSolution: string;
}

export interface StudentExamRecord {
  id: string;
  examNo: string; // 唯一考号，例如 2026090101
  name: string;
  className: string;
  barcode: string;
  objectiveScore: number;
  subjectiveScore: number;
  totalScore: number;
  status: 'normal' | 'missing' | 'exempt' | 'abnormal';
  abnormalReason?: string;
  objectiveAnswers: Record<number, string>;
  subjectiveAnswers: {
    questionId: number;
    title: string;
    maxScore: number;
    awardedScore: number | null;
    comment: string;
    annotations: string[];
    cropImageUrl: string;
    graderName?: string;
    gradedAt?: string;
  }[];
}

export interface ExamQuestion {
  id: number;
  section: 'listening' | 'vocabulary' | 'grammar' | 'reading' | 'translation' | 'writing';
  type: 'single_choice' | 'cloze' | 'reading_choice' | 'translation' | 'composition';
  stem: string;
  options?: string[];
  correctAnswer: string;
  score: number;
  unit: string;
  knowledgePoint: string;
  difficulty: '基础' | '中等' | '较难';
  audioUrl?: string;
  analysis: string;
}

export interface OMRSimulationCard {
  id: string;
  title: string;
  studentName: string;
  examNo: string;
  status: 'passed' | 'warning_leak' | 'warning_multi' | 'error_barcode' | 'error_skew';
  statusDesc: string;
  skewAngle: number;
  barcodeRecognized: boolean;
  detectedBarcode: string;
  captureCondition?: 'normal_phone' | 'perspective_tilt' | 'heavy_shadow' | 'barcode_glare';
  blurScore?: number; // Laplacian variance e.g. 280 (sharp), 85 (blur warning)
  hasHandShadow?: boolean;
  handwrittenSeatNo?: string;
  bubbleRecognitions: {
    qNum: number;
    detected: string; // e.g. "B", "A,C"
    fillConfidence: number;
    expected: string;
    status: 'correct' | 'wrong' | 'leak' | 'multi';
    manualOverride?: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  examId: string;
  timestamp: string;
  operator: string;
  action: string;
  target: string;
  oldValue: string;
  newValue: string;
  reason: string;
}
