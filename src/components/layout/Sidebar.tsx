
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  CheckSquare, 
  AlertTriangle, 
  BarChart3, 
  Wrench 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Empresas', href: '/companies', icon: Building2 },
  { name: 'Sistemas', href: '/systems', icon: Settings },
  { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
  { name: 'Incidentes', href: '/incidents', icon: AlertTriangle },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Ferramentas', href: '/tools', icon: Wrench },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 pt-16">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
