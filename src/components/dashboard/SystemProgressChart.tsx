
import { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';

const data = [
  { name: 'Planejado', value: 1, color: '#6366f1' },
  { name: 'Em Execução', value: 1, color: '#8b5cf6' },
  { name: 'Teste', value: 1, color: '#06b6d4' },
  { name: 'Concluído', value: 0, color: '#10b981' }
];

const mockDetailedData = [
  { id: '1', name: 'Sistema ERP', value: 75, status: 'Em Execução', date: '2024-01-15', company: 'Empresa A' },
  { id: '2', name: 'Sistema CRM', value: 30, status: 'Planejado', date: '2024-01-10', company: 'Empresa B' },
  { id: '3', name: 'Sistema Financeiro', value: 90, status: 'Teste', date: '2024-01-08', company: 'Empresa C' },
];

const SystemProgressChart = () => {
  const [showTable, setShowTable] = useState(false);

  const handlePieClick = () => {
    setShowTable(true);
  };

  return (
    <>
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Status dos Sistemas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart onClick={handlePieClick} className="cursor-pointer">
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showTable && (
        <InteractiveReportsTable
          title="Detalhes do Progresso dos Sistemas"
          data={mockDetailedData}
          onClose={() => setShowTable(false)}
        />
      )}
    </>
  );
};

export default SystemProgressChart;
