
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';

const data = [
  { priority: 'Alta', quantidade: 2, color: '#ef4444' },
  { priority: 'Média', quantidade: 2, color: '#f59e0b' },
  { priority: 'Baixa', quantidade: 0, color: '#10b981' }
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
      <Card className="h-96 macos-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Tarefas por Prioridade
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} onClick={handleBarClick} className="cursor-pointer macos-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="priority" 
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} 
                stroke="hsl(var(--foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} 
                stroke="hsl(var(--foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar 
                dataKey="quantidade" 
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
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
