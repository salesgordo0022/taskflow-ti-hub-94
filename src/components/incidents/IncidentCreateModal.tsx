import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/select';
import { Incident, System, Company } from '@/types';

interface IncidentCreateModalProps {
  onCreate: (incident: Incident) => void;
  systems: System[];
  companies: Company[];
}

const IncidentCreateModal = ({ onCreate, systems, companies }: IncidentCreateModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [incident, setIncident] = useState<Omit<Incident, 'id' | 'createdAt' | 'notes'>>({
    title: '',
    description: '',
    systemIds: systems[0] ? [systems[0].id] : [],
    companyId: companies[0]?.id || '',
    severity: 'medium',
    status: 'open',
  });
  // Remover estados locais de sistemas e modal de sistema

  const handleSave = () => {
    onCreate({
      ...incident,
      id: Date.now().toString(),
      createdAt: new Date(),
      notes: [],
    });
    setIsOpen(false);
    setIncident({
      title: '',
      description: '',
      systemIds: systems[0] ? [systems[0].id] : [],
      companyId: companies[0]?.id || '',
      severity: 'medium',
      status: 'open',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          + Novo Incidente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-[#18181b] text-white">
        <DialogHeader>
          <DialogTitle className="text-blue-300">Criar Novo Incidente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Título</Label>
            <Input id="title" value={incident.title} onChange={e => setIncident(i => ({ ...i, title: e.target.value }))} className="bg-gray-900 text-white border-gray-700 placeholder-gray-400" />
          </div>
          <div>
            <Label htmlFor="description" className="text-white">Descrição</Label>
            <Textarea id="description" value={incident.description} onChange={e => setIncident(i => ({ ...i, description: e.target.value }))} className="bg-gray-900 text-white border-gray-700 placeholder-gray-400" />
          </div>
          <div>
            <Label htmlFor="systems" className="text-white">Sistemas Envolvidos</Label>
            <select
              id="systems"
              multiple
              className="w-full border rounded p-2 bg-gray-900 text-white border-gray-700"
              value={incident.systemIds}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setIncident(i => ({ ...i, systemIds: options }));
              }}
            >
              {systems.map(system => (
                <option key={system.id} value={system.id}>{system.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="company" className="text-white">Empresa</Label>
            <Select value={incident.companyId} onValueChange={value => setIncident(i => ({ ...i, companyId: value }))}>
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
          <div>
            <Label htmlFor="severity" className="text-white">Severidade</Label>
            <Select value={incident.severity} onValueChange={value => setIncident(i => ({ ...i, severity: value as Incident['severity'] }))}>
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
        <div className="flex justify-end mt-4">
          <Button className="bg-blue-500 text-white font-bold px-6 py-2 rounded hover:bg-blue-700 transition shadow" onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentCreateModal; 