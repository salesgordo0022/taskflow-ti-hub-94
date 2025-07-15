
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/companies': return 'Empresas';
      case '/systems': return 'Sistemas';
      case '/tasks': return 'Tarefas';
      case '/incidents': return 'Incidentes';
      case '/reports': return 'Relatórios';
      case '/tools': return 'Ferramentas';
      default: return 'TI Management';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar..."
            className="pl-10 w-64"
          />
        </div>
        
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
