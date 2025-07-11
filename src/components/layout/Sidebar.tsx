
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Server, 
  CheckSquare, 
  AlertTriangle, 
  BarChart3, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Brain,
  MessageSquare,
  Settings,
  Bell,
  Code,
  Database,
  Network,
  Shield,
  Zap,
  TrendingUp,
  BookOpen,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
  { id: 'companies', label: 'Empresas', icon: Building2, color: 'text-green-400' },
  { id: 'systems', label: 'Sistemas', icon: Server, color: 'text-purple-400' },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare, color: 'text-yellow-400' },
  { id: 'incidents', label: 'Incidentes', icon: AlertTriangle, color: 'text-red-400' },
  { id: 'notifications', label: 'Notificações', icon: Bell, color: 'text-orange-400' },
  { id: 'mindmap', label: 'Mapa Mental', icon: Brain, color: 'text-pink-400' },
  { id: 'slack', label: 'Slack', icon: MessageSquare, color: 'text-indigo-400' },
  { id: 'reports', label: 'Relatórios', icon: BarChart3, color: 'text-cyan-400' },
  { id: 'automation-report', label: 'Automações', icon: TrendingUp, color: 'text-purple-400' },
  { id: 'calendar', label: 'Calendário', icon: Calendar, color: 'text-emerald-400' },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare, color: 'text-green-400' },
  { id: 'inventory', label: 'Inventário', icon: Server, color: 'text-blue-400' },
  { id: 'knowledge', label: 'Base de Conhecimento', icon: BookOpen, color: 'text-purple-400' },
  { id: 'scripts', label: 'Scripts', icon: Code, color: 'text-yellow-400' },
  { id: 'network-test', label: 'Teste WiFi', icon: Wifi, color: 'text-cyan-400' },
  { id: 'settings', label: 'Configurações', icon: Settings, color: 'text-gray-400' },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen bg-gradient-to-b from-gray-900 to-black border-r border-blue-500/20 transition-all duration-300 backdrop-blur-sm",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-blue-500/20 bg-black/50">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-blue-400" />
                <span className="text-white font-mono font-semibold text-sm">DEV_HUB</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start mb-1 font-mono text-sm transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/20" 
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white",
                  collapsed && "px-2 justify-center"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-all duration-200 group-hover:scale-110", 
                  item.color,
                  !collapsed && "mr-3"
                )} />
                {!collapsed && (
                  <span className="font-mono">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                )}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-500/20 bg-black/50">
          {!collapsed && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-mono">SISTEMA ONLINE</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                <p>v1.0.0-beta</p>
                <p>© 2024 TaskFlow TI</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
