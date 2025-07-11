import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Building,
  Server,
  FileText,
  User,
  Edit,
  Plus
} from 'lucide-react';
import { Incident, System, Company } from '@/types';
import { cn } from '@/lib/utils';

interface IncidentDetailsModalProps {
  incident: Incident;
  systems: System[];
  companies: Company[];
  onAddNote?: (incidentId: string, note: string) => void;
  onEdit?: () => void;
  trigger?: React.ReactNode;
}

const severityConfig = {
  low: { label: 'Baixa', color: 'bg-green-100 text-green-800', icon: AlertCircle },
  medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
};

const statusConfig = {
  open: { label: 'Aberto', icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  in_progress: { label: 'Em Progresso', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  resolved: { label: 'Resolvido', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' }
};

const IncidentDetailsModal = ({ 
  incident, 
  systems, 
  companies, 
  onAddNote, 
  onEdit,
  trigger 
}: IncidentDetailsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  const severity = severityConfig[incident.severity];
  const status = statusConfig[incident.status];
  const StatusIcon = status.icon;
  const SeverityIcon = severity.icon;

  const selectedSystems = systems.filter(s => incident.systemIds.includes(s.id));
  const selectedCompany = companies.find(c => c.id === incident.companyId);

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(incident.id, newNote.trim());
      setNewNote('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-600 text-white border-green-800';
      case 'in_progress': return 'bg-yellow-400 text-black border-yellow-600';
      default: return 'bg-orange-400 text-black border-orange-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Ver Detalhes</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#18181b] text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-blue-300">Detalhes do Incidente</DialogTitle>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cabeçalho com Status e Severidade */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2 rounded-full", status.bgColor)}>
                    <StatusIcon className={cn("h-5 w-5", status.color)} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{incident.title}</h2>
                    <p className="text-sm text-gray-400">ID: {incident.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={severity.color} style={{ color: '#222', fontWeight: 700 }}>
                    <SeverityIcon className="h-3 w-3 mr-1" />
                    {severity.label}
                  </Badge>
                  <Badge className={cn("border", status.bgColor, status.color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Descrição */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Descrição
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 leading-relaxed">{incident.description}</p>
            </CardContent>
          </Card>

          {/* Informações do Sistema e Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Sistemas Envolvidos
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedSystems.map(system => (
                    <div key={system.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <div>
                        <p className="font-medium text-white">{system.name}</p>
                        <p className="text-sm text-gray-400">v{system.version}</p>
                      </div>
                      <Badge className={getStatusColor(incident.status)}>
                        {system.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Empresa
                </h3>
              </CardHeader>
              <CardContent>
                {selectedCompany && (
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-800 rounded">
                      <p className="font-medium text-white">{selectedCompany.name}</p>
                      <p className="text-sm text-gray-400">CNPJ: {selectedCompany.cnpj}</p>
                      <p className="text-sm text-gray-400">Responsável: {selectedCompany.responsible}</p>
                      <p className="text-sm text-gray-400">Email: {selectedCompany.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline e Datas */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timeline
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">Incidente Criado</p>
                    <p className="text-sm text-gray-400">{incident.createdAt.toLocaleString()}</p>
                  </div>
                </div>
                
                {incident.status === 'in_progress' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Em Progresso</p>
                      <p className="text-sm text-gray-400">Status atual</p>
                    </div>
                  </div>
                )}
                
                {incident.status === 'resolved' && incident.resolvedAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Resolvido</p>
                      <p className="text-sm text-gray-400">{incident.resolvedAt.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Anotações */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Anotações ({incident.notes.length})
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incident.notes.length > 0 ? (
                  incident.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-800 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-gray-200">{note}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Anotação #{index + 1}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">Nenhuma anotação registrada</p>
                )}
                
                {onAddNote && (
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Adicionar nova anotação..."
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                      onKeyPress={e => e.key === 'Enter' && handleAddNote()}
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-blue-300">Estatísticas</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{incident.notes.length}</p>
                  <p className="text-sm text-gray-400">Anotações</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{selectedSystems.length}</p>
                  <p className="text-sm text-gray-400">Sistemas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {Math.floor((Date.now() - incident.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-gray-400">Dias Ativo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {incident.status === 'resolved' && incident.resolvedAt 
                      ? Math.floor((incident.resolvedAt.getTime() - incident.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                      : '-'
                    }
                  </p>
                  <p className="text-sm text-gray-400">Dias para Resolver</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={() => setIsOpen(false)}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailsModal; 