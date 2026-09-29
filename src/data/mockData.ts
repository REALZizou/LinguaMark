import { ExamQuestion, StudentExamRecord, OMRSimulationCard } from '../types/prd';

export const SAMPLE_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    section: 'listening',
    type: 'single_choice',
    stem: 'Listen to the short dialogue. What time will the flight depart according to the announcement?',
    options: ['A. At 14:15', 'B. At 14:45', 'C. At 15:30', 'D. At 16:00'],
    correctAnswer: 'B',
    score: 1.5,
    unit: 'Unit 3 Travel & Transportation',
    knowledgePoint: '听力信息捕获 / 时间与转折词辨析',
    difficulty: '基础',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/airport_terminal.ogg',
    analysis: '对话中先提到原定航班 14:15，后广播通知延误半小时至 14:45 登机起飞。关键词辨析 "delayed by 30 minutes"。'
  },
  {
    id: 2,
    section: 'listening',
    type: 'single_choice',
    stem: 'Why did the speaker recommend the second hotel?',
    options: ['A. It is closer to the conference venue.', 'B. It offers free shuttle service.', 'C. It provides cheaper group discounts.', 'D. It has quieter rooms.'],
    correctAnswer: 'A',
    score: 1.5,
    unit: 'Unit 3 Travel & Transportation',
    knowledgePoint: '听力事实推理 / 因果关系表达',
    difficulty: '中等',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/airport_terminal.ogg',
    analysis: '录音中明确指出："The second one is merely a 5-minute walk to the convention hall, saving us massive commute time."'
  },
  {
    id: 3,
    section: 'grammar',
    type: 'single_choice',
    stem: 'Hardly ______ the presentation when the power suddenly went out.',
    options: ['A. had he started', 'B. he had started', 'C. did he start', 'D. would he start'],
    correctAnswer: 'A',
    score: 1.5,
    unit: 'Unit 5 Advanced Grammar',
    knowledgePoint: '否定词放句首的部分倒装与过去完成时',
    difficulty: '较难',
    analysis: 'Hardly... when... 固定句型，表示“一……就……”。否定副词 Hardly 置于句首，主句须采用部分倒装，且动作发生在过去之前，用过去完成时 had + 主语 + done。'
  },
  {
    id: 4,
    section: 'vocabulary',
    type: 'single_choice',
    stem: 'The research team made a _______ discovery that could revolutionize foreign language acquisition methodologies.',
    options: ['A. superficial', 'B. breakthrough', 'C. ambiguous', 'D. tedious'],
    correctAnswer: 'B',
    score: 1.5,
    unit: 'Unit 6 Academic Discourse',
    knowledgePoint: '学术核心词汇与修饰搭配',
    difficulty: '中等',
    analysis: 'breakthrough 表示“突破性的”，修饰 discovery 正确。superficial 肤浅的，ambiguous 模棱两可的，tedious 沉闷乏味的，均不符合语境褒义逻辑。'
  },
  {
    id: 5,
    section: 'reading',
    type: 'single_choice',
    stem: 'What is the author’s primary attitude toward relying exclusively on automated language translation tools?',
    options: ['A. Fully optimistic', 'B. Cautiously skeptical', 'C. Strongly indifferent', 'D. Unconditionally hostile'],
    correctAnswer: 'B',
    score: 2.0,
    unit: 'Unit 7 Cultural Communication',
    knowledgePoint: '阅读主旨与作者情感态度推断',
    difficulty: '较难',
    analysis: '文章末段提到机器翻译虽提升效率，但在跨文化语用和语境细微差别（nuance）上存在严重硬伤，因此持审慎怀疑（cautiously skeptical）态度。'
  },
  {
    id: 6,
    section: 'translation',
    type: 'translation',
    stem: '【中译英】只有掌握了扎实的语法基础，学生才能更流利、准确地进行跨文化学术交流。（要求使用倒装句）',
    correctAnswer: 'Only when students master a solid grammatical foundation can they communicate across cultures fluently and accurately.',
    score: 5.0,
    unit: 'Unit 8 Translation & Syntax',
    knowledgePoint: 'Only + 状语从句置于句首的部分倒装 / 词汇搭配',
    difficulty: '较难',
    analysis: '得分点：1. Only when 引导条件从句且主句部分倒装 can they... (2分)；2. 掌握扎实语法基础 master a solid grammatical foundation (1.5分)；3. 跨文化交流 communicate across cultures fluently (1.5分)。'
  },
  {
    id: 7,
    section: 'writing',
    type: 'composition',
    stem: '【书面表达 (15分)】请结合你自身的外语学习经历，写一篇 120-150 词的短文，探讨“刻意背诵与真实语境沉浸”对语言习得的不同影响。',
    correctAnswer: '【评分维度】内容要点(5分)、语言语法准确度(4分)、词汇句式多样性(3分)、篇章结构与连贯(3分)。',
    score: 15.0,
    unit: 'Unit 9 Academic Writing',
    knowledgePoint: '议论文写作 / 论据阐述 / 逻辑连接词运用',
    difficulty: '较难',
    analysis: '重点考查：有无明确的主题句（Topic Sentence）、是否形成对比论证、是否存在常见谓语动词拼写与时态错误。'
  }
];

