
import React, { useState } from 'react';
import { Building2, TrendingUp, Users, Bot, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import InteractiveReportsTable from '@/components/reports/InteractiveReportsTable';
import * as XLSX from 'xlsx';

const CompanyReportsTab = () => {
  const [showReportsTable, setShowReportsTable] = useState(false);
  const { companies, loading } = useSupabaseCompanies();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando relatórios...</div>
      </div>
    );
  }

  // Estatísticas das empresas
  const totalCompanies = companies.length;
  const automatedCompanies = companies.filter(c => c.isAutomated).length;
  const companiesBySegment = companies.reduce((acc, company) => {
    acc[company.segment] = (acc[company.segment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const companiesByRegime = companies.reduce((acc, company) => {
    acc[company.regime] = (acc[company.regime] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const companiesByLevel = companies.reduce((acc, company) => {
    acc[company.level] = (acc[company.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Automações por tipo
  const automationStats = {
    notaEntrada: companies.filter(c => c.hasNotaEntrada).length,
    notaSaida: companies.filter(c => c.hasNotaSaida).length,
    cupom: companies.filter(c => c.hasCupom).length,
    apuracao: companies.filter(c => c.hasApuracao).length,
    envioDocumentos: companies.filter(c => c.hasEnvioDocumentos).length,
  };

  // Dados para a tabela interativa
  const reportData = Object.entries(companiesBySegment).map(([segment, count], index) => ({
    id: `segment-${index}`,
    name: `Empresas - ${segment.charAt(0).toUpperCase() + segment.slice(1)}`,
    value: count,
    status: count > 0 ? 'Ativo' : 'Inativo',
    date: new Date().toLocaleDateString(),
    company: 'Todos os Segmentos',
    priority: count > 5 ? 'Alta' : count > 2 ? 'Média' : 'Baixa'
  }));

  const exportCompaniesReport = () => {
    const exportData = companies.map(company => ({
      'Nome': company.name,
      'CNPJ': company.cnpj,
      'Responsável': company.responsiblePerson,
      'Email': company.email,
      'Telefone': company.phone,
      'Segmento': company.segment,
      'Regime': company.regime,
      'Nível': company.level,
      'Automatizada': company.isAutomated ? 'Sim' : 'Não',
      'Nota Entrada': company.hasNotaEntrada ? 'Sim' : 'Não',
      'Nota Saída': company.hasNotaSaida ? 'Sim' : 'Não',
      'Cupom': company.hasCupom ? 'Sim' : 'Não',
      'Apuração': company.hasApuracao ? 'Sim' : 'Não',
      'Envio Documentos': company.hasEnvioDocumentos ? 'Sim' : 'Não',
      'Data Cadastro': company.createdAt.toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Empresas');
    XLSX.writeFile(workbook, `relatorio_empresas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Relatórios de Empresas</h2>
        <div className="flex gap-2">
          <Button onClick={exportCompaniesReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button onClick={() => setShowReportsTable(true)} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Tabela Interativa
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Empresas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automatizadas</CardTitle>
            <Bot className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automatedCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {totalCompanies > 0 ? Math.round((automatedCompanies / totalCompanies) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Automação</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCompanies > 0 ? Math.round((automatedCompanies / totalCompanies) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Empresas automatizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segmentos Ativos</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(companiesBySegment).length}</div>
            <p className="text-xs text-muted-foreground">Diferentes segmentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Segmento */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Segmento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(companiesBySegment).map(([segment, count]) => (
              <div key={segment} className="flex items-center justify-between">
                <span className="capitalize">{segment}</span>
                <Badge variant="outline">{count} empresas</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Distribuição por Regime */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Regime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(companiesByRegime).map(([regime, count]) => (
              <div key={regime} className="flex items-center justify-between">
                <span className="uppercase">{regime}</span>
                <Badge variant="outline">{count} empresas</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Distribuição por Nível */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Nível de Complexidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(companiesByLevel).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="capitalize">{level}</span>
                <Badge 
                  variant="outline"
                  className={
                    level === 'facil' ? 'border-green-500 text-green-700' :
                    level === 'medio' ? 'border-yellow-500 text-yellow-700' :
                    'border-red-500 text-red-700'
                  }
                >
                  {count} empresas
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Estatísticas de Automação */}
        <Card>
          <CardHeader>
            <CardTitle>Automações por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Nota de Entrada</span>
              <Badge variant="outline">{automationStats.notaEntrada} empresas</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Nota de Saída</span>
              <Badge variant="outline">{automationStats.notaSaida} empresas</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Cupom Fiscal</span>
              <Badge variant="outline">{automationStats.cupom} empresas</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Apuração</span>
              <Badge variant="outline">{automationStats.apuracao} empresas</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Envio de Documentos</span>
              <Badge variant="outline">{automationStats.envioDocumentos} empresas</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {showReportsTable && (
        <InteractiveReportsTable
          title="Relatório de Empresas por Segmento"
          data={reportData}
          onClose={() => setShowReportsTable(false)}
        />
      )}
    </div>
  );
};

export default CompanyReportsTab;
