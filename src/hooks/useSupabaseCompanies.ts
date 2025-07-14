import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedCompanies: Company[] = data.map(company => ({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        responsible: company.responsible,
        responsiblePerson: company.responsible_person,
        email: company.email,
        phone: company.phone,
        segment: company.segment as 'comercio' | 'industria' | 'servicos' | 'rural' | 'outros',
        regime: company.regime as 'simples' | 'presumido' | 'real' | 'mei',
        level: company.level as 'facil' | 'medio' | 'dificil',
        hasNotaEntrada: company.has_nota_entrada || false,
        hasNotaSaida: company.has_nota_saida || false,
        hasCupom: company.has_cupom || false,
        hasApuracao: company.has_apuracao || false,
        hasEnvioDocumentos: company.has_envio_documentos || false,
        isAutomated: company.is_automated || false,
        createdAt: new Date(company.created_at)
      }));

      setCompanies(mappedCompanies);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (company: Omit<Company, 'id' | 'createdAt'>) => {
    try {
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

      if (error) throw error;

      await fetchCompanies();
      
      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar empresa",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCompany = async (company: Company) => {
    try {
      const { error } = await supabase
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
        .eq('id', company.id);

      if (error) throw error;

      await fetchCompanies();
      
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCompanies();
      
      toast({
        title: "Sucesso",
        description: "Empresa excluída com sucesso"
      });
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir empresa",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  };
};
