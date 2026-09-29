# 《语测通 (LinguaMark)》系统详细技术规格书 (Technical Specification)

本规格书基于已评审定稿的 PRD 与业务/技术架构图编制，涵盖**数据库物理表结构设计 (DDL)**、**核心前后端 RESTful API 接口契约**以及**纯本地 OpenCV 视觉处理算子规范**。

---

## 目录
1. 数据库物理表结构设计 (Database Schema DDL)
2. 核心前后端 RESTful API 契约设计 (API Specifications)
3. 纯本地 OpenCV + ZXing 视觉算法管道算子规范 (CV Operators)
4. 状态机与不可篡改审计流设计 (State Machine & Audit Trail)

---

## 一、 数据库物理表结构设计 (DDL)

系统采用标准 SQL 规范（完全兼容 PostgreSQL 14+ 及 SQLite 3），所有表名采用复数小写下划线，时间字段统一使用带有毫秒精度的 UTC 时间戳。

```sql
-- =============================================================================
-- 1. 用户与权限表 (users)
-- =============================================================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,                         -- UUID
    username VARCHAR(50) NOT NULL UNIQUE,               -- 登录用户名/工号
    password_hash VARCHAR(128) NOT NULL,                -- Argon2id/Bcrypt 密码哈希
    real_name VARCHAR(50) NOT NULL,                     -- 教师真实姓名
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher')), -- 系统角色
    authorized_class_ids JSONB DEFAULT '[]',            -- 授权管理的班级ID数组（行级权限隔离）
    can_create_exam BOOLEAN DEFAULT FALSE,              -- 是否允许自建班级考试与制卡权限开关
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. 班级与学生档案表 (classes & students)
-- =============================================================================
CREATE TABLE classes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,                          -- 班级名称，如 "高二(1)班"
    grade VARCHAR(20) NOT NULL,                         -- 年级，如 "高二"
    school_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    student_no VARCHAR(20) NOT NULL UNIQUE,             -- 学籍号/学号
    real_name VARCHAR(50) NOT NULL,                     -- 姓名
    gender VARCHAR(10) CHECK (gender IN ('M', 'F', 'UNKNOWN')),
    class_id VARCHAR(36) NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    exam_code_suffix VARCHAR(3) NOT NULL,               -- 班级流水号(3位)，如 "001"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_class ON students(class_id);

-- =============================================================================
-- 3. 答题卡版式模板表 (sheet_templates)
-- =============================================================================
CREATE TABLE sheet_templates (
    id VARCHAR(50) PRIMARY KEY,                         -- 模板特征标识，如 "TPL_A4_50Q_V1"
    name VARCHAR(100) NOT NULL,                         -- 模板显示名，如 "A4双面通用50题外语综合卡"
    paper_size VARCHAR(10) NOT NULL CHECK (paper_size IN ('A4', 'A3', 'A5')),
    page_count INT NOT NULL DEFAULT 1,                  -- 页数：1或2
    descriptor JSONB NOT NULL,                          -- 完整版式坐标描述 (含FinderPattern、条码ROI、气泡网格、主观题框)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4. 考务主表 (exams)
-- =============================================================================
CREATE TABLE exams (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,                        -- 考试名称，如 "2026年春季高二期中英语统考"
    subject VARCHAR(30) DEFAULT 'English',              -- 学科（默认外语）
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('bank_auto', 'manual_benchmark')), -- 模式A(题库) / 模式B(非题库标杆卡)
    template_id VARCHAR(50) NOT NULL REFERENCES sheet_templates(id),
    total_score NUMERIC(5,1) NOT NULL DEFAULT 100.0,    -- 试卷总分
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',        -- 草稿创建中
        'ready',        -- 已制卡，等待施考
        'collecting',   -- 试卷图像收集中
        'grading',      -- OMR识别与主观流水批改中
        'reviewing',    -- 异常复核与合分中
        'locked'        -- 考分终审锁定，生成学情物料
    )),
    listening_audio_url VARCHAR(255),                  -- 统一听力音频文件OSS/本地路径
    benchmark_card_image_url VARCHAR(255),              -- (模式B) 教师标杆标准答案卡原图路径
    created_by VARCHAR(36) NOT NULL REFERENCES users(id),
    target_class_ids JSONB NOT NULL DEFAULT '[]',       -- 施考班级列表
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    locked_at TIMESTAMP WITH TIME ZONE                  -- 终审锁定时间
);

-- =============================================================================
-- 5. 试题与采分点定义表 (exam_questions)
-- =============================================================================
CREATE TABLE exam_questions (
    id VARCHAR(36) PRIMARY KEY,
    exam_id VARCHAR(36) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    q_num INT NOT NULL,                                 -- 题号 (1~80)
    type VARCHAR(20) NOT NULL CHECK (type IN (
        'single_choice', 'listening_choice', 'fill_in', 'translation', 'composition'
    )),
    score NUMERIC(4,1) NOT NULL,                        -- 本题分值
    standard_answer VARCHAR(50),                        -- 标准答案 (如 "B" 或 "ACD")
    competence_dimension VARCHAR(30) NOT NULL CHECK (competence_dimension IN (
        'listening', 'vocabulary', 'grammar', 'reading', 'writing'
    )),                                                 -- 外语五维素养归属
    rubrics JSONB,                                      -- 主观题采分点列表 (如 [{"point":"倒装语序准确", "delta":1.5}])
    analysis_text TEXT,                                 -- 官方解析文本
    stem_image_url VARCHAR(255),                        -- 原题切片或原题图
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (exam_id, q_num)
);

CREATE INDEX idx_questions_exam ON exam_questions(exam_id);

-- =============================================================================
-- 6. 答题卡实物影像与元数据表 (answer_sheets)
-- =============================================================================
CREATE TABLE answer_sheets (
    id VARCHAR(36) PRIMARY KEY,
    exam_id VARCHAR(36) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id VARCHAR(36) REFERENCES students(id),     -- 绑定的考生ID
    exam_no VARCHAR(20),                                -- 解码出的9位考号 (如 "202610104")
    page_index INT DEFAULT 1,                           -- 当前页码
    total_pages INT DEFAULT 1,
    original_image_url VARCHAR(255) NOT NULL,           -- 当期无损原图 (30天存储策略)
    warped_image_url VARCHAR(255),                      -- 透视拉平矫正后标准图像
    confidence_score NUMERIC(4,1) NOT NULL DEFAULT 0.0, -- 整卷置信度评分 (0~100)
    status VARCHAR(30) NOT NULL DEFAULT 'uploaded' CHECK (status IN (
        'uploaded',             -- 已上传入闸
        'passed',               -- 正常且已通过OMR (得分可信)
        'warning_leak',         -- 存在客观题漏涂
        'warning_multi',        -- 存在疑似双涂/擦拭不洁
        'error_barcode',        -- 条码损坏/反光 (待手写对齐)
        'error_missing_corner', -- 定位角标丢失 (待重拍/手动打点)
        'quarantined'           -- 严重异常已隔离
    )),
    laplacian_variance NUMERIC(6,1),                    -- 清晰度方差 (防抖指标)
    handwritten_crop_url VARCHAR(255),                  -- 手写准考证号/姓名区域微切片 (条码反光时兜底)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sheets_exam_student ON answer_sheets(exam_id, student_id);

-- =============================================================================
-- 7. 客观题机器识别明细表 (objective_results)
-- =============================================================================
CREATE TABLE objective_results (
    id VARCHAR(36) PRIMARY KEY,
    sheet_id VARCHAR(36) NOT NULL REFERENCES answer_sheets(id) ON DELETE CASCADE,
    q_num INT NOT NULL,
    recognized_option VARCHAR(10),                      -- 识别出选项 (如 "A", "NULL", "MULTI")
    black_density_ratio NUMERIC(4,3),                   -- 填涂黑度占比 (如 0.584)
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,          -- 判分正误
    score NUMERIC(4,1) NOT NULL DEFAULT 0.0,            -- 实得分数
    is_manual_overridden BOOLEAN DEFAULT FALSE,         -- 是否经人工改判
    overridden_by VARCHAR(36) REFERENCES users(id),     -- 改判教师ID
    overridden_reason VARCHAR(100),                     -- 改判原因
    UNIQUE (sheet_id, q_num)
);

CREATE INDEX idx_obj_sheet ON objective_results(sheet_id);

-- =============================================================================
-- 8. 主观题切片与批阅流水表 (grading_slices)
-- =============================================================================
CREATE TABLE grading_slices (
    id VARCHAR(36) PRIMARY KEY,
    sheet_id VARCHAR(36) NOT NULL REFERENCES answer_sheets(id) ON DELETE CASCADE,
    q_num INT NOT NULL,                                 -- 对应主观题号
    slice_image_url VARCHAR(255) NOT NULL,              -- 带8%缓冲区的高清手迹切片
    annotated_image_url VARCHAR(255),                   -- 批改留痕图 (含红笔标注印章)
    score NUMERIC(4,1) NOT NULL DEFAULT 0.0,            -- 主观题得分
    applied_stamps JSONB DEFAULT '[]',                  -- 施加的评语印章 (如 ["倒装语序准确+1.5", "时态错误-1.0"])
    graded_by VARCHAR(36) REFERENCES users(id),         -- 阅卷教师ID (双盲匿名批阅，前端脱敏)
    graded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (sheet_id, q_num)
);

CREATE INDEX idx_slices_sheet ON grading_slices(sheet_id);

-- =============================================================================
-- 9. 考试总汇与多维素养成绩表 (exam_records)
-- =============================================================================
CREATE TABLE exam_records (
    id VARCHAR(36) PRIMARY KEY,
    exam_id VARCHAR(36) NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id VARCHAR(36) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    objective_score NUMERIC(5,1) NOT NULL DEFAULT 0.0,
    subjective_score NUMERIC(5,1) NOT NULL DEFAULT 0.0,
    total_score NUMERIC(5,1) NOT NULL DEFAULT 0.0,
    class_rank INT,
    attendance_status VARCHAR(20) DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'excused')),
    competence_scores JSONB NOT NULL DEFAULT '{}',      -- {"listening": 85.0, "vocabulary": 62.5, "grammar": 45.0, ...}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (exam_id, student_id)
);

CREATE INDEX idx_records_exam ON exam_records(exam_id);

-- =============================================================================
-- 10. 全流程不可篡改改分审计流水表 (audit_logs)
-- =============================================================================
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    exam_id VARCHAR(36) NOT NULL,
    operator_id VARCHAR(36) NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,                   -- 'MANUAL_OVERRIDE_OBJECTIVE', 'UPDATE_SUBJECTIVE_SCORE', 'LOCK_EXAM'
    target_record_id VARCHAR(36) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    reason TEXT NOT NULL,                               -- 强制改分必填原因
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_exam ON audit_logs(exam_id);
```

