
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import IncidentCard from '@/components/incidents/IncidentCard';
import IncidentCreateModal from '@/components/incidents/IncidentCreateModal';
import { useSupabaseIncidents } from '@/hooks/useSupabaseIncidents';
import { useSupabaseSystems } from '@/hooks/useSupabaseSystems';
import { useSupabaseCompanies } from '@/hooks/useSupabaseCompanies';

const Incidents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { incidents, loading, createIncident, updateIncident } = useSupabaseIncidents();
  const { systems } = useSupabaseSystems();
  const { companies } = useSupabaseCompanies();

  const filteredIncidents = incidents.filter(incident => 
    incident.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper functions to get names
  const getSystemNames = (systemIds: string[]) => {
    return systemIds.map(id => {
      const system = systems.find(s => s.id === id);
      return system ? system.name : 'Sistema não encontrado';
    });
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Empresa não encontrada';
  };

  const handleAddNote = async (incidentId: string, note: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      const updatedIncident = {
        ...incident,
        notes: [...incident.notes, note]
      };
      await updateIncident(updatedIncident);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando incidentes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Incidentes</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Incidente
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar incidentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            systemNames={getSystemNames(incident.systemIds)}
            companyName={getCompanyName(incident.companyId)}
            systems={systems}
            companies={companies}
            onUpdate={updateIncident}
            onAddNote={handleAddNote}
          />
        ))}
      </div>

      <IncidentCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={createIncident}
        systems={systems}
        companies={companies}
      />
    </div>
  );
};

export default Incidents;
