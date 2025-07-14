import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Incident } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          companies (name),
          incident_systems (
            systems (id, name)
          ),
          incident_notes (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedIncidents: Incident[] = data.map(incident => ({
        id: incident.id,
        title: incident.title,
        description: incident.description || '',
        companyId: incident.company_id,
        severity: incident.severity as 'low' | 'medium' | 'high' | 'critical',
        status: incident.status as 'open' | 'in_progress' | 'resolved',
        resolvedAt: incident.resolved_at ? new Date(incident.resolved_at) : undefined,
        systemIds: incident.incident_systems?.map((is: any) => is.systems.id) || [],
        notes: incident.incident_notes?.map((note: any) => note.note) || [],
        createdAt: new Date(incident.created_at)
      }));

      setIncidents(mappedIncidents);
    } catch (error) {
      console.error('Erro ao buscar incidentes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar incidentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incident: Omit<Incident, 'id' | 'createdAt' | 'notes'>) => {
    try {
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

      // Inserir relacionamentos com sistemas se existirem
      if (incident.systemIds && incident.systemIds.length > 0) {
        const systemsData = incident.systemIds.map(systemId => ({
          incident_id: data.id,
          system_id: systemId
        }));

        const { error: systemsError } = await supabase
          .from('incident_systems')
          .insert(systemsData);

        if (systemsError) throw systemsError;
      }

      await fetchIncidents();
      
      toast({
        title: "Sucesso",
        description: "Incidente criado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar incidente:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar incidente",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateIncident = async (incident: Incident) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({
          title: incident.title,
          description: incident.description,
          company_id: incident.companyId,
          severity: incident.severity,
          status: incident.status,
          resolved_at: incident.resolvedAt?.toISOString()
        })
        .eq('id', incident.id);

      if (error) throw error;

      // Atualizar relacionamentos com sistemas
      await supabase.from('incident_systems').delete().eq('incident_id', incident.id);
      
      if (incident.systemIds && incident.systemIds.length > 0) {
        const systemsData = incident.systemIds.map(systemId => ({
          incident_id: incident.id,
          system_id: systemId
        }));

        const { error: systemsError } = await supabase
          .from('incident_systems')
          .insert(systemsData);

        if (systemsError) throw systemsError;
      }

      await fetchIncidents();
      
      toast({
        title: "Sucesso",
        description: "Incidente atualizado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar incidente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar incidente",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchIncidents();
      
      toast({
        title: "Sucesso",
        description: "Incidente excluído com sucesso"
      });
    } catch (error) {
      console.error('Erro ao excluir incidente:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir incidente",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return {
    incidents,
    loading,
    createIncident,
    updateIncident,
    deleteIncident,
    refetch: fetchIncidents
  };
};
