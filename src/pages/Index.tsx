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

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import SystemProgressChart from '@/components/dashboard/SystemProgressChart';
import TaskPriorityChart from '@/components/dashboard/TaskPriorityChart';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanyCreateModal from '@/components/companies/CompanyCreateModal';
import SystemCard from '@/components/systems/SystemCard';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import IncidentCard from '@/components/incidents/IncidentCard';
import CalendarView from '@/components/calendar/CalendarView';
import ProfileSettings from '@/components/profile/ProfileSettings';

import { mockCompanies, mockSystems, mockTasks, mockIncidents } from '@/utils/mockData';
import { Task, Company, System } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState(mockTasks);
  const [companies, setCompanies] = useState(mockCompanies);
  const [systems, setSystems] = useState(mockSystems);

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    ));
  };

  const handleCompanyCreate = (newCompany: Company) => {
    setCompanies(prev => [...prev, newCompany]);
  };

  const handleSystemUpdate = (updatedSystem: System) => {
    setSystems(prev => prev.map(system => 
      system.id === updatedSystem.id ? updatedSystem : system
    ));
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
  const openIncidents = mockIncidents.filter(i => i.status !== 'resolved').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Visão geral do seu ambiente de TI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Tarefas Pendentes"
                value={tasks.filter(t => t.status === 'pending').length}
                icon={CheckSquare}
                color="blue"
                trend={{ value: 12, isPositive: false }}
              />
              <MetricCard
                title="Sistemas Ativos"
                value={systems.filter(s => s.status === 'in_progress').length}
                icon={Server}
                color="green"
                trend={{ value: 8, isPositive: true }}
              />
              <MetricCard
                title="Empresas Atendidas"
                value={companies.length}
                icon={Building2}
                color="blue"
              />
              <MetricCard
                title="Incidentes Abertos"
                value={mockIncidents.filter(i => i.status !== 'resolved').length}
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
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Tarefas Recentes</h2>
                <div className="space-y-3">
                  {tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="p-4 bg-white border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status === 'completed' ? 'Concluído' :
                           task.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Sistemas em Foco</h2>
                <div className="space-y-3">
                  {systems.slice(0, 3).map(system => (
                    <div key={system.id} className="p-4 bg-white border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{system.name}</h3>
                        <span className="text-sm font-medium">{system.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
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

      case 'companies':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Empresas</h1>
                <p className="text-gray-600">Configure notas fiscais, cupons e automação para cada empresa</p>
              </div>
              <CompanyCreateModal onSave={handleCompanyCreate} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map(company => {
                const systemsCount = systems.filter(s => 
                  s.companies.includes(company.id)
                ).length;
                const tasksCount = tasks.filter(t => t.companyId === company.id).length;
                
                return (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    systemsCount={systemsCount}
                    tasksCount={tasksCount}
                    onUpdate={handleCompanyUpdate}
                  />
                );
              })}
            </div>
          </div>
        );

      case 'systems':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistemas</h1>
              <p className="text-gray-600">Controle acessos e acompanhe a implementação dos sistemas</p>
            </div>

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
          </div>
        );

      case 'mindmap':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa Mental</h1>
              <p className="text-gray-600">Visualize e organize seus mapas mentais com MindMeister</p>
            </div>

            <div className="bg-white rounded-lg border h-[80vh]">
              <iframe
                src="https://www.mindmeister.com/"
                className="w-full h-full rounded-lg"
                title="MindMeister"
                style={{ border: 'none' }}
                allow="fullscreen"
              />
            </div>
          </div>
        );

      case 'slack':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Slack</h1>
              <p className="text-gray-600">Acesse sua equipe e canais do Slack</p>
            </div>

            <div className="bg-white rounded-lg border h-[80vh]">
              <iframe
                src="https://slack.com/"
                className="w-full h-full rounded-lg"
                title="Slack"
                style={{ border: 'none' }}
                allow="fullscreen"
              />
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tarefas</h1>
              <p className="text-gray-600">Organize e acompanhe todas as suas tarefas</p>
            </div>

            <KanbanBoard 
              tasks={tasks} 
              onStatusChange={handleTaskStatusChange}
              onTaskUpdate={handleTaskUpdate}
            />
          </div>
        );

      case 'incidents':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Incidentes</h1>
              <p className="text-gray-600">Gerencie todos os incidentes técnicos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockIncidents.map(incident => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  systemName={systems.find(s => s.id === incident.systemId)?.name || 'Sistema não encontrado'}
                  companyName={companies.find(c => c.id === incident.companyId)?.name || 'Empresa não encontrada'}
                />
              ))}
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios</h1>
              <p className="text-gray-600">Análises e relatórios detalhados</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemProgressChart />
              <TaskPriorityChart />
              <ProductivityChart />
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Resumo Executivo</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Taxa de Conclusão de Tarefas</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo Médio de Resolução</span>
                    <span className="font-medium">3.2 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produtividade da Equipe</span>
                    <span className="font-medium text-green-600">+15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incidentes Críticos</span>
                    <span className="font-medium text-red-600">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendário</h1>
              <p className="text-gray-600">Visualize todas as suas tarefas e prazos</p>
            </div>

            <CalendarView tasks={tasks} />
          </div>
        );

      case 'settings':
        return <ProfileSettings />;

      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
