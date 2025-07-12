
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { System } from '@/types';

export const useSystems = () => {
  return useQuery({
    queryKey: ['systems'],
    queryFn: async () => {
      const { data: systemsData, error: systemsError } = await supabase
        .from('systems')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (systemsError) throw systemsError;

      // Buscar empresas relacionadas e tags para cada sistema
      const systemsWithRelations = await Promise.all(
        systemsData.map(async (system) => {
          // Buscar empresas relacionadas
          const { data: companiesData } = await supabase
            .from('system_companies')
            .select('company_id')
            .eq('system_id', system.id);

          // Buscar tags
          const { data: tagsData } = await supabase
            .from('system_tags')
            .select('tag')
            .eq('system_id', system.id);

          // Buscar usuários com acesso
          const { data: usersData } = await supabase
            .from('system_users')
            .select('user_id')
            .eq('system_id', system.id);

          return {
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
            companies: companiesData?.map(c => c.company_id) || [],
            tags: tagsData?.map(t => t.tag) || [],
            isImplemented: system.is_implemented,
            accessUsers: usersData?.map(u => u.user_id) || [],
            systemUrl: system.system_url
          } as System;
        })
      );

      return systemsWithRelations;
    }
  });
};

export const useCreateSystem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (system: Omit<System, 'id'>) => {
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
      
      if (error) throw error;

      // Inserir relacionamentos com empresas
      if (system.companies.length > 0) {
        const { error: companiesError } = await supabase
          .from('system_companies')
          .insert(
            system.companies.map(companyId => ({
              system_id: data.id,
              company_id: companyId
            }))
          );
        
        if (companiesError) throw companiesError;
      }

      // Inserir tags
      if (system.tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('system_tags')
          .insert(
            system.tags.map(tag => ({
              system_id: data.id,
              tag
            }))
          );
        
        if (tagsError) throw tagsError;
      }

      // Inserir usuários com acesso
      if (system.accessUsers.length > 0) {
        const { error: usersError } = await supabase
          .from('system_users')
          .insert(
            system.accessUsers.map(userId => ({
              system_id: data.id,
              user_id: userId
            }))
          );
        
        if (usersError) throw usersError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
    }
  });
};

export const useUpdateSystem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (system: System) => {
      const { data, error } = await supabase
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
        .eq('id', system.id)
        .select()
        .single();
      
      if (error) throw error;

      // Atualizar relacionamentos com empresas
      await supabase.from('system_companies').delete().eq('system_id', system.id);
      if (system.companies.length > 0) {
        await supabase
          .from('system_companies')
          .insert(
            system.companies.map(companyId => ({
              system_id: system.id,
              company_id: companyId
            }))
          );
      }

      // Atualizar tags
      await supabase.from('system_tags').delete().eq('system_id', system.id);
      if (system.tags.length > 0) {
        await supabase
          .from('system_tags')
          .insert(
            system.tags.map(tag => ({
              system_id: system.id,
              tag
            }))
          );
      }

      // Atualizar usuários com acesso
      await supabase.from('system_users').delete().eq('system_id', system.id);
      if (system.accessUsers.length > 0) {
        await supabase
          .from('system_users')
          .insert(
            system.accessUsers.map(userId => ({
              system_id: system.id,
              user_id: userId
            }))
          );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
    }
  });
};

export const useDeleteSystem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('systems')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
    }
  });
};
