import { Server, Users, Calendar, CheckCircle, XCircle, ExternalLink, Key, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { System } from '@/types';
import { cn } from '@/lib/utils';
import SystemEditModal from './SystemEditModal';

interface SystemCardProps {
  system: System;
  companyNames: string[];
  onUpdate: (system: System) => void;
}

const statusConfig = {
  planned: { label: 'Planejado', color: 'bg-gray-500 text-white' },
  in_progress: { label: 'Em Execução', color: 'bg-blue-500 text-white' },
  testing: { label: 'Em Teste', color: 'bg-yellow-500 text-white' },
  completed: { label: 'Concluído', color: 'bg-green-500 text-white' }
};

const SystemCard = ({ system, companyNames, onUpdate }: SystemCardProps) => {
  const status = statusConfig[system.status];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-gray-900/80 backdrop-blur-sm border-blue-500/30 hover:border-blue-500/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Server className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white font-mono">{system.name}</h3>
              <p className="text-sm text-blue-300 font-mono">v{system.version}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={cn("font-mono", status.color)}>
              {status.label}
            </Badge>
            {system.isImplemented ? (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 font-mono">
                <CheckCircle className="h-3 w-3 mr-1" />
                Implantado
              </Badge>
            ) : (
              <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 font-mono">
                <XCircle className="h-3 w-3 mr-1" />
                Não Implantado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-300 font-mono">{system.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-mono">Progresso</span>
            <span className="font-medium text-blue-400 font-mono">{system.progress}%</span>
          </div>
          <Progress value={system.progress} className="h-2 bg-gray-700" />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Key className="h-4 w-4 text-blue-400" />
          <span className="font-mono">{system.accessUsers.length} usuários com acesso</span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-green-400" />
            <span className="font-mono">{system.companies.length} empresas</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="font-mono">{system.expectedEndDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {system.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-800/50 text-gray-300 border-gray-600 font-mono">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-mono">Empresas:</p>
          <p className="text-sm text-gray-300 font-mono">{companyNames.join(', ')}</p>
        </div>

        <div className="space-y-2 pt-2">
          {system.systemUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 font-mono"
              onClick={() => window.open(system.systemUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Acessar Sistema
            </Button>
          )}
          <div className="flex space-x-2">
            <SystemEditModal system={system} onSave={onUpdate} readOnly />
            <SystemEditModal system={system} onSave={onUpdate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
