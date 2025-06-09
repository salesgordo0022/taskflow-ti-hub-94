
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
      <Card className="h-96 macos-card hover:shadow-2xl transition-all duration-500 group">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-lg font-semibold text-foreground bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Tarefas por Prioridade
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} onClick={handleBarClick} className="cursor-pointer">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.3)" />
              <XAxis 
                dataKey="priority" 
                tick={{ fontSize: 12, fill: '#f3f4f6' }} 
                stroke="#f3f4f6"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#f3f4f6' }} 
                stroke="#f3f4f6"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(31, 41, 55, 0.98)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(24px)',
                  color: '#f3f4f6',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              />
              <Bar 
                dataKey="quantidade" 
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                onClick={handleBarClick}
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
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
