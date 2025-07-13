
-- Limpar e recriar todas as tabelas com a estrutura correta para funcionar com o sistema
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

-- Tabela de usuários
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'ti', 'accountant')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de empresas
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

-- Tabela de sistemas
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

-- Tabela de relacionamento sistema-empresa
CREATE TABLE public.system_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(system_id, company_id)
);

-- Tabela de tags dos sistemas
CREATE TABLE public.system_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários com acesso aos sistemas
CREATE TABLE public.system_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  user_id UUID REFERENCES public.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(system_id, user_id)
);

-- Tabela de tarefas
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

-- Tabela de canais de lembrete das tarefas
CREATE TABLE public.task_reminder_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de subtarefas
CREATE TABLE public.subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de incidentes
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

-- Tabela de relacionamento incidente-sistema
CREATE TABLE public.incident_systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID REFERENCES public.incidents ON DELETE CASCADE,
  system_id UUID REFERENCES public.systems ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(incident_id, system_id)
);

-- Tabela de notas dos incidentes
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

-- Políticas RLS permissivas para permitir todas as operações (necessário para funcionamento sem autenticação)
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

-- Inserir dados de exemplo completos para testar todas as funcionalidades
INSERT INTO public.companies (name, cnpj, responsible, responsible_person, email, phone, segment, regime, level, has_nota_entrada, has_nota_saida, has_cupom, has_apuracao, has_envio_documentos, is_automated) VALUES
('Tech Solutions LTDA', '12.345.678/0001-90', 'João Silva', 'João Silva', 'contato@techsolutions.com', '(11) 99999-9999', 'servicos', 'simples', 'medio', true, true, false, true, true, false),
('Comércio Exemplo S.A.', '98.765.432/0001-10', 'Maria Santos', 'Maria Santos', 'info@comercioexemplo.com', '(11) 88888-8888', 'comercio', 'presumido', 'facil', true, false, true, false, true, true),
('Indústria ABC LTDA', '11.222.333/0001-44', 'Pedro Costa', 'Pedro Costa', 'contato@industriaabc.com', '(11) 77777-7777', 'industria', 'real', 'dificil', true, true, true, true, true, false),
('Rural Sul LTDA', '22.333.444/0001-55', 'Ana Oliveira', 'Ana Oliveira', 'contato@ruralsul.com', '(11) 66666-6666', 'rural', 'simples', 'medio', false, true, false, true, false, true),
('Serviços Norte ME', '33.444.555/0001-66', 'Carlos Lima', 'Carlos Lima', 'info@servicosnorte.com', '(11) 55555-5555', 'servicos', 'mei', 'facil', false, false, true, false, true, false);

