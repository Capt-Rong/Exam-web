-- 1. 建立新的 questions 資料表 (correct_answer_key 為 text[])
CREATE TABLE public.questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id uuid NOT NULL,
    chapter_id uuid NULL,
    content text NOT NULL,
    options jsonb NOT NULL,
    correct_answer_key text[] NOT NULL, -- <<< 修改：直接定義為 text[]
    explanation text,
    question_number integer,
    tags text[],
    notes text,
    created_at timestamptz DEFAULT now(),

    CONSTRAINT fk_test
        FOREIGN KEY(test_id)
        REFERENCES public.tests(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_chapter
        FOREIGN KEY(chapter_id)
        REFERENCES public.chapters(id)
        ON DELETE SET NULL
);

-- 為資料表加上註解
COMMENT ON TABLE public.questions IS 'Stores individual questions within a test, potentially linked to a study chapter.';
COMMENT ON COLUMN public.questions.id IS 'Unique identifier for the question.';
COMMENT ON COLUMN public.questions.test_id IS 'Foreign key referencing the test this question belongs to.';
COMMENT ON COLUMN public.questions.chapter_id IS 'Optional foreign key referencing the chapter this question is related to for study purposes.';
COMMENT ON COLUMN public.questions.content IS 'The text content of the question itself.';
COMMENT ON COLUMN public.questions.options IS 'JSONB storing the question options (e.g., {"A": "Option A", "B": "Option B"}).';
COMMENT ON COLUMN public.questions.correct_answer_key IS 'Array of keys for the correct option(s) from the "options" JSON (e.g., ARRAY[''A''], or ARRAY[''A'', ''B''] for multiple correct choices where selecting one is enough).';
COMMENT ON COLUMN public.questions.explanation IS 'Optional explanation for the correct answer.';
COMMENT ON COLUMN public.questions.question_number IS 'Optional number for ordering questions within a test.';
COMMENT ON COLUMN public.questions.tags IS 'Array of text tags for categorizing the question (e.g., "enzyme-regulation", "S. aureus").';
COMMENT ON COLUMN public.questions.notes IS 'Optional notes from the author/creator of the question (e.g., for internal remarks or alerts).';
COMMENT ON COLUMN public.questions.created_at IS 'Timestamp of when the question was created.';

-- 索引
CREATE INDEX idx_questions_test_id ON public.questions(test_id);
CREATE INDEX idx_questions_chapter_id ON public.questions(chapter_id);
CREATE INDEX idx_questions_tags ON public.questions USING GIN (tags);
-- CREATE INDEX idx_questions_correct_answer_key ON public.questions USING GIN (correct_answer_key); -- 如果常需要基於 correct_answer_key 陣列內容查詢，可以加 GIN 索引

-- 2. 設定 Row Level Security (RLS) 策略 (與之前相同)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to questions"
ON public.questions
FOR SELECT
USING (true);

CREATE POLICY "Allow admin/service_role to insert questions"
ON public.questions
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow admin/service_role to update questions"
ON public.questions
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow admin/service_role to delete questions"
ON public.questions
FOR DELETE
USING (auth.role() = 'service_role');


-- 3. 插入模擬資料 (使用 ARRAY[] 格式)
INSERT INTO public.questions (
    test_id,
    chapter_id,
    content,
    options,
    correct_answer_key,
    explanation,
    question_number,
    tags,
    notes
) VALUES
(
    (SELECT id FROM public.tests WHERE name = '112年第一次血液學模擬測驗' LIMIT 1),
    (SELECT id FROM public.chapters WHERE title = '第二章：紅血球生成與代謝' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'hematology') LIMIT 1),
    '下列何者是紅血球生成過程中主要的刺激素？',
    '{"A": "胰島素", "B": "紅血球生成素 (EPO)", "C": "甲狀腺素", "D": "生長激素"}'::jsonb,
    ARRAY['B'], -- 正確格式
    '紅血球生成素 (Erythropoietin, EPO) 主要由腎臟產生，是調控紅血球生成最重要的細胞激素。',
    1,
    ARRAY['紅血球生成', 'EPO', '血液學'],
    '這是一個基礎題，確認學生對EPO的理解。'
),
(
    (SELECT id FROM public.tests WHERE name = '112年第一次血液學模擬測驗' LIMIT 1),
    (SELECT id FROM public.chapters WHERE title = '第三章：貧血概論' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'hematology') LIMIT 1),
    '缺鐵性貧血的典型紅血球型態為何？',
    '{"A": "大球性正色素性", "B": "小球性低色素性", "C": "正球性正色素性", "D": "巨母紅血球性"}'::jsonb,
    ARRAY['B'], -- 正確格式
    '缺鐵會導致血紅素合成不足，使得紅血球體積變小 (microcytic) 且顏色變淡 (hypochromic)。',
    2,
    ARRAY['貧血', '缺鐵性貧血', '紅血球型態'],
    NULL
),
(
    (SELECT id FROM public.tests WHERE name = '111年度臨床生化學考古題解析 (A卷)' LIMIT 1),
    (SELECT id FROM public.chapters WHERE title = '第二章：醣類代謝及其異常' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry') LIMIT 1),
    '下列哪些是糖尿病的典型症狀？（選一或多個皆可，此處假設選到任一個都算沾到邊）',
    '{"A": "多飲", "B": "多尿", "C": "體重減輕", "D": "視力模糊", "E": "以上皆是"}'::jsonb,
    ARRAY['A', 'B', 'C', 'D', 'E'], -- 正確格式 (多個可能正確的選項)
    '糖尿病的典型症狀包括三多一少（多飲、多尿、多食、體重減輕），以及視力模糊、易疲倦等。',
    3,
    ARRAY['糖尿病', '症狀', '臨床生化學'],
    '此題目選項設計有多個符合的，用於測試多選一即對。'
),
(
    (SELECT id FROM public.tests WHERE name = '免疫學基礎概念測驗' LIMIT 1),
    NULL,
    '下列哪些細胞參與先天免疫反應？ (選一即可)',
    '{"A": "巨噬細胞", "B": "嗜中性球", "C": "B淋巴細胞", "D": "T淋巴細胞"}'::jsonb,
    ARRAY['A', 'B'], -- 正確格式 (多個可能正確的選項)
    '巨噬細胞和嗜中性球是先天免疫系統的重要吞噬細胞。B和T淋巴細胞屬於後天免疫。',
    1,
    ARRAY['先天免疫', '免疫細胞'],
    NULL
);

