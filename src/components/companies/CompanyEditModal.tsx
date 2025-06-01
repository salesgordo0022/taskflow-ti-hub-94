
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Company } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';

interface CompanyEditModalProps {
  company: Company;
  onSave: (company: Company) => void;
}

const CompanyEditModal = ({ company, onSave }: CompanyEditModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Company>(company);

  const handleSave = () => {
    onSave(editedCompany);
    setIsOpen(false);
    toast({
      title: "Empresa atualizada",
      description: "As informações da empresa foram salvas com sucesso.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={editedCompany.name}
                onChange={(e) => setEditedCompany({...editedCompany, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={editedCompany.cnpj}
                onChange={(e) => setEditedCompany({...editedCompany, cnpj: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={editedCompany.email}
                onChange={(e) => setEditedCompany({...editedCompany, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={editedCompany.phone}
                onChange={(e) => setEditedCompany({...editedCompany, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input
              id="responsible"
              value={editedCompany.responsiblePerson}
              onChange={(e) => setEditedCompany({...editedCompany, responsiblePerson: e.target.value})}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Configurações Fiscais</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Nota Fiscal de Entrada</Label>
                <p className="text-sm text-gray-500">Empresa emite notas de entrada</p>
              </div>
              <Switch
                checked={editedCompany.hasNotaEntrada}
                onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasNotaEntrada: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Nota Fiscal de Saída</Label>
                <p className="text-sm text-gray-500">Empresa emite notas de saída</p>
              </div>
              <Switch
                checked={editedCompany.hasNotaSaida}
                onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasNotaSaida: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Cupom Fiscal</Label>
                <p className="text-sm text-gray-500">Empresa emite cupons fiscais</p>
              </div>
              <Switch
                checked={editedCompany.hasCupom}
                onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasCupom: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Automação</Label>
                <p className="text-sm text-gray-500">Processos automatizados configurados</p>
              </div>
              <Switch
                checked={editedCompany.isAutomated}
                onCheckedChange={(checked) => setEditedCompany({...editedCompany, isAutomated: checked})}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyEditModal;
