import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Info, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CompanyTemplateDownload = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

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

    toast({
      title: "Modelo baixado!",
      description: "Arquivo CSV salvo com sucesso. Preencha os dados e importe novamente.",
    });
  };

  const downloadExcelTemplate = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Modelo Importação Empresas - TaskFlow TI</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; color: #333; }
        .example { background-color: #e8f4f8; }
        .instructions { background-color: #fff3cd; }
        .required { color: #d32f2f; font-weight: bold; }
        .optional { color: #1976d2; }
        h1 { color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px; }
        .info-box { background-color: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .warning-box { background-color: #fff3e0; border: 1px solid #ff9800; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>📋 Modelo de Importação de Empresas - TaskFlow TI</h1>
    
    <div class="info-box">
        <h3>ℹ️ Instruções Importantes:</h3>
        <ul>
            <li><strong>Campos Obrigatórios:</strong> Nome da Empresa e CNPJ</li>
            <li><strong>Campos Booleanos:</strong> Use "SIM" ou "NÃO" (maiúsculas)</li>
            <li><strong>Formato CNPJ:</strong> Use o formato XX.XXX.XXX/XXXX-XX</li>
            <li><strong>Email:</strong> Use formato válido (exemplo@empresa.com)</li>
            <li><strong>Telefone:</strong> Use formato (XX) XXXXX-XXXX</li>
        </ul>
    </div>

    <div class="warning-box">
        <h3>⚠️ Opções Disponíveis:</h3>
        <ul>
            <li><strong>Segmento:</strong> comercio, industria, servicos, rural, outros</li>
            <li><strong>Regime:</strong> simples, presumido, real, mei</li>
            <li><strong>Nível:</strong> facil, medio, dificil</li>
            <li><strong>Automações:</strong> SIM ou NÃO</li>
        </ul>
    </div>
    
    <table>
        <thead>
            <tr>
                <th class="required">Nome da Empresa *</th>
                <th class="required">CNPJ *</th>
                <th class="optional">Responsável</th>
                <th class="optional">Email</th>
                <th class="optional">Telefone</th>
                <th class="optional">Segmento</th>
                <th class="optional">Regime</th>
                <th class="optional">Nível</th>
                <th class="optional">Nota Entrada</th>
                <th class="optional">Nota Saída</th>
                <th class="optional">Cupom</th>
                <th class="optional">Apuração</th>
                <th class="optional">Envio Documentos</th>
                <th class="optional">Automação</th>
            </tr>
        </thead>
        <tbody>
            <tr class="example">
                <td>Exemplo Ltda</td>
                <td>12.345.678/0001-90</td>
                <td>João Silva</td>
                <td>joao@exemplo.com</td>
                <td>(11) 99999-9999</td>
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
                <td>maria@abc.com</td>
                <td>(11) 88888-8888</td>
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
                <td>ana@tech.com</td>
                <td>(11) 77777-7777</td>
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
            <tr class="example">
                <td>Fazenda Verde</td>
                <td>55.666.777/0001-88</td>
                <td>Pedro Oliveira</td>
                <td>pedro@fazenda.com</td>
                <td>(11) 66666-6666</td>
                <td>rural</td>
                <td>presumido</td>
                <td>medio</td>
                <td>SIM</td>
                <td>NÃO</td>
                <td>SIM</td>
                <td>NÃO</td>
                <td>SIM</td>
                <td>NÃO</td>
            </tr>
            <tr class="example">
                <td>Consultoria XYZ</td>
                <td>99.888.777/0001-66</td>
                <td>Carlos Lima</td>
                <td>carlos@xyz.com</td>
                <td>(11) 55555-5555</td>
                <td>servicos</td>
                <td>real</td>
                <td>dificil</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>SIM</td>
                <td>SIM</td>
            </tr>
            <tr class="instructions">
                <td colspan="14">
                    <strong>📝 Dicas para preenchimento:</strong><br>
                    • Mantenha o formato dos exemplos<br>
                    • Use "SIM" ou "NÃO" para campos booleanos<br>
                    • Preencha pelo menos Nome e CNPJ<br>
                    • Salve como CSV antes de importar<br>
                    • Verifique se não há vírgulas extras no texto
                </td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <h3>🔄 Como usar:</h3>
        <ol>
            <li>Preencha os dados seguindo os exemplos</li>
            <li>Salve o arquivo como CSV</li>
            <li>Volte ao sistema e use "Importar Empresas"</li>
            <li>Selecione o arquivo CSV criado</li>
            <li>Clique em "Importar"</li>
        </ol>
    </div>
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

    toast({
      title: "Modelo baixado!",
      description: "Arquivo HTML/Excel salvo. Abra no Excel ou navegador para preencher.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-600 hover:bg-green-700 text-white border-green-600">
          <Download className="h-4 w-4 mr-2" />
          Baixar Planilha Modelo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <span>Planilha Modelo para Importação</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Escolha um dos formatos abaixo para baixar a planilha modelo. Preencha os dados e use a função "Importar Empresas" para adicionar as empresas ao sistema.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-dark p-4 rounded-lg border-blue-500/30">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-blue-400">CSV Simples</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Formato CSV básico, ideal para edição em qualquer editor de texto ou Excel.
              </p>
              <ul className="text-xs text-gray-400 space-y-1 mb-4">
                <li>✓ Fácil de editar</li>
                <li>✓ Compatível com Excel</li>
                <li>✓ Formato universal</li>
              </ul>
              <Button 
                onClick={downloadCSVTemplate} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar CSV
              </Button>
            </div>

            <div className="card-dark p-4 rounded-lg border-green-500/30">
              <div className="flex items-center space-x-2 mb-3">
                <FileSpreadsheet className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-green-400">HTML/Excel</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Formato HTML com formatação rica, ideal para abrir no Excel com cores e instruções.
              </p>
              <ul className="text-xs text-gray-400 space-y-1 mb-4">
                <li>✓ Formatação rica</li>
                <li>✓ Instruções incluídas</li>
                <li>✓ Cores e estilos</li>
              </ul>
              <Button 
                onClick={downloadExcelTemplate} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar HTML
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-white flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Campos Incluídos no Modelo</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="text-gray-300">Nome da Empresa *</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="text-gray-300">CNPJ *</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Responsável</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Telefone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Segmento</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Regime</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Nível</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Nota Entrada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Nota Saída</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Cupom</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Apuração</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Envio Documentos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-300">Automação</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              <span className="text-red-400">*</span> Campos obrigatórios | 
              <span className="text-blue-400"> Outros</span> campos opcionais
            </p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica:</strong> Após baixar e preencher a planilha, salve como CSV e use o botão "Importar Empresas" para adicionar as empresas ao sistema.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyTemplateDownload; 