
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Incident, System, Company } from '@/types';
import { cn } from '@/lib/utils';
import IncidentDetailsModal from './IncidentDetailsModal';
import IncidentEditModal from './IncidentEditModal';

interface IncidentCardProps {
  incident: Incident;
  systemNames: string[];
  companyName: string;
  systems: System[];
  companies: Company[];
  onUpdate?: (incident: Incident) => void;
  onAddNote?: (incidentId: string, note: string) => void;
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

const IncidentCard = ({ incident, systemNames, companyName, systems, companies, onUpdate, onAddNote }: IncidentCardProps) => {
  const severity = severityConfig[incident.severity];
  const status = statusConfig[incident.status];
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-yellow-400/50 bg-[#18181b]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className={cn("h-5 w-5", status.color)} />
            <h3 className="font-semibold text-blue-300">{incident.title}</h3>
          </div>
          <Badge className={severity.color} style={{ color: '#222', fontWeight: 700 }}>
            {severity.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-200">{incident.description}</p>
        
        <div className="text-sm text-gray-100 flex items-center gap-2">
          <span className="font-bold text-white">Sistemas Envolvidos:</span>
          {systemNames.map((name, idx) => {
            let colorClass = '';
            if (incident.status === 'resolved') colorClass = 'bg-green-600 text-white border-green-800';
            else if (incident.status === 'in_progress') colorClass = 'bg-yellow-400 text-black border-yellow-600';
            else colorClass = 'bg-orange-400 text-black border-orange-600';
            return (
              <span
                key={name + idx}
                className={`px-2 py-1 rounded font-mono text-xs border ${colorClass}`}
              >
                {name}
              </span>
            );
          })}
          <span className="mx-2">•</span>
          <span className="text-gray-300">Empresa: {companyName}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Criado em {incident.createdAt.toLocaleDateString()}</span>
          {incident.resolvedAt && (
            <span>Resolvido em {incident.resolvedAt.toLocaleDateString()}</span>
          )}
        </div>

        {incident.notes.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Últimas anotações:</p>
            <div className="space-y-1">
              {incident.notes.slice(-2).map((note, index) => (
                <p key={index} className="text-xs bg-gray-900 text-yellow-300 p-2 rounded font-mono">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <IncidentDetailsModal
            incident={incident}
            systems={systems}
            companies={companies}
            onAddNote={onAddNote}
            onEdit={onUpdate ? () => {
              // Trigger edit modal
            } : undefined}
            trigger={
              <Button variant="outline" size="sm" className="flex-1 bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:text-black font-bold">
                Ver Detalhes
              </Button>
            }
          />
          {onUpdate && (
            <IncidentEditModal
              incident={incident}
              onUpdate={onUpdate}
              systems={systems}
              companies={companies}
              trigger={
                <Button variant="outline" size="sm" className="flex-1 bg-black text-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:text-black font-bold">
                  Editar
                </Button>
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