INSERT INTO public.systems (name, version, description, responsible, status, start_date, expected_end_date, actual_end_date, progress, is_implemented, system_url) VALUES
('Sistema ERP Financeiro', '1.0.0', 'Sistema integrado de gestão financeira com módulos de contas a pagar, receber e fluxo de caixa', 'Equipe TI', 'in_progress', NOW() - INTERVAL '3 months', NOW() + INTERVAL '3 months', NULL, 75, false, 'https://erp.techsolutions.com'),
('Portal do Cliente', '2.1.0', 'Portal web para acesso dos clientes com consultas e solicitações', 'Equipe TI', 'completed', NOW() - INTERVAL '1 year', NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months', 100, true, 'https://portal.techsolutions.com'),
('Sistema de Estoque', '1.5.0', 'Controle de estoque automatizado com código de barras', 'Equipe TI', 'testing', NOW() - INTERVAL '4 months', NOW() + INTERVAL '1 month', NULL, 90, false, 'https://estoque.techsolutions.com'),
('Sistema Contábil', '3.0.0', 'Sistema para gestão contábil completa', 'Equipe Contábil', 'planned', NOW() + INTERVAL '1 month', NOW() + INTERVAL '8 months', NULL, 0, false, NULL),
('Sistema de RH', '1.2.0', 'Gestão de recursos humanos e folha de pagamento', 'Equipe RH', 'in_progress', NOW() - INTERVAL '2 months', NOW() + INTERVAL '4 months', NULL, 45, false, 'https://rh.techsolutions.com');

-- Inserir relacionamentos sistema-empresa
INSERT INTO public.system_companies (system_id, company_id) VALUES
((SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro'), (SELECT id FROM public.companies WHERE name = 'Tech Solutions LTDA')),
((SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro'), (SELECT id FROM public.companies WHERE name = 'Comércio Exemplo S.A.')),
((SELECT id FROM public.systems WHERE name = 'Portal do Cliente'), (SELECT id FROM public.companies WHERE name = 'Tech Solutions LTDA')),
((SELECT id FROM public.systems WHERE name = 'Sistema de Estoque'), (SELECT id FROM public.companies WHERE name = 'Indústria ABC LTDA')),
((SELECT id FROM public.systems WHERE name = 'Sistema Contábil'), (SELECT id FROM public.companies WHERE name = 'Rural Sul LTDA')),
((SELECT id FROM public.systems WHERE name = 'Sistema de RH'), (SELECT id FROM public.companies WHERE name = 'Serviços Norte ME'));

-- Inserir tags dos sistemas
INSERT INTO public.system_tags (system_id, tag) VALUES
((SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro'), 'ERP'),
((SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro'), 'Financeiro'),
((SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro'), 'Gestão'),
((SELECT id FROM public.systems WHERE name = 'Portal do Cliente'), 'Portal'),
((SELECT id FROM public.systems WHERE name = 'Portal do Cliente'), 'Web'),
((SELECT id FROM public.systems WHERE name = 'Portal do Cliente'), 'Cliente'),
((SELECT id FROM public.systems WHERE name = 'Sistema de Estoque'), 'Estoque'),
((SELECT id FROM public.systems WHERE name = 'Sistema de Estoque'), 'Inventário'),
((SELECT id FROM public.systems WHERE name = 'Sistema Contábil'), 'Contabilidade'),
((SELECT id FROM public.systems WHERE name = 'Sistema Contábil'), 'Fiscal'),
((SELECT id FROM public.systems WHERE name = 'Sistema de RH'), 'RH'),
((SELECT id FROM public.systems WHERE name = 'Sistema de RH'), 'Folha de Pagamento');

INSERT INTO public.tasks (title, description, system_id, company_id, responsible, priority, status, due_date, completed_at, reminder_enabled) VALUES
('Implementar módulo de vendas', 'Desenvolver funcionalidade completa de vendas no ERP com relatórios', (SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro'), (SELECT id FROM public.companies WHERE name = 'Tech Solutions LTDA'), 'João Silva', 'high', 'in_progress', NOW() + INTERVAL '2 weeks', NULL, true),
('Testar portal do cliente', 'Realizar testes de integração completos no portal', (SELECT id FROM public.systems WHERE name = 'Portal do Cliente'), (SELECT id FROM public.companies WHERE name = 'Tech Solutions LTDA'), 'Maria Santos', 'medium', 'completed', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week', false),
('Documentar API do sistema', 'Criar documentação completa da API com exemplos', (SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro'), NULL, 'Pedro Costa', 'low', 'pending', NOW() + INTERVAL '1 month', NULL, true),
('Configurar backup automático', 'Implementar rotina de backup automático do banco de dados', NULL, (SELECT id FROM public.companies WHERE name = 'Indústria ABC LTDA'), 'Carlos Lima', 'high', 'in_progress', NOW() + INTERVAL '1 week', NULL, true),
('Treinar usuários no sistema', 'Realizar treinamento dos usuários finais', (SELECT id FROM public.systems WHERE name = 'Sistema de Estoque'), (SELECT id FROM public.companies WHERE name = 'Indústria ABC LTDA'), 'Ana Oliveira', 'medium', 'pending', NOW() + INTERVAL '3 weeks', NULL, false),
('Migrar dados legacy', 'Migrar dados do sistema antigo para o novo', (SELECT id FROM public.systems WHERE name = 'Sistema Contábil'), (SELECT id FROM public.companies WHERE name = 'Rural Sul LTDA'), 'João Silva', 'high', 'pending', NOW() + INTERVAL '2 months', NULL, true);

-- Inserir canais de lembrete para tarefas
INSERT INTO public.task_reminder_channels (task_id, channel) VALUES
((SELECT id FROM public.tasks WHERE title = 'Implementar módulo de vendas'), 'email'),
((SELECT id FROM public.tasks WHERE title = 'Implementar módulo de vendas'), 'whatsapp'),
((SELECT id FROM public.tasks WHERE title = 'Documentar API do sistema'), 'email'),
((SELECT id FROM public.tasks WHERE title = 'Configurar backup automático'), 'email'),
((SELECT id FROM public.tasks WHERE title = 'Migrar dados legacy'), 'email'),
((SELECT id FROM public.tasks WHERE title = 'Migrar dados legacy'), 'whatsapp');

-- Inserir subtarefas
INSERT INTO public.subtasks (task_id, title, completed) VALUES
((SELECT id FROM public.tasks WHERE title = 'Implementar módulo de vendas'), 'Criar estrutura do banco de dados', true),
((SELECT id FROM public.tasks WHERE title = 'Implementar módulo de vendas'), 'Desenvolver API de vendas', true),
((SELECT id FROM public.tasks WHERE title = 'Implementar módulo de vendas'), 'Criar interface de usuário', false),
((SELECT id FROM public.tasks WHERE title = 'Implementar módulo de vendas'), 'Implementar relatórios', false),
((SELECT id FROM public.tasks WHERE title = 'Documentar API do sistema'), 'Listar endpoints', false),
((SELECT id FROM public.tasks WHERE title = 'Documentar API do sistema'), 'Criar exemplos de uso', false),
((SELECT id FROM public.tasks WHERE title = 'Documentar API do sistema'), 'Revisar documentação', false),
((SELECT id FROM public.tasks WHERE title = 'Configurar backup automático'), 'Escolher ferramenta de backup', true),
((SELECT id FROM public.tasks WHERE title = 'Configurar backup automático'), 'Configurar agendamento', false),
((SELECT id FROM public.tasks WHERE title = 'Configurar backup automático'), 'Testar recuperação', false);

INSERT INTO public.incidents (title, description, company_id, severity, status, resolved_at) VALUES
('Erro no sistema de login', 'Usuários não conseguem fazer login no sistema ERP, erro de autenticação', (SELECT id FROM public.companies WHERE name = 'Tech Solutions LTDA'), 'high', 'open', NULL),
('Lentidão no carregamento do portal', 'Portal do cliente está carregando muito lentamente, causando timeout', (SELECT id FROM public.companies WHERE name = 'Tech Solutions LTDA'), 'medium', 'in_progress', NULL),
('Erro de sincronização de estoque', 'Sistema de estoque não está sincronizando corretamente com ERP', (SELECT id FROM public.companies WHERE name = 'Indústria ABC LTDA'), 'high', 'open', NULL),
('Backup falhou', 'Rotina de backup automático falhou na madrugada', (SELECT id FROM public.companies WHERE name = 'Comércio Exemplo S.A.'), 'critical', 'resolved', NOW() - INTERVAL '2 days'),
('Relatório com dados incorretos', 'Relatório financeiro apresentando valores inconsistentes', (SELECT id FROM public.companies WHERE name = 'Rural Sul LTDA'), 'medium', 'in_progress', NULL);

-- Inserir relacionamentos incidente-sistema
INSERT INTO public.incident_systems (incident_id, system_id) VALUES
((SELECT id FROM public.incidents WHERE title = 'Erro no sistema de login'), (SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro')),
((SELECT id FROM public.incidents WHERE title = 'Lentidão no carregamento do portal'), (SELECT id FROM public.systems WHERE name = 'Portal do Cliente')),
((SELECT id FROM public.incidents WHERE title = 'Erro de sincronização de estoque'), (SELECT id FROM public.systems WHERE name = 'Sistema de Estoque')),
((SELECT id FROM public.incidents WHERE title = 'Erro de sincronização de estoque'), (SELECT id FROM public.systems WHERE name = 'Sistema ERP Financeiro')),
((SELECT id FROM public.incidents WHERE title = 'Relatório com dados incorretos'), (SELECT id FROM public.systems WHERE name = 'Sistema Contábil'));

-- Inserir notas dos incidentes
INSERT INTO public.incident_notes (incident_id, note) VALUES
((SELECT id FROM public.incidents WHERE title = 'Erro no sistema de login'), 'Identificado problema no servidor de autenticação'),
((SELECT id FROM public.incidents WHERE title = 'Erro no sistema de login'), 'Tentativa de reinicialização do serviço realizada'),
((SELECT id FROM public.incidents WHERE title = 'Lentidão no carregamento do portal'), 'Analisando logs do servidor web'),
((SELECT id FROM public.incidents WHERE title = 'Lentidão no carregamento do portal'), 'Possível problema de performance na consulta ao banco'),
((SELECT id FROM public.incidents WHERE title = 'Erro de sincronização de estoque'), 'Erro ocorre sempre às 14h durante sincronização'),
((SELECT id FROM public.incidents WHERE title = 'Backup falhou'), 'Espaço em disco insuficiente identificado'),
((SELECT id FROM public.incidents WHERE title = 'Backup falhou'), 'Liberado espaço e backup executado com sucesso'),
((SELECT id FROM public.incidents WHERE title = 'Relatório com dados incorretos'), 'Verificando integridade dos dados contábeis');
