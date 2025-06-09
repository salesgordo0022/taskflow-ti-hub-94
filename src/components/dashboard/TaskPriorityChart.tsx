
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
      <Card className="h-96 bg-white/95 backdrop-blur-xl border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-gray-100/50">
          <CardTitle className="text-lg font-medium text-gray-900">Tarefas por Prioridade</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} onClick={handleBarClick} className="cursor-pointer">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar 
                dataKey="quantidade" 
                fill="#3b82f6" 
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
