
import { Clock, User, AlertCircle, CheckCircle2, Play } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  systemName?: string;
  companyName?: string;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-green-100 text-green-800' },
  medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'Alta', color: 'bg-red-100 text-red-800' }
};

const statusConfig = {
  pending: { label: 'Pendente', icon: Clock, color: 'text-gray-500' },
  in_progress: { label: 'Em Andamento', icon: Play, color: 'text-blue-500' },
  completed: { label: 'Concluído', icon: CheckCircle2, color: 'text-green-500' }
};

const TaskCard = ({ task, systemName, companyName, onStatusChange }: TaskCardProps) => {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const isOverdue = task.status !== 'completed' && new Date() > task.dueDate;

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow duration-200",
      isOverdue && "border-red-200 bg-red-50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className={cn("h-5 w-5", status.color)} />
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
          </div>
          <div className="flex space-x-2">
            <Badge className={priority.color}>
              {priority.label}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Atrasada
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{task.description}</p>
        
        {(systemName || companyName) && (
          <div className="text-sm text-gray-500">
            {systemName && <span>Sistema: {systemName}</span>}
            {systemName && companyName && <span className="mx-2">•</span>}
            {companyName && <span>Empresa: {companyName}</span>}
          </div>
        )}

        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtarefas</span>
              <span className="font-medium">{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <Progress value={subtaskProgress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
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
              className="flex-1"
            >
              Iniciar
            </Button>
          )}
          {task.status === 'in_progress' && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange(task.id, 'completed')}
              className="flex-1"
            >
              Concluir
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1">
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
