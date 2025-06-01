
import { Server, Users, Calendar, CheckCircle, XCircle, ExternalLink, Key } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { System } from '@/types';
import { cn } from '@/lib/utils';

interface SystemCardProps {
  system: System;
  companyNames: string[];
}

const statusConfig = {
  planned: { label: 'Planejado', color: 'bg-gray-500' },
  in_progress: { label: 'Em Execução', color: 'bg-blue-500' },
  testing: { label: 'Em Teste', color: 'bg-yellow-500' },
  completed: { label: 'Concluído', color: 'bg-green-500' }
};

const SystemCard = ({ system, companyNames }: SystemCardProps) => {
  const status = statusConfig[system.status];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{system.name}</h3>
              <p className="text-sm text-gray-500">v{system.version}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Badge className={cn("text-white", status.color)}>
              {status.label}
            </Badge>
            {system.isImplemented ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Implantado
              </Badge>
            ) : (
              <Badge variant="outline">
                <XCircle className="h-3 w-3 mr-1" />
                Não Implantado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{system.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">{system.progress}%</span>
          </div>
          <Progress value={system.progress} className="h-2" />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Key className="h-4 w-4" />
          <span>{system.accessUsers.length} usuários com acesso</span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{system.companies.length} empresas</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{system.expectedEndDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {system.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-500">Empresas:</p>
          <p className="text-sm">{companyNames.join(', ')}</p>
        </div>

        <div className="space-y-2 pt-2">
          {system.systemUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.open(system.systemUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Acessar Sistema
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              Controlar Acesso
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
