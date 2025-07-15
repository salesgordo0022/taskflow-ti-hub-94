
import React from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import SystemProgressChart from '@/components/dashboard/SystemProgressChart';
import TaskPriorityChart from '@/components/dashboard/TaskPriorityChart';
import AutomationReport from '@/components/dashboard/AutomationReport';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import { useSupabaseSystems } from '@/hooks/useSupabaseSystems';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useSupabaseIncidents } from '@/hooks/useSupabaseIncidents';
import { Building2, Server, CheckSquare, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { companies, loading: companiesLoading } = useSupabaseCompanies();
  const { systems, loading: systemsLoading } = useSupabaseSystems();
  const { tasks, loading: tasksLoading } = useSupabaseTasks();
  const { incidents, loading: incidentsLoading } = useSupabaseIncidents();

  const activeSystems = systems.filter(s => s.status !== 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length;

  const isLoading = companiesLoading || systemsLoading || tasksLoading || incidentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Empresas"
          value={companies.length}
          icon={Building2}
          color="blue"
          trend={{ value: 0, isPositive: true }}
        />
        <MetricCard
          title="Sistemas Ativos"
          value={activeSystems}
          icon={Server}
          color="green"
          trend={{ value: 0, isPositive: true }}
        />
        <MetricCard
          title="Tarefas Pendentes"
          value={pendingTasks}
          icon={CheckSquare}
          color="yellow"
          trend={{ value: 0, isPositive: false }}
        />
        <MetricCard
          title="Incidentes Abertos"
          value={openIncidents}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 0, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductivityChart />
        <SystemProgressChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskPriorityChart />
        <AutomationReport companies={companies} />
      </div>
    </div>
  );
};

export default Dashboard;
