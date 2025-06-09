
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
      <Card className="h-96 macos-card hover:shadow-2xl transition-all duration-500 group">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-lg font-semibold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Produtividade Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} onClick={handleLineClick} className="cursor-pointer">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.3)" />
              <XAxis 
                dataKey="dia" 
                tick={{ fontSize: 12, fill: '#ffffff' }} 
                stroke="#ffffff"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#ffffff' }} 
                stroke="#ffffff"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.98)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(24px)',
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="concluidas" 
                stroke="#6366f1" 
                strokeWidth={3}
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
