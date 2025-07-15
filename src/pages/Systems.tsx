
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SystemCard from '@/components/systems/SystemCard';
import SystemCreateModal from '@/components/systems/SystemCreateModal';
import { useSupabaseSystems } from '@/hooks/useSupabaseSystems';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';

const Systems: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { systems, loading, createSystem, updateSystem } = useSupabaseSystems();
  const { companies } = useSupabaseCompanies();

  const filteredSystems = systems.filter(system => 
    system.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const companyNames = companies.map(c => c.name);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando sistemas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sistemas</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Sistema
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar sistemas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSystems.map((system) => (
          <SystemCard
            key={system.id}
            system={system}
            companyNames={companyNames}
            onUpdate={updateSystem}
          />
        ))}
      </div>

      <SystemCreateModal
        onCreate={createSystem}
      />
    </div>
  );
};

export default Systems;
