
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Server, 
  CheckSquare, 
  AlertTriangle, 
  Users, 
  Calendar,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// Componentes
import CompanyCard from '@/components/companies/CompanyCard';
import CompanyCreateModal from '@/components/companies/CompanyCreateModal';
import CompanyImportModal from '@/components/companies/CompanyImportModal';
import CompanyListTable from '@/components/companies/CompanyListTable';
import SystemCard from '@/components/systems/SystemCard';
import SystemCreateModal from '@/components/systems/SystemCreateModal';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import IncidentCreateModal from '@/components/incidents/IncidentCreateModal';
import IncidentCard from '@/components/incidents/IncidentCard';
import MetricCard from '@/components/dashboard/MetricCard';
import SystemProgressChart from '@/components/dashboard/SystemProgressChart';
import TaskPriorityChart from '@/components/dashboard/TaskPriorityChart';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import AutomationReport from '@/components/dashboard/AutomationReport';
import CalendarView from '@/components/calendar/CalendarView';
import ProfileSettings from '@/components/profile/ProfileSettings';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import MindMapEditor from '@/components/MindMapEditor';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';

// Hooks personalizados do Supabase
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import { useSupabaseSystems } from '@/hooks/useSupabaseSystems';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useSupabaseIncidents } from '@/hooks/useSupabaseIncidents';

// Tipos
import { Company, System, Task, Incident } from '@/types';

