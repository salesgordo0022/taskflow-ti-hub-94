export interface Company {
  id: string;
  name: string;
  cnpj: string;
  responsible: string;
  email: string;
  phone: string;
  createdAt: Date;
  // Novos campos para controle contábil
  segment: 'comercio' | 'industria' | 'servicos' | 'rural' | 'outros';
  regime: 'simples' | 'presumido' | 'real' | 'mei';
  level: 'facil' | 'medio' | 'dificil';
  // Automações específicas
  hasNotaEntrada: boolean;
  hasNotaSaida: boolean;
  hasCupom: boolean;
  hasApuracao: boolean;
  hasEnvioDocumentos: boolean;
  isAutomated: boolean;
  responsiblePerson: string;
}

export interface System {
  id: string;
  name: string;
  version: string;
  description: string;
  responsible: string;
  status: 'planned' | 'in_progress' | 'testing' | 'completed';
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  companies: string[];
  progress: number;
  tags: string[];
  isImplemented: boolean;
  accessUsers: string[];
  systemUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  systemId?: string;
  companyId?: string;
  responsible: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  reminderEnabled: boolean;
  reminderChannels: ('email' | 'whatsapp')[];
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'ti' | 'accountant';
  phone?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  systemIds: string[]; // agora pode ser vários sistemas
  companyId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  notes: string[];
}
