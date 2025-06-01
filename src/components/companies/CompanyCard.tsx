
import { Building2, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
  systemsCount: number;
  tasksCount: number;
}

const CompanyCard = ({ company, systemsCount, tasksCount }: CompanyCardProps) => {
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
          <div className="flex space-x-2">
            <Badge variant="outline">{systemsCount} sistemas</Badge>
            <Badge variant="outline">{tasksCount} tarefas</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{company.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{company.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Cliente desde {company.createdAt.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Ver Detalhes
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
