-- 1. 建立 notes 資料表
CREATE TABLE public.notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- This id is used as [noteId] in note display URLs
    chapter_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL, -- Can store Markdown or HTML content
    "order" integer, -- 使用雙引號是因為 "order" 是 SQL 的保留關鍵字
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(), -- To track when the note was last updated

    CONSTRAINT fk_chapter
        FOREIGN KEY(chapter_id)
        REFERENCES public.chapters(id)
        ON DELETE CASCADE -- 如果 chapter 被刪除，相關的 notes 也會被刪除
);

-- 為資料表加上註解
COMMENT ON TABLE public.notes IS 'Stores individual study notes or content pieces within a chapter.';
COMMENT ON COLUMN public.notes.id IS 'Unique identifier for the note (used as [noteId] in URLs).';
COMMENT ON COLUMN public.notes.chapter_id IS 'Foreign key referencing the chapter this note belongs to.';
COMMENT ON COLUMN public.notes.title IS 'Title of the study note.';
COMMENT ON COLUMN public.notes.content IS 'The main content of the note, can be Markdown or HTML.';
COMMENT ON COLUMN public.notes."order" IS 'Optional field to define the display order of notes within a chapter.';
COMMENT ON COLUMN public.notes.created_at IS 'Timestamp of when the note was created.';
COMMENT ON COLUMN public.notes.updated_at IS 'Timestamp of when the note was last updated.';

-- 可以在 chapter_id 和 "order" 上建立索引以提升查詢效能
CREATE INDEX idx_notes_chapter_id ON public.notes(chapter_id);
CREATE INDEX idx_notes_order ON public.notes("order");
-- 複合唯一約束，確保同一章節下筆記標題唯一 (可選，視需求決定)
-- ALTER TABLE public.notes ADD CONSTRAINT unique_chapter_note_title UNIQUE (chapter_id, title);

-- 建立一個觸發器自動更新 updated_at 欄位
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


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


-- 3. 插入模擬資料 (Mock Data)
-- 注意：這裡的 chapter_id 需要對應到您 `chapters` 表中實際存在的 `id`。
-- 我們將使用子查詢來獲取 `chapters` 的 `id`。

INSERT INTO public.notes (chapter_id, title, content, "order")
VALUES
(
    (SELECT id FROM public.chapters WHERE title = '第二章：紅血球生成與代謝' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'hematology') LIMIT 1),
    '紅血球的生命週期',
    '## 紅血球的生命週期

紅血球在骨髓中由造血幹細胞分化而來，成熟後釋放到血液中。
- 平均壽命：約 **120 天**。
- 主要功能：運輸氧氣。
- 衰老機制：細胞膜變形能力下降，容易被脾臟中的巨噬細胞吞噬。
- 分解產物：血紅素分解為鐵質、膽紅素和球蛋白。鐵質可回收再利用。

### 影響因素
1.  營養狀況（鐵、維生素B12、葉酸）
2.  EPO 水平
3.  遺傳疾病（如地中海型貧血、鐮刀型細胞貧血症）',
    1
),
(
    (SELECT id FROM public.chapters WHERE title = '第二章：紅血球生成與代謝' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'hematology') LIMIT 1),
    '血紅素的結構與功能',
    '# 血紅素 (Hemoglobin, Hb)

血紅素是紅血球中負責攜帶氧氣的蛋白質。

### 結構
- 由**四個亞基**組成。
- 每個亞基包含一個**血基質 (heme)** 和一條**球蛋白鏈 (globin chain)**。
- 血基質中央含一個亞鐵離子 (Fe²⁺)，能與一個氧分子結合。

### 主要類型
- HbA (α₂β₂): 成人主要血紅素，約佔95-98%。
- HbA₂ (α₂δ₂): 成人少量血紅素，約佔2-3%。
- HbF (α₂γ₂): 胎兒血紅素，出生後逐漸被 HbA 取代。

### 功能
- **氧氣運輸**：從肺部將氧氣運送到組織。
- **二氧化碳運輸**：部分二氧化碳以碳酸氫鹽形式運輸，部分與球蛋白結合。
- **酸鹼緩衝**。',
    2
),
(
    (SELECT id FROM public.chapters WHERE title = '第二章：醣類代謝及其異常' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'clinical-biochemistry') LIMIT 1),
    '糖解作用 (Glycolysis)',
    '## 糖解作用 (Glycolysis)

糖解作用是將一分子葡萄糖分解為兩分子丙酮酸的代謝途徑，過程中產生 ATP 和 NADH。

**主要步驟**（簡化）：
1.  **能量投資期**：消耗 2 ATP
    *   葡萄糖 → 葡萄糖-6-磷酸 (G6P) → 果糖-6-磷酸 (F6P) → 果糖-1,6-雙磷酸 (F1,6BP)
2.  **能量回收期**：產生 4 ATP 和 2 NADH
    *   F1,6BP → 兩分子甘油醛-3-磷酸 (G3P)
    *   G3P → ... → 丙酮酸 (Pyruvate)

**淨產物** (每分子葡萄糖)：
- 2 丙酮酸
- 2 ATP
- 2 NADH

**發生地點**：細胞質

**重要調控酵素**：
- 己醣激酶 (Hexokinase) / 葡萄糖激酶 (Glucokinase)
- 磷酸果糖激酶-1 (PFK-1)
- 丙酮酸激酶 (Pyruvate kinase)',
    1
),
(
    (SELECT id FROM public.chapters WHERE title = '第一章：細菌學總論' AND subject_id = (SELECT id FROM public.subjects WHERE slug = 'clinical-microbiology') LIMIT 1),
    '細菌的革蘭氏染色法',
    '### 革蘭氏染色法 (Gram Stain)

革蘭氏染色法是一種鑑別細菌的常用方法，根據細菌細胞壁結構的差異將細菌分為兩大類：

1.  **革蘭氏陽性菌 (Gram-positive bacteria)**：
    *   細胞壁厚，主要成分為肽聚醣 (Peptidoglycan)。
    *   染色後呈現 **紫色**。
    *   例子：葡萄球菌 (Staphylococcus)、鏈球菌 (Streptococcus)。

2.  **革蘭氏陰性菌 (Gram-negative bacteria)**：
    *   細胞壁薄，肽聚醣層外還有一層外膜 (Outer membrane)，含有脂多醣 (LPS)。
    *   染色後呈現 **紅色或粉紅色**。
    *   例子：大腸桿菌 (E. coli)、沙門氏菌 (Salmonella)。

#### 染色步驟：
1.  結晶紫 (Crystal violet) - 初染
2.  碘液 (Iodine solution) - 媒染劑
3.  酒精或丙酮 (Alcohol/Acetone) - 脫色劑
4.  番紅 (Safranin) - 複染劑',
    1
);