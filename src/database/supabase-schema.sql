
-- Estrutura das tabelas para Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Tabela de Usuários (complementa auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'ti', 'accountant')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Empresas
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  responsible TEXT NOT NULL,
  responsible_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  segment TEXT NOT NULL CHECK (segment IN ('comercio', 'industria', 'servicos', 'rural', 'outros')),
  regime TEXT NOT NULL CHECK (regime IN ('simples', 'presumido', 'real', 'mei')),
  level TEXT NOT NULL CHECK (level IN ('facil', 'medio', 'dificil')),
  has_nota_entrada BOOLEAN DEFAULT FALSE,
  has_nota_saida BOOLEAN DEFAULT FALSE,
  has_cupom BOOLEAN DEFAULT FALSE,
  has_apuracao BOOLEAN DEFAULT FALSE,
  has_envio_documentos BOOLEAN DEFAULT FALSE,
  is_automated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Sistemas
CREATE TABLE IF NOT EXISTS public.systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  responsible TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'testing', 'completed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_end_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_implemented BOOLEAN DEFAULT FALSE,
  system_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de relacionamento Sistema-Empresa
CREATE TABLE IF NOT EXISTS public.system_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(system_id, company_id)
);

-- 5. Tabela de Tags dos Sistemas
CREATE TABLE IF NOT EXISTS public.system_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Usuários com Acesso aos Sistemas
CREATE TABLE IF NOT EXISTS public.system_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  user_id UUID REFERENCES public.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(system_id, user_id)
);

-- 7. Tabela de Tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  system_id UUID REFERENCES public.systems ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies ON DELETE SET NULL,
  responsible TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  reminder_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de Canais de Lembrete das Tarefas
CREATE TABLE IF NOT EXISTS public.task_reminder_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela de Subtarefas
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabela de Incidentes
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Tabela de relacionamento Incidente-Sistema
CREATE TABLE IF NOT EXISTS public.incident_systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES public.incidents ON DELETE CASCADE,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(incident_id, system_id)
);

-- 12. Tabela de Notas dos Incidentes
CREATE TABLE IF NOT EXISTS public.incident_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES public.incidents ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_reminder_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_notes ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS (ajustar conforme necessário)
-- Usuários autenticados podem ver e modificar seus próprios dados
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para outras tabelas (permitir acesso para usuários autenticados)
CREATE POLICY "Authenticated users can access companies" ON public.companies
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access systems" ON public.systems
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access tasks" ON public.tasks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access incidents" ON public.incidents
  FOR ALL USING (auth.role() = 'authenticated');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_systems_updated_at BEFORE UPDATE ON public.systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
