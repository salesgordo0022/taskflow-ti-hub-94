
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Server, ListTodo, AlertTriangle, Bell, Map, CheckSquare, Package, BookOpen, Code, BarChart3, Calendar } from "lucide-react";

// Company components
import CompanyCreateModal from "@/components/companies/CompanyCreateModal";
import CompanyListTable from "@/components/companies/CompanyListTable";
import CompanyImportModal from "@/components/companies/CompanyImportModal";
import CompanyTemplateDownload from "@/components/companies/CompanyTemplateDownload";

// System components
import SystemCard from "@/components/systems/SystemCard";
import SystemCreateModal from "@/components/systems/SystemCreateModal";
import SystemManagementTips from "@/components/systems/SystemManagementTips";

// Task components
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskCreateModal from "@/components/tasks/TaskCreateModal";
import CalendarView from "@/components/calendar/CalendarView";

// Incident components
import IncidentCard from "@/components/incidents/IncidentCard";
import IncidentCreateModal from "@/components/incidents/IncidentCreateModal";

// Dashboard components
import MetricCard from "@/components/dashboard/MetricCard";
import SystemProgressChart from "@/components/dashboard/SystemProgressChart";
import TaskPriorityChart from "@/components/dashboard/TaskPriorityChart";
import ProductivityChart from "@/components/dashboard/ProductivityChart";
import AutomationReport from "@/components/dashboard/AutomationReport";

// Other components
import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import MindMapEditor from "@/components/MindMapEditor";
import InteractiveReportsTable from "@/components/reports/InteractiveReportsTable";

// Tools components
import ChecklistTab from "@/components/tools/ChecklistTab";
import InventoryTab from "@/components/tools/InventoryTab";
import KnowledgeBaseTab from "@/components/tools/KnowledgeBaseTab";
import ScriptsToolsTab from "@/components/tools/ScriptsToolsTab";
import NetworkTestTab from "@/components/tools/NetworkTestTab";

