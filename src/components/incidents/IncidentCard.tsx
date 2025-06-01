
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Incident } from '@/types';
import { cn } from '@/lib/utils';

interface IncidentCardProps {
  incident: Incident;
  systemName: string;
  companyName: string;
}

const severityConfig = {
  low: { label: 'Baixa', color: 'bg-green-100 text-green-800', icon: AlertCircle },
  medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
};

const statusConfig = {
  open: { label: 'Aberto', icon: AlertCircle, color: 'text-red-500' },
  in_progress: { label: 'Em Progresso', icon: Clock, color: 'text-blue-500' },
  resolved: { label: 'Resolvido', icon: CheckCircle, color: 'text-green-500' }
};

const IncidentCard = ({ incident, systemName, companyName }: IncidentCardProps) => {
  const severity = severityConfig[incident.severity];
  const status = statusConfig[incident.status];
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className={cn("h-5 w-5", status.color)} />
            <h3 className="font-semibold text-gray-900">{incident.title}</h3>
          </div>
          <Badge className={severity.color}>
            {severity.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{incident.description}</p>
        
        <div className="text-sm text-gray-500">
          <span>Sistema: {systemName}</span>
          <span className="mx-2">•</span>
          <span>Empresa: {companyName}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Criado em {incident.createdAt.toLocaleDateString()}</span>
          {incident.resolvedAt && (
            <span>Resolvido em {incident.resolvedAt.toLocaleDateString()}</span>
          )}
        </div>

        {incident.notes.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Últimas anotações:</p>
            <div className="space-y-1">
              {incident.notes.slice(-2).map((note, index) => (
                <p key={index} className="text-xs bg-gray-50 p-2 rounded">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Ver Detalhes
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Adicionar Nota
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
