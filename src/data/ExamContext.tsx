import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentExamRecord, ExamQuestion, OMRSimulationCard, AuditLogEntry } from '../types/prd';
import { SAMPLE_EXAM_QUESTIONS, MOCK_STUDENTS } from './mockData';

export interface ExamMetadata {
  id: string;
  title: string;
  subject: string;
  mode: 'item_bank' | 'manual_exam';
  status: 'draft' | 'ready' | 'collecting' | 'grading' | 'reviewing' | 'locked';
  totalScore: number;
  templateId: string;
  audioUrl?: string;
  createdAt: string;
}

interface ExamContextType {
  exam: ExamMetadata;
  questions: ExamQuestion[];
  students: StudentExamRecord[];
  cards: OMRSimulationCard[];
  auditLogs: AuditLogEntry[];
  isLocked: boolean;
  updateExam: (patch: Partial<ExamMetadata>) => void;
  setQuestions: (questions: ExamQuestion[]) => void;
  overrideObjectiveScore: (cardId: string, qNum: number, newOption: string, reason: string) => void;
  submitSubjectiveScore: (studentId: string, questionId: number, score: number, comment?: string, stamps?: string[]) => void;
  lockExam: () => void;
  unlockExam: (adminReason: string) => void;
  resetToDemo: () => void;
  addUploadedCard: (card: OMRSimulationCard) => void;
}

const DEFAULT_EXAM: ExamMetadata = {
  id: 'ex-2026-spring-01',
  title: '2026年春季高二期中外语统考卷 (标准卷 A)',
  subject: 'English',
  mode: 'item_bank',
  status: 'grading',
  totalScore: 100,
  templateId: 'TPL_A4_50Q_V1',
  audioUrl: 'https://actions.google.com/sounds/v1/ambiences/airport_terminal.ogg',
  createdAt: '2026-03-28'
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    examId: 'ex-2026-spring-01',
    timestamp: '2026-03-28 14:32:10',
    operator: '王老师 (英语组备课组长)',
    action: 'SYSTEM_OMR_INIT',
    target: '全卷初始化',
    oldValue: '待解析',
    newValue: '已完成 45 份答题卡本地识别',
    reason: '首批高二年级答题卡手机连拍图像入闸自动批阅'
  }
];

