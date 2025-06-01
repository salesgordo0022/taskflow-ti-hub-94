
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { dia: 'Seg', concluidas: 5 },
  { dia: 'Ter', concluidas: 3 },
  { dia: 'Qua', concluidas: 8 },
  { dia: 'Qui', concluidas: 6 },
  { dia: 'Sex', concluidas: 4 },
  { dia: 'Sáb', concluidas: 2 },
  { dia: 'Dom', concluidas: 1 }
];

const ProductivityChart = () => {
  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Produtividade Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="concluidas" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductivityChart;
