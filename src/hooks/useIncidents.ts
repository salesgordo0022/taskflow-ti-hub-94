
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Incident } from '@/types';

export const useIncidents = () => {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (incidentsError) throw incidentsError;

      // Buscar sistemas relacionados e notas para cada incidente
      const incidentsWithRelations = await Promise.all(
        incidentsData.map(async (incident) => {
          // Buscar sistemas relacionados
          const { data: systemsData } = await supabase
            .from('incident_systems')
            .select('system_id')
            .eq('incident_id', incident.id);

          // Buscar notas
          const { data: notesData } = await supabase
            .from('incident_notes')
            .select('note')
            .eq('incident_id', incident.id)
            .order('created_at', { ascending: true });

          return {
            id: incident.id,
            title: incident.title,
            description: incident.description || '',
            systemIds: systemsData?.map(s => s.system_id) || [],
            companyId: incident.company_id,
            severity: incident.severity,
            status: incident.status,
            createdAt: new Date(incident.created_at),
            resolvedAt: incident.resolved_at ? new Date(incident.resolved_at) : undefined,
            notes: notesData?.map(n => n.note) || []
          } as Incident;
        })
      );

      return incidentsWithRelations;
    }
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (incident: Omit<Incident, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('incidents')
        .insert({
          title: incident.title,
          description: incident.description,
          company_id: incident.companyId,
          severity: incident.severity,
          status: incident.status,
          resolved_at: incident.resolvedAt?.toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;

      // Inserir relacionamentos com sistemas
      if (incident.systemIds.length > 0) {
        await supabase
          .from('incident_systems')
          .insert(
            incident.systemIds.map(systemId => ({
              incident_id: data.id,
              system_id: systemId
            }))
          );
      }

      // Inserir notas
      if (incident.notes.length > 0) {
        await supabase
          .from('incident_notes')
          .insert(
            incident.notes.map(note => ({
              incident_id: data.id,
              note
            }))
          );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    }
  });
};

export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (incident: Incident) => {
      const { data, error } = await supabase
        .from('incidents')
        .update({
          title: incident.title,
          description: incident.description,
          company_id: incident.companyId,
          severity: incident.severity,
          status: incident.status,
          resolved_at: incident.resolvedAt?.toISOString()
        })
        .eq('id', incident.id)
        .select()
        .single();
      
      if (error) throw error;

      // Atualizar relacionamentos com sistemas
      await supabase.from('incident_systems').delete().eq('incident_id', incident.id);
      if (incident.systemIds.length > 0) {
        await supabase
          .from('incident_systems')
          .insert(
            incident.systemIds.map(systemId => ({
              incident_id: incident.id,
              system_id: systemId
            }))
          );
      }

      // Atualizar notas
      await supabase.from('incident_notes').delete().eq('incident_id', incident.id);
      if (incident.notes.length > 0) {
        await supabase
          .from('incident_notes')
          .insert(
            incident.notes.map(note => ({
              incident_id: incident.id,
              note
            }))
          );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    }
  });
};

export const useDeleteIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    }
  });
};
