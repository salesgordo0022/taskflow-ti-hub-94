
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
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'companies', label: 'Empresas', icon: Building2 },
  { id: 'systems', label: 'Sistemas', icon: Server },
  { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  { id: 'incidents', label: 'Incidentes', icon: AlertTriangle },
  { id: 'mindmap', label: 'Mapa Mental', icon: Brain },
  { id: 'slack', label: 'Slack', icon: MessageSquare },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <span className="text-white font-semibold">Menu Principal</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-slate-700"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start mb-1 text-slate-300 hover:text-white hover:bg-slate-700",
                  isActive && "bg-blue-600 text-white hover:bg-blue-500",
                  collapsed && "px-2"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          {!collapsed && (
            <div className="text-xs text-slate-400">
              <p>Versão 1.0.0</p>
              <p>© 2024 TaskFlow TI</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
