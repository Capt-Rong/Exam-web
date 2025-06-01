-- 1. 建立 chapters 資料表
CREATE TABLE public.chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid NOT NULL,
    title text NOT NULL,
    "order" integer, -- 使用雙引號是因為 "order" 是 SQL 的保留關鍵字
    created_at timestamptz DEFAULT now(),

    CONSTRAINT fk_subject
        FOREIGN KEY(subject_id)
        REFERENCES public.subjects(id)
        ON DELETE CASCADE -- 如果 subject 被刪除，相關的 chapters 也會被刪除
);

-- 為資料表加上註解
COMMENT ON TABLE public.chapters IS 'Organizes study notes into chapters within a subject.';
COMMENT ON COLUMN public.chapters.id IS 'Unique identifier for the chapter.';
COMMENT ON COLUMN public.chapters.subject_id IS 'Foreign key referencing the subject this chapter belongs to.';
COMMENT ON COLUMN public.chapters.title IS 'Title of the chapter (e.g., "紅血球生成與代謝", "酵素學緒論").';
COMMENT ON COLUMN public.chapters."order" IS 'Optional field to define the display order of chapters within a subject.';
COMMENT ON COLUMN public.chapters.created_at IS 'Timestamp of when the chapter was created.';

-- 可以在 subject_id 和 "order" 上建立索引以提升查詢效能 (可選)
CREATE INDEX idx_chapters_subject_id ON public.chapters(subject_id);
CREATE INDEX idx_chapters_order ON public.chapters("order");
-- 複合唯一約束，確保同一科目下章節標題唯一 (可選，視需求決定)
-- ALTER TABLE public.chapters ADD CONSTRAINT unique_subject_chapter_title UNIQUE (subject_id, title);

-- 2. 設定 Row Level Security (RLS) 策略
-- 首先，為資料表啟用 RLS
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- RLS 策略：允許公開讀取 (SELECT)
CREATE POLICY "Allow public read access to chapters"
ON public.chapters
FOR SELECT
USING (true);

-- RLS 策略：僅允許 admin/service_role 插入 (INSERT)
CREATE POLICY "Allow admin/service_role to insert chapters"
ON public.chapters
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 更新 (UPDATE)
CREATE POLICY "Allow admin/service_role to update chapters"
ON public.chapters
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 刪除 (DELETE)
CREATE POLICY "Allow admin/service_role to delete chapters"
ON public.chapters
FOR DELETE
USING (auth.role() = 'service_role');

-- 3. 插入模擬資料 (Mock Data)
-- 注意：這裡的 subject_id 需要對應到您 `subjects` 表中實際存在的 `id`。
-- 我們將使用子查詢來獲取 `subjects` 的 `id`。

INSERT INTO public.chapters (subject_id, title, "order")
VALUES
    (
        (SELECT id FROM public.subjects WHERE slug = 'hematology'),
        '第一章：緒論與血液常規檢查',
        1
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'hematology'),
        '第二章：紅血球生成與代謝',
        2
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'hematology'),
        '第三章：貧血概論',
        3
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry'),
        '第一章：臨床生化學概論與品質管制',
        1
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry'),
        '第二章：醣類代謝及其異常',
        2
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry'),
        '第三章：脂質代謝及其異常',
        3
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'immunology'),
        '第一章：免疫系統概覽',
        1
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'immunology'),
        '第二章：先天性免疫',
        2
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-microbiology'),
        '第一章：細菌學總論',
        1
    ),
    (
        (SELECT id FROM public.subjects WHERE slug = 'clinical-microbiology'),
        '第二章：革蘭氏陽性球菌',
        2
    );
