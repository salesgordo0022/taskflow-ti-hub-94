
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
    blue: 'text-blue-300',
    green: 'text-green-300',
    yellow: 'text-yellow-300',
    red: 'text-red-300'
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-500 sad-fade-in card-dark sad-glow macos-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white mb-1 opacity-80">{title}</p>
            <p className="text-3xl font-bold text-white">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-white mt-1 opacity-70">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-3">
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded",
                  trend.isPositive 
                    ? "text-green-300 bg-green-900/30" 
                    : "text-red-300 bg-red-900/30"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-white ml-2 opacity-60">vs. mês anterior</span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg opacity-80 macos-icon",
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
