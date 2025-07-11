import { useState } from 'react';
import { 
  Building2, 
  Zap, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  BarChart3,
  Filter
} from 'lucide-react';
import { Company } from '@/types';

interface AutomationReportProps {
  companies: Company[];
}

interface AutomationStats {
  totalCompanies: number;
  automatedCompanies: number;
  nonAutomatedCompanies: number;
  automationRate: number;
  automationBySegment: Record<string, { total: number; automated: number; rate: number }>;
  automationByRegime: Record<string, { total: number; automated: number; rate: number }>;
  automationByLevel: Record<string, { total: number; automated: number; rate: number }>;
  automationFeatures: {
    notaEntrada: number;
    notaSaida: number;
    cupom: number;
    apuracao: number;
    envioDocumentos: number;
  };
}

const AutomationReport = ({ companies }: AutomationReportProps) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'automated' | 'non-automated'>('all');

  const calculateStats = (): AutomationStats => {
    const totalCompanies = companies.length;
    const automatedCompanies = companies.filter(c => c.isAutomated).length;
    const nonAutomatedCompanies = totalCompanies - automatedCompanies;
    const automationRate = totalCompanies > 0 ? (automatedCompanies / totalCompanies) * 100 : 0;

    // Estatísticas por segmento
    const automationBySegment: Record<string, { total: number; automated: number; rate: number }> = {};
    companies.forEach(company => {
      if (!automationBySegment[company.segment]) {
        automationBySegment[company.segment] = { total: 0, automated: 0, rate: 0 };
      }
      automationBySegment[company.segment].total++;
      if (company.isAutomated) {
        automationBySegment[company.segment].automated++;
      }
    });

    Object.keys(automationBySegment).forEach(segment => {
      const { total, automated } = automationBySegment[segment];
      automationBySegment[segment].rate = total > 0 ? (automated / total) * 100 : 0;
    });

    // Estatísticas por regime
    const automationByRegime: Record<string, { total: number; automated: number; rate: number }> = {};
    companies.forEach(company => {
      if (!automationByRegime[company.regime]) {
        automationByRegime[company.regime] = { total: 0, automated: 0, rate: 0 };
      }
      automationByRegime[company.regime].total++;
      if (company.isAutomated) {
        automationByRegime[company.regime].automated++;
      }
    });

    Object.keys(automationByRegime).forEach(regime => {
      const { total, automated } = automationByRegime[regime];
      automationByRegime[regime].rate = total > 0 ? (automated / total) * 100 : 0;
    });

    // Estatísticas por nível
    const automationByLevel: Record<string, { total: number; automated: number; rate: number }> = {};
    companies.forEach(company => {
      if (!automationByLevel[company.level]) {
        automationByLevel[company.level] = { total: 0, automated: 0, rate: 0 };
      }
      automationByLevel[company.level].total++;
      if (company.isAutomated) {
        automationByLevel[company.level].automated++;
      }
    });

    Object.keys(automationByLevel).forEach(level => {
      const { total, automated } = automationByLevel[level];
      automationByLevel[level].rate = total > 0 ? (automated / total) * 100 : 0;
    });

    // Estatísticas de features de automação
    const automationFeatures = {
      notaEntrada: companies.filter(c => c.hasNotaEntrada).length,
      notaSaida: companies.filter(c => c.hasNotaSaida).length,
      cupom: companies.filter(c => c.hasCupom).length,
      apuracao: companies.filter(c => c.hasApuracao).length,
      envioDocumentos: companies.filter(c => c.hasEnvioDocumentos).length,
    };

    return {
      totalCompanies,
      automatedCompanies,
      nonAutomatedCompanies,
      automationRate,
      automationBySegment,
      automationByRegime,
      automationByLevel,
      automationFeatures
    };
  };

  const stats = calculateStats();

  const filteredCompanies = companies.filter(company => {
    if (selectedFilter === 'automated') return company.isAutomated;
    if (selectedFilter === 'non-automated') return !company.isAutomated;
    return true;
  });

  const getSegmentLabel = (segment: string) => {
    const labels: Record<string, string> = {
      'comercio': 'Comércio',
      'industria': 'Indústria',
      'servicos': 'Serviços',
      'rural': 'Rural',
      'outros': 'Outros'
    };
    return labels[segment] || segment;
  };

  const getRegimeLabel = (regime: string) => {
    const labels: Record<string, string> = {
      'simples': 'Simples Nacional',
      'presumido': 'Presumido',
      'real': 'Lucro Real',
      'mei': 'MEI'
    };
    return labels[regime] || regime;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'facil': 'Fácil',
      'medio': 'Médio',
      'dificil': 'Difícil'
    };
    return labels[level] || level;
  };

  return (
    <div className="space-y-6">
      {/* Header do Relatório */}
      <div className="card-dark p-6 rounded-lg border-purple-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold font-mono bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Relatório de Automações
          </h2>
        </div>
        <p className="text-gray-300 font-mono">Análise detalhada das automações por empresa</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-dark p-6 rounded-lg border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-mono">Taxa de Automação</p>
              <p className="text-2xl font-bold text-green-400 font-mono">{stats.automationRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="card-dark p-6 rounded-lg border-blue-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-mono">Empresas Automatizadas</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">{stats.automatedCompanies}</p>
            </div>
          </div>
        </div>

        <div className="card-dark p-6 rounded-lg border-yellow-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <XCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-mono">Pendentes Automação</p>
              <p className="text-2xl font-bold text-yellow-400 font-mono">{stats.nonAutomatedCompanies}</p>
            </div>
          </div>
        </div>

        <div className="card-dark p-6 rounded-lg border-purple-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-mono">Total Empresas</p>
              <p className="text-2xl font-bold text-purple-400 font-mono">{stats.totalCompanies}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-dark p-4 rounded-lg border-gray-500/30">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Todas', count: stats.totalCompanies },
              { key: 'automated', label: 'Automatizadas', count: stats.automatedCompanies },
              { key: 'non-automated', label: 'Pendentes', count: stats.nonAutomatedCompanies }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as 'all' | 'automated' | 'non-automated')}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                  selectedFilter === filter.key
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-800/60 text-gray-300 border border-gray-700/30 hover:border-purple-500/30'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automação por Segmento */}
        <div className="card-dark p-6 rounded-lg border-blue-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold font-mono text-blue-400">Automação por Segmento</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.automationBySegment).map(([segment, data]) => (
              <div key={segment} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-gray-300">{getSegmentLabel(segment)}</span>
                  <span className="text-sm font-mono text-blue-400">{data.automated}/{data.total}</span>
                </div>
                <div className="w-full bg-gray-700/60 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.rate}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-mono">{data.rate.toFixed(1)}% automatizado</span>
              </div>
            ))}
          </div>
        </div>

        {/* Automação por Regime */}
        <div className="card-dark p-6 rounded-lg border-green-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold font-mono text-green-400">Automação por Regime</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.automationByRegime).map(([regime, data]) => (
              <div key={regime} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-gray-300">{getRegimeLabel(regime)}</span>
                  <span className="text-sm font-mono text-green-400">{data.automated}/{data.total}</span>
                </div>
                <div className="w-full bg-gray-700/60 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.rate}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-mono">{data.rate.toFixed(1)}% automatizado</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features de Automação */}
      <div className="card-dark p-6 rounded-lg border-yellow-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold font-mono text-yellow-400">Features de Automação</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'notaEntrada', label: 'Nota Entrada', count: stats.automationFeatures.notaEntrada },
            { key: 'notaSaida', label: 'Nota Saída', count: stats.automationFeatures.notaSaida },
            { key: 'cupom', label: 'Cupom', count: stats.automationFeatures.cupom },
            { key: 'apuracao', label: 'Apuração', count: stats.automationFeatures.apuracao },
            { key: 'envioDocumentos', label: 'Envio Docs', count: stats.automationFeatures.envioDocumentos }
          ].map(feature => (
            <div key={feature.key} className="text-center p-4 bg-gray-800/60 rounded-lg border border-gray-700/30">
              <div className="text-2xl font-bold text-yellow-400 font-mono">{feature.count}</div>
              <div className="text-sm text-gray-300 font-mono">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="card-dark p-6 rounded-lg border-purple-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold font-mono text-purple-400">
            Empresas ({filteredCompanies.length})
          </h3>
        </div>
        <div className="space-y-3">
          {filteredCompanies.map(company => (
            <div key={company.id} className="p-4 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-lg hover:border-purple-500/30 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white font-mono">{company.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-mono border ${
                  company.isAutomated 
                    ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                }`}>
                  {company.isAutomated ? '✓ Automatizada' : '⏳ Pendente'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <span className="text-gray-400 font-mono">Segmento: {getSegmentLabel(company.segment)}</span>
                <span className="text-gray-400 font-mono">Regime: {getRegimeLabel(company.regime)}</span>
                <span className="text-gray-400 font-mono">Nível: {getLevelLabel(company.level)}</span>
                <span className="text-gray-400 font-mono">Responsável: {company.responsiblePerson}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {[
                  { key: 'notaEntrada', label: 'Nota Entrada', enabled: company.hasNotaEntrada },
                  { key: 'notaSaida', label: 'Nota Saída', enabled: company.hasNotaSaida },
                  { key: 'cupom', label: 'Cupom', enabled: company.hasCupom },
                  { key: 'apuracao', label: 'Apuração', enabled: company.hasApuracao },
                  { key: 'envioDocumentos', label: 'Envio Docs', enabled: company.hasEnvioDocumentos }
                ].map(feature => (
                  <span
                    key={feature.key}
                    className={`text-xs px-2 py-1 rounded-full font-mono border ${
                      feature.enabled
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    {feature.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomationReport; 