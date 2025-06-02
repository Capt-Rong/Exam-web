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


-- 先檢查 parent_id 是否已存在，如果不存在則新增
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'chapters'
        AND column_name = 'parent_id'
    ) THEN
        ALTER TABLE public.chapters
        ADD COLUMN parent_id uuid NULL REFERENCES public.chapters(id) ON DELETE CASCADE;

        COMMENT ON COLUMN public.chapters.parent_id IS 'Optional foreign key referencing the parent chapter for hierarchical structure.';
        CREATE INDEX idx_chapters_parent_id ON public.chapters(parent_id);
    END IF;
END $$;

-- 清空該科目已有的章節，以便重新插入 (如果需要)
DELETE FROM public.chapters WHERE subject_id = 'a3a3841c-fb35-42fd-a122-6ecfcae96bdc';


-- 臨床生理學與病理學 (Subject ID: a3a3841c-fb35-42fd-a122-6ecfcae96bdc)

-- 頂層章節 UUIDs
-- 您可以手動產生 UUID，或者在插入時讓資料庫 DEFAULT gen_random_uuid()，然後後續查詢出來再用於 parent_id。
-- 為了指令碼的可讀性和確定性，這裡我會預先定義（在真實應用中，您可能會在程式碼中處理或分步插入）。
-- 為了簡化，我會在 INSERT 語句中使用子查詢或 CTE 來獲取 parent_id (如果父項剛被插入)。
-- 或者，更簡單的方法是分批插入，先插入頂層，再插入子層。

-- 這裡我們使用 CTE (Common Table Expressions) 來組織插入，這樣可以更容易地引用剛插入的父章節ID。

WITH subject_clinical_physiology_pathology_id AS (
    SELECT 'a3a3841c-fb35-42fd-a122-6ecfcae96bdc'::uuid AS id
),

-- 第一部分：臨床生理學
clinical_physiology_main AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), s.id, '臨床生理學', 1, NULL
    FROM subject_clinical_physiology_pathology_id s
    RETURNING id, subject_id
),
ekg_main AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), cp.subject_id, '心電圖(ECG/EKG)', 1, cp.id -- (一)
    FROM clinical_physiology_main cp
    RETURNING id, subject_id
),
neuro_main AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), cp.subject_id, '神經學檢查', 2, cp.id -- (二)
    FROM clinical_physiology_main cp
    RETURNING id, subject_id
),
blood_gas AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), cp.subject_id, '血液氣體分析', 3, cp.id -- (三)
    FROM clinical_physiology_main cp
    RETURNING id, subject_id
),
resp_function AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), cp.subject_id, '呼吸功能檢查', 4, cp.id -- (四)
    FROM clinical_physiology_main cp
    RETURNING id, subject_id
),
ultrasound AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), cp.subject_id, '超音波檢查', 5, cp.id -- (五)
    FROM clinical_physiology_main cp
    RETURNING id, subject_id
),
clinical_physiology_comprehensive AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), cp.subject_id, '臨床生理學綜合試題', 6, cp.id -- (六)
    FROM clinical_physiology_main cp
    RETURNING id, subject_id
),

-- 臨床生理學子章節
ekg_sub_chapters AS (
    INSERT INTO public.chapters (subject_id, title, "order", parent_id)
    VALUES
        ((SELECT subject_id FROM ekg_main), 'ECG基本原理與導程', 1, (SELECT id FROM ekg_main)),
        ((SELECT subject_id FROM ekg_main), '心律不整判讀', 2, (SELECT id FROM ekg_main)),
        ((SELECT subject_id FROM ekg_main), '心肌缺血與梗塞變化', 3, (SELECT id FROM ekg_main)),
        ((SELECT subject_id FROM ekg_main), '特殊ECG變化與臨床意義', 4, (SELECT id FROM ekg_main))
),
neuro_sub_chapters AS (
    INSERT INTO public.chapters (subject_id, title, "order", parent_id)
    VALUES
        ((SELECT subject_id FROM neuro_main), '腦波檢查(EEG)', 1, (SELECT id FROM neuro_main)),
        ((SELECT subject_id FROM neuro_main), '睡眠檢查(PSG)', 2, (SELECT id FROM neuro_main)),
        ((SELECT subject_id FROM neuro_main), '肌電圖(EMG)與神經傳導速度(NCV)', 3, (SELECT id FROM neuro_main))
),

