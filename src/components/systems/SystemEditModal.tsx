
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { System } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, X } from 'lucide-react';

interface SystemEditModalProps {
  system: System;
  onSave: (system: System) => void;
}

const SystemEditModal = ({ system, onSave }: SystemEditModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editedSystem, setEditedSystem] = useState<System>(system);
  const [newAccessUser, setNewAccessUser] = useState('');

  const handleSave = () => {
    onSave(editedSystem);
    setIsOpen(false);
    toast({
      title: "Sistema atualizado",
      description: "As informações do sistema foram salvas com sucesso.",
    });
  };

  const addAccessUser = () => {
    if (newAccessUser && !editedSystem.accessUsers.includes(newAccessUser)) {
      setEditedSystem({
        ...editedSystem,
        accessUsers: [...editedSystem.accessUsers, newAccessUser]
      });
      setNewAccessUser('');
    }
  };

  const removeAccessUser = (userToRemove: string) => {
    setEditedSystem({
      ...editedSystem,
      accessUsers: editedSystem.accessUsers.filter(user => user !== userToRemove)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 macos-button">
          <Edit className="h-4 w-4 mr-2 macos-icon" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Sistema</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Sistema</Label>
              <Input
                id="name"
                value={editedSystem.name}
                onChange={(e) => setEditedSystem({...editedSystem, name: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={editedSystem.version}
                onChange={(e) => setEditedSystem({...editedSystem, version: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={editedSystem.description}
              onChange={(e) => setEditedSystem({...editedSystem, description: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input
                id="responsible"
                value={editedSystem.responsible}
                onChange={(e) => setEditedSystem({...editedSystem, responsible: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={editedSystem.status} onValueChange={(value: any) => setEditedSystem({...editedSystem, status: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
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
              value={editedSystem.systemUrl || ''}
              onChange={(e) => setEditedSystem({...editedSystem, systemUrl: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Sistema Implementado</Label>
              <p className="text-sm text-gray-400">Marque se o sistema já foi implementado</p>
            </div>
            <Switch
              checked={editedSystem.isImplemented}
              onCheckedChange={(checked) => setEditedSystem({...editedSystem, isImplemented: checked})}
            />
          </div>

          <div className="space-y-4">
            <Label>Controle de Acessos</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="usuario@email.com"
                value={newAccessUser}
                onChange={(e) => setNewAccessUser(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAccessUser()}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button onClick={addAccessUser} size="sm" className="macos-button">
                <Plus className="h-4 w-4 macos-icon" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedSystem.accessUsers.map((user, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {user}
                  <button
                    onClick={() => removeAccessUser(user)}
                    className="ml-2 text-red-500 hover:text-red-700 macos-icon"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="macos-button">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="macos-button">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SystemEditModal;
