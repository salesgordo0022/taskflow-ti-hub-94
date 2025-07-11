
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { Task } from '@/types';
import TaskEditModal from './TaskEditModal';
import { addDays } from 'date-fns';
import TaskCreateModal from './TaskCreateModal';

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Task) => void;
}

const columns = [
  { id: 'pending', title: 'Pendente', status: 'pending' as const },
  { id: 'in_progress', title: 'Em Andamento', status: 'in_progress' as const },
  { id: 'completed', title: 'Concluído', status: 'completed' as const }
];

const KanbanBoard = ({ tasks, onStatusChange, onTaskUpdate, onTaskCreate }: KanbanBoardProps) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Tarefa em branco para criação
  const blankTask: Task = {
    id: Date.now().toString(),
    title: '',
    description: '',
    responsible: '',
    priority: 'low',
    status: 'pending',
    dueDate: addDays(new Date(), 1),
    createdAt: new Date(),
    reminderEnabled: false,
    reminderChannels: [],
    subtasks: [],
  };

  const handleCreate = (task: Task) => {
    if (onTaskCreate) onTaskCreate({ ...task, id: Date.now().toString() });
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quadro de Tarefas</h2>
        <TaskCreateModal onCreate={onTaskCreate!} />
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
