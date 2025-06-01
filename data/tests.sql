-- 1. 建立 tests 資料表
CREATE TABLE public.tests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid NOT NULL,
    name text NOT NULL, -- 例如: "111-1 Practice"
    description text,
    duration_in_seconds integer NOT NULL, -- 例如: 3600 (秒)
    created_at timestamptz DEFAULT now(),

    CONSTRAINT fk_subject
        FOREIGN KEY(subject_id)
        REFERENCES public.subjects(id)
        ON DELETE CASCADE -- 如果 subject 被刪除，相關的 tests 也會被刪除
);

-- 為資料表加上註解
COMMENT ON TABLE public.tests IS 'Stores specific exam papers or practice tests within a subject.';
COMMENT ON COLUMN public.tests.id IS 'Unique identifier for the test.';
COMMENT ON COLUMN public.tests.subject_id IS 'Foreign key referencing the subject this test belongs to.';
COMMENT ON COLUMN public.tests.name IS 'Name of the test (e.g., "111-1 Practice", "血液學模擬考A卷").';
COMMENT ON COLUMN public.tests.description IS 'Optional detailed description of the test.';
COMMENT ON COLUMN public.tests.duration_in_seconds IS 'Duration of the test in seconds (e.g., 3600 for 1 hour).';
COMMENT ON COLUMN public.tests.created_at IS 'Timestamp of when the test was created.';

-- 可以在 subject_id 和 name 上建立索引以提升查詢效能 (可選)
CREATE INDEX idx_tests_subject_id ON public.tests(subject_id);
CREATE INDEX idx_tests_name ON public.tests(name);


-- 2. 設定 Row Level Security (RLS) 策略
-- 首先，為資料表啟用 RLS
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- RLS 策略：允許公開讀取 (SELECT)
CREATE POLICY "Allow public read access to tests"
ON public.tests
FOR SELECT
USING (true);

-- RLS 策略：僅允許 admin/service_role 插入 (INSERT)
CREATE POLICY "Allow admin/service_role to insert tests"
ON public.tests
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 更新 (UPDATE)
CREATE POLICY "Allow admin/service_role to update tests"
ON public.tests
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 刪除 (DELETE)
CREATE POLICY "Allow admin/service_role to delete tests"
ON public.tests
FOR DELETE
USING (auth.role() = 'service_role');



-- 3. 插入模擬資料 (Mock Data)
-- 注意：這裡的 subject_id 需要對應到您 `subjects` 表中實際存在的 `id`。
-- 我們將使用子查詢來獲取 `subjects` 的 `id`。

-- 假設 'hematology' 的 slug 在 subjects 表中存在
INSERT INTO public.tests (subject_id, name, description, duration_in_seconds)
VALUES
    (
        (SELECT id FROM public.subjects WHERE slug = 'hematology'),
        '112年第一次血液學模擬測驗',
        '涵蓋112年度第一次考試範圍的血液學模擬測驗，共50題。',
        3600 -- 1 小時
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'hematology'),
        '血液學進階測驗 - 紅血球篇',
        '專注於紅血球相關疾病及檢驗的進階測驗。',
        2700 -- 45 分鐘
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry'),
        '111年度臨床生化學考古題解析 (A卷)',
        '111年度臨床生化學重要考古題，附帶部分解析提示。',
        5400 -- 1.5 小時
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry'),
        '臨床生化 - 肝功能主題測驗',
        '針對肝功能指標及其臨床意義的專項測驗。',
        3000 -- 50 分鐘
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'immunology'),
        '免疫學基礎概念測驗',
        '檢測免疫學基本觀念的掌握程度。',
        3600 -- 1 小時
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-microbiology'),
        '臨床微生物 - 細菌學快速複習',
        '細菌學重點快速複習測驗。',
        2400 -- 40 分鐘
    );