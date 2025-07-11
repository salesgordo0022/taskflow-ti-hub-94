
import { useEffect, useState } from 'react';
import { Bell, Search, Settings, User, Edit2, Check, Code, Zap, Activity } from 'lucide-react';
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

function useNetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState((navigator as any).connection?.effectiveType || 'unknown');
  useEffect(() => {
    const updateStatus = () => {
      setOnline(navigator.onLine);
      setConnectionType((navigator as any).connection?.effectiveType || 'unknown');
    };
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    (navigator as any).connection?.addEventListener('change', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      (navigator as any).connection?.removeEventListener('change', updateStatus);
    };
  }, []);
  return { online, connectionType };
}

const Header = ({ onTabChange }: HeaderProps) => {
  const { logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [systemTitle, setSystemTitle] = useState('TaskFlow TI Hub');
  const [tempTitle, setTempTitle] = useState(systemTitle);
  const { online, connectionType } = useNetworkStatus();

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
    <header className="h-16 border-b border-blue-500/20 bg-black/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-xl font-bold bg-gray-900/80 border-blue-500/30 text-blue-300 font-mono focus:border-blue-500/60 focus:ring-blue-500/20"
                onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleTitleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-mono"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 group">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-blue-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent font-mono">
                  {systemTitle}
                </h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTitleEdit}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-blue-400 hover:bg-blue-500/20"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
            <Input
              placeholder="Buscar tarefas, sistemas ou empresas..."
              className="pl-10 bg-gray-900/80 border-blue-500/30 text-blue-300 placeholder-gray-500 focus:bg-gray-800/80 focus:border-blue-500/60 focus:ring-blue-500/20 transition-all duration-200 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* System Status */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-mono">ONLINE</span>
          </div>

          {/* Activity Indicator */}
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-xs text-blue-400 font-mono">98%</span>
          </div>

          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-blue-400 hover:bg-blue-500/20">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-mono"
                >
                  3
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-gray-900/95 border-blue-500/30" align="end">
              <div className="p-4 border-b border-blue-500/20">
                <h4 className="font-semibold text-blue-300 font-mono">Notificações</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 space-y-3">
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-800/50 rounded-lg border border-red-500/20">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-400 font-mono">Tarefa Vencida</p>
                      <p className="text-xs text-gray-400">Implementar sistema ERP está vencida</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-800/50 rounded-lg border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-400 font-mono">Sistema Implementado</p>
                      <p className="text-xs text-gray-400">CRM implementado com sucesso</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-800/50 rounded-lg border border-yellow-500/20">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-400 font-mono">Prazo Próximo</p>
                      <p className="text-xs text-gray-400">Backup do servidor vence em 1 dia</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-blue-500/20">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 font-mono"
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
            className="text-blue-400 hover:bg-blue-500/20"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-500/20">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-900/95 border-blue-500/30">
              <DropdownMenuItem onClick={() => onTabChange('settings')} className="text-blue-300 hover:bg-blue-500/20 font-mono">
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange('settings')} className="text-blue-300 hover:bg-blue-500/20 font-mono">
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-400 hover:bg-red-500/20 font-mono">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`rounded-full w-3 h-3 ${online ? 'bg-green-500' : 'bg-red-500'}`} title={online ? 'Online' : 'Offline'}></span>
          <span className="text-xs text-gray-300 font-mono">{online ? 'Online' : 'Offline'}{connectionType !== 'unknown' ? ` • ${connectionType}` : ''}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
