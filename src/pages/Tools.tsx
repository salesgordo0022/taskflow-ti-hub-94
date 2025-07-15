
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChecklistTab from '@/components/tools/ChecklistTab';
import InventoryTab from '@/components/tools/InventoryTab';
import NetworkTestTab from '@/components/tools/NetworkTestTab';
import KnowledgeBaseTab from '@/components/tools/KnowledgeBaseTab';
import ScriptsToolsTab from '@/components/tools/ScriptsToolsTab';
import CompanyReportsTab from '@/components/tools/CompanyReportsTab';

const Tools: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ferramentas de TI</h1>
      
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="checklist">Checklists</TabsTrigger>
          <TabsTrigger value="inventory">Inventário</TabsTrigger>
          <TabsTrigger value="network">Rede</TabsTrigger>
          <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="company-reports">Relatórios Empresas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checklist">
          <ChecklistTab />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>
        
        <TabsContent value="network">
          <NetworkTestTab />
        </TabsContent>
        
        <TabsContent value="knowledge">
          <KnowledgeBaseTab />
        </TabsContent>
        
        <TabsContent value="scripts">
          <ScriptsToolsTab />
        </TabsContent>
        
        <TabsContent value="company-reports">
          <CompanyReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tools;
