
// Este arquivo agora serve apenas como fallback e referência
// Os dados reais são buscados do Supabase através dos hooks customizados

import { Company, System, Task, User, Incident } from '@/types';

// Dados de exemplo para desenvolvimento (caso não haja conexão com Supabase)
export const mockCompanies: Company[] = [];
export const mockSystems: System[] = [];
export const mockTasks: Task[] = [];
export const mockUsers: User[] = [];
export const mockIncidents: Incident[] = [];

// Funções utilitárias que podem ser úteis
export const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'resolved': return 'text-green-400';
    case 'in_progress': return 'text-blue-400';
    case 'pending':
    case 'open': return 'text-yellow-400';
    case 'planned': return 'text-purple-400';
    case 'testing': return 'text-orange-400';
    default: return 'text-gray-400';
  }
};

export const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
  switch (severity) {
    case 'low': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-orange-400';
    case 'critical': return 'text-red-400';
    default: return 'text-gray-400';
  }
};
