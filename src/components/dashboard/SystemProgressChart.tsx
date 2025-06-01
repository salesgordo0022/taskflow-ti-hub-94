
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Planejado', value: 1, color: '#94a3b8' },
  { name: 'Em Execução', value: 1, color: '#3b82f6' },
  { name: 'Teste', value: 1, color: '#f59e0b' },
  { name: 'Concluído', value: 0, color: '#10b981' }
];

const SystemProgressChart = () => {
  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Status dos Sistemas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SystemProgressChart;
