
import { useState } from 'react';
import { Bell, Search, Settings, User, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onTabChange: (tab: string) => void;
}

const Header = ({ onTabChange }: HeaderProps) => {
  const { logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [systemTitle, setSystemTitle] = useState('TaskFlow TI Hub');
  const [tempTitle, setTempTitle] = useState(systemTitle);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setTempTitle(systemTitle);
  };

  const handleTitleSave = () => {
    setSystemTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(systemTitle);
    setIsEditingTitle(false);
  };

  return (
    <header className="h-16 border-b bg-black/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-xl font-bold bg-gray-800 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleTitleSave}
                className="macos-button"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {systemTitle}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTitleEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity macos-icon"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 macos-icon" />
            <Input
              placeholder="Buscar tarefas, sistemas ou empresas..."
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative macos-icon">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-semibold">Notificações</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 space-y-3">
                  <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tarefa Vencida</p>
                      <p className="text-xs text-gray-500">Implementar sistema ERP está vencida</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sistema Implementado</p>
                      <p className="text-xs text-gray-500">CRM implementado com sucesso</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Prazo Próximo</p>
                      <p className="text-xs text-gray-500">Backup do servidor vence em 1 dia</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full macos-button"
                    onClick={() => {
                      onTabChange('notifications');
                      setNotificationsOpen(false);
                    }}
                  >
                    Ver todas as notificações
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onTabChange('settings')}
            className="macos-icon"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="macos-icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onTabChange('settings')}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange('settings')}>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
