
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      console.log('Buscando tarefas do Supabase...');
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*),
          task_reminder_channels (channel)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar tarefas:', error);
        throw error;
      }

      console.log('Tarefas encontradas:', data);
      const mappedTasks: Task[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        systemId: item.system_id || undefined,
        companyId: item.company_id || undefined,
        responsible: item.responsible,
        priority: item.priority as Task['priority'],
        status: item.status as Task['status'],
        dueDate: new Date(item.due_date),
        createdAt: new Date(item.created_at),
        completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
        reminderEnabled: item.reminder_enabled || false,
        reminderChannels: (item.task_reminder_channels as any[])?.map(trc => trc.channel) || [],
        subtasks: (item.subtasks as any[])?.map(st => ({
          id: st.id,
          title: st.title,
          completed: st.completed || false
        })) || []
      }));

      setTasks(mappedTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => {
    try {
      console.log('Criando tarefa:', task);
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          system_id: task.systemId,
          company_id: task.companyId,
          responsible: task.responsible,
          priority: task.priority,
          status: task.status,
          due_date: task.dueDate.toISOString(),
          completed_at: task.completedAt?.toISOString(),
          reminder_enabled: task.reminderEnabled
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tarefa:', error);
        throw error;
      }

      console.log('Tarefa criada:', data);
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!"
      });

      fetchTasks();
      return data;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      console.log('Atualizando tarefa:', id, updates);
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          system_id: updates.systemId,
          company_id: updates.companyId,
          responsible: updates.responsible,
          priority: updates.priority,
          status: updates.status,
          due_date: updates.dueDate?.toISOString(),
          completed_at: updates.completedAt?.toISOString(),
          reminder_enabled: updates.reminderEnabled
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tarefa:', error);
        throw error;
      }

      console.log('Tarefa atualizada:', data);
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!"
      });

      fetchTasks();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    refetch: fetchTasks
  };
};
