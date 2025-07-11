import { useState } from 'react';
import { Monitor, Server, Laptop, Printer, Network, Plus, Trash2, Edit, Save, X, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Equipment {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'server' | 'printer' | 'network' | 'other';
  brand: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'active' | 'maintenance' | 'retired' | 'broken';
  purchaseDate: Date;
  warrantyExpiry?: Date;
  assignedTo?: string;
  specifications: string;
  notes?: string;
}

const InventoryTab = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Servidor Principal',
      type: 'server',
      brand: 'Dell',
      model: 'PowerEdge R740',
      serialNumber: 'DELL-2024-001',
      location: 'Sala de Servidores',
      status: 'active',
      purchaseDate: new Date('2023-01-15'),
      warrantyExpiry: new Date('2026-01-15'),
      specifications: 'Intel Xeon, 64GB RAM, 2TB SSD',
      notes: 'Servidor principal para aplicações críticas'
    },
    {
      id: '2',
      name: 'Notebook Desenvolvimento',
      type: 'laptop',
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon',
      serialNumber: 'LEN-2024-002',
      location: 'Escritório TI',
      status: 'active',
      purchaseDate: new Date('2023-06-20'),
      warrantyExpiry: new Date('2026-06-20'),
      assignedTo: 'João Silva',
      specifications: 'Intel i7, 16GB RAM, 512GB SSD',
      notes: 'Notebook para desenvolvimento de software'
    },
    {
      id: '3',
      name: 'Impressora Multifuncional',
      type: 'printer',
      brand: 'HP',
      model: 'LaserJet Pro M404n',
      serialNumber: 'HP-2024-003',
      location: 'Recepção',
      status: 'maintenance',
      purchaseDate: new Date('2022-12-10'),
      warrantyExpiry: new Date('2025-12-10'),
      specifications: 'Impressão, cópia, digitalização',
      notes: 'Necessita manutenção - problema de alimentação'
    },
    {
      id: '4',
      name: 'Switch de Rede',
      type: 'network',
      brand: 'Cisco',
      model: 'Catalyst 2960',
      serialNumber: 'CIS-2024-004',
      location: 'Rack de Rede',
      status: 'active',
      purchaseDate: new Date('2023-03-05'),
      warrantyExpiry: new Date('2026-03-05'),
      specifications: '24 portas Gigabit, PoE',
      notes: 'Switch principal da rede corporativa'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<Equipment>>({
    name: '',
    type: 'desktop',
    brand: '',
    model: '',
    serialNumber: '',
    location: '',
    status: 'active',
    purchaseDate: new Date(),
    specifications: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleEdit = (id: string) => {
    const item = equipment.find(eq => eq.id === id);
    if (item) {
      setNewItem(item);
      setEditingId(id);
    }
  };

  const handleSave = (id: string) => {
    setEquipment(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...newItem }
        : item
    ));
    setEditingId(null);
    setNewItem({ name: '', type: 'desktop', brand: '', model: '', serialNumber: '', location: '', status: 'active', purchaseDate: new Date(), specifications: '' });
  };

  const handleDelete = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNew = () => {
    if (newItem.name && newItem.brand && newItem.model && newItem.serialNumber) {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        name: newItem.name,
        type: newItem.type as Equipment['type'],
        brand: newItem.brand,
        model: newItem.model,
        serialNumber: newItem.serialNumber,
        location: newItem.location || '',
        status: newItem.status as Equipment['status'],
        purchaseDate: newItem.purchaseDate || new Date(),
        warrantyExpiry: newItem.warrantyExpiry,
        assignedTo: newItem.assignedTo,
        specifications: newItem.specifications || '',
        notes: newItem.notes
      };
      setEquipment(prev => [...prev, newEquipment]);
      setNewItem({ name: '', type: 'desktop', brand: '', model: '', serialNumber: '', location: '', status: 'active', purchaseDate: new Date(), specifications: '' });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="h-5 w-5" />;
      case 'laptop': return <Laptop className="h-5 w-5" />;
      case 'server': return <Server className="h-5 w-5" />;
      case 'printer': return <Printer className="h-5 w-5" />;
      case 'network': return <Network className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'maintenance': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'retired': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'broken': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'desktop': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'laptop': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'server': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'printer': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'network': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="card-dark p-6 rounded-lg border-blue-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Inventário de Equipamentos</h1>
        </div>
        <p className="text-gray-300 font-mono">Controle completo do patrimônio de TI da empresa</p>
      </div>

      {/* Filtros e Busca */}
      <div className="card-dark p-6 rounded-lg border-green-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-green-400">Filtros e Busca</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar equipamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Tipo de Equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="laptop">Notebook</SelectItem>
              <SelectItem value="server">Servidor</SelectItem>
              <SelectItem value="printer">Impressora</SelectItem>
              <SelectItem value="network">Rede</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="retired">Aposentado</SelectItem>
              <SelectItem value="broken">Defeituoso</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {/* Adicionar Novo Equipamento */}
      <div className="card-dark p-6 rounded-lg border-yellow-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-yellow-400">Novo Equipamento</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Nome do equipamento"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Marca"
            value={newItem.brand}
            onChange={(e) => setNewItem(prev => ({ ...prev, brand: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Modelo"
            value={newItem.model}
            onChange={(e) => setNewItem(prev => ({ ...prev, model: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Número de Série"
            value={newItem.serialNumber}
            onChange={(e) => setNewItem(prev => ({ ...prev, serialNumber: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Select value={newItem.type} onValueChange={(value) => setNewItem(prev => ({ ...prev, type: value as any }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="laptop">Notebook</SelectItem>
              <SelectItem value="server">Servidor</SelectItem>
              <SelectItem value="printer">Impressora</SelectItem>
              <SelectItem value="network">Rede</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Localização"
            value={newItem.location}
            onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          
          <Input
            placeholder="Responsável (opcional)"
            value={newItem.assignedTo}
            onChange={(e) => setNewItem(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
        </div>
        
        <Textarea
          placeholder="Especificações técnicas"
          value={newItem.specifications}
          onChange={(e) => setNewItem(prev => ({ ...prev, specifications: e.target.value }))}
          className="mt-4 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          rows={3}
        />
        
        <div className="flex justify-end mt-4">
          <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Equipamento
          </Button>
        </div>
      </div>

      {/* Lista de Equipamentos */}
      <div className="space-y-4">
        {filteredEquipment.map(item => (
          <div key={item.id} className="card-dark p-6 rounded-lg border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-gray-800/60 rounded-lg">
                  {getTypeIcon(item.type)}
                </div>
                
                <div className="flex-1">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={newItem.name || item.name}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-800/60 border-gray-700/30 text-white"
                          placeholder="Nome"
                        />
                        <Input
                          value={newItem.brand || item.brand}
                          onChange={(e) => setNewItem(prev => ({ ...prev, brand: e.target.value }))}
                          className="bg-gray-800/60 border-gray-700/30 text-white"
                          placeholder="Marca"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={newItem.model || item.model}
                          onChange={(e) => setNewItem(prev => ({ ...prev, model: e.target.value }))}
                          className="bg-gray-800/60 border-gray-700/30 text-white"
                          placeholder="Modelo"
                        />
                        <Input
                          value={newItem.serialNumber || item.serialNumber}
                          onChange={(e) => setNewItem(prev => ({ ...prev, serialNumber: e.target.value }))}
                          className="bg-gray-800/60 border-gray-700/30 text-white"
                          placeholder="Número de Série"
                        />
                      </div>
                      <Textarea
                        value={newItem.specifications || item.specifications}
                        onChange={(e) => setNewItem(prev => ({ ...prev, specifications: e.target.value }))}
                        className="bg-gray-800/60 border-gray-700/30 text-white"
                        rows={2}
                        placeholder="Especificações"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold font-mono text-white">{item.name}</h3>
                        <Badge className={getTypeColor(item.type)}>
                          {item.type === 'desktop' ? 'Desktop' :
                           item.type === 'laptop' ? 'Notebook' :
                           item.type === 'server' ? 'Servidor' :
                           item.type === 'printer' ? 'Impressora' :
                           item.type === 'network' ? 'Rede' : 'Outro'}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'active' ? 'Ativo' :
                           item.status === 'maintenance' ? 'Manutenção' :
                           item.status === 'retired' ? 'Aposentado' : 'Defeituoso'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-400 font-mono">Marca/Modelo</p>
                          <p className="text-white font-mono">{item.brand} {item.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 font-mono">Número de Série</p>
                          <p className="text-white font-mono">{item.serialNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 font-mono">Localização</p>
                          <p className="text-white font-mono">{item.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 font-mono">Responsável</p>
                          <p className="text-white font-mono">{item.assignedTo || 'Não atribuído'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 font-mono mb-1">Especificações</p>
                        <p className="text-gray-300 font-mono text-sm">{item.specifications}</p>
                      </div>
                      
                      {item.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-400 font-mono mb-1">Observações</p>
                          <p className="text-gray-300 font-mono text-sm">{item.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                          Compra: {item.purchaseDate.toLocaleDateString()}
                        </Badge>
                        {item.warrantyExpiry && (
                          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                            Garantia: {item.warrantyExpiry.toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {editingId === item.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSave(item.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-dark p-4 rounded-lg border-blue-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Total de Equipamentos</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">{equipment.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Ativos</p>
              <p className="text-2xl font-bold text-green-400 font-mono">
                {equipment.filter(item => item.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-yellow-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Em Manutenção</p>
              <p className="text-2xl font-bold text-yellow-400 font-mono">
                {equipment.filter(item => item.status === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-red-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Defeituosos</p>
              <p className="text-2xl font-bold text-red-400 font-mono">
                {equipment.filter(item => item.status === 'broken').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTab; 