import { Company, System, Task, User, Incident } from '@/types';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'ABC Indústria Ltda',
    cnpj: '12.345.678/0001-90',
    responsible: 'Maria Silva',
    email: 'maria@abcindustria.com',
    phone: '(11) 98765-4321',
    createdAt: new Date('2024-01-15'),
    hasNotaEntrada: true,
    hasNotaSaida: true,
    hasCupom: false,
    isAutomated: true,
    responsiblePerson: 'Maria Silva'
  },
  {
    id: '2',
    name: 'XYZ Comércio S.A.',
    cnpj: '98.765.432/0001-10',
    responsible: 'João Santos',
    email: 'joao@xyzcomercio.com',
    phone: '(11) 99876-5432',
    createdAt: new Date('2024-02-20'),
    hasNotaEntrada: true,
    hasNotaSaida: false,
    hasCupom: true,
    isAutomated: false,
    responsiblePerson: 'João Santos'
  },
  {
    id: '3',
    name: 'Tech Solutions',
    cnpj: '11.222.333/0001-44',
    responsible: 'Ana Costa',
    email: 'ana@techsolutions.com',
    phone: '(11) 91234-5678',
    createdAt: new Date('2024-03-10'),
    hasNotaEntrada: false,
    hasNotaSaida: true,
    hasCupom: true,
    isAutomated: true,
    responsiblePerson: 'Ana Costa'
  }
];

export const mockSystems: System[] = [
  {
    id: '1',
    name: 'ERP Fiscal v2.0',
    version: '2.0.1',
    description: 'Sistema de gestão fiscal integrado',
    responsible: 'Carlos TI',
    status: 'in_progress',
    startDate: new Date('2024-05-01'),
    expectedEndDate: new Date('2024-06-15'),
    companies: ['1', '2'],
    progress: 65,
    tags: ['fiscal', 'erp', 'integração'],
    isImplemented: true,
    accessUsers: ['carlos@empresa.com', 'ana@empresa.com'],
    systemUrl: 'https://erp-fiscal.exemplo.com'
  },
  {
    id: '2',
    name: 'Folha de Pagamento Pro',
    version: '3.2.0',
    description: 'Sistema completo de folha de pagamento',
    responsible: 'Ana TI',
    status: 'testing',
    startDate: new Date('2024-04-15'),
    expectedEndDate: new Date('2024-05-30'),
    companies: ['1', '3'],
    progress: 90,
    tags: ['folha', 'rh', 'cálculos'],
    isImplemented: true,
    accessUsers: ['ana@empresa.com', 'pedro@empresa.com', 'carlos@empresa.com'],
    systemUrl: 'https://folha-pagamento.exemplo.com'
  },
  {
    id: '3',
    name: 'Emissor NFe',
    version: '1.8.5',
    description: 'Emissor de notas fiscais eletrônicas',
    responsible: 'Carlos TI',
    status: 'planned',
    startDate: new Date('2024-06-01'),
    expectedEndDate: new Date('2024-07-15'),
    companies: ['2', '3'],
    progress: 15,
    tags: ['nfe', 'fiscal', 'sefaz'],
    isImplemented: false,
    accessUsers: ['carlos@empresa.com']
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Configurar banco de dados',
    description: 'Instalação e configuração inicial do PostgreSQL',
    systemId: '1',
    companyId: '1',
    responsible: 'Carlos TI',
    priority: 'high',
    status: 'completed',
    dueDate: new Date('2024-05-05'),
    createdAt: new Date('2024-05-01'),
    completedAt: new Date('2024-05-04'),
    reminderEnabled: true,
    reminderChannels: ['email', 'whatsapp'],
    subtasks: [
      { id: '1-1', title: 'Baixar PostgreSQL', completed: true },
      { id: '1-2', title: 'Configurar usuários', completed: true },
      { id: '1-3', title: 'Testar conexão', completed: true }
    ]
  },
  {
    id: '2',
    title: 'Implementar módulo fiscal',
    description: 'Desenvolvimento das rotinas de cálculo fiscal',
    systemId: '1',
    companyId: '1',
    responsible: 'Ana TI',
    priority: 'high',
    status: 'in_progress',
    dueDate: new Date('2024-06-10'),
    createdAt: new Date('2024-05-15'),
    reminderEnabled: true,
    reminderChannels: ['email'],
    subtasks: [
      { id: '2-1', title: 'Calcular ICMS', completed: true },
      { id: '2-2', title: 'Calcular IPI', completed: false },
      { id: '2-3', title: 'Validar regras', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Treinar usuários finais',
    description: 'Sessão de treinamento para equipe contábil',
    systemId: '2',
    companyId: '3',
    responsible: 'Carlos TI',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date('2024-06-20'),
    createdAt: new Date('2024-05-20'),
    reminderEnabled: true,
    reminderChannels: ['email', 'whatsapp'],
    subtasks: [
      { id: '3-1', title: 'Preparar material', completed: false },
      { id: '3-2', title: 'Agendar sessão', completed: false },
      { id: '3-3', title: 'Realizar treinamento', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Backup de segurança',
    description: 'Configurar rotina de backup automático',
    systemId: '1',
    companyId: '2',
    responsible: 'Ana TI',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date('2024-06-01'),
    createdAt: new Date('2024-05-25'),
    reminderEnabled: false,
    reminderChannels: [],
    subtasks: []
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos@empresa.com',
    role: 'ti',
    phone: '(11) 91111-1111'
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'ana@empresa.com',
    role: 'ti',
    phone: '(11) 92222-2222'
  },
  {
    id: '3',
    name: 'Pedro Admin',
    email: 'admin@empresa.com',
    role: 'admin',
    phone: '(11) 93333-3333'
  }
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Erro de conexão com SEFAZ',
    description: 'Sistema não consegue conectar com webservice da SEFAZ',
    systemId: '3',
    companyId: '2',
    severity: 'high',
    status: 'in_progress',
    createdAt: new Date('2024-05-28'),
    notes: ['Verificando certificado digital', 'Testando nova URL']
  },
  {
    id: '2',
    title: 'Lentidão no relatório de folha',
    description: 'Relatório mensal demora mais de 5 minutos para gerar',
    systemId: '2',
    companyId: '1',
    severity: 'medium',
    status: 'open',
    createdAt: new Date('2024-05-30'),
    notes: ['Query precisa de otimização']
  }
];
