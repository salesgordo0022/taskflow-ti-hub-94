
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { System } from '@/types';

export const useSystems = () => {
  return useQuery({
    queryKey: ['systems'],
    queryFn: async () => {
      console.log('Fetching systems from Supabase...');
      const { data: systemsData, error: systemsError } = await supabase
        .from('systems')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (systemsError) {
        console.error('Error fetching systems:', systemsError);
        throw systemsError;
      }

      console.log('Systems fetched:', systemsData);

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
      console.log('Creating system:', system);
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
        console.error('Error creating system:', error);
        throw error;
      }

      console.log('System created:', data);

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
        
        if (companiesError) {
          console.error('Error linking companies:', companiesError);
          throw companiesError;
        }
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
        
        if (tagsError) {
          console.error('Error creating tags:', tagsError);
          throw tagsError;
        }
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
        
        if (usersError) {
          console.error('Error linking users:', usersError);
          throw usersError;
        }
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
      console.log('Updating system:', system);
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
      
      if (error) {
        console.error('Error updating system:', error);
        throw error;
      }

      console.log('System updated:', data);

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
      console.log('Deleting system:', id);
      const { error } = await supabase
        .from('systems')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting system:', error);
        throw error;
      }
      console.log('System deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
    }
  });
};
