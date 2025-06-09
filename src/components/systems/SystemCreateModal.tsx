
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { System } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface SystemCreateModalProps {
  onSave: (system: System) => void;
}

const SystemCreateModal = ({ onSave }: SystemCreateModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newSystem, setNewSystem] = useState<Partial<System>>({
    name: '',
    version: '1.0.0',
    description: '',
    responsible: '',
    status: 'planned',
    companies: [],
    progress: 0,
    tags: [],
    isImplemented: false,
    accessUsers: [],
    systemUrl: ''
  });

  const handleSave = () => {
    if (!newSystem.name || !newSystem.description || !newSystem.responsible) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const system: System = {
      id: Date.now().toString(),
      name: newSystem.name!,
      version: newSystem.version!,
      description: newSystem.description!,
      responsible: newSystem.responsible!,
      status: newSystem.status as System['status'],
      startDate: new Date(),
      expectedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      companies: newSystem.companies || [],
      progress: newSystem.progress || 0,
      tags: newSystem.tags || [],
      isImplemented: newSystem.isImplemented || false,
      accessUsers: newSystem.accessUsers || [],
      systemUrl: newSystem.systemUrl || ''
    };

    onSave(system);
    setIsOpen(false);
    setNewSystem({
      name: '',
      version: '1.0.0',
      description: '',
      responsible: '',
      status: 'planned',
      companies: [],
      progress: 0,
      tags: [],
      isImplemented: false,
      accessUsers: [],
      systemUrl: ''
    });

    toast({
      title: "Sistema criado",
      description: "O novo sistema foi adicionado com sucesso.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Sistema
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Sistema</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Sistema *</Label>
              <Input
                id="name"
                placeholder="Ex: Sistema de Vendas"
                value={newSystem.name}
                onChange={(e) => setNewSystem({...newSystem, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                placeholder="1.0.0"
                value={newSystem.version}
                onChange={(e) => setNewSystem({...newSystem, version: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva o sistema e suas funcionalidades..."
              value={newSystem.description}
              onChange={(e) => setNewSystem({...newSystem, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável *</Label>
              <Input
                id="responsible"
                placeholder="Nome do responsável"
                value={newSystem.responsible}
                onChange={(e) => setNewSystem({...newSystem, responsible: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newSystem.status} onValueChange={(value: any) => setNewSystem({...newSystem, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planejado</SelectItem>
                  <SelectItem value="in_progress">Em Execução</SelectItem>
                  <SelectItem value="testing">Em Teste</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemUrl">URL do Sistema</Label>
            <Input
              id="systemUrl"
              placeholder="https://sistema.exemplo.com"
              value={newSystem.systemUrl}
              onChange={(e) => setNewSystem({...newSystem, systemUrl: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Sistema Implementado</Label>
              <p className="text-sm text-gray-500">Marque se o sistema já foi implementado</p>
            </div>
            <Switch
              checked={newSystem.isImplemented}
              onCheckedChange={(checked) => setNewSystem({...newSystem, isImplemented: checked})}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Criar Sistema
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SystemCreateModal;
