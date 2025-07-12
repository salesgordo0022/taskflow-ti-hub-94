
// Configurações centralizadas do Supabase
export const SUPABASE_CONFIG = {
  url: 'https://qeaoucacctigdgdzqpgm.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYW91Y2FjY3RpZ2RnZHpxcGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzUxNTQsImV4cCI6MjA2Nzg1MTE1NH0.VTyrO9X5F4IkPm7Lu--vLpTxdvFZuQhGTg3HR8mrjyI'
};

// Tipos de tabelas para facilitar o desenvolvimento
export const SUPABASE_TABLES = {
  USERS: 'users',
  COMPANIES: 'companies',
  SYSTEMS: 'systems',
  SYSTEM_COMPANIES: 'system_companies',
  SYSTEM_TAGS: 'system_tags',
  SYSTEM_USERS: 'system_users',
  TASKS: 'tasks',
  TASK_REMINDER_CHANNELS: 'task_reminder_channels',
  SUBTASKS: 'subtasks',
  INCIDENTS: 'incidents',
  INCIDENT_SYSTEMS: 'incident_systems',
  INCIDENT_NOTES: 'incident_notes'
} as const;

// Configurações de RLS (Row Level Security)
export const RLS_POLICIES = {
  AUTHENTICATED_ONLY: 'authenticated',
  USER_OWN_DATA: 'user_own_data'
} as const;
