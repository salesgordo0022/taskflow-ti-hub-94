import { useState } from 'react';
import { 
  Lightbulb, 
  Users, 
  Shield, 
  Key, 
  Eye, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
  Network,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const SystemManagementTips = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const tips = [
    {
      id: 'access-control',
      title: 'Controle de Acessos',
      icon: Shield,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      tips: [
        '🔐 Implemente autenticação de dois fatores (2FA) para todos os usuários',
        '👥 Crie grupos de usuários por função (Admin, Usuário, Visualizador)',
        '⏰ Configure expiração automática de senhas (90 dias)',
        '🚫 Bloqueie acessos após 3 tentativas de login falhadas',
        '📱 Monitore logins suspeitos e acessos fora do horário comercial',
        '🔄 Faça auditoria mensal de acessos e permissões',
        '📧 Configure notificações de login para contas administrativas'
      ]
    },
    {
      id: 'user-management',
      title: 'Gestão de Usuários',
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      tips: [
        '👤 Mantenha um inventário atualizado de todos os usuários',
        '📋 Crie perfis padrão para cada tipo de usuário',
        '🔄 Processo de onboarding: solicitação → aprovação → criação → treinamento',
        '📤 Processo de offboarding: desativação → backup → remoção de acessos',
        '📊 Relatórios mensais de usuários ativos/inativos',
        '🎯 Defina responsáveis por cada sistema',
        '📞 Mantenha contatos de emergência atualizados'
      ]
    },
    {
      id: 'system-description',
      title: 'Descrição e Documentação',
      icon: Database,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      tips: [
        '📝 Documente o propósito e funcionalidades principais de cada sistema',
        '🔗 Mapeie integrações entre sistemas',
        '📋 Mantenha lista de dependências técnicas',
        '📚 Crie manuais de usuário e procedimentos',
        '🔄 Atualize documentação a cada nova versão',
        '📊 Documente métricas de performance e SLA',
        '🚨 Procedimentos de backup e recuperação'
      ]
    },
    {
      id: 'responsible-management',
      title: 'Gestão de Responsáveis',
      icon: UserPlus,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      tips: [
        '👨‍💼 Designe um responsável principal por sistema',
        '👥 Defina responsáveis secundários (backup)',
        '📞 Mantenha contatos de emergência 24/7',
        '📅 Escala de plantão para sistemas críticos',
        '📋 Matriz de responsabilidades (RACI)',
        '🔄 Reuniões semanais de alinhamento',
        '📊 KPIs de responsabilidade e SLA'
      ]
    },
    {
      id: 'security',
      title: 'Segurança e Compliance',
      icon: Lock,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      tips: [
        '🔒 Criptografia de dados sensíveis',
        '📋 Política de senhas forte (mínimo 12 caracteres)',
        '🔄 Backup automático e criptografado',
        '📊 Logs de auditoria para todas as ações',
        '🚨 Monitoramento de atividades suspeitas',
        '📋 Conformidade com LGPD e regulamentações',
        '🛡️ Antivírus e firewall atualizados'
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoramento e Alertas',
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30',
      tips: [
        '📊 Dashboards em tempo real de performance',
        '🚨 Alertas automáticos para falhas críticas',
        '📈 Métricas de uptime e disponibilidade',
        '🔍 Logs centralizados para análise',
        '📱 Notificações via email, SMS e WhatsApp',
        '📋 Relatórios diários de status dos sistemas',
        '🎯 SLA de resposta para diferentes tipos de incidente'
      ]
    }
  ];

  const bestPractices = [
    {
      title: 'Controle de Acesso',
      practices: [
        'Princípio do menor privilégio',
        'Revisão trimestral de permissões',
        'Segregação de funções',
        'Acesso baseado em roles (RBAC)'
      ]
    },
    {
      title: 'Gestão de Usuários',
      practices: [
        'Processo automatizado de onboarding/offboarding',
        'Single Sign-On (SSO) quando possível',
        'Diretório centralizado de usuários',
        'Treinamento obrigatório para novos usuários'
      ]
    },
    {
      title: 'Documentação',
      practices: [
        'Documentação sempre atualizada',
        'Versionamento de documentação',
        'Templates padronizados',
        'Revisão semanal de mudanças'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-dark p-6 rounded-lg border-blue-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Dicas de Gestão de Sistemas
          </h2>
        </div>
        <p className="text-gray-300 font-mono">
          Guia completo para controlar acessos, usuários, descrições e responsáveis dos seus sistemas
        </p>
      </div>

      {/* Alert de Boas Práticas */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>💡 Dica:</strong> Use estas dicas como checklist para implementar um controle robusto de sistemas. 
          Cada seção pode ser expandida para ver detalhes específicos.
        </AlertDescription>
      </Alert>

      {/* Seções de Dicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tips.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);
          
          return (
            <Card key={section.id} className={`card-dark border ${section.borderColor} hover:shadow-lg transition-all duration-300`}>
              <CardHeader className="pb-3">
                <Button 
                  variant="ghost" 
                  className="w-full p-0 h-auto justify-start"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${section.bgColor} border ${section.borderColor}`}>
                      <Icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <CardTitle className={`text-lg font-mono ${section.color}`}>
                        {section.title}
                      </CardTitle>
                      <p className="text-sm text-gray-400 font-mono">
                        {isExpanded ? 'Clique para recolher' : 'Clique para expandir'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {section.tips.length} dicas
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </Button>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    {section.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/60 rounded-lg border border-gray-700/30">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-gray-300 font-mono">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Melhores Práticas */}
      <div className="card-dark p-6 rounded-lg border-green-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-bold font-mono text-green-400">Melhores Práticas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestPractices.map((practice, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-semibold text-white font-mono">{practice.title}</h4>
              <ul className="space-y-2">
                {practice.practices.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-300 font-mono">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist de Implementação */}
      <div className="card-dark p-6 rounded-lg border-yellow-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-bold font-mono text-yellow-400">Checklist de Implementação</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-white font-mono">Fase 1: Preparação</h4>
            <div className="space-y-2">
              {[
                'Inventário completo de sistemas',
                'Mapeamento de usuários atuais',
                'Definição de responsáveis',
                'Criação de políticas de acesso'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-yellow-500/30 rounded flex-shrink-0" />
                  <span className="text-sm text-gray-300 font-mono">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-white font-mono">Fase 2: Implementação</h4>
            <div className="space-y-2">
              {[
                'Configuração de autenticação',
                'Criação de perfis de usuário',
                'Implementação de monitoramento',
                'Treinamento da equipe'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-yellow-500/30 rounded flex-shrink-0" />
                  <span className="text-sm text-gray-300 font-mono">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alertas Importantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>⚠️ Importante:</strong> Sempre mantenha backups atualizados e tenha um plano de recuperação de desastres.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>⏰ Lembrete:</strong> Revise permissões e acessos trimestralmente para manter a segurança.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SystemManagementTips; 