---

## 二、 核心前后端 RESTful API 契约设计

### 1. 考务与极速建考模块

#### 1.1 创建非题库极速考试并提取标杆卡 (模式 B)
* **Endpoint**: `POST /api/v1/exams/manual-benchmark`
* **Content-Type**: `multipart/form-data`
* **Request Payload**:
  * `title`: "高二英语第一次周测"
  * `templateId`: "TPL_A4_50Q_V1"
  * `targetClassIds`: `["cls-01", "cls-02"]`
  * `benchmarkCardFile`: `[File: benchmark_sheet.jpg]` (教师 2B 铅笔填涂好的标准答案卡)
* **Response Payload (201 Created)**:
```json
{
  "code": 200,
  "message": "考试创建成功，标杆卡答案已秒级提取",
  "data": {
    "examId": "ex-2026-0301",
    "status": "ready",
    "extractedAnswerKey": {
      "1": "A", "2": "C", "3": "B", "4": "D", "5": "B",
      "6": "A", "7": "C", "8": "D", "9": "B", "10": "A"
    },
    "templateDescriptor": {
      "templateId": "TPL_A4_50Q_V1",
      "paperSize": "A4",
      "totalQuestions": 50
    },
    "extractionConfidence": 99.8
  }
}
```

#### 1.2 批量生成考生专属 Code128 条码打印流
* **Endpoint**: `GET /api/v1/exams/:examId/barcodes/print-stream`
* **Query Params**: `format=pdf&pageSize=A4&stickersPerPage=24`
* **Response**: `application/pdf` 二进制流（符合 A4 不干胶标签纸标准间距，含考生姓名、学号、9位 Code128 条码）。

