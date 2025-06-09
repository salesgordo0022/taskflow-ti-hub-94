
import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';

const data = [
  { dia: 'Seg', concluidas: 5 },
  { dia: 'Ter', concluidas: 3 },
  { dia: 'Qua', concluidas: 8 },
  { dia: 'Qui', concluidas: 6 },
  { dia: 'Sex', concluidas: 4 },
  { dia: 'Sáb', concluidas: 2 },
  { dia: 'Dom', concluidas: 1 }
];

const mockDetailedData = [
  { id: '1', name: 'Segunda-feira', value: 5, status: 'Concluído', date: '2024-01-15' },
  { id: '2', name: 'Terça-feira', value: 3, status: 'Concluído', date: '2024-01-16' },
  { id: '3', name: 'Quarta-feira', value: 8, status: 'Concluído', date: '2024-01-17' },
  { id: '4', name: 'Quinta-feira', value: 6, status: 'Concluído', date: '2024-01-18' },
  { id: '5', name: 'Sexta-feira', value: 4, status: 'Concluído', date: '2024-01-19' },
  { id: '6', name: 'Sábado', value: 2, status: 'Concluído', date: '2024-01-20' },
  { id: '7', name: 'Domingo', value: 1, status: 'Concluído', date: '2024-01-21' },
];

const ProductivityChart = () => {
  const [showTable, setShowTable] = useState(false);

  const handleLineClick = () => {
    setShowTable(true);
  };

  return (
    <>
      <Card className="h-96 macos-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Produtividade Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} onClick={handleLineClick} className="cursor-pointer macos-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dia" 
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
              <Line 
                type="monotone" 
                dataKey="concluidas" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                onClick={handleLineClick}
                className="cursor-pointer"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {showTable && (
        <InteractiveReportsTable
          title="Detalhes da Produtividade Semanal"
          data={mockDetailedData}
          onClose={() => setShowTable(false)}
        />
      )}
    </>
  );
};

export default ProductivityChart;
