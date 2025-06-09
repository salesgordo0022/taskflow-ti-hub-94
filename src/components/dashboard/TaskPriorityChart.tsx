
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';

const data = [
  { priority: 'Alta', quantidade: 2, color: '#dc2626' },
  { priority: 'Média', quantidade: 2, color: '#a3a3a3' },
  { priority: 'Baixa', quantidade: 0, color: '#6b7280' }
];

const mockDetailedData = [
  { id: '1', name: 'Implementar sistema de pagamento', value: 1, status: 'Em Andamento', date: '2024-01-15', priority: 'Alta' },
  { id: '2', name: 'Corrigir bug no login', value: 1, status: 'Pendente', date: '2024-01-14', priority: 'Alta' },
  { id: '3', name: 'Atualizar documentação', value: 1, status: 'Em Andamento', date: '2024-01-13', priority: 'Média' },
  { id: '4', name: 'Revisar código da API', value: 1, status: 'Concluído', date: '2024-01-12', priority: 'Média' },
];

const TaskPriorityChart = () => {
  const [showTable, setShowTable] = useState(false);

  const handleBarClick = () => {
    setShowTable(true);
  };

  return (
    <>
      <Card className="h-96 bg-card/95 backdrop-blur-xl border-border shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-medium text-foreground">Tarefas por Prioridade</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} onClick={handleBarClick} className="cursor-pointer">
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="priority" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(25, 25, 25, 0.95)',
                  border: '1px solid rgba(156, 163, 175, 0.2)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  color: '#e5e5e5'
                }}
              />
              <Bar 
                dataKey="quantidade" 
                fill="#9ca3af" 
                radius={[6, 6, 0, 0]}
                onClick={handleBarClick}
                className="cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showTable && (
        <InteractiveReportsTable
          title="Detalhes das Tarefas por Prioridade"
          data={mockDetailedData}
          onClose={() => setShowTable(false)}
        />
      )}
    </>
  );
};

export default TaskPriorityChart;