---

### 2. 图像采集与 OMR 流水线模块

#### 2.1 批量答题卡影像上传入闸 (支持手机直传与 ZIP 导入)
* **Endpoint**: `POST /api/v1/omr/upload-batch`
* **Content-Type**: `multipart/form-data`
* **Request Payload**:
  * `examId`: "ex-2026-0301"
  * `images`: `[File[], zipFile]`
* **Response Payload (200 OK)**:
```json
{
  "code": 200,
  "data": {
    "batchId": "batch-8849",
    "totalCount": 45,
    "processedCount": 45,
    "passedCount": 42,
    "warningCount": 2,
    "errorCount": 1,
    "items": [
      {
        "sheetId": "sheet-001",
        "studentName": "张子涵",
        "examNo": "202610101",
        "confidenceScore": 98.5,
        "status": "passed",
        "laplacianVariance": 312.4
      },
      {
        "sheetId": "sheet-002",
        "studentName": "李嘉文",
        "examNo": "202610102",
        "confidenceScore": 78.0,
        "status": "warning_multi",
        "abnormalQuestions": [3]
      },
      {
        "sheetId": "sheet-003",
        "studentName": "周晓彤",
        "examNo": null,
        "confidenceScore": 0.0,
        "status": "error_barcode",
        "handwrittenCropUrl": "/storage/crops/handwritten_sheet003.webp",
        "suggestedMatchCandidates": ["202610104", "202610108"]
      }
    ]
  }
}
```

