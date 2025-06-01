
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { priority: 'Alta', quantidade: 2, color: '#ef4444' },
  { priority: 'Média', quantidade: 2, color: '#f59e0b' },
  { priority: 'Baixa', quantidade: 0, color: '#10b981' }
];

const TaskPriorityChart = () => {
  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tarefas por Prioridade</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="priority" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantidade" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TaskPriorityChart;
