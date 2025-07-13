
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
      const { data, error } = await supabase
        .from('systems')
        .select(`
          *,
          system_tags (tag),
          system_companies (
            companies (id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedSystems: System[] = data.map(system => ({
        id: system.id,
        name: system.name,
        version: system.version,
        description: system.description || '',
        responsible: system.responsible,
        status: system.status,
        startDate: new Date(system.start_date),
        expectedEndDate: new Date(system.expected_end_date),
        actualEndDate: system.actual_end_date ? new Date(system.actual_end_date) : undefined,
        progress: system.progress,
        isImplemented: system.is_implemented,
        systemUrl: system.system_url || '',
        tags: system.system_tags?.map((t: any) => t.tag) || [],
        companies: system.system_companies?.map((sc: any) => sc.companies.name) || [],
        createdAt: new Date(system.created_at)
      }));

      setSystems(mappedSystems);
    } catch (error) {
      console.error('Erro ao buscar sistemas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar sistemas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSystem = async (system: Omit<System, 'id' | 'createdAt'>) => {
    try {
      const { data: systemData, error: systemError } = await supabase
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

      if (systemError) throw systemError;

      // Inserir tags se existirem
      if (system.tags && system.tags.length > 0) {
        const tagsData = system.tags.map(tag => ({
          system_id: systemData.id,
          tag: tag
        }));

        const { error: tagsError } = await supabase
          .from('system_tags')
          .insert(tagsData);

        if (tagsError) throw tagsError;
      }

      await fetchSystems();
      
      toast({
        title: "Sucesso",
        description: "Sistema criado com sucesso"
      });

      return systemData;
    } catch (error) {
      console.error('Erro ao criar sistema:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar sistema",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSystem = async (system: System) => {
    try {
      const { error: systemError } = await supabase
        .from('systems')
        .update({
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
        .eq('id', system.id);

      if (systemError) throw systemError;

      // Atualizar tags
      await supabase.from('system_tags').delete().eq('system_id', system.id);
      
      if (system.tags && system.tags.length > 0) {
        const tagsData = system.tags.map(tag => ({
          system_id: system.id,
          tag: tag
        }));

        const { error: tagsError } = await supabase
          .from('system_tags')
          .insert(tagsData);

        if (tagsError) throw tagsError;
      }

      await fetchSystems();
      
      toast({
        title: "Sucesso",
        description: "Sistema atualizado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar sistema:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar sistema",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteSystem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('systems')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSystems();
      
      toast({
        title: "Sucesso",
        description: "Sistema excluído com sucesso"
      });
    } catch (error) {
      console.error('Erro ao excluir sistema:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir sistema",
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
    deleteSystem,
    refetch: fetchSystems
  };
};
