
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
    blue: 'border-indigo-500/30 bg-gradient-to-br from-indigo-600/20 to-blue-600/10 text-indigo-300',
    green: 'border-emerald-500/30 bg-gradient-to-br from-emerald-600/20 to-green-600/10 text-emerald-300',
    yellow: 'border-amber-500/30 bg-gradient-to-br from-amber-600/20 to-yellow-600/10 text-amber-300',
    red: 'border-red-500/30 bg-gradient-to-br from-red-600/20 to-pink-600/10 text-red-300'
  };

  return (
    <Card className="macos-card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-3">
                <span className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm",
                  trend.isPositive 
                    ? "text-emerald-300 bg-gradient-to-r from-emerald-600/30 to-green-600/20 border border-emerald-500/30" 
                    : "text-red-300 bg-gradient-to-r from-red-600/30 to-pink-600/20 border border-red-500/30"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-2">vs. mês anterior</span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex items-center justify-center w-14 h-14 rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:scale-110",
            colorClasses[color]
          )}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