#### 2.2 客观题异常逐题人工改判接口
* **Endpoint**: `POST /api/v1/omr/manual-override`
* **Content-Type**: `application/json`
* **Request Payload**:
```json
{
  "sheetId": "sheet-002",
  "qNum": 3,
  "overriddenOption": "B",
  "reason": "橡皮擦拭未净导致双涂假象，经核对原始高倍切片判定学生真实作答为B"
}
```
* **Response Payload (200 OK)**:
```json
{
  "code": 200,
  "message": "改判成功并已记入审计日志",
  "data": {
    "sheetId": "sheet-002",
    "qNum": 3,
    "newScore": 2.0,
    "auditLogId": "log-99214"
  }
}
```

---

### 3. 主观题流水阅卷模块

#### 3.1 获取下一份待评阅切片 (双盲密评)
* **Endpoint**: `GET /api/v1/grading/slices/next`
* **Query Params**: `examId=ex-2026-0301&qNum=21`
* **Response Payload (200 OK)**:
```json
{
  "code": 200,
  "data": {
    "sliceId": "slice-1029",
    "sheetId": "sheet-005",
    "qNum": 21,
    "questionTitle": "中译英：尽管下着大雨，他们依然按时到达了机场。",
    "fullScore": 5.0,
    "sliceImageUrl": "/storage/slices/q21_sheet005_hd.webp",
    "fullPaperImageUrl": "/storage/warped/sheet005_full.webp",
    "presetStamps": [
      {"label": "让步状语从句准确", "delta": 2.0},
      {"label": "时态语态一致", "delta": 1.5},
      {"label": "拼写有误", "delta": -1.0}
    ],
    "remainingCount": 14
  }
}
```

#### 3.2 提交主观题评分并平滑推进
* **Endpoint**: `POST /api/v1/grading/slices/submit`
* **Content-Type**: `application/json`
* **Request Payload**:
```json
{
  "sliceId": "slice-1029",
  "score": 4.5,
  "appliedStamps": ["让步状语从句准确", "时态语态一致"],
  "comment": "从句结构优美"
}
```

---

### 4. 学情诊断与物料生成模块

