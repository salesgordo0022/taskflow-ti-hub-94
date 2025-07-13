
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useUpdateCompany } from '@/hooks/useCompanies';

interface CompanyEditModalProps {
  company: Company;
  onSuccess?: () => void;
  readOnly?: boolean;
}

const CompanyEditModal = ({ company, onSuccess, readOnly = false }: CompanyEditModalProps) => {
  const { toast } = useToast();
  const updateCompanyMutation = useUpdateCompany();
  const [isOpen, setIsOpen] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Company>(company);

  const handleSave = async () => {
    try {
      await updateCompanyMutation.mutateAsync(editedCompany);
      setIsOpen(false);
      toast({
        title: "Empresa atualizada",
        description: "As informações da empresa foram salvas com sucesso.",
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          {readOnly ? 'Ver Detalhes' : 'Editar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{readOnly ? 'Detalhes da Empresa' : 'Editar Empresa'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-100">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={editedCompany.name}
                  onChange={(e) => setEditedCompany({...editedCompany, name: e.target.value})}
                  disabled={readOnly}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={editedCompany.cnpj}
                  onChange={(e) => setEditedCompany({...editedCompany, cnpj: e.target.value})}
                  disabled={readOnly}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  value={editedCompany.responsiblePerson}
                  onChange={(e) => setEditedCompany({...editedCompany, responsiblePerson: e.target.value})}
                  disabled={readOnly}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedCompany.email}
                  onChange={(e) => setEditedCompany({...editedCompany, email: e.target.value})}
                  disabled={readOnly}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={editedCompany.phone}
                onChange={(e) => setEditedCompany({...editedCompany, phone: e.target.value})}
                disabled={readOnly}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <Separator />

          {/* Configurações Fiscais */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-100">Configurações Fiscais</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="segment">Segmento</Label>
                <Select value={editedCompany.segment} onValueChange={(value: Company['segment']) => setEditedCompany({...editedCompany, segment: value})} disabled={readOnly}>
                  <SelectTrigger disabled={readOnly} className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comercio">Comércio</SelectItem>
                    <SelectItem value="industria">Indústria</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regime">Regime</Label>
                <Select value={editedCompany.regime} onValueChange={(value: Company['regime']) => setEditedCompany({...editedCompany, regime: value})} disabled={readOnly}>
                  <SelectTrigger disabled={readOnly} className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples</SelectItem>
                    <SelectItem value="presumido">Presumido</SelectItem>
                    <SelectItem value="real">Real</SelectItem>
                    <SelectItem value="mei">MEI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nível da Empresa</Label>
                <Select value={editedCompany.level} onValueChange={(value: Company['level']) => setEditedCompany({...editedCompany, level: value})} disabled={readOnly}>
                  <SelectTrigger disabled={readOnly} className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Automações */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-100">Automações Disponíveis</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nota Fiscal de Entrada</Label>
                  <p className="text-sm text-gray-400">Empresa emite notas de entrada</p>
                </div>
                <Switch
                  checked={editedCompany.hasNotaEntrada}
                  onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasNotaEntrada: checked})}
                  disabled={readOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Nota Fiscal de Saída</Label>
                  <p className="text-sm text-gray-400">Empresa emite notas de saída</p>
                </div>
                <Switch
                  checked={editedCompany.hasNotaSaida}
                  onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasNotaSaida: checked})}
                  disabled={readOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Cupom Fiscal</Label>
                  <p className="text-sm text-gray-400">Empresa emite cupons fiscais</p>
                </div>
                <Switch
                  checked={editedCompany.hasCupom}
                  onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasCupom: checked})}
                  disabled={readOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Apuração</Label>
                  <p className="text-sm text-gray-400">Apuração automática de impostos</p>
                </div>
                <Switch
                  checked={editedCompany.hasApuracao}
                  onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasApuracao: checked})}
                  disabled={readOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Envio de Documentos</Label>
                  <p className="text-sm text-gray-400">Envio automático ao cliente</p>
                </div>
                <Switch
                  checked={editedCompany.hasEnvioDocumentos}
                  onCheckedChange={(checked) => setEditedCompany({...editedCompany, hasEnvioDocumentos: checked})}
                  disabled={readOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Automação Geral</Label>
                  <p className="text-sm text-gray-400">Processos automatizados configurados</p>
                </div>
                <Switch
                  checked={editedCompany.isAutomated}
                  onCheckedChange={(checked) => setEditedCompany({...editedCompany, isAutomated: checked})}
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
            {!readOnly && (
              <Button onClick={handleSave} disabled={updateCompanyMutation.isPending}>
                {updateCompanyMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyEditModal;
