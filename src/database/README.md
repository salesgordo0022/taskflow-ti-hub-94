
# Configuração do Banco de Dados Supabase

## Instruções para Configuração

### 1. Conectar ao Supabase
1. Clique no botão verde "Supabase" no canto superior direito da interface do Lovable
2. Conecte sua conta Supabase ou crie uma nova
3. Crie um novo projeto ou selecione um existente

### 2. Executar o Schema SQL
1. No painel do Supabase, vá para "SQL Editor"
2. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
3. Execute o script para criar todas as tabelas e configurações

### 3. Estrutura das Tabelas Criadas

#### Tabelas Principais:
- **users**: Perfis de usuários (complementa auth.users)
- **companies**: Dados das empresas
- **systems**: Sistemas/projetos em desenvolvimento
- **tasks**: Tarefas e atividades
- **incidents**: Incidentes e problemas

#### Tabelas de Relacionamento:
- **system_companies**: Relaciona sistemas com empresas
- **system_tags**: Tags dos sistemas
- **system_users**: Usuários com acesso aos sistemas
- **task_reminder_channels**: Canais de lembrete das tarefas
- **subtasks**: Subtarefas
- **incident_systems**: Relaciona incidentes com sistemas
- **incident_notes**: Notas dos incidentes

### 4. Recursos Configurados

#### Row Level Security (RLS)
- Todas as tabelas têm RLS habilitado
- Políticas básicas de segurança implementadas
- Usuários só podem acessar dados conforme permissões

#### Triggers Automáticos
- Campo `updated_at` atualizado automaticamente
- Função `update_updated_at_column()` criada para todas as tabelas relevantes

#### Constraints e Validações
- Checks para garantir valores válidos em campos enum
- Chaves estrangeiras para manter integridade referencial
- Campos obrigatórios definidos como NOT NULL

### 5. Próximos Passos

Após executar o schema:

1. **Configurar Authentication**: Configure os providers de autenticação desejados
2. **Ajustar Políticas RLS**: Refine as políticas conforme regras de negócio específicas
3. **Criar Índices**: Adicione índices para otimizar consultas frequentes
4. **Configurar Storage**: Se necessário, configure buckets para arquivos
5. **Testar Conectividade**: Teste a conexão do frontend com o banco

### 6. Variáveis de Ambiente Necessárias

Certifique-se de que as seguintes variáveis estão configuradas:
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

### 7. Observações Importantes

- IDs são gerados automaticamente como UUID
- Timestamps incluem timezone
- Soft deletes não implementados (usar CASCADE nas FK)
- RLS configurado para usuários autenticados
- Campos de texto usam TEXT (sem limite de caracteres)

Para dúvidas ou ajustes nas políticas de segurança, consulte a documentação oficial do Supabase.