-- 第二部分：病理學
pathology_main AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), s.id, '病理學', 2, NULL
    FROM subject_clinical_physiology_pathology_id s
    RETURNING id, subject_id
),
cell_injury AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '細胞傷害、發炎與修復', 1, p.id -- (一)
    FROM pathology_main p
    RETURNING id, subject_id
),
neoplasia_main AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '腫瘤概論', 2, p.id -- (二)
    FROM pathology_main p
    RETURNING id, subject_id
),
genetic_developmental AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '遺傳和發育疾病', 3, p.id -- (三)
    FROM pathology_main p
    RETURNING id, subject_id
),
physical_chemical_nutritional AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '物理化學傷害與營養疾病', 4, p.id -- (四)
    FROM pathology_main p
    RETURNING id, subject_id
),
infection AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '感染性疾病', 5, p.id -- (五)
    FROM pathology_main p
    RETURNING id, subject_id
),
immune_diseases AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '免疫相關疾病', 6, p.id -- (六)
    FROM pathology_main p
    RETURNING id, subject_id
),
systemic_diseases_1_main AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '系統疾病(一)', 7, p.id -- (七)
    FROM pathology_main p
    RETURNING id, subject_id
),
systemic_diseases_2_main AS (
    INSERT INTO public.chapters (id, subject_id, title, "order", parent_id)
    SELECT gen_random_uuid(), p.subject_id, '系統疾病(二)', 8, p.id -- (八)
    FROM pathology_main p
    RETURNING id, subject_id
),

-- 病理學子章節
neoplasia_sub_chapters AS (
    INSERT INTO public.chapters (subject_id, title, "order", parent_id)
    VALUES
        ((SELECT subject_id FROM neoplasia_main), '腫瘤命名與分類', 1, (SELECT id FROM neoplasia_main)),
        ((SELECT subject_id FROM neoplasia_main), '良性與惡性腫瘤特性', 2, (SELECT id FROM neoplasia_main)),
        ((SELECT subject_id FROM neoplasia_main), '致癌機制與分子基礎', 3, (SELECT id FROM neoplasia_main)),
        ((SELECT subject_id FROM neoplasia_main), '腫瘤的臨床表現與診斷', 4, (SELECT id FROM neoplasia_main))
),
systemic_diseases_1_sub_chapters AS (
    INSERT INTO public.chapters (subject_id, title, "order", parent_id)
    VALUES
        ((SELECT subject_id FROM systemic_diseases_1_main), '心血管系統疾病', 1, (SELECT id FROM systemic_diseases_1_main)),
        ((SELECT subject_id FROM systemic_diseases_1_main), '呼吸系統疾病(含頭頸部)', 2, (SELECT id FROM systemic_diseases_1_main)),
        ((SELECT subject_id FROM systemic_diseases_1_main), '造血系統疾病', 3, (SELECT id FROM systemic_diseases_1_main)),
        ((SELECT subject_id FROM systemic_diseases_1_main), '乳房及女性生殖系統疾病', 4, (SELECT id FROM systemic_diseases_1_main)),
        ((SELECT subject_id FROM systemic_diseases_1_main), '內分泌系統疾病', 5, (SELECT id FROM systemic_diseases_1_main))
),
systemic_diseases_2_sub_chapters AS (
    INSERT INTO public.chapters (subject_id, title, "order", parent_id)
    VALUES
        ((SELECT subject_id FROM systemic_diseases_2_main), '消化及肝膽系統疾病', 1, (SELECT id FROM systemic_diseases_2_main)),
        ((SELECT subject_id FROM systemic_diseases_2_main), '腎臟泌尿及男性生殖系統疾病', 2, (SELECT id FROM systemic_diseases_2_main)),
        ((SELECT subject_id FROM systemic_diseases_2_main), '骨骼及軟組織疾病', 3, (SELECT id FROM systemic_diseases_2_main)),
        ((SELECT subject_id FROM systemic_diseases_2_main), '神經系統疾病', 4, (SELECT id FROM systemic_diseases_2_main))
)

-- CTE 結束，執行上面的 INSERT
SELECT 'Chapters for Clinical Physiology and Pathology inserted or updated.' AS status;