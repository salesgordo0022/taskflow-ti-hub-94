
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, Subtask } from '@/types';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (tasksError) throw tasksError;

      // Buscar subtarefas para cada tarefa
      const tasksWithSubtasks = await Promise.all(
        tasksData.map(async (task) => {
          // Buscar subtarefas
          const { data: subtasksData } = await supabase
            .from('subtasks')
            .select('*')
            .eq('task_id', task.id);

          // Buscar canais de lembrete
          const { data: channelsData } = await supabase
            .from('task_reminder_channels')
            .select('channel')
            .eq('task_id', task.id);

          return {
            id: task.id,
            title: task.title,
            description: task.description || '',
            systemId: task.system_id,
            companyId: task.company_id,
            responsible: task.responsible,
            priority: task.priority,
            status: task.status,
            dueDate: new Date(task.due_date),
            createdAt: new Date(task.created_at),
            completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
            reminderEnabled: task.reminder_enabled,
            reminderChannels: channelsData?.map(c => c.channel) || [],
            subtasks: subtasksData?.map(s => ({
              id: s.id,
              title: s.title,
              completed: s.completed
            })) || []
          } as Task;
        })
      );

      return tasksWithSubtasks;
    }
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (task: Omit<Task, 'id' | 'createdAt'>) => {
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

      // Inserir canais de lembrete
      if (task.reminderChannels.length > 0) {
        await supabase
          .from('task_reminder_channels')
          .insert(
            task.reminderChannels.map(channel => ({
              task_id: data.id,
              channel
            }))
          );
      }

      // Inserir subtarefas
      if (task.subtasks.length > 0) {
        await supabase
          .from('subtasks')
          .insert(
            task.subtasks.map(subtask => ({
              task_id: data.id,
              title: subtask.title,
              completed: subtask.completed
            }))
          );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (task: Task) => {
      const { data, error } = await supabase
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
        .eq('id', task.id)
        .select()
        .single();
      
      if (error) throw error;

      // Atualizar canais de lembrete
      await supabase.from('task_reminder_channels').delete().eq('task_id', task.id);
      if (task.reminderChannels.length > 0) {
        await supabase
          .from('task_reminder_channels')
          .insert(
            task.reminderChannels.map(channel => ({
              task_id: task.id,
              channel
            }))
          );
      }

      // Atualizar subtarefas
      await supabase.from('subtasks').delete().eq('task_id', task.id);
      if (task.subtasks.length > 0) {
        await supabase
          .from('subtasks')
          .insert(
            task.subtasks.map(subtask => ({
              task_id: task.id,
              title: subtask.title,
              completed: subtask.completed
            }))
          );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};
