
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskCreateModal from '@/components/tasks/TaskCreateModal';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';

const Tasks: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { tasks, loading, createTask, updateTask } = useSupabaseTasks();

  const handleStatusChange = async (taskId: string, status: any) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask({ ...task, status });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <KanbanBoard 
        tasks={tasks} 
        onStatusChange={handleStatusChange}
        onTaskUpdate={updateTask}
        onTaskCreate={createTask}
      />

      <TaskCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={createTask}
      />
    </div>
  );
};

export default Tasks;
