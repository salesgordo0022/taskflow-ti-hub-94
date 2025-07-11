
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'cyan';
}

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'blue' 
}: MetricCardProps) => {
  const colorClasses = {
    blue: {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      glow: 'shadow-blue-500/20'
    },
    green: {
      text: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: 'text-green-400',
      glow: 'shadow-green-500/20'
    },
    yellow: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      icon: 'text-yellow-400',
      glow: 'shadow-yellow-500/20'
    },
    red: {
      text: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      glow: 'shadow-red-500/20'
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      icon: 'text-purple-400',
      glow: 'shadow-purple-500/20'
    },
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      icon: 'text-cyan-400',
      glow: 'shadow-cyan-500/20'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-105 group cursor-pointer",
      "bg-gray-900/80 backdrop-blur-sm border",
      colors.border,
      colors.glow,
      "hover:shadow-lg hover:shadow-lg"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", colors.bg)} />
              <p className="text-sm font-mono text-gray-300 uppercase tracking-wider">{title}</p>
            </div>
            <p className={cn("text-3xl font-bold font-mono", colors.text)}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1 font-mono">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-3 space-x-2">
                <span className={cn(
                  "text-xs font-mono px-2 py-1 rounded border",
                  trend.isPositive 
                    ? "text-green-400 bg-green-500/10 border-green-500/30" 
                    : "text-red-400 bg-red-500/10 border-red-500/30"
                )}>
                  {trend.isPositive ? '↗' : '↘'} {trend.value}%
                </span>
                <span className="text-xs text-gray-500 font-mono">vs. anterior</span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 group-hover:scale-110",
            colors.bg,
            colors.border
          )}>
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
        </div>
        
        {/* Terminal-style progress bar */}
        <div className="mt-4 w-full bg-gray-800/50 rounded-full h-1">
          <div 
            className={cn("h-1 rounded-full transition-all duration-1000", colors.bg)}
            style={{ width: `${Math.min(100, Math.max(0, typeof value === 'number' ? value : 0))}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