const INITIAL_CARDS: OMRSimulationCard[] = [
  {
    id: 'card-1',
    title: '正常规范答卷 (样例 1: 张子涵)',
    studentName: '张子涵',
    examNo: '202610101',
    status: 'passed',
    statusDesc: '填涂规范，置信度 99.4%，无争议直接入库',
    skewAngle: 1.2,
    barcodeRecognized: true,
    detectedBarcode: '202610101',
    captureCondition: 'normal_phone',
    blurScore: 342.5,
    hasHandShadow: false,
    bubbleRecognitions: [
      { qNum: 1, detected: 'B', fillConfidence: 0.96, expected: 'B', status: 'correct' },
      { qNum: 2, detected: 'A', fillConfidence: 0.94, expected: 'A', status: 'correct' },
      { qNum: 3, detected: 'A', fillConfidence: 0.92, expected: 'A', status: 'correct' },
      { qNum: 4, detected: 'B', fillConfidence: 0.95, expected: 'B', status: 'correct' },
      { qNum: 5, detected: 'B', fillConfidence: 0.88, expected: 'B', status: 'correct' }
    ]
  },
  {
    id: 'card-2',
    title: '复杂光照异常 (样例 2: 李嘉文)',
    studentName: '李嘉文',
    examNo: '202610102',
    status: 'warning_multi',
    statusDesc: '第3题橡皮擦除痕迹明显，算法触发双涂黄色预警，转人工复核',
    skewAngle: 4.8,
    barcodeRecognized: true,
    detectedBarcode: '202610102',
    captureCondition: 'heavy_shadow',
    blurScore: 215.0,
    hasHandShadow: true,
    bubbleRecognitions: [
      { qNum: 1, detected: 'B', fillConfidence: 0.91, expected: 'B', status: 'correct' },
      { qNum: 2, detected: 'A', fillConfidence: 0.89, expected: 'A', status: 'correct' },
      { qNum: 3, detected: 'A,B', fillConfidence: 0.54, expected: 'A', status: 'multi' },
      { qNum: 4, detected: 'B', fillConfidence: 0.93, expected: 'B', status: 'correct' },
      { qNum: 5, detected: 'C', fillConfidence: 0.86, expected: 'B', status: 'wrong' }
    ]
  },
  {
    id: 'card-3',
    title: '倾斜与漏涂 (样例 3: 王晨宇)',
    studentName: '王晨宇',
    examNo: '202610103',
    status: 'warning_leak',
    statusDesc: '纸张旋转 12.5° 已由透视算法拉平，第4题空白漏涂',
    skewAngle: 12.5,
    barcodeRecognized: true,
    detectedBarcode: '202610103',
    captureCondition: 'perspective_tilt',
    blurScore: 198.0,
    hasHandShadow: false,
    bubbleRecognitions: [
      { qNum: 1, detected: 'B', fillConfidence: 0.95, expected: 'B', status: 'correct' },
      { qNum: 2, detected: 'C', fillConfidence: 0.87, expected: 'A', status: 'wrong' },
      { qNum: 3, detected: 'A', fillConfidence: 0.90, expected: 'A', status: 'correct' },
      { qNum: 4, detected: '', fillConfidence: 0.05, expected: 'B', status: 'leak' },
      { qNum: 5, detected: 'B', fillConfidence: 0.91, expected: 'B', status: 'correct' }
    ]
  },
  {
    id: 'card-4',
    title: '条码高光反光 (样例 4: 周晓彤)',
    studentName: '周晓彤',
    examNo: '202610104',
    status: 'error_barcode',
    statusDesc: '顶灯高光导致条码识读失败，自动调取手写准考证切片由教师 1 秒点选绑定',
    skewAngle: 2.1,
    barcodeRecognized: false,
    detectedBarcode: '',
    captureCondition: 'barcode_glare',
    blurScore: 165.0,
    hasHandShadow: false,
    handwrittenSeatNo: '04',
    bubbleRecognitions: [
      { qNum: 1, detected: 'B', fillConfidence: 0.92, expected: 'B', status: 'correct' },
      { qNum: 2, detected: 'A', fillConfidence: 0.95, expected: 'A', status: 'correct' },
      { qNum: 3, detected: 'D', fillConfidence: 0.88, expected: 'A', status: 'wrong' },
      { qNum: 4, detected: 'B', fillConfidence: 0.91, expected: 'B', status: 'correct' },
      { qNum: 5, detected: 'B', fillConfidence: 0.93, expected: 'B', status: 'correct' }
    ]
  }
];

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exam, setExam] = useState<ExamMetadata>(() => {
    const saved = localStorage.getItem('lm_exam');
    return saved ? JSON.parse(saved) : DEFAULT_EXAM;
  });

  const [questions, setQuestionsState] = useState<ExamQuestion[]>(() => {
    const saved = localStorage.getItem('lm_questions');
    return saved ? JSON.parse(saved) : SAMPLE_EXAM_QUESTIONS;
  });

  const [students, setStudents] = useState<StudentExamRecord[]>(() => {
    const saved = localStorage.getItem('lm_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  const [cards, setCards] = useState<OMRSimulationCard[]>(() => {
    const saved = localStorage.getItem('lm_cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('lm_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Save changes to localStorage for persistent teacher trials
  useEffect(() => {
    localStorage.setItem('lm_exam', JSON.stringify(exam));
  }, [exam]);

  useEffect(() => {
    localStorage.setItem('lm_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('lm_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('lm_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('lm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const updateExam = (patch: Partial<ExamMetadata>) => {
    setExam((prev) => ({ ...prev, ...patch }));
  };

  const setQuestions = (newQuestions: ExamQuestion[]) => {
    setQuestionsState(newQuestions);
    const newTotal = newQuestions.reduce((sum, q) => sum + q.score, 0);
    setExam((prev) => ({ ...prev, totalScore: newTotal }));
  };

  const overrideObjectiveScore = (cardId: string, qNum: number, newOption: string, reason: string) => {
    let oldVal = '';
    let targetCard = cards.find(c => c.id === cardId);
    if (targetCard) {
      const q = targetCard.bubbleRecognitions.find(b => b.qNum === qNum);
      oldVal = q?.manualOverride || q?.detected || '未作答';
    }

    // 1. Update Card in Cards array
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedBubbles = c.bubbleRecognitions.map((b) => {
          if (b.qNum !== qNum) return b;
          const isCorrect = newOption === b.expected;
          return {
            ...b,
            manualOverride: newOption,
            status: (isCorrect ? 'correct' : 'wrong') as 'correct' | 'wrong'
          };
        });

        // Recalculate card status if all warnings resolved
        const hasWarning = updatedBubbles.some(b => b.status === 'multi' || b.status === 'leak');
        return {
          ...c,
          status: hasWarning ? c.status : 'passed',
          statusDesc: hasWarning ? c.statusDesc : '已人工改判核准，状态正常',
          bubbleRecognitions: updatedBubbles
        };
      })
    );

    // 2. Update Student Record
    if (targetCard) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.name !== targetCard!.studentName) return s;
          const updatedObj = { ...s.objectiveAnswers, [qNum]: newOption };
          
          // Recalculate objective score
          let newObjScore = 0;
          Object.entries(updatedObj).forEach(([qId, ans]) => {
            const question = questions.find(q => q.id === Number(qId));
            if (question && question.correctAnswer === ans) {
              newObjScore += question.score;
            }
          });

          return {
            ...s,
            objectiveAnswers: updatedObj,
            objectiveScore: Number(newObjScore.toFixed(1)),
            totalScore: Number((newObjScore + s.subjectiveScore).toFixed(1))
          };
        })
      );
    }

    // 3. Write Immutable Audit Log
    const newLog: AuditLogEntry = {
      id: `log-${Date.now().toString().slice(-4)}`,
      examId: exam.id,
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      operator: '王老师 (英语组阅卷教师)',
      action: 'MANUAL_OVERRIDE_OBJECTIVE',
      target: `${targetCard?.studentName || '考生'} - 第 ${qNum} 题`,
      oldValue: oldVal,
      newValue: newOption,
      reason: reason
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const submitSubjectiveScore = (
    studentId: string,
    questionId: number,
    score: number,
    comment: string = '',
    stamps: string[] = []
  ) => {
    let oldScore = 0;
    const student = students.find(s => s.id === studentId);
    if (student) {
      const sub = student.subjectiveAnswers.find(sa => sa.questionId === questionId);
      oldScore = sub?.awardedScore ?? 0;
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        let newSubjectiveTotal = 0;
        const updatedSubAnswers = s.subjectiveAnswers.map((sa) => {
          if (sa.questionId !== questionId) {
            newSubjectiveTotal += sa.awardedScore ?? 0;
            return sa;
          }
          newSubjectiveTotal += score;
          return {
            ...sa,
            awardedScore: score,
            comment: comment || sa.comment,
            annotations: stamps.length ? stamps : sa.annotations,
            gradedAt: new Date().toLocaleTimeString('zh-CN', { hour12: false })
          };
        });

        return {
          ...s,
          subjectiveAnswers: updatedSubAnswers,
          subjectiveScore: Number(newSubjectiveTotal.toFixed(1)),
          totalScore: Number((s.objectiveScore + newSubjectiveTotal).toFixed(1))
        };
      })
    );

    // Audit log if modified
    const newLog: AuditLogEntry = {
      id: `log-${Date.now().toString().slice(-4)}`,
      examId: exam.id,
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      operator: '张老师 (主观题流水阅卷)',
      action: 'SUBMIT_SUBJECTIVE_GRADE',
      target: `${student?.name || '考生'} - 第 ${questionId} 题主观题`,
      oldValue: `${oldScore} 分`,
      newValue: `${score} 分`,
      reason: stamps.join(', ') || comment || '双盲流水批改打分'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const lockExam = () => {
    setExam((prev) => ({ ...prev, status: 'locked' }));
    const newLog: AuditLogEntry = {
      id: `log-${Date.now().toString().slice(-4)}`,
      examId: exam.id,
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      operator: '刘主任 (教务处系统管理员)',
      action: 'LOCK_EXAM_SCORES',
      target: '全卷成绩状态机',
      oldValue: 'reviewing',
      newValue: 'locked',
      reason: '全班答卷批改与异常复核完成，正式终审锁定'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const unlockExam = (adminReason: string) => {
    setExam((prev) => ({ ...prev, status: 'reviewing' }));
    const newLog: AuditLogEntry = {
      id: `log-${Date.now().toString().slice(-4)}`,
      examId: exam.id,
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      operator: '超级管理员 (特批)',
      action: 'UNLOCK_EXAM_SCORES',
      target: '全卷成绩状态机',
      oldValue: 'locked',
      newValue: 'reviewing',
      reason: adminReason
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addUploadedCard = (newCard: OMRSimulationCard) => {
    setCards((prev) => [newCard, ...prev]);
  };

  const resetToDemo = () => {
    localStorage.removeItem('lm_exam');
    localStorage.removeItem('lm_questions');
    localStorage.removeItem('lm_students');
    localStorage.removeItem('lm_cards');
    localStorage.removeItem('lm_audit_logs');
    setExam(DEFAULT_EXAM);
    setQuestionsState(SAMPLE_EXAM_QUESTIONS);
    setStudents(MOCK_STUDENTS);
    setCards(INITIAL_CARDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <ExamContext.Provider
      value={{
        exam,
        questions,
        students,
        cards,
        auditLogs,
        isLocked: exam.status === 'locked',
        updateExam,
        setQuestions,
        overrideObjectiveScore,
        submitSubjectiveScore,
        lockExam,
        unlockExam,
        resetToDemo,
        addUploadedCard
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
