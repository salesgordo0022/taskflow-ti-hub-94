import { useState } from 'react';
import { 
  CheckSquare, 
  Server, 
  Building2, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/auth/LoginScreen';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import SystemProgressChart from '@/components/dashboard/SystemProgressChart';
import TaskPriorityChart from '@/components/dashboard/TaskPriorityChart';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanyCreateModal from '@/components/companies/CompanyCreateModal';
import CompanyImportModal from '@/components/companies/CompanyImportModal';
import SystemCard from '@/components/systems/SystemCard';
import SystemCreateModal from '@/components/systems/SystemCreateModal';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import IncidentCard from '@/components/incidents/IncidentCard';
import CalendarView from '@/components/calendar/CalendarView';
import ProfileSettings from '@/components/profile/ProfileSettings';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import CompanyListTable from '@/components/companies/CompanyListTable';
import CompanyTemplateDownload from '@/components/companies/CompanyTemplateDownload';
import SystemManagementTips from '@/components/systems/SystemManagementTips';
import SystemUserManagement from '@/components/systems/SystemUserManagement';
import AutomationReport from '@/components/dashboard/AutomationReport';
import MindMapEditor from '@/components/MindMapEditor';
import { Node, Edge, addEdge, useNodesState, useEdgesState, Connection } from 'reactflow';
import { ReactFlowProvider } from 'reactflow';
import { addDays } from 'date-fns';

// Importar hooks do Supabase
import { useCompanies, useCreateCompany, useUpdateCompany } from '@/hooks/useCompanies';
import { useSystems, useCreateSystem, useUpdateSystem } from '@/hooks/useSystems';
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { useIncidents, useCreateIncident, useUpdateIncident } from '@/hooks/useIncidents';
import { useUsers } from '@/hooks/useUsers';

import { Task, Company, System } from '@/types';
import React from 'react';
import IncidentCreateModal from '@/components/incidents/IncidentCreateModal';
import { Incident } from '@/types';
import Aurora from '@/components/animations/Aurora';
import TaskCard from '@/components/tasks/TaskCard';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import TaskEditModal from '@/components/tasks/TaskEditModal';
import * as XLSX from 'xlsx';
import ChecklistTab from '@/components/tools/ChecklistTab';
import InventoryTab from '@/components/tools/InventoryTab';
import KnowledgeBaseTab from '@/components/tools/KnowledgeBaseTab';
import ScriptsToolsTab from '@/components/tools/ScriptsToolsTab';
import NetworkTestTab from '@/components/tools/NetworkTestTab';

const LOCAL_STORAGE_KEY = 'mindmaps';

interface MindMapData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

function loadMindMaps(): MindMapData[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [
    { id: '1', name: 'Mapa Mental Exemplo', nodes: [ { id: '1', type: 'default', data: { label: 'Ideia Central' }, position: { x: 250, y: 150 } } ], edges: [] }
  ];
  return JSON.parse(data);
}

function saveMindMaps(maps: MindMapData[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(maps));
}

const Index: React.FC = () => {
  console.log('Index component rendering...');
  
  const { isAuthenticated } = useAuth();
  console.log('Authentication status:', isAuthenticated);

  // Usar hooks do Supabase para dados reais
  console.log('Initializing Supabase hooks...');
  
  const { data: companies = [], isLoading: companiesLoading, error: companiesError } = useCompanies();
  const { data: systems = [], isLoading: systemsLoading, error: systemsError } = useSystems();
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useTasks();
  const { data: incidents = [], isLoading: incidentsLoading, error: incidentsError } = useIncidents();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers();

  console.log('Hook status:', {
    companiesLoading, systemsLoading, tasksLoading, incidentsLoading, usersLoading,
    companiesError, systemsError, tasksError, incidentsError, usersError
  });

  // Hooks de mutação
  const { mutate: createCompany } = useCreateCompany();
  const { mutate: updateCompany } = useUpdateCompany();
  const { mutate: createSystem } = useCreateSystem();
  const { mutate: updateSystem } = useUpdateSystem();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: createIncident } = useCreateIncident();
  const { mutate: updateIncident } = useUpdateIncident();

  // HOOKS DEVEM VIR ANTES DE QUALQUER RETURN!
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemTab, setSystemTab] = useState<'overview' | 'users' | 'tips'>('overview');
  const [taskTab, setTaskTab] = useState<'kanban' | 'list' | 'completed'>('kanban');

  // Estado para múltiplos mapas mentais
  const [mindMaps, setMindMaps] = useState<MindMapData[]>(loadMindMaps());
  const [selectedMindMapId, setSelectedMindMapId] = useState<string>(mindMaps[0]?.id || '');
  // Novo estado: se o editor está aberto
  const [mindMapEditorOpen, setMindMapEditorOpen] = useState<boolean>(false);

  // FILTROS DE TAREFAS (mover para o topo)
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('all');
  const [taskFilterPriority, setTaskFilterPriority] = useState<string>('all');
  const [taskFilterResponsible, setTaskFilterResponsible] = useState<string>('all');
  const [taskFilterSystem, setTaskFilterSystem] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState<string>('');

  // Função para filtrar tarefas (deve ficar fora do renderContent)
  const filteredTasks = tasks.filter(task => {
    const statusOk = taskFilterStatus === 'all' || task.status === taskFilterStatus;
    const priorityOk = taskFilterPriority === 'all' || task.priority === taskFilterPriority;
    const responsibleOk = taskFilterResponsible === 'all' || task.responsible === taskFilterResponsible;
    // Suporte a sistema (caso a task tenha systemId)
    const systemOk = taskFilterSystem === 'all' || (task.systemId && task.systemId === taskFilterSystem);
    const searchOk =
      task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(taskSearch.toLowerCase()));
    return statusOk && priorityOk && responsibleOk && systemOk && searchOk;
  });

  // Atualiza localStorage sempre que mindMaps muda
  React.useEffect(() => { saveMindMaps(mindMaps); }, [mindMaps]);

  const selectedMindMap = mindMaps.find(m => m.id === selectedMindMapId) || mindMaps[0];

  // Hooks de estado para o editor
  const [nodes, setNodes, onNodesChange] = useNodesState(selectedMindMap?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(selectedMindMap?.edges || []);

  // Sincroniza nodes/edges do editor com o mapa selecionado
  React.useEffect(() => {
    setNodes(selectedMindMap?.nodes || []);
    setEdges(selectedMindMap?.edges || []);
  }, [selectedMindMapId]);

  // Salva alterações do editor no mapa selecionado
  React.useEffect(() => {
    setMindMaps(maps => maps.map(m => m.id === selectedMindMapId ? { ...m, nodes, edges } : m));
  }, [nodes, edges]);

  const onConnect = React.useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onPaneDoubleClick = React.useCallback((event: React.MouseEvent) => {
    const bounds = (event.target as HTMLDivElement).getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'default',
      data: { label: 'Novo Nó' },
      position,
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  // CRUD de mapas mentais
  const createMindMap = () => {
    const newId = (Date.now()).toString();
    const newMap: MindMapData = {
      id: newId,
      name: `Novo Mapa ${mindMaps.length + 1}`,
      nodes: [ { id: '1', type: 'default', data: { label: 'Ideia Central' }, position: { x: 250, y: 150 } } ],
      edges: []
    };
    setMindMaps(maps => [...maps, newMap]);
    setSelectedMindMapId(newId);
  };
  const renameMindMap = (id: string, name: string) => {
    setMindMaps(maps => maps.map(m => m.id === id ? { ...m, name } : m));
  };
  const deleteMindMap = (id: string) => {
    let idx = mindMaps.findIndex(m => m.id === id);
    if (idx === -1) return;
    const newMaps = mindMaps.filter(m => m.id !== id);
    setMindMaps(newMaps);
    if (newMaps.length > 0) setSelectedMindMapId(newMaps[Math.max(0, idx-1)].id);
    else createMindMap();
  };
  // Atualizar para abrir editor ao clicar
  const handleSelectMindMap = (id: string) => {
    setSelectedMindMapId(id);
    setMindMapEditorOpen(true);
  };

  console.log('About to check authentication...');

  // HOOKS TERMINAM AQUI. SÓ DEPOIS PODE HAVER RETURN CONDICIONAL!
  if (!isAuthenticated) {
    console.log('User not authenticated, showing login screen');
    return <LoginScreen />;
  }

  // Mostrar loading se os dados ainda estão carregando
  const isAnyLoading = companiesLoading || systemsLoading || tasksLoading || incidentsLoading || usersLoading;
  
  if (isAnyLoading) {
    console.log('Loading data from Supabase...');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Aurora />
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-400 font-mono text-lg">Carregando dados do sistema...</p>
        </div>
      </div>
    );
  }

  console.log('Data loaded, rendering main interface');

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      updateTask({ ...taskToUpdate, status });
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    updateTask(updatedTask);
  };

  const handleCompanyUpdate = (updatedCompany: Company) => {
    updateCompany(updatedCompany);
  };

  const handleCompanyCreate = (newCompany: Omit<Company, 'id' | 'createdAt'>) => {
    createCompany(newCompany);
  };

  const handleCompanyImport = (importedCompanies: Company[]) => {
    importedCompanies.forEach(company => {
      const { id, createdAt, ...companyData } = company;
      createCompany(companyData);
    });
  };

  const handleSystemUpdate = (updatedSystem: System) => {
    updateSystem(updatedSystem);
  };

  const handleSystemCreate = (newSystem: Omit<System, 'id'>) => {
    createSystem(newSystem);
  };

  // Função para criar tarefa
  const handleTaskCreate = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    createTask(newTask);
  };

  // Função para criar incidente
  const handleIncidentCreate = (newIncident: Omit<Incident, 'id' | 'createdAt'>) => {
    createIncident(newIncident);
  };

  // Função para atualizar incidente
  const handleIncidentUpdate = (updatedIncident: Incident) => {
    updateIncident(updatedIncident);
  };

  // Função para adicionar nota ao incidente
  const handleIncidentAddNote = (incidentId: string, note: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      updateIncident({ ...incident, notes: [...incident.notes, note] });
    }
  };

  const getCompanyNames = (companyIds: string[]) => {
    return companyIds.map(id => 
      companies.find(c => c.id === id)?.name || 'Empresa não encontrada'
    );
  };

  const getSystemName = (systemId: string) => {
    return systems.find(s => s.id === systemId)?.name || 'Sistema não encontrado';
  };

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'Empresa não encontrada';
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const systemsInProgress = systems.filter(s => s.status === 'in_progress').length;
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length;

  // Função para exportar tarefas filtradas para Excel
  const handleExportExcel = () => {
    // Monta os dados para exportação
    const data = filteredTasks.map(task => ({
      ID: task.id,
      Título: task.title,
      Descrição: task.description,
      Responsável: task.responsible,
      Prioridade: task.priority,
      Status: task.status,
      Vencimento: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
      CriadaEm: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tarefas');
    XLSX.writeFile(wb, 'tarefas.xlsx');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="card-dark p-6 rounded-lg border-blue-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</h1>
              </div>
              <p className="text-gray-300 font-mono">Visão geral do seu ambiente de TI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Tarefas Pendentes"
                value={pendingTasks}
                icon={CheckSquare}
                color="yellow"
                trend={{ value: 12, isPositive: false }}
              />
              <MetricCard
                title="Sistemas Ativos"
                value={systemsInProgress}
                icon={Server}
                color="green"
                trend={{ value: 8, isPositive: true }}
              />
              <MetricCard
                title="Empresas Atendidas"
                value={companies.length}
                icon={Building2}
                color="purple"
              />
              <MetricCard
                title="Incidentes Abertos"
                value={openIncidents}
                icon={AlertTriangle}
                color="red"
                trend={{ value: 25, isPositive: false }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SystemProgressChart />
              <TaskPriorityChart />
              <ProductivityChart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-dark p-6 rounded-lg border-yellow-500/30">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <h2 className="text-xl font-bold font-mono text-yellow-400">Tarefas Recentes</h2>
                </div>
                <div className="space-y-3">
                  {tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="p-4 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-lg hover:border-yellow-500/30 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white font-mono">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-mono border ${
                          task.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                          task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {task.status === 'completed' ? '✓ Concluído' :
                           task.status === 'in_progress' ? '⟳ Em Andamento' : '⏳ Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 font-mono">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-dark p-6 rounded-lg border-green-500/30">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <h2 className="text-xl font-bold font-mono text-green-400">Sistemas em Foco</h2>
                </div>
                <div className="space-y-3">
                  {systems.slice(0, 3).map(system => (
                    <div key={system.id} className="p-4 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-lg hover:border-green-500/30 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white font-mono">{system.name}</h3>
                        <span className="text-sm font-medium text-green-400 font-mono">{system.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700/60 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 shadow-lg shadow-green-500/20"
                          style={{ width: `${system.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="card-dark p-6 rounded-lg border-blue-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Relatórios</h1>
              </div>
              <p className="text-gray-300 font-mono">Análises e relatórios detalhados - Clique nos gráficos para ver detalhes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemProgressChart />
              <TaskPriorityChart />
              <ProductivityChart />
              <div className="card-dark p-6 rounded-lg border-green-500/30">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <h3 className="text-lg font-bold font-mono text-green-400">Resumo Executivo</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/30">
                    <span className="text-gray-300 font-mono">Taxa de Conclusão de Tarefas</span>
                    <span className="font-semibold text-blue-400 font-mono">75%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/30">
                    <span className="text-gray-300 font-mono">Tempo Médio de Resolução</span>
                    <span className="font-semibold text-blue-400 font-mono">3.2 dias</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/30">
                    <span className="text-gray-300 font-mono">Produtividade da Equipe</span>
                    <span className="font-semibold text-green-400 font-mono">+15%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/30">
                    <span className="text-gray-300 font-mono">Incidentes Críticos</span>
                    <span className="font-semibold text-red-400 font-mono">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'automation-report':
        return <AutomationReport companies={companies} />;

      case 'systems':
        return (
          <div className="space-y-6">
            {/* Header Principal */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Sistemas</h1>
                <p className="text-gray-300 font-mono">Controle acessos, usuários, descrições e responsáveis dos sistemas</p>
              </div>
              <div className="flex space-x-3">
                <SystemCreateModal onSave={handleSystemCreate} />
              </div>
            </div>

            {/* Abas de Navegação */}
            <div className="flex space-x-2 border-b border-gray-700/30">
              {[
                { id: 'overview', label: 'Visão Geral', icon: '📊', description: 'Lista de sistemas e status' },
                { id: 'users', label: 'Usuários e Acessos', icon: '👥', description: 'Gestão de usuários e permissões' },
                { id: 'tips', label: 'Dicas de Gestão', icon: '💡', description: 'Guia de boas práticas' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSystemTab(tab.id as 'overview' | 'users' | 'tips')}
                  className={`px-6 py-3 rounded-t-lg font-mono text-sm transition-all duration-200 flex flex-col items-center space-y-1 ${
                    systemTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                      : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-70">{tab.description}</span>
                </button>
              ))}
            </div>

            {/* Conteúdo das Abas */}
            {systemTab === 'overview' && (
              <div className="space-y-6">
                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="card-dark p-4 rounded-lg border-blue-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                      <div>
                        <p className="text-sm text-gray-400 font-mono">Total de Sistemas</p>
                        <p className="text-2xl font-bold text-blue-400 font-mono">{systems.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-dark p-4 rounded-lg border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <div>
                        <p className="text-sm text-gray-400 font-mono">Implementados</p>
                        <p className="text-2xl font-bold text-green-400 font-mono">
                          {systems.filter(s => s.isImplemented).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-dark p-4 rounded-lg border-yellow-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                      <div>
                        <p className="text-sm text-gray-400 font-mono">Em Desenvolvimento</p>
                        <p className="text-2xl font-bold text-yellow-400 font-mono">
                          {systems.filter(s => s.status === 'in_progress').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-dark p-4 rounded-lg border-purple-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <div>
                        <p className="text-sm text-gray-400 font-mono">Usuários Ativos</p>
                        <p className="text-2xl font-bold text-purple-400 font-mono">
                          {users.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de Sistemas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {systems.map(system => (
                    <SystemCard
                      key={system.id}
                      system={system}
                      companyNames={system.companies.map(id => 
                        companies.find(c => c.id === id)?.name || 'Empresa não encontrada'
                      )}
                      onUpdate={handleSystemUpdate}
                    />
                  ))}
                </div>

                {/* Mensagem quando não há sistemas */}
                {systems.length === 0 && (
                  <div className="card-dark p-8 rounded-lg border-gray-500/30 text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold text-gray-300 font-mono mb-2">Nenhum Sistema Cadastrado</h3>
                    <p className="text-gray-400 font-mono mb-4">
                      Comece criando seu primeiro sistema para gerenciar projetos e tarefas
                    </p>
                    <SystemCreateModal onSave={handleSystemCreate} />
                  </div>
                )}
              </div>
            )}

            {systemTab === 'users' && (
              <SystemUserManagement systems={systems} users={users} />
            )}

            {systemTab === 'tips' && (
              <SystemManagementTips />
            )}
          </div>
        );

      case 'notifications':
        return <NotificationsPanel />;

      case 'companies':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Empresas</h1>
                <p className="text-gray-300 font-mono">Configure notas fiscais, cupons e automação para cada empresa</p>
              </div>
              <div className="flex space-x-3">
                <CompanyTemplateDownload />
                <CompanyImportModal onImport={handleCompanyImport} />
                <CompanyCreateModal onSave={handleCompanyCreate} />
              </div>
            </div>
            <CompanyListTable companies={companies} onUpdate={handleCompanyUpdate} />
          </div>
        );

      case 'mindmap':
        return (
          <div className="space-y-6">
            <div className="card-dark p-6 rounded-lg border-pink-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
                <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">Mapa Mental</h1>
              </div>
              <p className="text-gray-300 font-mono">Crie, organize e navegue entre seus mapas mentais!</p>
            </div>
            <div className="flex gap-6">
              {/* Lista lateral de mapas mentais */}
              <div className="w-64 bg-gray-900/80 rounded-lg border border-pink-500/20 p-4 space-y-2 h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-pink-300 text-sm">Seus Mapas</span>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white rounded px-2 py-1 text-xs font-mono" onClick={createMindMap}>Novo</button>
                </div>
                {mindMaps.map(map => (
                  <div key={map.id} className={`flex items-center group rounded px-2 py-1 mb-1 cursor-pointer ${selectedMindMapId === map.id && mindMapEditorOpen ? 'bg-pink-500/20 text-pink-200' : 'hover:bg-gray-800/60 text-gray-300'}`}
                    onClick={() => handleSelectMindMap(map.id)}>
                    <span className="flex-1 truncate font-mono text-sm">{map.name}</span>
                    <button className="ml-1 text-xs text-pink-400 hover:text-pink-200" title="Renomear" onClick={e => {e.stopPropagation(); const newName = prompt('Novo nome:', map.name); if (newName) renameMindMap(map.id, newName);}}>✏️</button>
                    <button className="ml-1 text-xs text-pink-400 hover:text-pink-200" title="Excluir" onClick={e => {e.stopPropagation(); if (window.confirm('Excluir este mapa mental?')) deleteMindMap(map.id);}}>🗑️</button>
                  </div>
                ))}
              </div>
              {/* Editor visual do mapa mental só se aberto */}
              {mindMapEditorOpen && (
                <div className="flex-1 relative">
                  <button className="absolute top-2 right-2 z-10 bg-pink-700 hover:bg-pink-800 text-white rounded px-2 py-1 text-xs font-mono" onClick={() => setMindMapEditorOpen(false)}>Fechar</button>
                  {selectedMindMap && (
                    <ReactFlowProvider>
                      <MindMapEditor
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onPaneDoubleClick={onPaneDoubleClick}
                      />
                    </ReactFlowProvider>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'slack':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Slack</h1>
              <p className="text-gray-300 font-mono">Acesse sua equipe e canais do Slack</p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <a
                href="https://slack.com/signin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-blue-500 text-white font-mono text-lg hover:bg-blue-600 transition border border-blue-500/30"
              >
                Abrir Slack em nova aba
              </a>
              <span className="text-sm text-gray-400 font-mono">
                Por motivos de segurança, o Slack só pode ser acessado em uma nova aba do navegador.
              </span>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Tarefas</h1>
                <p className="text-neutral-300 font-mono text-lg">Organize e acompanhe todas as suas tarefas</p>
              </div>
              <button
                onClick={handleExportExcel}
                className="bg-blue-700 hover:bg-blue-800 text-white font-mono px-5 py-2 rounded-lg shadow border border-blue-500/30 transition-all text-base"
              >
                Exportar para Excel
              </button>
            </div>
            {/* PAINEL DE FILTROS E BUSCA */}
            <div className="flex flex-wrap gap-4 items-end mb-2 bg-neutral-900 p-4 rounded-lg border border-blue-500/10">
              <div>
                <label className="block text-xs text-blue-300 font-mono mb-1">Status</label>
                <select value={taskFilterStatus} onChange={e => setTaskFilterStatus(e.target.value)} className="bg-neutral-800 text-gray-100 rounded px-2 py-1 border border-neutral-700">
                  <option value="all">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-blue-300 font-mono mb-1">Prioridade</label>
                <select value={taskFilterPriority} onChange={e => setTaskFilterPriority(e.target.value)} className="bg-neutral-800 text-gray-100 rounded px-2 py-1 border border-neutral-700">
                  <option value="all">Todas</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-blue-300 font-mono mb-1">Responsável</label>
                <select value={taskFilterResponsible} onChange={e => setTaskFilterResponsible(e.target.value)} className="bg-neutral-800 text-gray-100 rounded px-2 py-1 border border-neutral-700">
                  <option value="all">Todos</option>
                  {Array.from(new Set(tasks.map(t => t.responsible))).map(res => (
                    <option key={res} value={res}>{res}</option>
                  ))}
                </select>
              </div>
            <div>
                <label className="block text-xs text-blue-300 font-mono mb-1">Sistema</label>
                <select value={taskFilterSystem} onChange={e => setTaskFilterSystem(e.target.value)} className="bg-neutral-800 text-gray-100 rounded px-2 py-1 border border-neutral-700">
                  <option value="all">Todos</option>
                  {systems.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs text-blue-300 font-mono mb-1">Buscar</label>
                <input
                  type="text"
                  value={taskSearch}
                  onChange={e => setTaskSearch(e.target.value)}
                  placeholder="Título ou descrição..."
                  className="bg-neutral-800 text-gray-100 rounded px-2 py-1 w-full border border-neutral-700"
                />
              </div>
            </div>
            {/* Sub-abas de visualização */}
            <div className="flex space-x-2 mb-4">
              <button
                className={`px-4 py-2 rounded-t-lg font-mono text-base transition-all duration-200 ${taskTab === 'kanban' ? 'bg-blue-500/20 text-blue-200 border-b-2 border-blue-400' : 'bg-neutral-900 text-gray-300 hover:bg-neutral-800'}`}
                onClick={() => setTaskTab('kanban')}
              >Kanban</button>
              <button
                className={`px-4 py-2 rounded-t-lg font-mono text-base transition-all duration-200 ${taskTab === 'list' ? 'bg-blue-500/20 text-blue-200 border-b-2 border-blue-400' : 'bg-neutral-900 text-gray-300 hover:bg-neutral-800'}`}
                onClick={() => setTaskTab('list')}
              >Lista</button>
              <button
                className={`px-4 py-2 rounded-t-lg font-mono text-base transition-all duration-200 ${taskTab === 'completed' ? 'bg-blue-500/20 text-blue-200 border-b-2 border-blue-400' : 'bg-neutral-900 text-gray-300 hover:bg-neutral-800'}`}
                onClick={() => setTaskTab('completed')}
              >Concluídas</button>
            </div>
            {/* Conteúdo das sub-abas */}
            {taskTab === 'kanban' && (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['pending', 'in_progress', 'completed'].map((status) => {
                    const colTitle = status === 'pending' ? 'Pendente' : status === 'in_progress' ? 'Em Andamento' : 'Concluído';
                    const colTasks = filteredTasks.filter(t => t.status === status);
                    return (
                      <div key={status} className="bg-neutral-900 rounded-lg border border-blue-500/10 flex flex-col max-h-[70vh]">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-blue-500/10">
                          <span className="font-mono text-blue-200 font-bold text-lg">{colTitle}</span>
                          <span className="bg-blue-500/20 text-blue-200 font-mono text-xs px-2 py-1 rounded-full">{colTasks.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                          {colTasks.length === 0 && (
                            <div className="text-center text-gray-500 font-mono py-8">Nenhuma tarefa</div>
                          )}
                          {colTasks.map(task => (
                            <div key={`task-${task.id}`} className="mb-2">
                              <TaskCard
                                task={task}
                                onStatusChange={handleTaskStatusChange}
                                onTaskUpdate={handleTaskUpdate}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-end">
                  <TaskCreateModal onCreate={handleTaskCreate} />
                </div>
              </div>
            )}
            {taskTab === 'list' && (
              <div className="bg-neutral-900 rounded-lg border border-blue-500/10 p-4">
                <table className="w-full text-left font-mono text-base">
                  <thead>
                    <tr className="text-blue-200">
                      <th className="py-2">Título</th>
                      <th>Responsável</th>
                      <th>Prioridade</th>
                      <th>Status</th>
                      <th>Vencimento</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <tr key={`task-${task.id}`} className="border-b border-neutral-700 hover:bg-neutral-800 text-gray-100">
                        <td className="py-2 font-semibold">{task.title}</td>
                        <td>{task.responsible}</td>
                        <td><span className={`px-2 py-1 rounded-full text-xs font-bold ${task.priority === 'high' ? 'bg-red-600/30 text-red-200' : task.priority === 'medium' ? 'bg-yellow-600/30 text-yellow-200' : 'bg-green-600/30 text-green-200'}`}>{task.priority}</span></td>
                        <td><span className={`px-2 py-1 rounded-full text-xs font-bold ${task.status === 'completed' ? 'bg-green-600/30 text-green-200' : task.status === 'in_progress' ? 'bg-blue-600/30 text-blue-200' : 'bg-yellow-600/30 text-yellow-200'}`}>{task.status}</span></td>
                        <td>{task.dueDate.toLocaleDateString()}</td>
                        <td><TaskEditModal task={task} onSave={handleTaskUpdate} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-end">
                  <TaskCreateModal onCreate={handleTaskCreate} />
                </div>
              </div>
            )}
            {taskTab === 'completed' && (
              <div className="bg-neutral-900 rounded-lg border border-green-500/10 p-4">
                <h3 className="text-green-200 font-mono font-bold mb-2 text-xl">Tarefas Concluídas</h3>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {filteredTasks.filter(t => t.status === 'completed').length === 0 && (
                    <div className="text-center text-gray-500 font-mono py-8">Nenhuma tarefa concluída</div>
                  )}
                  {filteredTasks.filter(t => t.status === 'completed').map(task => (
                    <TaskCard
                      key={`task-${task.id}`}
                      task={task}
                      onStatusChange={handleTaskStatusChange}
                      onTaskUpdate={handleTaskUpdate}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'incidents':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Incidentes</h1>
              <p className="text-gray-300 font-mono">Gerencie todos os incidentes técnicos</p>
              </div>
              <IncidentCreateModal onCreate={handleIncidentCreate} systems={systems} companies={companies} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {incidents.map(incident => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  systemNames={incident.systemIds.map(id => systems.find(s => s.id === id)?.name || 'Sistema não encontrado')}
                  companyName={companies.find(c => c.id === incident.companyId)?.name || 'Empresa não encontrada'}
                  systems={systems}
                  companies={companies}
                  onUpdate={handleIncidentUpdate}
                  onAddNote={handleIncidentAddNote}
                />
              ))}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Calendário</h1>
              <p className="text-gray-300 font-mono">Visualize todas as suas tarefas e prazos</p>
            </div>

            <CalendarView tasks={tasks} />
          </div>
        );

      case 'settings':
        return <ProfileSettings />;

      case 'checklist':
        return <ChecklistTab />;
      case 'inventory':
        return <InventoryTab />;
      case 'knowledge':
        return <KnowledgeBaseTab />;
      case 'scripts':
        return <ScriptsToolsTab />;
      case 'network-test':
        return <NetworkTestTab />;

      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black flex relative">
      {/* Aurora background animado */}
      <Aurora />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col relative z-10">
        <Header onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
