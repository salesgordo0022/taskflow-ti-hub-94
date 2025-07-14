
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import SystemProgressChart from '@/components/dashboard/SystemProgressChart';
import TaskPriorityChart from '@/components/dashboard/TaskPriorityChart';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanyCreateModal from '@/components/companies/CompanyCreateModal';
import CompanyEditModal from '@/components/companies/CompanyEditModal';
import CompanyImportModal from '@/components/companies/CompanyImportModal';
import CompanyListTable from '@/components/companies/CompanyListTable';
import SystemCard from '@/components/systems/SystemCard';
import SystemCreateModal from '@/components/systems/SystemCreateModal';
import SystemEditModal from '@/components/systems/SystemEditModal';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import TaskEditModal from '@/components/tasks/TaskEditModal';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import IncidentCard from '@/components/incidents/IncidentCard';
import IncidentCreateModal from '@/components/incidents/IncidentCreateModal';
import IncidentEditModal from '@/components/incidents/IncidentEditModal';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';
import CalendarView from '@/components/calendar/CalendarView';
import ChecklistTab from '@/components/tools/ChecklistTab';
import InventoryTab from '@/components/tools/InventoryTab';
import NetworkTestTab from '@/components/tools/NetworkTestTab';
import KnowledgeBaseTab from '@/components/tools/KnowledgeBaseTab';
import ScriptsToolsTab from '@/components/tools/ScriptsToolsTab';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Monitor, 
  CheckSquare, 
  AlertTriangle, 
  Plus,
  Search,
  Grid,
  List
} from 'lucide-react';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import { useSupabaseSystems } from '@/hooks/useSupabaseSystems';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useSupabaseIncidents } from '@/hooks/useSupabaseIncidents';

