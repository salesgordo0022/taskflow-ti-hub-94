import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { Incident, System, Company } from '@/types';

interface IncidentEditModalProps {
  incident: Incident;
  onUpdate: (incident: Incident) => void;
  systems: System[];
  companies: Company[];
  trigger?: React.ReactNode;
}

const IncidentEditModal = ({ incident, onUpdate, systems, companies, trigger }: IncidentEditModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedIncident, setEditedIncident] = useState<Incident>(incident);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    setEditedIncident(incident);
  }, [incident]);

  const handleSave = () => {
    onUpdate(editedIncident);
    setIsOpen(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setEditedIncident(prev => ({
        ...prev,
        notes: [...prev.notes, newNote.trim()]
      }));
      setNewNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    setEditedIncident(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const handleStatusChange = (status: Incident['status']) => {
    setEditedIncident(prev => ({
      ...prev,
      status,
      resolvedAt: status === 'resolved' ? new Date() : undefined
    }));
  };

  const selectedSystems = systems.filter(s => editedIncident.systemIds.includes(s.id));
  const selectedCompany = companies.find(c => c.id === editedIncident.companyId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Editar</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#18181b] text-white">
        <DialogHeader>
          <DialogTitle className="text-blue-300">Editar Incidente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white">Título</Label>
              <Input 
                id="title" 
                value={editedIncident.title} 
                onChange={e => setEditedIncident(i => ({ ...i, title: e.target.value }))} 
                className="bg-gray-900 text-white border-gray-700 placeholder-gray-400" 
              />
            </div>
            <div>
              <Label htmlFor="severity" className="text-white">Severidade</Label>
              <Select 
                value={editedIncident.severity} 
                onValueChange={value => setEditedIncident(i => ({ ...i, severity: value as Incident['severity'] }))}
              >
                <SelectTrigger className="bg-gray-900 text-white border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-700">
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Descrição</Label>
            <Textarea 
              id="description" 
              value={editedIncident.description} 
              onChange={e => setEditedIncident(i => ({ ...i, description: e.target.value }))} 
              className="bg-gray-900 text-white border-gray-700 placeholder-gray-400 min-h-[100px]" 
            />
          </div>

          {/* Status e Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-white">Status</Label>
              <Select 
                value={editedIncident.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="bg-gray-900 text-white border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-700">
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="company" className="text-white">Empresa</Label>
              <Select 
                value={editedIncident.companyId} 
                onValueChange={value => setEditedIncident(i => ({ ...i, companyId: value }))}
              >
                <SelectTrigger className="bg-gray-900 text-white border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-700">
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sistemas Envolvidos */}
          <div>
            <Label htmlFor="systems" className="text-white">Sistemas Envolvidos</Label>
            <select
              id="systems"
              multiple
              className="w-full border rounded p-2 bg-gray-900 text-white border-gray-700 min-h-[100px]"
              value={editedIncident.systemIds}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setEditedIncident(i => ({ ...i, systemIds: options }));
              }}
            >
              {systems.map(system => (
                <option key={system.id} value={system.id}>{system.name}</option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSystems.map(system => (
                <Badge key={system.id} className="bg-blue-600 text-white">
                  {system.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Anotações */}
          <div>
            <Label className="text-white">Anotações</Label>
            <div className="space-y-3">
              {editedIncident.notes.map((note, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{note}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Adicionada em {new Date().toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveNote(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Adicionar nova anotação..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="flex-1 bg-gray-900 text-white border-gray-700 placeholder-gray-400"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Informações de Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-400">Criado em</Label>
              <p className="text-white">{editedIncident.createdAt.toLocaleString()}</p>
            </div>
            {editedIncident.resolvedAt && (
              <div>
                <Label className="text-gray-400">Resolvido em</Label>
                <p className="text-white">{editedIncident.resolvedAt.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentEditModal; 