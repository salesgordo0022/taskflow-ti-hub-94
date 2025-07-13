
-- Primeiro, vamos limpar e recriar todas as tabelas com a estrutura correta
-- Remover tabelas existentes se existirem (ordem inversa devido às dependências)
DROP TABLE IF EXISTS public.incident_notes CASCADE;
DROP TABLE IF EXISTS public.incident_systems CASCADE;
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.subtasks CASCADE;
DROP TABLE IF EXISTS public.task_reminder_channels CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.system_users CASCADE;
DROP TABLE IF EXISTS public.system_tags CASCADE;
DROP TABLE IF EXISTS public.system_companies CASCADE;
DROP TABLE IF EXISTS public.systems CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Criar tabela de usuários (perfis públicos)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'ti', 'accountant')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de empresas
CREATE TABLE public.companies (
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

-- Criar tabela de sistemas
CREATE TABLE public.systems (
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

-- Criar tabela de relacionamento sistema-empresa
CREATE TABLE public.system_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(system_id, company_id)
);

-- Criar tabela de tags dos sistemas
CREATE TABLE public.system_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de usuários com acesso aos sistemas
CREATE TABLE public.system_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  user_id UUID REFERENCES public.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(system_id, user_id)
);

-- Criar tabela de tarefas
CREATE TABLE public.tasks (
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

-- Criar tabela de canais de lembrete das tarefas
CREATE TABLE public.task_reminder_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de subtarefas
CREATE TABLE public.subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de incidentes
CREATE TABLE public.incidents (
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

-- Criar tabela de relacionamento incidente-sistema
CREATE TABLE public.incident_systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES public.incidents ON DELETE CASCADE,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(incident_id, system_id)
);

-- Criar tabela de notas dos incidentes
CREATE TABLE public.incident_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES public.incidents ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
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

-- Políticas RLS permissivas para permitir todas as operações
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on systems" ON public.systems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on system_companies" ON public.system_companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on system_tags" ON public.system_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on system_users" ON public.system_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on task_reminder_channels" ON public.task_reminder_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on subtasks" ON public.subtasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on incidents" ON public.incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on incident_systems" ON public.incident_systems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on incident_notes" ON public.incident_notes FOR ALL USING (true) WITH CHECK (true);

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

-- Inserir dados de exemplo para teste
INSERT INTO public.companies (name, cnpj, responsible, responsible_person, email, phone, segment, regime, level) VALUES
('Tech Solutions LTDA', '12.345.678/0001-90', 'João Silva', 'João Silva', 'contato@techsolutions.com', '(11) 99999-9999', 'servicos', 'simples', 'medio'),
('Comércio Exemplo S.A.', '98.765.432/0001-10', 'Maria Santos', 'Maria Santos', 'info@comercioexemplo.com', '(11) 88888-8888', 'comercio', 'presumido', 'facil'),
('Indústria ABC LTDA', '11.222.333/0001-44', 'Pedro Costa', 'Pedro Costa', 'contato@industriaabc.com', '(11) 77777-7777', 'industria', 'real', 'dificil');

INSERT INTO public.systems (name, version, description, responsible, status, start_date, expected_end_date, progress) VALUES
('Sistema ERP Financeiro', '1.0.0', 'Sistema integrado de gestão financeira', 'Equipe TI', 'in_progress', NOW(), NOW() + INTERVAL '6 months', 75),
('Portal do Cliente', '2.1.0', 'Portal web para acesso dos clientes', 'Equipe TI', 'completed', NOW() - INTERVAL '1 year', NOW() - INTERVAL '6 months', 100),
('Sistema de Estoque', '1.5.0', 'Controle de estoque automatizado', 'Equipe TI', 'testing', NOW() - INTERVAL '3 months', NOW() + INTERVAL '2 months', 90);

INSERT INTO public.tasks (title, description, responsible, priority, status, due_date) VALUES
('Implementar módulo de vendas', 'Desenvolver funcionalidade de vendas no ERP', 'João Silva', 'high', 'in_progress', NOW() + INTERVAL '2 weeks'),
('Testar portal do cliente', 'Realizar testes de integração no portal', 'Maria Santos', 'medium', 'pending', NOW() + INTERVAL '1 week'),
('Documentar API', 'Criar documentação completa da API', 'Pedro Costa', 'low', 'pending', NOW() + INTERVAL '1 month');

INSERT INTO public.incidents (title, description, company_id, severity, status) VALUES
('Erro no sistema de login', 'Usuários não conseguem fazer login no sistema', (SELECT id FROM public.companies LIMIT 1), 'high', 'open'),
('Lentidão no carregamento', 'Sistema está carregando muito lentamente', (SELECT id FROM public.companies LIMIT 1 OFFSET 1), 'medium', 'in_progress');
