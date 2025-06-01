
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { Task } from '@/types';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onTaskUpdate?: (task: Task) => void;
}

const columns = [
  { id: 'pending', title: 'Pendente', status: 'pending' as const },
  { id: 'in_progress', title: 'Em Andamento', status: 'in_progress' as const },
  { id: 'completed', title: 'Concluído', status: 'completed' as const }
];

const KanbanBoard = ({ tasks, onStatusChange, onTaskUpdate }: KanbanBoardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quadro de Tarefas</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.status);
          
          return (
            <Card key={column.id} className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{column.title}</CardTitle>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onTaskUpdate={onTaskUpdate}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma tarefa
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