export const MOCK_STUDENTS: StudentExamRecord[] = [
  {
    id: 'std_01',
    examNo: '202610101',
    name: '陈思宇 (Chen Siyu)',
    className: '高二外语特色(1)班',
    barcode: 'BC202610101',
    objectiveScore: 8.0,
    subjectiveScore: 17.5,
    totalScore: 25.5,
    status: 'normal',
    objectiveAnswers: { 1: 'B', 2: 'A', 3: 'A', 4: 'B', 5: 'B' },
    subjectiveAnswers: [
      {
        questionId: 6,
        title: '第6题：中译英倒装句 (5分)',
        maxScore: 5.0,
        awardedScore: 4.5,
        comment: '倒装结构正确，个别拼写细微瑕疵。',
        annotations: ['倒装结构准确', '扎实表达得体'],
        cropImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        graderName: '张老师 (高级教师)',
        gradedAt: '2026-09-24 10:14'
      },
      {
        questionId: 7,
        title: '第7题：议论文写作 (15分)',
        maxScore: 15.0,
        awardedScore: 13.0,
        comment: '论证层次清晰，从背诵到实际交流过渡自然，高级词汇运用恰当。',
        annotations: ['论据充分', '句式多样+1', '连接词流畅'],
        cropImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
        graderName: '李老师 (教研组长)',
        gradedAt: '2026-09-24 10:35'
      }
    ]
  },
  {
    id: 'std_02',
    examNo: '202610102',
    name: '林浩轩 (Lin Haoxuan)',
    className: '高二外语特色(1)班',
    barcode: 'BC202610102',
    objectiveScore: 4.5,
    subjectiveScore: 12.0,
    totalScore: 16.5,
    status: 'abnormal',
    abnormalReason: '第4题涂卡漏涂；第5题双涂干扰，经人工复核改判。',
    objectiveAnswers: { 1: 'B', 2: 'C', 3: 'B', 4: '', 5: 'B' },
    subjectiveAnswers: [
      {
        questionId: 6,
        title: '第6题：中译英倒装句 (5分)',
        maxScore: 5.0,
        awardedScore: 3.0,
        comment: '忘记倒装助动词提前，Only when从句未形成倒装。扣2分。',
        annotations: ['倒装语序错误-2分', '词汇拼写合格'],
        cropImageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
        graderName: '张老师 (高级教师)',
        gradedAt: '2026-09-24 10:19'
      },
      {
        questionId: 7,
        title: '第7题：议论文写作 (15分)',
        maxScore: 15.0,
        awardedScore: 9.0,
        comment: '字数偏少约90词，第三人称单数动词有2处未变位。',
        annotations: ['字数偏少', '语法时态错误-1', '逻辑尚可'],
        cropImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
        graderName: '李老师 (教研组长)',
        gradedAt: '2026-09-24 10:42'
      }
    ]
  },
  {
    id: 'std_03',
    examNo: '202610103',
    name: '王紫涵 (Wang Zihan)',
    className: '高二外语特色(1)班',
    barcode: 'BC202610103',
    objectiveScore: 6.5,
    subjectiveScore: null as any,
    totalScore: 6.5,
    status: 'normal',
    objectiveAnswers: { 1: 'B', 2: 'A', 3: 'C', 4: 'B', 5: 'B' },
    subjectiveAnswers: [
      {
        questionId: 6,
        title: '第6题：中译英倒装句 (5分)',
        maxScore: 5.0,
        awardedScore: null,
        comment: '',
        annotations: [],
        cropImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80'
      },
      {
        questionId: 7,
        title: '第7题：议论文写作 (15分)',
        maxScore: 15.0,
        awardedScore: null,
        comment: '',
        annotations: [],
        cropImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'std_04',
    examNo: '202610104',
    name: '周逸飞 (Zhou Yifei)',
    className: '高二外语特色(1)班',
    barcode: 'BC202610104',
    objectiveScore: 0,
    subjectiveScore: 0,
    totalScore: 0,
    status: 'missing',
    abnormalReason: '病假缺考，答题卡未回收，标记缺考。',
    objectiveAnswers: {},
    subjectiveAnswers: []
  }
];

export const MOCK_OMR_CARDS: OMRSimulationCard[] = [
  {
    id: 'card_001',
    title: '手机拍照样本 01 (规范俯拍)',
    studentName: '陈思宇 (Chen Siyu)',
    examNo: '202610101',
    status: 'passed',
    statusDesc: '【手机拍照正常流】四角黑标捕获完整，倾斜角 0.8° 透视已自动拉平，Laplacian 清晰度评分 285 (优秀)，条码解码成功，5道客观题全部判定。',
    skewAngle: 0.8,
    barcodeRecognized: true,
    detectedBarcode: 'BC202610101',
    captureCondition: 'normal_phone',
    blurScore: 285,
    hasHandShadow: false,
    handwrittenSeatNo: '01',
    bubbleRecognitions: [
      { qNum: 1, detected: 'B', fillConfidence: 0.98, expected: 'B', status: 'correct' },
      { qNum: 2, detected: 'A', fillConfidence: 0.95, expected: 'A', status: 'correct' },
      { qNum: 3, detected: 'A', fillConfidence: 0.92, expected: 'A', status: 'correct' },
      { qNum: 4, detected: 'B', fillConfidence: 0.96, expected: 'B', status: 'correct' },
      { qNum: 5, detected: 'B', fillConfidence: 0.91, expected: 'B', status: 'correct' }
    ]
  },
  {
    id: 'card_002',
    title: '手机拍照样本 02 (异常：漏涂+多涂)',
    studentName: '林浩轩 (Lin Haoxuan)',
    examNo: '202610102',
    status: 'warning_multi',
    statusDesc: '【填涂异常预警】手机图像校正成功。第4题未填涂(填涂率仅12%)，第5题涂改不彻底(B/C填涂率均超70%)，已触发黄色预警待教师复核。',
    skewAngle: 2.1,
    barcodeRecognized: true,
    detectedBarcode: 'BC202610102',
    captureCondition: 'normal_phone',
    blurScore: 240,
    hasHandShadow: false,
    handwrittenSeatNo: '02',
    bubbleRecognitions: [
      { qNum: 1, detected: 'B', fillConfidence: 0.94, expected: 'B', status: 'correct' },
      { qNum: 2, detected: 'C', fillConfidence: 0.88, expected: 'A', status: 'wrong' },
      { qNum: 3, detected: 'B', fillConfidence: 0.89, expected: 'A', status: 'wrong' },
      { qNum: 4, detected: 'None', fillConfidence: 0.12, expected: 'B', status: 'leak' },
      { qNum: 5, detected: 'B,C', fillConfidence: 0.76, expected: 'B', status: 'multi' }
    ]
  },
  {
    id: 'card_003',
    title: '手机拍照样本 03 (大倾斜角 + 手机阴影)',
    studentName: '赵若楠 (Zhao Ruonan)',
    examNo: '202610105',
    status: 'passed',
    statusDesc: '【抗干扰算法自愈】手机俯角倾斜 12.5° 且右下方受手机手部投影遮挡。经 WarpPerspective 透视变换与背景光照均化 (CLAHE) 算法自适应去阴影拉平，成功无误提取。',
    skewAngle: 12.5,
    barcodeRecognized: true,
    detectedBarcode: 'BC202610105',
    captureCondition: 'heavy_shadow',
    blurScore: 210,
    hasHandShadow: true,
    handwrittenSeatNo: '05',
    bubbleRecognitions: [
      { qNum: 1, detected: 'A', fillConfidence: 0.84, expected: 'B', status: 'wrong' },
      { qNum: 2, detected: 'A', fillConfidence: 0.91, expected: 'A', status: 'correct' },
      { qNum: 3, detected: 'A', fillConfidence: 0.89, expected: 'A', status: 'correct' },
      { qNum: 4, detected: 'C', fillConfidence: 0.82, expected: 'B', status: 'wrong' },
      { qNum: 5, detected: 'B', fillConfidence: 0.88, expected: 'B', status: 'correct' }
    ]
  },
  {
    id: 'card_004',
    title: '手机拍照样本 04 (条码反光 ➔ 手写考号兜底)',
    studentName: '孙一鸣 (Sun Yiming)',
    examNo: '待人工对齐 (手写准考证: 202610104)',
    status: 'error_barcode',
    statusDesc: '【反光降级兜底】手机顶灯导致不干胶条码出现高光白斑解码失败。系统自动切出学生手写考号区域，支持教师 1 秒点选绑定考号，无需重新拍照。',
    skewAngle: 1.4,
    barcodeRecognized: false,
    detectedBarcode: 'BARCODE_GLARE_FAIL (条码反光白斑)',
    captureCondition: 'barcode_glare',
    blurScore: 260,
    hasHandShadow: false,
    handwrittenSeatNo: '04',
    bubbleRecognitions: [
      { qNum: 1, detected: 'B', fillConfidence: 0.95, expected: 'B', status: 'correct' },
      { qNum: 2, detected: 'A', fillConfidence: 0.94, expected: 'A', status: 'correct' },
      { qNum: 3, detected: 'A', fillConfidence: 0.90, expected: 'A', status: 'correct' },
      { qNum: 4, detected: 'B', fillConfidence: 0.96, expected: 'B', status: 'correct' },
      { qNum: 5, detected: 'A', fillConfidence: 0.87, expected: 'B', status: 'wrong' }
    ]
  }
];
