
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
      console.log('Buscando empresas do Supabase...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
      }

      console.log('Empresas encontradas:', data);
      const mappedCompanies: Company[] = data.map(item => ({
        id: item.id,
        name: item.name,
        cnpj: item.cnpj,
        responsible: item.responsible,
        responsiblePerson: item.responsible_person,
        email: item.email,
        phone: item.phone,
        segment: item.segment as Company['segment'],
        regime: item.regime as Company['regime'],
        level: item.level as Company['level'],
        hasNotaEntrada: item.has_nota_entrada || false,
        hasNotaSaida: item.has_nota_saida || false,
        hasCupom: item.has_cupom || false,
        hasApuracao: item.has_apuracao || false,
        hasEnvioDocumentos: item.has_envio_documentos || false,
        isAutomated: item.is_automated || false,
        createdAt: new Date(item.created_at)
      }));

      setCompanies(mappedCompanies);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as empresas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (company: Omit<Company, 'id' | 'createdAt'>) => {
    try {
      console.log('Criando empresa:', company);
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
        console.error('Erro ao criar empresa:', error);
        throw error;
      }

      console.log('Empresa criada:', data);
      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso!"
      });

      fetchCompanies();
      return data;
    } catch (error) {
      console.error('Erro ao crear empresa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a empresa.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      console.log('Atualizando empresa:', id, updates);
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: updates.name,
          cnpj: updates.cnpj,
          responsible: updates.responsible,
          responsible_person: updates.responsiblePerson,
          email: updates.email,
          phone: updates.phone,
          segment: updates.segment,
          regime: updates.regime,
          level: updates.level,
          has_nota_entrada: updates.hasNotaEntrada,
          has_nota_saida: updates.hasNotaSaida,
          has_cupom: updates.hasCupom,
          has_apuracao: updates.hasApuracao,
          has_envio_documentos: updates.hasEnvioDocumentos,
          is_automated: updates.isAutomated
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar empresa:', error);
        throw error;
      }

      console.log('Empresa atualizada:', data);
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!"
      });

      fetchCompanies();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a empresa.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      console.log('Deletando empresa:', id);
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar empresa:', error);
        throw error;
      }

      console.log('Empresa deletada');
      toast({
        title: "Sucesso",
        description: "Empresa removida com sucesso!"
      });

      fetchCompanies();
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a empresa.",
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
