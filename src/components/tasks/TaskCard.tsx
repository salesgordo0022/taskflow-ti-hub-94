
import { Clock, User, AlertCircle, CheckCircle2, Play } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import TaskEditModal from './TaskEditModal';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onTaskUpdate?: (task: Task) => void;
}

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-green-900 text-green-200' },
  medium: { label: 'Média', color: 'bg-yellow-900 text-yellow-100' },
  high: { label: 'Alta', color: 'bg-red-900 text-red-200' }
};

const statusConfig = {
  pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-300' },
  in_progress: { label: 'Em Andamento', icon: Play, color: 'text-blue-300' },
  completed: { label: 'Concluído', icon: CheckCircle2, color: 'text-green-300' }
};

const TaskCard = ({ task, onStatusChange, onTaskUpdate }: TaskCardProps) => {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const isOverdue = task.status !== 'completed' && new Date() > task.dueDate;

  const handleTaskUpdate = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow duration-200 bg-neutral-900 border-neutral-700",
      isOverdue && "border-red-400 bg-red-950"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className={cn("h-5 w-5", status.color)} />
            <h3 className="font-semibold text-gray-100 text-lg">{task.title}</h3>
          </div>
          <div className="flex space-x-2">
            <Badge className={priority.color}>
              {priority.label}
            </Badge>
            {isOverdue && (
              <Badge className="bg-yellow-900 text-yellow-200 border border-yellow-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Atrasada
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-300">{task.description}</p>

        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtarefas</span>
              <span className="font-medium text-gray-200">{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <Progress value={subtaskProgress} className="h-2 bg-neutral-800" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{task.responsible}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{task.dueDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          {task.status === 'pending' && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange(task.id, 'in_progress')}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white border-none"
            >
              Iniciar
            </Button>
          )}
          {task.status === 'in_progress' && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange(task.id, 'completed')}
              className="flex-1 bg-green-700 hover:bg-green-800 text-white border-none"
            >
              Concluir
            </Button>
          )}
          <TaskEditModal task={task} onSave={handleTaskUpdate} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
