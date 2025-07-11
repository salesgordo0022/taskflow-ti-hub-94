
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
import { Plus } from 'lucide-react';

interface CompanyCreateModalProps {
  onSave: (company: Company) => void;
}

const CompanyCreateModal = ({ onSave }: CompanyCreateModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<Omit<Company, 'id' | 'createdAt'>>({
    name: '',
    cnpj: '',
    responsible: '',
    responsiblePerson: '',
    segment: 'comercio',
    regime: 'simples',
    level: 'medio',
    hasNotaEntrada: false,
    hasNotaSaida: false,
    hasCupom: false,
    hasApuracao: false,
    hasEnvioDocumentos: false,
    isAutomated: false
  });

  const handleSave = () => {
    if (!newCompany.name || !newCompany.cnpj) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const company: Company = {
      ...newCompany,
      id: Date.now().toString(),
      createdAt: new Date(),
      responsiblePerson: newCompany.responsiblePerson || newCompany.responsible
    };

    onSave(company);
    setIsOpen(false);
    setNewCompany({
      name: '',
      cnpj: '',
      responsible: '',
      responsiblePerson: '',
      segment: 'comercio',
      regime: 'simples',
      level: 'medio',
      hasNotaEntrada: false,
      hasNotaSaida: false,
      hasCupom: false,
      hasApuracao: false,
      hasEnvioDocumentos: false,
      isAutomated: false
    });
    
    toast({
      title: "Empresa criada",
      description: "A nova empresa foi adicionada com sucesso.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Empresa</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={newCompany.cnpj}
                  onChange={(e) => setNewCompany({...newCompany, cnpj: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  value={newCompany.responsiblePerson}
                  onChange={(e) => setNewCompany({...newCompany, responsiblePerson: e.target.value, responsible: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações Fiscais */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Configurações Fiscais</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="segment">Segmento</Label>
                <Select value={newCompany.segment} onValueChange={(value: Company['segment']) => setNewCompany({...newCompany, segment: value})}>
                  <SelectTrigger>
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
                <Select value={newCompany.regime} onValueChange={(value: Company['regime']) => setNewCompany({...newCompany, regime: value})}>
                  <SelectTrigger>
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
                <Select value={newCompany.level} onValueChange={(value: Company['level']) => setNewCompany({...newCompany, level: value})}>
                  <SelectTrigger>
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
            <h3 className="font-medium text-gray-900">Automações Disponíveis</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nota Fiscal de Entrada</Label>
                  <p className="text-sm text-gray-500">Empresa emite notas de entrada</p>
                </div>
                <Switch
                  checked={newCompany.hasNotaEntrada}
                  onCheckedChange={(checked) => setNewCompany({...newCompany, hasNotaEntrada: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Nota Fiscal de Saída</Label>
                  <p className="text-sm text-gray-500">Empresa emite notas de saída</p>
                </div>
                <Switch
                  checked={newCompany.hasNotaSaida}
                  onCheckedChange={(checked) => setNewCompany({...newCompany, hasNotaSaida: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Cupom Fiscal</Label>
                  <p className="text-sm text-gray-500">Empresa emite cupons fiscais</p>
                </div>
                <Switch
                  checked={newCompany.hasCupom}
                  onCheckedChange={(checked) => setNewCompany({...newCompany, hasCupom: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Apuração</Label>
                  <p className="text-sm text-gray-500">Apuração automática de impostos</p>
                </div>
                <Switch
                  checked={newCompany.hasApuracao}
                  onCheckedChange={(checked) => setNewCompany({...newCompany, hasApuracao: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Envio de Documentos</Label>
                  <p className="text-sm text-gray-500">Envio automático ao cliente</p>
                </div>
                <Switch
                  checked={newCompany.hasEnvioDocumentos}
                  onCheckedChange={(checked) => setNewCompany({...newCompany, hasEnvioDocumentos: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Automação Geral</Label>
                  <p className="text-sm text-gray-500">Processos automatizados configurados</p>
                </div>
                <Switch
                  checked={newCompany.isAutomated}
                  onCheckedChange={(checked) => setNewCompany({...newCompany, isAutomated: checked})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Criar Empresa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyCreateModal;
