
import React, { useState } from 'react';
import { Plus, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanyListTable from '@/components/companies/CompanyListTable';
import CompanyCreateModal from '@/components/companies/CompanyCreateModal';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';
import { useSupabaseSystems } from '@/hooks/useSupabaseSystems';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';

const Companies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { companies, loading, createCompany, updateCompany, deleteCompany } = useSupabaseCompanies();
  const { systems } = useSupabaseSystems();
  const { tasks } = useSupabaseTasks();

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.includes(searchTerm)
  );

  // Helper function to get counts for each company
  const getCompanyCounts = (companyId: string) => {
    const systemsCount = systems.filter(s => s.companies?.includes(companyId)).length;
    const tasksCount = tasks.filter(t => t.companyId === companyId).length;
    return { systemsCount, tasksCount };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando empresas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Empresas</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => {
            const { systemsCount, tasksCount } = getCompanyCounts(company.id);
            return (
              <CompanyCard
                key={company.id}
                company={company}
                systemsCount={systemsCount}
                tasksCount={tasksCount}
                onUpdate={updateCompany}
              />
            );
          })}
        </div>
      ) : (
        <CompanyListTable 
          companies={filteredCompanies}
          onUpdate={updateCompany}
        />
      )}

      <CompanyCreateModal
        onSave={createCompany}
      />
    </div>
  );
};

export default Companies;
