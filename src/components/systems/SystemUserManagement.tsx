import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  Eye, 
  EyeOff, 
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Key,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { System, User } from '@/types';

interface SystemUserManagementProps {
  systems: System[];
  users: User[];
}

interface SystemAccess {
  systemId: string;
  userId: string;
  role: 'admin' | 'user' | 'viewer';
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  lastAccess?: Date;
}

const SystemUserManagement = ({ systems, users }: SystemUserManagementProps) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data para acessos dos sistemas
  const mockSystemAccesses: SystemAccess[] = [
    {
      systemId: '1',
      userId: '1',
      role: 'admin',
      grantedAt: new Date('2024-01-15'),
      isActive: true,
      lastAccess: new Date('2024-01-20')
    },
    {
      systemId: '1',
      userId: '2',
      role: 'user',
      grantedAt: new Date('2024-01-16'),
      expiresAt: new Date('2024-12-31'),
      isActive: true,
      lastAccess: new Date('2024-01-19')
    },
    {
      systemId: '2',
      userId: '1',
      role: 'admin',
      grantedAt: new Date('2024-02-01'),
      isActive: true,
      lastAccess: new Date('2024-01-20')
    },
    {
      systemId: '2',
      userId: '2',
      role: 'viewer',
      grantedAt: new Date('2024-02-05'),
      isActive: false,
      lastAccess: new Date('2024-01-15')
    }
  ];

  const getSystemName = (systemId: string) => {
    return systems.find(s => s.id === systemId)?.name || 'Sistema não encontrado';
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Usuário não encontrado';
  };

  const getUserEmail = (userId: string) => {
    return users.find(u => u.id === userId)?.email || '';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: { label: 'Administrador', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      user: { label: 'Usuário', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      viewer: { label: 'Visualizador', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    return labels[role as keyof typeof labels] || labels.user;
  };

  const filteredAccesses = mockSystemAccesses.filter(access => {
    const matchesSystem = selectedSystem === 'all' || access.systemId === selectedSystem;
    const matchesRole = filterRole === 'all' || access.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && access.isActive) || 
      (filterStatus === 'inactive' && !access.isActive);
    
    const userName = getUserName(access.userId);
    const matchesSearch = !searchTerm || 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserEmail(access.userId).toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSystem && matchesRole && matchesStatus && matchesSearch;
  });

  const downloadAccessReport = () => {
    const report = [
      ['Sistema', 'Usuário', 'Email', 'Função', 'Status', 'Data de Concessão', 'Último Acesso'],
      ...filteredAccesses.map(access => [
        getSystemName(access.systemId),
        getUserName(access.userId),
        getUserEmail(access.userId),
        getRoleLabel(access.role).label,
        access.isActive ? 'Ativo' : 'Inativo',
        access.grantedAt.toLocaleDateString(),
        access.lastAccess?.toLocaleDateString() || 'Nunca'
      ])
    ];

    const csvContent = report.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio_acessos_sistemas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-dark p-6 rounded-lg border-purple-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold font-mono bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gestão de Usuários e Acessos
          </h2>
        </div>
        <p className="text-gray-300 font-mono">
          Controle completo de usuários, permissões e acessos aos sistemas
        </p>
      </div>

      {/* Filtros */}
      <div className="card-dark p-6 rounded-lg border-gray-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-mono text-gray-300">Sistema</Label>
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger className="bg-gray-800/60 border-gray-700/30">
                <SelectValue placeholder="Todos os sistemas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os sistemas</SelectItem>
                {systems.map(system => (
                  <SelectItem key={system.id} value={system.id}>
                    {system.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-mono text-gray-300">Função</Label>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="bg-gray-800/60 border-gray-700/30">
                <SelectValue placeholder="Todas as funções" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="viewer">Visualizador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-mono text-gray-300">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-800/60 border-gray-700/30">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-mono text-gray-300">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/60 border-gray-700/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-mono text-gray-300">Ações</Label>
            <Button 
              onClick={downloadAccessReport}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-dark border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-mono">Total de Acessos</p>
                <p className="text-2xl font-bold text-blue-400 font-mono">{mockSystemAccesses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-mono">Acessos Ativos</p>
                <p className="text-2xl font-bold text-green-400 font-mono">
                  {mockSystemAccesses.filter(a => a.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-mono">Administradores</p>
                <p className="text-2xl font-bold text-red-400 font-mono">
                  {mockSystemAccesses.filter(a => a.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-mono">Expiram em 30 dias</p>
                <p className="text-2xl font-bold text-yellow-400 font-mono">
                  {mockSystemAccesses.filter(a => 
                    a.expiresAt && 
                    a.expiresAt.getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Acessos */}
      <div className="card-dark p-6 rounded-lg border-gray-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-mono text-white">Acessos aos Sistemas</h3>
          <Badge variant="outline" className="text-sm">
            {filteredAccesses.length} resultados
          </Badge>
        </div>

        <div className="space-y-3">
          {filteredAccesses.map((access, index) => {
            const roleInfo = getRoleLabel(access.role);
            const systemName = getSystemName(access.systemId);
            const userName = getUserName(access.userId);
            const userEmail = getUserEmail(access.userId);

            return (
              <div key={index} className="p-4 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-lg hover:border-purple-500/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <Key className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white font-mono">{systemName}</h4>
                      <p className="text-sm text-gray-400 font-mono">{userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`font-mono ${roleInfo.color}`}>
                      {roleInfo.label}
                    </Badge>
                    <Badge variant={access.isActive ? "default" : "secondary"} className="font-mono">
                      {access.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inativo
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 font-mono">Email:</span>
                    <p className="text-gray-300 font-mono">{userEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-mono">Concedido em:</span>
                    <p className="text-gray-300 font-mono">{access.grantedAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-mono">Último acesso:</span>
                    <p className="text-gray-300 font-mono">
                      {access.lastAccess ? access.lastAccess.toLocaleDateString() : 'Nunca'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-mono">Expira em:</span>
                    <p className="text-gray-300 font-mono">
                      {access.expiresAt ? access.expiresAt.toLocaleDateString() : 'Não expira'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-700/30">
                  <Button variant="outline" size="sm" className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30">
                    <Settings className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="bg-yellow-600/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-600/30">
                    <Clock className="h-3 w-3 mr-1" />
                    Renovar
                  </Button>
                  <Button variant="outline" size="sm" className="bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30">
                    <UserMinus className="h-3 w-3 mr-1" />
                    Revogar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAccesses.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">Nenhum acesso encontrado com os filtros aplicados</p>
          </div>
        )}
      </div>

      {/* Alertas Importantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🔒 Segurança:</strong> Revise regularmente os acessos e remova permissões desnecessárias.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>⏰ Lembrete:</strong> Configure alertas para acessos que expiram em breve.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SystemUserManagement; 