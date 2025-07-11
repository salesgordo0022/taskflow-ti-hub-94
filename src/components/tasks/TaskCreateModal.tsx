import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays } from 'date-fns';
import { Task } from '@/types';

interface TaskCreateModalProps {
  onCreate: (task: Task) => void;
}

const TaskCreateModal = ({ onCreate }: TaskCreateModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'reminderEnabled' | 'reminderChannels'>>({
    title: '',
    description: '',
    responsible: '',
    priority: 'low',
    status: 'pending',
    dueDate: addDays(new Date(), 1),
  });

  const handleSave = () => {
    onCreate({
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      subtasks: [],
      reminderEnabled: false,
      reminderChannels: [],
    });
    setIsOpen(false);
    setTask({
      title: '',
      description: '',
      responsible: '',
      priority: 'low',
      status: 'pending',
      dueDate: addDays(new Date(), 1),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          + Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={task.title} onChange={e => setTask(t => ({ ...t, title: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={task.description} onChange={e => setTask(t => ({ ...t, description: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="responsible">Responsável</Label>
            <Input id="responsible" value={task.responsible} onChange={e => setTask(t => ({ ...t, responsible: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={task.priority} onValueChange={value => setTask(t => ({ ...t, priority: value as Task['priority'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <Input id="dueDate" type="date" value={task.dueDate.toISOString().split('T')[0]} onChange={e => setTask(t => ({ ...t, dueDate: new Date(e.target.value) }))} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateModal; 