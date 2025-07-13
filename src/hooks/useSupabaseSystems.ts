
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { System } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseSystems = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSystems = async () => {
    try {
      console.log('Buscando sistemas do Supabase...');
      const { data, error } = await supabase
        .from('systems')
        .select(`
          *,
          system_companies (company_id),
          system_tags (tag),
          system_users (user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sistemas:', error);
        throw error;
      }

      console.log('Sistemas encontrados:', data);
      const mappedSystems: System[] = data.map(item => ({
        id: item.id,
        name: item.name,
        version: item.version,
        description: item.description || '',
        responsible: item.responsible,
        status: item.status as System['status'],
        startDate: new Date(item.start_date),
        expectedEndDate: new Date(item.expected_end_date),
        actualEndDate: item.actual_end_date ? new Date(item.actual_end_date) : undefined,
        companies: (item.system_companies as any[])?.map(sc => sc.company_id) || [],
        progress: item.progress || 0,
        tags: (item.system_tags as any[])?.map(st => st.tag) || [],
        isImplemented: item.is_implemented || false,
        accessUsers: (item.system_users as any[])?.map(su => su.user_id) || [],
        systemUrl: item.system_url || undefined
      }));

      setSystems(mappedSystems);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os sistemas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSystem = async (system: Omit<System, 'id'>) => {
    try {
      console.log('Criando sistema:', system);
      const { data, error } = await supabase
        .from('systems')
        .insert({
          name: system.name,
          version: system.version,
          description: system.description,
          responsible: system.responsible,
          status: system.status,
          start_date: system.startDate.toISOString(),
          expected_end_date: system.expectedEndDate.toISOString(),
          actual_end_date: system.actualEndDate?.toISOString(),
          progress: system.progress,
          is_implemented: system.isImplemented,
          system_url: system.systemUrl
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar sistema:', error);
        throw error;
      }

      console.log('Sistema criado:', data);
      toast({
        title: "Sucesso",
        description: "Sistema criado com sucesso!"
      });

      fetchSystems();
      return data;
    } catch (error) {
      console.error('Erro ao criar sistema:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o sistema.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSystem = async (id: string, updates: Partial<System>) => {
    try {
      console.log('Atualizando sistema:', id, updates);
      const { data, error } = await supabase
        .from('systems')
        .update({
          name: updates.name,
          version: updates.version,
          description: updates.description,
          responsible: updates.responsible,
          status: updates.status,
          start_date: updates.startDate?.toISOString(),
          expected_end_date: updates.expectedEndDate?.toISOString(),
          actual_end_date: updates.actualEndDate?.toISOString(),
          progress: updates.progress,
          is_implemented: updates.isImplemented,
          system_url: updates.systemUrl
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar sistema:', error);
        throw error;
      }

      console.log('Sistema atualizado:', data);
      toast({
        title: "Sucesso",
        description: "Sistema atualizado com sucesso!"
      });

      fetchSystems();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar sistema:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o sistema.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  return {
    systems,
    loading,
    createSystem,
    updateSystem,
    refetch: fetchSystems
  };
};
