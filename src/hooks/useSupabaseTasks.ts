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
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*),
          systems (name),
          companies (name),
          task_reminder_channels (channel)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        systemId: task.system_id,
        companyId: task.company_id,
        responsible: task.responsible,
        priority: task.priority as 'low' | 'medium' | 'high',
        status: task.status as 'pending' | 'in_progress' | 'completed',
        dueDate: new Date(task.due_date),
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        reminderEnabled: task.reminder_enabled || false,
        reminderChannels: task.task_reminder_channels?.map((rc: any) => rc.channel as 'email' | 'whatsapp') || [],
        subtasks: task.subtasks?.map((st: any) => ({
          id: st.id,
          title: st.title,
          completed: st.completed || false
        })) || [],
        createdAt: new Date(task.created_at)
      }));

      setTasks(mappedTasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar tarefas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'subtasks'>) => {
    try {
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

      if (error) throw error;

      // Inserir canais de lembrete se existirem
      if (task.reminderChannels && task.reminderChannels.length > 0) {
        const channelsData = task.reminderChannels.map(channel => ({
          task_id: data.id,
          channel: channel
        }));

        const { error: channelsError } = await supabase
          .from('task_reminder_channels')
          .insert(channelsData);

        if (channelsError) throw channelsError;
      }

      await fetchTasks();
      
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
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
        .eq('id', task.id);

      if (error) throw error;

      // Atualizar canais de lembrete
      await supabase.from('task_reminder_channels').delete().eq('task_id', task.id);
      
      if (task.reminderChannels && task.reminderChannels.length > 0) {
        const channelsData = task.reminderChannels.map(channel => ({
          task_id: task.id,
          channel: channel
        }));

        const { error: channelsError } = await supabase
          .from('task_reminder_channels')
          .insert(channelsData);

        if (channelsError) throw channelsError;
      }

      await fetchTasks();
      
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tarefa",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTasks();
      
      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso"
      });
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir tarefa",
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
    deleteTask,
    refetch: fetchTasks
  };
};
