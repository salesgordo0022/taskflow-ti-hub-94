
import { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';

const data = [
  { name: 'Planejado', value: 1, color: '#8B4513' },
  { name: 'Em Execução', value: 1, color: '#A0522D' },
  { name: 'Teste', value: 1, color: '#CD853F' },
  { name: 'Concluído', value: 0, color: '#DEB887' }
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
      <Card className="h-96 sad-fade-in card-dark sad-glow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
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
                  backgroundColor: 'rgba(20, 20, 25, 0.95)',
                  border: '1px solid rgba(55, 55, 60, 0.5)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: 'white'
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