// Data hooks
import { useCompanies } from "@/hooks/useCompanies";
import { useSystems } from "@/hooks/useSystems";
import { useTasks } from "@/hooks/useTasks";
import { useIncidents } from "@/hooks/useIncidents";
import { useUsers } from "@/hooks/useUsers";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Data fetching with proper error handling
  const { 
    data: companies = [], 
    isLoading: companiesLoading, 
    error: companiesError,
    refetch: refetchCompanies 
  } = useCompanies();
  
  const { 
    data: systems = [], 
    isLoading: systemsLoading, 
    error: systemsError,
    refetch: refetchSystems 
  } = useSystems();
  
  const { 
    data: tasks = [], 
    isLoading: tasksLoading, 
    error: tasksError,
    refetch: refetchTasks 
  } = useTasks();
  
  const { 
    data: incidents = [], 
    isLoading: incidentsLoading, 
    error: incidentsError,
    refetch: refetchIncidents 
  } = useIncidents();
  
  const { 
    data: users = [], 
    isLoading: usersLoading, 
    error: usersError 
  } = useUsers();

  // Logging for debugging
  useEffect(() => {
    console.log('Index component rendering...');
    console.log('Authentication status:', true);
    console.log('Initializing Supabase hooks...');
    console.log('Hook status:', {
      companiesLoading,
      systemsLoading,
      tasksLoading,
      incidentsLoading,
      usersLoading,
      companiesError,
      systemsError,
      tasksError,
      incidentsError,
      usersError
    });
    if (!companiesLoading && !systemsLoading && !tasksLoading && !incidentsLoading && !usersLoading) {
      console.log('Data loaded, rendering main interface');
    }
  }, [companiesLoading, systemsLoading, tasksLoading, incidentsLoading, usersLoading]);

  // Show loading state
  if (companiesLoading && systemsLoading && tasksLoading && incidentsLoading && usersLoading) {
    console.log('Loading data from Supabase...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados do sistema...</p>
        </div>
      </div>
    );
  }

  // Handle refresh functions
  const handleRefreshCompanies = () => {
    console.log('Refreshing companies data...');
    refetchCompanies();
  };

  const handleRefreshSystems = () => {
    console.log('Refreshing systems data...');
    refetchSystems();
  };

  const handleRefreshTasks = () => {
    console.log('Refreshing tasks data...');
    refetchTasks();
  };

  const handleRefreshIncidents = () => {
    console.log('Refreshing incidents data...');
    refetchIncidents();
  };

  // Get company names for systems
  const getCompanyNames = (companyIds: string[]) => {
    return companyIds
      .map(id => companies.find(c => c.id === id)?.name)
      .filter(Boolean) as string[];
  };

  // Get system and company names for incidents
  const getSystemNames = (systemIds: string[]) => {
    return systemIds
      .map(id => systems.find(s => s.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || '';
  };

  console.log('About to check authentication...');
  console.log('Loading data from Supabase...');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Sistema de Gestão Empresarial
          </h1>
          <p className="text-gray-400">Gerencie empresas, sistemas, tarefas e incidentes de forma integrada</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 bg-gray-800 mb-6 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs p-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2 text-xs p-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Empresas</span>
            </TabsTrigger>
            <TabsTrigger value="systems" className="flex items-center gap-2 text-xs p-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Sistemas</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 text-xs p-2">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Tarefas</span>
            </TabsTrigger>
            <TabsTrigger value="incidents" className="flex items-center gap-2 text-xs p-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Incidentes</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 text-xs p-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs p-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="flex items-center gap-2 text-xs p-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Mapa Mental</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2 text-xs p-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Checklist</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2 text-xs p-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventário</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2 text-xs p-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Base Conhecimento</span>
            </TabsTrigger>
            <TabsTrigger value="scripts" className="flex items-center gap-2 text-xs p-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Scripts</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Total de Empresas"
                value={companies.length}
                icon={Building2}
                trend={{ value: 5, isPositive: true }}
              />
              <MetricCard
                title="Sistemas Ativos"
                value={systems.filter(s => s.status !== 'completed').length}
                icon={Server}
                trend={{ value: 2, isPositive: true }}
              />
              <MetricCard
                title="Tarefas Pendentes"
                value={tasks.filter(t => t.status === 'pending').length}
                icon={ListTodo}
                trend={{ value: 3, isPositive: false }}
              />
              <MetricCard
                title="Incidentes Abertos"
                value={incidents.filter(i => i.status === 'open').length}
                icon={AlertTriangle}
                trend={{ value: 1, isPositive: true }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SystemProgressChart systems={systems} />
              <TaskPriorityChart tasks={tasks} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductivityChart tasks={tasks} />
              <AutomationReport companies={companies} />
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Gestão de Empresas</h2>
                <Badge variant="secondary">{companies.length} empresas</Badge>
              </div>
              <div className="flex gap-2">
                <CompanyTemplateDownload />
                <CompanyImportModal onSuccess={handleRefreshCompanies} />
                <CompanyCreateModal onSuccess={handleRefreshCompanies} />
              </div>
            </div>
            
            {companiesError && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <p className="text-red-200">Erro ao carregar empresas: {companiesError.message}</p>
              </div>
            )}
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Lista de Empresas</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie todas as empresas cadastradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyListTable companies={companies} onRefresh={handleRefreshCompanies} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Systems Tab */}
          <TabsContent value="systems" className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Gestão de Sistemas</h2>
                <Badge variant="secondary">{systems.length} sistemas</Badge>
              </div>
              <SystemCreateModal onSuccess={handleRefreshSystems} />
            </div>
            
            {systemsError && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <p className="text-red-200">Erro ao carregar sistemas: {systemsError.message}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {systems.map((system) => (
                <SystemCard 
                  key={system.id} 
                  system={system} 
                  companyNames={getCompanyNames(system.companies)}
                  onUpdate={handleRefreshSystems} 
                />
              ))}
            </div>
            
            <SystemManagementTips />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Gestão de Tarefas</h2>
                <Badge variant="secondary">{tasks.length} tarefas</Badge>
              </div>
              <TaskCreateModal onSuccess={handleRefreshTasks} />
            </div>
            
            {tasksError && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <p className="text-red-200">Erro ao carregar tarefas: {tasksError.message}</p>
              </div>
            )}
            
            <KanbanBoard 
              tasks={tasks} 
              onTaskUpdate={handleRefreshTasks}
              onStatusChange={(taskId: string, newStatus: string) => {
                console.log(`Task ${taskId} status changed to ${newStatus}`);
                handleRefreshTasks();
              }}
            />
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-semibold text-white">Gestão de Incidentes</h2>
                <Badge variant="secondary">{incidents.length} incidentes</Badge>
              </div>
              <IncidentCreateModal onSuccess={handleRefreshIncidents} />
            </div>
            
            {incidentsError && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <p className="text-red-200">Erro ao carregar incidentes: {incidentsError.message}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {incidents.map((incident) => (
                <IncidentCard 
                  key={incident.id} 
                  incident={incident} 
                  systemNames={getSystemNames(incident.systemIds)}
                  companyName={getCompanyName(incident.companyId)}
                  systems={systems}
                  companies={companies}
                  onUpdate={handleRefreshIncidents} 
                />
              ))}
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <CalendarView tasks={tasks} />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <NotificationsPanel />
          </TabsContent>

          {/* Mind Map Tab */}
          <TabsContent value="mindmap">
            <MindMapEditor 
              nodes={[]}
              edges={[]}
              onNodesChange={() => {}}
              onEdgesChange={() => {}}
              onConnect={() => {}}
              onSave={() => {}}
            />
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist">
            <ChecklistTab />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge">
            <KnowledgeBaseTab />
          </TabsContent>

          {/* Scripts Tab */}
          <TabsContent value="scripts">
            <ScriptsToolsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