#### 4.1 获取外语五维核心素养雷达图数据
* **Endpoint**: `GET /api/v1/analytics/:examId/radar`
* **Response Payload (200 OK)**:
```json
{
  "code": 200,
  "data": {
    "examTitle": "2026年春季高二期中英语统考",
    "dimensions": [
      {"key": "listening", "name": "听力理解", "classRate": 82.4, "gradeRate": 78.0},
      {"key": "vocabulary", "name": "词汇辨析", "classRate": 61.2, "gradeRate": 65.5},
      {"key": "grammar", "name": "语法句法", "classRate": 48.7, "gradeRate": 54.0},
      {"key": "reading", "name": "阅读理解", "classRate": 76.5, "gradeRate": 72.1},
      {"key": "writing", "name": "书面表达", "classRate": 69.0, "gradeRate": 68.4}
    ]
  }
}
```

---

## 三、 纯本地 OpenCV + ZXing 视觉算法算子规格

算法服务以本地 C++ / WebAssembly / Python 模块封装，严禁调用公网 API。

```
┌────────────────────────────────────────────────────────────────────────┐
│                        纯本地五阶算法算子管道规格                        │
├────────────────────────────────────────────────────────────────────────┤
│ 算子 1：画质预检 (Quality Gate)                                        │
│   • 输入：cv::Mat (原图 BGR)                                           │
│   • 算法：cv::Laplacian(gray, lap, CV_64F); cv::meanStdDev(lap, mu, var)│
│   • 门限：方差 var >= 100.0 通过；< 100.0 抛出 Warning_Blur            │
├────────────────────────────────────────────────────────────────────────┤
│ 算子 2：四角锚点锁定与透视变换 (Finder Pattern & Warp)                  │
│   • 输入：cv::Mat (灰度图), TemplateDescriptor                         │
│   • 算法：Canny 边缘检测 ➔ 轮廓面积/长宽比过滤 (筛选 8mmx8mm 实心方块)  │
│   • 矩阵计算：cv::getPerspectiveTransform(quad_pts, target_pts)       │
│   • 输出：拉平至 2480 x 3508 (A4 300DPI) 标准矩形无畸变图像            │
├────────────────────────────────────────────────────────────────────────┤
│ 算子 3：背景光照场估计与去手影 (Shadow Removal)                        │
│   • 输入：cv::Mat (透视校正后单通道图像)                               │
│   • 算法：cv::morphologyEx(src, bg, MORPH_OPEN, kernel_size=45)       │
│   • 差分扣除：diff = src - bg + 128                                    │
│   • 局部均衡：cv::createCLAHE(clipLimit=2.0, tileGridSize=(8,8))       │
├────────────────────────────────────────────────────────────────────────┤
│ 算子 4：条码与手写考号双模绑定 (Barcode & Fallback)                    │
│   • 输入：根据 Descriptor 裁切的 Barcode ROI 与 Handwritten ROI        │
│   • 解码：ZXing::Decode(barcode_roi, Format_CODE_128)                  │
│   • 降级兜底：若解码抛出异常，输出手写切片供前端置顶补绑               │
├────────────────────────────────────────────────────────────────────────┤
│ 算子 5：气泡网格 Sauvola 局部自适应动态二值化与积分判分 (OMR Evaluation)│
│   • 输入：各小题选项气泡 ROI 矩阵 (x, y, w, h)                         │
│   • 动态阈值公式：T = mean * (1 + k * (std / R - 1))，k=0.2, R=128    │
│   • 判定：黑度像素占比 density = black_pixels / total_pixels           │
│   • 规则：density >= 0.38 判为有效；漏涂 (全<0.15)；双涂 (差值<0.15)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 四、 状态机流转与审计约束

考试生命周期状态机遵循强顺序流转，禁止跳跃式变迁：

```
[草稿 draft] ──(录入完成)──► [就绪 ready] ──(开始收卷)──► [收集中 collecting]
                                                                │
                                                        (首批试卷解析)
                                                                ▼
[已终审锁定 locked] ◄──(终审确认)─── [待复核 reviewing] ◄─── [阅卷中 grading]
```

### 改分审计铁律
* 状态机一旦进入 `locked`（已终审锁定），总分与小题分**自动只读冻结**；
* 若超级管理员特批改分，系统必须弹出强制弹窗要求填写 `reason`，修改前后值、时间戳、IP 地址原子性写入 `audit_logs` 表，**数据库层禁止 DELETE 审计表记录**。
