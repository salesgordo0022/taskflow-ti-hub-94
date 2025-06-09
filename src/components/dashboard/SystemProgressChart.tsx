
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
      <Card className="h-96 macos-card hover:shadow-2xl transition-all duration-500 group">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-lg font-semibold text-foreground bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
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
                className="cursor-pointer transition-all duration-300 hover:drop-shadow-lg"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 15, 20, 0.98)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(24px)',
                  color: '#f8fafc',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: '#cbd5e1'
                }}
              />
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
