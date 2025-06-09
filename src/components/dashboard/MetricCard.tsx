
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
  color?: 'blue' | 'green' | 'yellow' | 'red';
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
    blue: 'border-slate-600/50 bg-slate-800/30 text-slate-300',
    green: 'border-emerald-700/50 bg-emerald-900/30 text-emerald-400',
    yellow: 'border-amber-700/50 bg-amber-900/30 text-amber-400',
    red: 'border-red-700/50 bg-red-900/30 text-red-400'
  };

  return (
    <Card className="macos-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-semibold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive ? "text-emerald-400 bg-emerald-900/80" : "text-red-400 bg-red-900/80"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-2">vs. mês anterior</span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl border backdrop-blur-sm",
            colorClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
