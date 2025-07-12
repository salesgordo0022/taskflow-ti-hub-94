
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types';

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('Fetching companies from Supabase...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      console.log('Companies fetched:', data);
      return data.map(company => ({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        responsible: company.responsible,
        responsiblePerson: company.responsible_person,
        email: company.email,
        phone: company.phone,
        segment: company.segment,
        regime: company.regime,
        level: company.level,
        hasNotaEntrada: company.has_nota_entrada,
        hasNotaSaida: company.has_nota_saida,
        hasCupom: company.has_cupom,
        hasApuracao: company.has_apuracao,
        hasEnvioDocumentos: company.has_envio_documentos,
        isAutomated: company.is_automated,
        createdAt: new Date(company.created_at)
      })) as Company[];
    }
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Omit<Company, 'id' | 'createdAt'>) => {
      console.log('Creating company:', company);
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: company.name,
          cnpj: company.cnpj,
          responsible: company.responsible,
          responsible_person: company.responsiblePerson,
          email: company.email,
          phone: company.phone,
          segment: company.segment,
          regime: company.regime,
          level: company.level,
          has_nota_entrada: company.hasNotaEntrada,
          has_nota_saida: company.hasNotaSaida,
          has_cupom: company.hasCupom,
          has_apuracao: company.hasApuracao,
          has_envio_documentos: company.hasEnvioDocumentos,
          is_automated: company.isAutomated
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }
      console.log('Company created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Company) => {
      console.log('Updating company:', company);
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          cnpj: company.cnpj,
          responsible: company.responsible,
          responsible_person: company.responsiblePerson,
          email: company.email,
          phone: company.phone,
          segment: company.segment,
          regime: company.regime,
          level: company.level,
          has_nota_entrada: company.hasNotaEntrada,
          has_nota_saida: company.hasNotaSaida,
          has_cupom: company.hasCupom,
          has_apuracao: company.hasApuracao,
          has_envio_documentos: company.hasEnvioDocumentos,
          is_automated: company.isAutomated
        })
        .eq('id', company.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }
      console.log('Company updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting company:', id);
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }
      console.log('Company deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
};
