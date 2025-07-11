
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock as ClockIcon, Hourglass, AlertCircle } from 'lucide-react';
import { Task } from '@/types';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView = ({ tasks }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getTaskDates = () => {
    return tasks.map(task => task.dueDate);
  };

  const isTaskDate = (date: Date) => {
    return tasks.some(task => isSameDay(task.dueDate, date));
  };

  // Novos helpers para destacar dias
  const getDayStatus = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return null;
    if (dayTasks.some(t => t.status !== 'completed')) return 'pending';
    return 'completed';
  };

  // Gera lista de datas para cada status
  const getTaskDatesByStatus = () => {
    const pending: Date[] = [];
    const completed: Date[] = [];
    // Considera apenas dias únicos
    const allDates = Array.from(new Set(tasks.map(t => t.dueDate.toString()))).map(d => new Date(d));
    allDates.forEach(date => {
      const status = getDayStatus(date);
      if (status === 'pending') pending.push(date);
      if (status === 'completed') completed.push(date);
    });
    return { pending, completed };
  };

  const { pending: pendingDates, completed: completedDates } = getTaskDatesByStatus();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={ptBR}
              modifiers={{
                hasPending: pendingDates,
                hasCompleted: completedDates,
              }}
              modifiersClassNames={{
                hasPending: "bg-blue-200 text-blue-900 font-semibold border-2 border-blue-400",
                hasCompleted: "bg-green-200 text-green-900 font-semibold border-2 border-green-400",
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5" />
              <span>
                {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map(task => {
                  const isOverdue = task.status !== 'completed' && new Date() > task.dueDate;
                  return (
                    <div key={task.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {/* Ícone de status */}
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : task.status === 'in_progress' ? (
                            <ClockIcon className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Hourglass className="h-4 w-4 text-yellow-500" />
                          )}
                          <h4 className="font-medium text-sm">{task.title}</h4>
                        </div>
                        <div className="flex space-x-1">
                          <Badge variant={
                            task.priority === 'high' ? 'destructive' :
                            task.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {task.priority === 'high' ? 'Alta' :
                             task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                          {isOverdue && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Atrasada
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{task.description}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>Responsável: {task.responsible}</span>
                        <span className={`px-2 py-1 rounded ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status === 'completed' ? 'Concluído' :
                           task.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhuma tarefa para esta data
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
