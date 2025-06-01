-- 1. 建立 subjects 資料表
CREATE TABLE public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
);


-- 為資料表加上註解 (可選，但建議)
COMMENT ON TABLE public.subjects IS 'Stores information about different study or exam subjects.';
COMMENT ON COLUMN public.subjects.id IS 'Unique identifier for the subject.';
COMMENT ON COLUMN public.subjects.name IS 'Human-readable name of the subject (e.g., Clinical Biochemistry).';
COMMENT ON COLUMN public.subjects.slug IS 'URL-friendly version of the name (e.g., clinical-biochemistry).';
COMMENT ON COLUMN public.subjects.description IS 'Optional detailed description of the subject.';
COMMENT ON COLUMN public.subjects.created_at IS 'Timestamp of when the subject was created.';



-- 2. 設定 Row Level Security (RLS) 策略
-- 首先，為資料表啟用 RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- RLS 策略：允許公開讀取 (SELECT)
CREATE POLICY "Allow public read access to subjects"
ON public.subjects
FOR SELECT
USING (true);



-- RLS 策略：僅允許 admin/service_role 插入 (INSERT)
-- 注意：'service_role' 是 Supabase 中常用於後端操作或管理員操作的角色。
-- 如果您有自訂的管理員角色，請相應調整。
CREATE POLICY "Allow admin/service_role to insert subjects"
ON public.subjects
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 更新 (UPDATE)
CREATE POLICY "Allow admin/service_role to update subjects"
ON public.subjects
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- RLS 策略：僅允許 admin/service_role 刪除 (DELETE)
CREATE POLICY "Allow admin/service_role to delete subjects"
ON public.subjects
FOR DELETE
USING (auth.role() = 'service_role');



-- 3. 插入模擬資料 (Mock Data)
-- 假設 description 暫時留空或填寫基本描述
INSERT INTO public.subjects (name, slug, description) VALUES
('Hematology', 'hematology', '血液學是研究血液、造血器官及血液疾病的醫學分支。'),
('Clinical Biochemistry', 'clinical-biochemistry', '臨床生物化學，也稱為臨床化學，是分析體液中化學物質以進行診斷和治療的醫學領域。'),
('Immunology', 'immunology', '免疫學是研究生物體免疫系統的生物醫學分支。'),
('Spectrology', 'spectrology', '光譜學，此處可能指臨床檢驗中利用光譜技術進行物質分析，例如質譜儀（Mass Spectrometry）的應用。'), -- "Spectrology" 是一個比較不常見的詞，這裡假設指的是光譜分析相關技術
('Clinical Microbiology', 'clinical-microbiology', '臨床微生物學是研究與人類健康和疾病相關的微生物（如細菌、病毒、真菌和寄生蟲）的學科。'),
('Pathology', 'pathology', '病理學是研究疾病原因、機制、發展和影響的醫學專業。');