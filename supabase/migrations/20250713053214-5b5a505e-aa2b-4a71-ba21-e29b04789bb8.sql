-- Temporariamente remover restrição RLS para permitir inserções anônimas
-- Isso permitirá que o sistema funcione enquanto implementamos autenticação adequada

-- Remover políticas RLS restritivas para permitir operações básicas
DROP POLICY IF EXISTS "Authenticated users can access companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can access systems" ON public.systems;
DROP POLICY IF EXISTS "Authenticated users can access tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can access incidents" ON public.incidents;
DROP POLICY IF EXISTS "Authenticated users can access subtasks" ON public.subtasks;
DROP POLICY IF EXISTS "Authenticated users can access system_companies" ON public.system_companies;
DROP POLICY IF EXISTS "Authenticated users can access system_tags" ON public.system_tags;
DROP POLICY IF EXISTS "Authenticated users can access system_users" ON public.system_users;
DROP POLICY IF EXISTS "Authenticated users can access task_reminder_channels" ON public.task_reminder_channels;
DROP POLICY IF EXISTS "Authenticated users can access incident_systems" ON public.incident_systems;
DROP POLICY IF EXISTS "Authenticated users can access incident_notes" ON public.incident_notes;

-- Criar políticas mais permissivas para permitir operações básicas
CREATE POLICY "Allow all operations on companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on systems" ON public.systems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on incidents" ON public.incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on subtasks" ON public.subtasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on system_companies" ON public.system_companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on system_tags" ON public.system_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on system_users" ON public.system_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on task_reminder_channels" ON public.task_reminder_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on incident_systems" ON public.incident_systems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on incident_notes" ON public.incident_notes FOR ALL USING (true) WITH CHECK (true);