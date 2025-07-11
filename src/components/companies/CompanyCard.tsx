import { Building2, Mail, Phone, Calendar, CheckCircle, XCircle, User, Bot, Eye, TrendingUp, FileText, Send } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/types';
import CompanyEditModal from './CompanyEditModal';

interface CompanyCardProps {
  company: Company;
  systemsCount: number;
  tasksCount: number;
  onUpdate: (company: Company) => void;
}

const CompanyCard = ({ company, systemsCount, tasksCount, onUpdate }: CompanyCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'facil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'dificil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'comercio': return 'bg-blue-100 text-blue-800';
      case 'industria': return 'bg-purple-100 text-purple-800';
      case 'servicos': return 'bg-cyan-100 text-cyan-800';
      case 'rural': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.cnpj}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            {company.isAutomated ? (
              <Badge className="bg-green-100 text-green-800">
                <Bot className="h-3 w-3 mr-1" />
                Automatizada
              </Badge>
            ) : (
              <Badge variant="outline">Manual</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações básicas */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getSegmentColor(company.segment)}>
            {company.segment.charAt(0).toUpperCase() + company.segment.slice(1)}
          </Badge>
          <Badge variant="outline">{company.regime.toUpperCase()}</Badge>
          <Badge className={getLevelColor(company.level)}>
            {company.level.charAt(0).toUpperCase() + company.level.slice(1)}
          </Badge>
        </div>

        {/* Automações */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1 text-xs">
            {company.hasNotaEntrada ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>Nota Entrada</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            {company.hasNotaSaida ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>Nota Saída</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            {company.hasCupom ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>Cupom</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            {company.hasApuracao ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>Apuração</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            {company.hasEnvioDocumentos ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span>Envio Docs</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>Responsável: {company.responsiblePerson}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Cliente desde {company.createdAt.toLocaleDateString()}</span>
        </div>
        
        <div className="flex space-x-2">
          <Badge variant="outline">{systemsCount} sistemas</Badge>
          <Badge variant="outline">{tasksCount} tarefas</Badge>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <CompanyEditModal company={company} onSave={onUpdate} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
