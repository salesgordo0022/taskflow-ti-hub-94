
import React, { useState } from 'react';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';
import CalendarView from '@/components/calendar/CalendarView';
import { Button } from '@/components/ui/button';
import { FileText, Calendar } from 'lucide-react';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';

const Reports: React.FC = () => {
  const [showReportsTable, setShowReportsTable] = useState(false);
  const { tasks } = useSupabaseTasks();

  // Sample data for the reports table
  const sampleReportData = [
    {
      id: '1',
      name: 'Relatório de Tarefas',
      value: tasks.length,
      status: 'Concluído',
      date: new Date().toLocaleDateString(),
      company: 'Empresa A',
      priority: 'Alta'
    },
    {
      id: '2', 
      name: 'Relatório de Sistemas',
      value: 15,
      status: 'Em Andamento',
      date: new Date().toLocaleDateString(),
      company: 'Empresa B',
      priority: 'Média'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Relatórios Interativos</h2>
            <Button 
              onClick={() => setShowReportsTable(true)}
              variant="outline"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Visualizar Relatórios
            </Button>
          </div>
          
          <div className="p-6 border rounded-lg">
            <p className="text-gray-600 mb-4">
              Acesse relatórios detalhados sobre o desempenho dos sistemas e tarefas.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total de Tarefas:</span>
                <span className="font-semibold">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tarefas Concluídas:</span>
                <span className="font-semibold">
                  {tasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tarefas Pendentes:</span>
                <span className="font-semibold">
                  {tasks.filter(t => t.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Calendário
          </h2>
          <CalendarView tasks={tasks} />
        </div>
      </div>

      {showReportsTable && (
        <InteractiveReportsTable
          title="Relatórios do Sistema"
          data={sampleReportData}
          onClose={() => setShowReportsTable(false)}
        />
      )}
    </div>
  );
};

export default Reports;