export default function Index() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [createCompanyOpen, setCreateCompanyOpen] = useState(false);
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [importCompanyOpen, setImportCompanyOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [createSystemOpen, setCreateSystemOpen] = useState(false);
  const [editSystemOpen, setEditSystemOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [createIncidentOpen, setCreateIncidentOpen] = useState(false);
  const [editIncidentOpen, setEditIncidentOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Hooks do Supabase
  const { companies, loading: companiesLoading, createCompany, updateCompany, deleteCompany } = useSupabaseCompanies();
  const { systems, loading: systemsLoading, createSystem, updateSystem, deleteSystem } = useSupabaseSystems();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useSupabaseTasks();
  const { incidents, loading: incidentsLoading, createIncident, updateIncident, deleteIncident } = useSupabaseIncidents();

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSystems = systems.filter(system =>
    system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    system.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Métricas calculadas
  const totalCompanies = companies.length;
  const totalSystems = systems.length;
  const totalTasks = tasks.length;
  const totalIncidents = incidents.length;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const openIncidents = incidents.filter(incident => incident.status === 'open').length;

  // Helper function to get company name by ID
  const getCompanyNameById = (id: string) => {
    const company = companies.find(c => c.id === id);
    return company?.name || '';
  };

  // Helper function to get system names by IDs
  const getSystemNamesByIds = (ids: string[]) => {
    return systems.filter(s => ids.includes(s.id)).map(s => s.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onTabChange={setActiveTab} />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 transition-all duration-300 ml-64">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total de Empresas"
                    value={totalCompanies}
                    icon={Building2}
                    trend={{ value: 12, isPositive: true }}
                  />
                  <MetricCard
                    title="Sistemas Ativos"
                    value={totalSystems}
                    icon={Monitor}
                    trend={{ value: 8, isPositive: true }}
                  />
                  <MetricCard
                    title="Tarefas Pendentes"
                    value={pendingTasks}
                    icon={CheckSquare}
                    trend={{ value: 5, isPositive: false }}
                  />
                  <MetricCard
                    title="Incidentes Abertos"
                    value={openIncidents}
                    icon={AlertTriangle}
                    trend={{ value: 2, isPositive: false }}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SystemProgressChart />
                  <TaskPriorityChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ProductivityChart />
                  <TaskPriorityChart />
                </div>
              </TabsContent>

              {/* Companies Tab */}
              <TabsContent value="companies" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-foreground">Empresas</h1>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar empresas..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex border rounded-lg">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={() => setImportCompanyOpen(true)} variant="outline">
                      Importar
                    </Button>
                    <Button onClick={() => setCreateCompanyOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Empresa
                    </Button>
                  </div>
                </div>

                {companiesLoading ? (
                  <div>Carregando empresas...</div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        onUpdate={updateCompany}
                        systemsCount={systems.filter(s => s.companies.includes(company.name)).length}
                        tasksCount={tasks.filter(t => t.companyId === company.id).length}
                      />
                    ))}
                  </div>
                ) : (
                  <CompanyListTable
                    companies={filteredCompanies}
                    onUpdate={updateCompany}
                  />
                )}

                <CompanyCreateModal
                  onSave={createCompany}
                />

                <CompanyEditModal
                  company={selectedCompany}
                  onUpdate={updateCompany}
                />

                <CompanyImportModal onImport={() => {}} />
              </TabsContent>

              {/* Systems Tab */}
              <TabsContent value="systems" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-foreground">Sistemas</h1>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar sistemas..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => setCreateSystemOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Sistema
                    </Button>
                  </div>
                </div>

                {systemsLoading ? (
                  <div>Carregando sistemas...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSystems.map((system) => (
                      <SystemCard
                        key={system.id}
                        system={system}
                        companyNames={system.companies}
                        onUpdate={updateSystem}
                      />
                    ))}
                  </div>
                )}

                <SystemCreateModal
                  onSave={createSystem}
                />

                <SystemEditModal
                  system={selectedSystem}
                  onSave={updateSystem}
                />
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
                  <Button onClick={() => setCreateTaskOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </div>

                {tasksLoading ? (
                  <div>Carregando tarefas...</div>
                ) : (
                  <KanbanBoard
                    tasks={tasks}
                    onTaskUpdate={updateTask}
                    onStatusChange={(taskId, newStatus) => {
                      const task = tasks.find(t => t.id === taskId);
                      if (task) {
                        updateTask({
                          ...task,
                          status: newStatus,
                          completedAt: newStatus === 'completed' ? new Date() : undefined
                        });
                      }
                    }}
                  />
                )}

                <TaskCreateModal
                  onCreate={createTask}
                />

                <TaskEditModal
                  task={selectedTask}
                  onSave={updateTask}
                />
              </TabsContent>

              {/* Incidents Tab */}
              <TabsContent value="incidents" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-foreground">Incidentes</h1>
                  <Button onClick={() => setCreateIncidentOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Incidente
                  </Button>
                </div>

                {incidentsLoading ? (
                  <div>Carregando incidentes...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIncidents.map((incident) => (
                      <IncidentCard
                        key={incident.id}
                        incident={incident}
                        systems={systems}
                        companies={companies}
                        onUpdate={updateIncident}
                        systemNames={getSystemNamesByIds(incident.systemIds)}
                        companyName={getCompanyNameById(incident.companyId)}
                      />
                    ))}
                  </div>
                )}

                <IncidentCreateModal
                  systems={systems}
                  companies={companies}
                  onCreate={createIncident}
                />

                <IncidentEditModal
                  incident={selectedIncident}
                  systems={systems}
                  companies={companies}
                  onUpdate={updateIncident}
                />
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
                <InteractiveReportsTable
                  title="Relatórios do Sistema"
                  data={[]}
                  onClose={() => {}}
                />
              </TabsContent>

              {/* Calendar Tab */}
              <TabsContent value="calendar" className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
                <CalendarView tasks={tasks} />
              </TabsContent>

              {/* Tools Tabs */}
              <TabsContent value="tools" className="space-y-6">
                <h1 className="text-3xl font-bold text-foreground">Ferramentas de TI</h1>
                
                <Tabs defaultValue="checklist" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="checklist">Checklists</TabsTrigger>
                    <TabsTrigger value="inventory">Inventário</TabsTrigger>
                    <TabsTrigger value="network">Testes de Rede</TabsTrigger>
                    <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
                    <TabsTrigger value="scripts">Scripts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="checklist">
                    <ChecklistTab />
                  </TabsContent>
                  
                  <TabsContent value="inventory">
                    <InventoryTab />
                  </TabsContent>
                  
                  <TabsContent value="network">
                    <NetworkTestTab />
                  </TabsContent>
                  
                  <TabsContent value="knowledge">
                    <KnowledgeBaseTab />
                  </TabsContent>
                  
                  <TabsContent value="scripts">
                    <ScriptsToolsTab />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