const Index = () => {
  // Estados para filtros e pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'grid' | 'table'>('grid');
  
  // Hooks do Supabase
  const { 
    companies, 
    loading: companiesLoading, 
    createCompany, 
    updateCompany 
  } = useSupabaseCompanies();
  
  const { 
    systems, 
    loading: systemsLoading, 
    createSystem, 
    updateSystem 
  } = useSupabaseSystems();
  
  const { 
    tasks, 
    loading: tasksLoading, 
    createTask, 
    updateTask 
  } = useSupabaseTasks();
  
  const { 
    incidents, 
    loading: incidentsLoading, 
    createIncident, 
    updateIncident 
  } = useSupabaseIncidents();

  // Filtros
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm)
  );

  const filteredSystems = systems.filter(system =>
    system.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || system.status === filterStatus)
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || task.status === filterStatus)
  );

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || incident.status === filterStatus)
  );

  // Métricas do Dashboard
  const totalCompanies = companies.length;
  const automatedCompanies = companies.filter(c => c.isAutomated).length;
  const completedSystems = systems.filter(s => s.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const openIncidents = incidents.filter(i => i.status === 'open').length;

  // Handlers para os modais
  const handleCompanyCreate = async (company: Omit<Company, 'id' | 'createdAt'>) => {
    await createCompany(company);
  };

  const handleCompanyUpdate = async (company: Company) => {
    await updateCompany(company.id, company);
  };

  const handleSystemCreate = async (system: Omit<System, 'id'>) => {
    await createSystem(system);
  };

  const handleSystemUpdate = async (system: System) => {
    await updateSystem(system.id, system);
  };

  const handleTaskCreate = async (task: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => {
    await createTask(task);
  };

  const handleTaskUpdate = async (task: Task) => {
    await updateTask(task.id, task);
  };

  const handleIncidentCreate = async (incident: Omit<Incident, 'id' | 'createdAt' | 'notes'>) => {
    await createIncident(incident);
  };

  const handleIncidentUpdate = async (incident: Incident) => {
    await updateIncident(incident.id, incident);
  };

  // Função para obter nomes das empresas
  const getCompanyNames = (companyIds: string[]) => {
    return companyIds.map(id => {
      const company = companies.find(c => c.id === id);
      return company ? company.name : 'Empresa não encontrada';
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sistema de Gestão Integrado
          </h1>
          <p className="text-gray-300">Gerencie empresas, sistemas, tarefas e incidentes em um só lugar</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">Dashboard</TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-blue-600">Empresas</TabsTrigger>
            <TabsTrigger value="systems" className="data-[state=active]:bg-blue-600">Sistemas</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600">Tarefas</TabsTrigger>
            <TabsTrigger value="incidents" className="data-[state=active]:bg-blue-600">Incidentes</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-600">Calendário</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">Relatórios</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">Perfil</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total de Empresas"
                value={totalCompanies}
                icon={Building2}
                trend={{ value: 12, isPositive: true }}
                description="Empresas cadastradas"
              />
              <MetricCard
                title="Empresas Automatizadas"
                value={automatedCompanies}
                icon={TrendingUp}
                trend={{ value: 8, isPositive: true }}
                description="Com automação ativa"
              />
              <MetricCard
                title="Sistemas Concluídos"
                value={completedSystems}
                icon={Server}
                trend={{ value: 3, isPositive: true }}
                description="Sistemas implementados"
              />
              <MetricCard
                title="Tarefas Pendentes"
                value={pendingTasks}
                icon={CheckSquare}
                trend={{ value: 5, isPositive: false }}
                description="Aguardando execução"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemProgressChart systems={systems} />
              <TaskPriorityChart tasks={tasks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductivityChart tasks={tasks} />
              <AutomationReport companies={companies} />
            </div>
          </TabsContent>

          {/* Empresas */}
          <TabsContent value="companies" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Empresas</h2>
                <p className="text-gray-400">Gerencie todas as empresas do sistema</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <CompanyImportModal onSuccess={() => window.location.reload()} />
                <CompanyCreateModal onSave={handleCompanyCreate} />
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={currentView === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('grid')}
                >
                  Cards
                </Button>
                <Button
                  variant={currentView === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('table')}
                >
                  Tabela
                </Button>
              </div>
            </div>

            {companiesLoading ? (
              <div className="text-center py-8">Carregando empresas...</div>
            ) : currentView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <CompanyCard 
                    key={company.id} 
                    company={company} 
                    onUpdate={handleCompanyUpdate}
                  />
                ))}
              </div>
            ) : (
              <CompanyListTable 
                companies={filteredCompanies} 
                onUpdate={handleCompanyUpdate}
              />
            )}
          </TabsContent>

          {/* Sistemas */}
          <TabsContent value="systems" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Sistemas</h2>
                <p className="text-gray-400">Controle todos os sistemas e implementações</p>
              </div>
              <SystemCreateModal onSave={handleSystemCreate} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar sistemas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="planned">Planejado</option>
                <option value="in_progress">Em Execução</option>
                <option value="testing">Em Teste</option>
                <option value="completed">Concluído</option>
              </select>
            </div>

            {systemsLoading ? (
              <div className="text-center py-8">Carregando sistemas...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSystems.map((system) => (
                  <SystemCard 
                    key={system.id} 
                    system={system} 
                    companyNames={getCompanyNames(system.companies)}
                    onUpdate={handleSystemUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tarefas */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Tarefas</h2>
                <p className="text-gray-400">Organize e acompanhe todas as tarefas</p>
              </div>
              <TaskCreateModal onSave={handleTaskCreate} />
            </div>

            {tasksLoading ? (
              <div className="text-center py-8">Carregando tarefas...</div>
            ) : (
              <KanbanBoard 
                tasks={tasks} 
                onTaskUpdate={handleTaskUpdate}
              />
            )}
          </TabsContent>

          {/* Incidentes */}
          <TabsContent value="incidents" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Incidentes</h2>
                <p className="text-gray-400">Monitore e resolva incidentes do sistema</p>
              </div>
              <IncidentCreateModal 
                onCreate={handleIncidentCreate}
                systems={systems}
                companies={companies}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar incidentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="open">Aberto</option>
                <option value="in_progress">Em Progresso</option>
                <option value="resolved">Resolvido</option>
              </select>
            </div>

            {incidentsLoading ? (
              <div className="text-center py-8">Carregando incidentes...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIncidents.map((incident) => (
                  <IncidentCard 
                    key={incident.id} 
                    incident={incident}
                    systems={systems}
                    companies={companies}
                    onUpdate={handleIncidentUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Calendário */}
          <TabsContent value="calendar">
            <CalendarView tasks={tasks} />
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports">
            <InteractiveReportsTable 
              companies={companies}
              systems={systems}
              tasks={tasks}
              incidents={incidents}
            />
          </TabsContent>

          {/* Perfil */}
          <TabsContent value="profile">
            <div className="max-w-4xl mx-auto">
              <ProfileSettings />
              <div className="mt-8">
                <NotificationsPanel />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
