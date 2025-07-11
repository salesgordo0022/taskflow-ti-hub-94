import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Company } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileSpreadsheet, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CompanyImportModalProps {
  onImport: (companies: Company[]) => void;
}

const CompanyImportModal = ({ onImport }: CompanyImportModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const downloadCSVTemplate = () => {
    const template = [
      ['Nome da Empresa', 'CNPJ', 'Responsável', 'Email', 'Telefone', 'Segmento', 'Regime', 'Nível', 'Nota Entrada', 'Nota Saída', 'Cupom', 'Apuração', 'Envio Documentos', 'Automação'],
      ['Exemplo Ltda', '12.345.678/0001-90', 'João Silva', 'joao@exemplo.com', '(11) 99999-9999', 'comercio', 'simples', 'medio', 'SIM', 'NÃO', 'SIM', 'SIM', 'NÃO', 'SIM'],
      ['ABC Indústria Ltda', '98.765.432/0001-10', 'Maria Santos', 'maria@abc.com', '(11) 88888-8888', 'industria', 'real', 'dificil', 'SIM', 'SIM', 'NÃO', 'SIM', 'SIM', 'SIM'],
      ['Tech Solutions', '11.222.333/0001-44', 'Ana Costa', 'ana@tech.com', '(11) 77777-7777', 'servicos', 'simples', 'facil', 'NÃO', 'SIM', 'SIM', 'SIM', 'NÃO', 'SIM'],
      ['Fazenda Verde', '55.666.777/0001-88', 'Pedro Oliveira', 'pedro@fazenda.com', '(11) 66666-6666', 'rural', 'presumido', 'medio', 'SIM', 'NÃO', 'SIM', 'NÃO', 'SIM', 'NÃO'],
      ['Consultoria XYZ', '99.888.777/0001-66', 'Carlos Lima', 'carlos@xyz.com', '(11) 55555-5555', 'servicos', 'real', 'dificil', 'SIM', 'SIM', 'SIM', 'SIM', 'SIM', 'SIM'],
      ['', '', '', '', '', 'comercio/industria/servicos/rural/outros', 'simples/presumido/real/mei', 'facil/medio/dificil', 'SIM/NÃO', 'SIM/NÃO', 'SIM/NÃO', 'SIM/NÃO', 'SIM/NÃO', 'SIM/NÃO']
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'modelo_importacao_empresas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcelTemplate = () => {
    // Criar um modelo HTML que pode ser aberto no Excel
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Modelo Importação Empresas</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .example { background-color: #e8f4f8; }
        .instructions { background-color: #fff3cd; }
    </style>
</head>
<body>
    <h2>Modelo de Importação de Empresas</h2>
    <p><strong>Instruções:</strong></p>
    <ul>
        <li>Preencha todos os campos obrigatórios (Nome da Empresa e CNPJ)</li>
        <li>Para campos booleanos, use "SIM" ou "NÃO"</li>
        <li>Segmento: comercio, industria, servicos, rural, outros</li>
        <li>Regime: simples, presumido, real, mei</li>
        <li>Nível: facil, medio, dificil</li>
    </ul>
    
    <table>
        <thead>
            <tr>
                <th>Nome da Empresa *</th>
                <th>CNPJ *</th>
                <th>Responsável</th>
                <th>Segmento</th>
                <th>Regime</th>
                <th>Nível</th>
                <th>Nota Entrada</th>
                <th>Nota Saída</th>
                <th>Cupom</th>
                <th>Apuração</th>
                <th>Envio Documentos</th>
                <th>Automação</th>
            </tr>
        </thead>
        <tbody>
            <tr class="example">
                <td>Exemplo Ltda</td>
                <td>12.345.678/0001-90</td>
                <td>João Silva</td>
                <td>comercio</td>
                <td>simples</td>
                <td>medio</td>
                <td>SIM</td>
                <td>NÃO</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>NÃO</td>
                <td>SIM</td>
            </tr>
            <tr class="example">
                <td>ABC Indústria Ltda</td>
                <td>98.765.432/0001-10</td>
                <td>Maria Santos</td>
                <td>industria</td>
                <td>real</td>
                <td>dificil</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>NÃO</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>SIM</td>
            </tr>
            <tr class="example">
                <td>Tech Solutions</td>
                <td>11.222.333/0001-44</td>
                <td>Ana Costa</td>
                <td>servicos</td>
                <td>simples</td>
                <td>facil</td>
                <td>NÃO</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>NÃO</td>
                <td>SIM</td>
            </tr>
            <tr class="instructions">
                <td colspan="12">
                    <strong>Opções disponíveis:</strong><br>
                    Segmento: comercio, industria, servicos, rural, outros<br>
                    Regime: simples, presumido, real, mei<br>
                    Nível: facil, medio, dificil<br>
                    Automações: SIM ou NÃO
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'modelo_importacao_empresas.html');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive"
      });
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const companies: Company[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;
        
        const company: Company = {
          id: Date.now().toString() + i,
          name: values[0] || '',
          cnpj: values[1] || '',
          responsible: values[2] || '',
          email: values[3] || '',
          phone: values[4] || '',
          segment: (values[5] as Company['segment']) || 'comercio',
          regime: (values[6] as Company['regime']) || 'simples',
          level: (values[7] as Company['level']) || 'medio',
          hasNotaEntrada: values[8]?.toUpperCase() === 'SIM',
          hasNotaSaida: values[9]?.toUpperCase() === 'SIM',
          hasCupom: values[10]?.toUpperCase() === 'SIM',
          hasApuracao: values[11]?.toUpperCase() === 'SIM',
          hasEnvioDocumentos: values[12]?.toUpperCase() === 'SIM',
          isAutomated: values[13]?.toUpperCase() === 'SIM',
          responsiblePerson: values[2] || '',
          createdAt: new Date()
        };
        
        if (company.name && company.cnpj) {
          companies.push(company);
        }
      }
      
      if (companies.length > 0) {
        onImport(companies);
        toast({
          title: "Importação concluída",
          description: `${companies.length} empresas foram importadas com sucesso.`,
        });
        setIsOpen(false);
        setSelectedFile(null);
      } else {
        toast({
          title: "Erro",
          description: "Nenhuma empresa válida encontrada no arquivo.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo. Verifique o formato.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importar Empresas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar Empresas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Importe empresas em lote usando um arquivo CSV. Baixe um dos modelos abaixo para ver o formato correto.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Modelos de Importação</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={downloadCSVTemplate} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  CSV Simples
                </Button>
                <Button variant="outline" onClick={downloadExcelTemplate} className="w-full">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  HTML/Excel
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="file">Selecionar Arquivo CSV</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Arquivo selecionado: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Instruções:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use um dos modelos como base</li>
              <li>• Preencha todos os campos obrigatórios (Nome e CNPJ)</li>
              <li>• Para campos booleanos, use "SIM" ou "NÃO"</li>
              <li>• Segmento: comercio, industria, servicos, rural, outros</li>
              <li>• Regime: simples, presumido, real, mei</li>
              <li>• Nível: facil, medio, dificil</li>
              <li>• Salve como CSV antes de importar</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={processFile} 
              disabled={!selectedFile || isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Importar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyImportModal; 