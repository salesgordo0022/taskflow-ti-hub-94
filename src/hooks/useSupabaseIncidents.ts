
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
      console.log('Buscando incidentes do Supabase...');
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          incident_systems (system_id),
          incident_notes (note)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar incidentes:', error);
        throw error;
      }

      console.log('Incidentes encontrados:', data);
      const mappedIncidents: Incident[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        systemIds: (item.incident_systems as any[])?.map(is => is.system_id) || [],
        companyId: item.company_id,
        severity: item.severity as Incident['severity'],
        status: item.status as Incident['status'],
        createdAt: new Date(item.created_at),
        resolvedAt: item.resolved_at ? new Date(item.resolved_at) : undefined,
        notes: (item.incident_notes as any[])?.map(in_ => in_.note) || []
      }));

      setIncidents(mappedIncidents);
    } catch (error) {
      console.error('Erro ao carregar incidentes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os incidentes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incident: Omit<Incident, 'id' | 'createdAt' | 'notes'>) => {
    try {
      console.log('Criando incidente:', incident);
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

      if (error) {
        console.error('Erro ao criar incidente:', error);
        throw error;
      }

      console.log('Incidente criado:', data);
      toast({
        title: "Sucesso",
        description: "Incidente criado com sucesso!"
      });

      fetchIncidents();
      return data;
    } catch (error) {
      console.error('Erro ao criar incidente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o incidente.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    try {
      console.log('Atualizando incidente:', id, updates);
      const { data, error } = await supabase
        .from('incidents')
        .update({
          title: updates.title,
          description: updates.description,
          company_id: updates.companyId,
          severity: updates.severity,
          status: updates.status,
          resolved_at: updates.resolvedAt?.toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar incidente:', error);
        throw error;
      }

      console.log('Incidente atualizado:', data);
      toast({
        title: "Sucesso",
        description: "Incidente atualizado com sucesso!"
      });

      fetchIncidents();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar incidente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o incidente.",
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
    refetch: fetchIncidents
  };
};
