CREATE TABLE public.notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject text NOT NULL REFERENCES public.subjects(name) ON DELETE CASCADE, -- 新增外鍵
    chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    "order" integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.notes IS 'Stores individual study notes or content pieces within a chapter, directly linked to a subject.';
COMMENT ON COLUMN public.notes.subject_id IS 'Foreign key referencing the subject this note belongs to (denormalized for easier querying, should be consistent with chapter''s subject).';
CREATE INDEX idx_notes_subject_id ON public.notes(subject_id);
CREATE INDEX idx_notes_chapter_id ON public.notes(chapter_id);
CREATE INDEX idx_notes_order ON public.notes("order");

-- 2. 設定 Row Level Security (RLS) 策略
-- 首先，為資料表啟用 RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- RLS 策略：允許公開讀取 (SELECT)
CREATE POLICY "Allow public read access to notes"
ON public.notes
FOR SELECT
USING (true);

-- RLS 策略：僅允許 admin/service_role 插入 (INSERT)
CREATE POLICY "Allow admin/service_role to insert notes"
ON public.notes
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 更新 (UPDATE)
CREATE POLICY "Allow admin/service_role to update notes"
ON public.notes
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 刪除 (DELETE)
CREATE POLICY "Allow admin/service_role to delete notes"
ON public.notes
FOR DELETE
USING (auth.role() = 'service_role');

-- Trigger for updated_at on notes
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();



-- Mock data for notes (確保 subject_id 和 chapter_id 的 subject 一致)
INSERT INTO public.notes (subject_id, chapter_id, title, content, "order") VALUES
(
    (SELECT id FROM public.subjects WHERE slug = 'hematology'), -- 直接指定 subject_id
    (SELECT id FROM public.chapters WHERE title = '第二章：紅血球生成與代謝' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'hematology') LIMIT 1),
    '紅血球的生命週期',
    '## 紅血球的生命週期...',
    1
),
(
    (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry'), -- 直接指定 subject_id
    (SELECT id FROM public.chapters WHERE title = '第二章：醣類代謝及其異常' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry') LIMIT 1),
    '糖解作用 (Glycolysis)',
    '## 糖解作用 (Glycolysis)...',
    1
);