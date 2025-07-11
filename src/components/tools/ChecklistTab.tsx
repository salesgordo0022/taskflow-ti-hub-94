import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Edit, Save, X, Search, Filter, Calendar, Clock, AlertTriangle, CheckCircle, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  lastCompleted?: Date;
  nextDue?: Date;
  assignedTo?: string;
  estimatedTime?: number; // em minutos
  tags: string[];
  notes: string[];
}

const CATEGORIES = [
  'Backup', 'Monitoramento', 'Segurança', 'Manutenção', 'Atualização', 
  'Limpeza', 'Verificação', 'Configuração', 'Teste', 'Documentação'
];

const PRIORITIES = [
  { value: 'low', label: 'Baixa', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { value: 'high', label: 'Alta', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-500/10 text-red-400 border-red-500/30' }
];

const ChecklistTab = () => {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([
    {
      id: '1',
      title: 'Backup dos Sistemas',
      description: 'Verificar se todos os backups foram executados com sucesso e validar integridade dos dados',
      category: 'Backup',
      frequency: 'daily',
      priority: 'high',
      completed: false,
      assignedTo: 'João Silva',
      estimatedTime: 30,
      tags: ['backup', 'sistemas', 'dados'],
      notes: []
    },
    {
      id: '2',
      title: 'Monitoramento de Performance',
      description: 'Analisar métricas de CPU, memória e disco dos servidores principais',
      category: 'Monitoramento',
      frequency: 'daily',
      priority: 'medium',
      completed: true,
      lastCompleted: new Date(),
      assignedTo: 'Maria Santos',
      estimatedTime: 15,
      tags: ['monitoramento', 'performance', 'servidores'],
      notes: ['Tudo funcionando normalmente']
    },
    {
      id: '3',
      title: 'Atualização de Segurança',
      description: 'Verificar e aplicar patches de segurança pendentes em todos os sistemas',
      category: 'Segurança',
      frequency: 'weekly',
      priority: 'critical',
      completed: false,
      assignedTo: 'Carlos Oliveira',
      estimatedTime: 120,
      tags: ['segurança', 'patches', 'atualização'],
      notes: []
    },
    {
      id: '4',
      title: 'Limpeza de Logs',
      description: 'Arquivar logs antigos e liberar espaço em disco dos servidores',
      category: 'Manutenção',
      frequency: 'weekly',
      priority: 'low',
      completed: false,
      assignedTo: 'Ana Costa',
      estimatedTime: 45,
      tags: ['limpeza', 'logs', 'disco'],
      notes: []
    },
    {
      id: '5',
      title: 'Teste de Restore',
      description: 'Executar teste de restauração dos backups para validar procedimentos',
      category: 'Teste',
      frequency: 'monthly',
      priority: 'high',
      completed: false,
      assignedTo: 'Pedro Lima',
      estimatedTime: 90,
      tags: ['teste', 'restore', 'backup'],
      notes: []
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({
    title: '',
    description: '',
    category: '',
    frequency: 'daily',
    priority: 'medium',
    assignedTo: '',
    estimatedTime: 30,
    tags: [],
    notes: []
  });

  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const handleToggleComplete = (id: string) => {
    setChecklists(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completed: !item.completed, lastCompleted: !item.completed ? new Date() : undefined }
        : item
    ));
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string) => {
    setChecklists(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...newItem }
        : item
    ));
    setEditingId(null);
    setNewItem({ title: '', description: '', category: '', frequency: 'daily', priority: 'medium', assignedTo: '', estimatedTime: 30, tags: [], notes: [] });
  };

  const handleDelete = (id: string) => {
    setChecklists(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNew = () => {
    if (newItem.title && newItem.description && newItem.category) {
      const newChecklistItem: ChecklistItem = {
        id: Date.now().toString(),
        title: newItem.title,
        description: newItem.description,
        category: newItem.category,
        frequency: newItem.frequency as ChecklistItem['frequency'],
        priority: newItem.priority as ChecklistItem['priority'],
        completed: false,
        assignedTo: newItem.assignedTo || '',
        estimatedTime: newItem.estimatedTime || 30,
        tags: newItem.tags || [],
        notes: []
      };
      setChecklists(prev => [...prev, newChecklistItem]);
      setNewItem({ 
        title: '', 
        description: '', 
        category: '', 
        frequency: 'daily',
        priority: 'medium',
        assignedTo: '',
        estimatedTime: 30,
        tags: [],
        notes: []
      });
    }
  };

  // Função para adicionar nota
  const handleAddNote = (itemId: string, note: string) => {
    setChecklists(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, notes: [...item.notes, note] }
        : item
    ));
  };

  // Função para adicionar tag
  const handleAddTag = (itemId: string, tag: string) => {
    if (tag.trim() && !checklists.find(item => item.id === itemId)?.tags.includes(tag.trim())) {
      setChecklists(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, tags: [...item.tags, tag.trim()] }
          : item
      ));
    }
  };

  // Função para remover tag
  const handleRemoveTag = (itemId: string, tagToRemove: string) => {
    setChecklists(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, tags: item.tags.filter(tag => tag !== tagToRemove) }
        : item
    ));
  };

  // Filtros
  const filteredChecklists = checklists.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesFrequency = filterFrequency === 'all' || item.frequency === filterFrequency;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && item.completed) ||
                         (filterStatus === 'pending' && !item.completed);
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'completed' && item.completed) ||
                      (activeTab === 'pending' && !item.completed) ||
                      (activeTab === 'critical' && item.priority === 'critical');

    return matchesSearch && matchesCategory && matchesFrequency && matchesPriority && matchesStatus && matchesTab;
  });

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'weekly': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'monthly': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'quarterly': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Backup': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'Monitoramento': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Segurança': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Manutenção': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-dark p-6 rounded-lg border-blue-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Checklist de Rotinas</h1>
        </div>
        <p className="text-gray-300 font-mono">Gerencie as rotinas diárias, semanais e mensais da equipe de TI</p>
      </div>

      {/* Filtros e Busca */}
      <div className="card-dark p-6 rounded-lg border-blue-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-blue-400">Filtros e Busca</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar rotinas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterFrequency} onValueChange={setFilterFrequency}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Frequência" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="all">Todas as Frequências</SelectItem>
              <SelectItem value="daily">Diária</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              {PRIORITIES.map(priority => (
                <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/60">
          <TabsTrigger value="all" className="text-white">Todas</TabsTrigger>
          <TabsTrigger value="pending" className="text-white">Pendentes</TabsTrigger>
          <TabsTrigger value="completed" className="text-white">Concluídas</TabsTrigger>
          <TabsTrigger value="critical" className="text-white">Críticas</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Adicionar Nova Rotina */}
      <div className="card-dark p-6 rounded-lg border-green-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-green-400">Nova Rotina</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Título da rotina"
            value={newItem.title}
            onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newItem.frequency} onValueChange={(value) => setNewItem(prev => ({ ...prev, frequency: value as any }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Frequência" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="daily">Diária</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Select value={newItem.priority} onValueChange={(value) => setNewItem(prev => ({ ...prev, priority: value as any }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              {PRIORITIES.map(priority => (
                <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Responsável"
            value={newItem.assignedTo}
            onChange={(e) => setNewItem(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Tempo estimado (minutos)"
            type="number"
            value={newItem.estimatedTime}
            onChange={(e) => setNewItem(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 30 }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
        </div>
        
        <Textarea
          placeholder="Descrição detalhada da rotina"
          value={newItem.description}
          onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
          className="mt-4 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          rows={3}
        />
      </div>

      {/* Lista de Rotinas */}
      <div className="space-y-4">
        {filteredChecklists.length === 0 ? (
          <div className="card-dark p-8 rounded-lg border-gray-500/30 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-300 font-mono mb-2">Nenhuma rotina encontrada</h3>
            <p className="text-gray-400 font-mono">
              Tente ajustar os filtros ou adicionar uma nova rotina
            </p>
          </div>
        ) : (
          filteredChecklists.map(item => (
            <div key={item.id} className="card-dark p-6 rounded-lg border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleComplete(item.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      item.completed 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                        : 'bg-gray-700/60 text-gray-400 hover:bg-gray-600/60'
                    }`}
                  >
                    <CheckSquare className={`h-5 w-5 ${item.completed ? 'text-green-400' : 'text-gray-400'}`} />
                  </Button>
                  
                  <div className="flex-1">
                    {editingId === item.id ? (
                      <div className="space-y-3">
                        <Input
                          value={newItem.title || item.title}
                          onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-gray-800/60 border-gray-700/30 text-white"
                          placeholder="Título"
                        />
                        <Textarea
                          value={newItem.description || item.description}
                          onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-gray-800/60 border-gray-700/30 text-white"
                          rows={2}
                          placeholder="Descrição"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Select value={newItem.category || item.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
                              <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border-gray-700">
                              {CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={newItem.frequency || item.frequency} onValueChange={(value) => setNewItem(prev => ({ ...prev, frequency: value as any }))}>
                            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
                              <SelectValue placeholder="Frequência" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border-gray-700">
                              <SelectItem value="daily">Diária</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                              <SelectItem value="quarterly">Trimestral</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Select value={newItem.priority || item.priority} onValueChange={(value) => setNewItem(prev => ({ ...prev, priority: value as any }))}>
                            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
                              <SelectValue placeholder="Prioridade" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border-gray-700">
                              {PRIORITIES.map(priority => (
                                <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={newItem.assignedTo || item.assignedTo || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, assignedTo: e.target.value }))}
                            className="bg-gray-800/60 border-gray-700/30 text-white"
                            placeholder="Responsável"
                          />
                          <Input
                            value={newItem.estimatedTime || item.estimatedTime || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 30 }))}
                            className="bg-gray-800/60 border-gray-700/30 text-white"
                            placeholder="Tempo (min)"
                            type="number"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className={`text-lg font-semibold font-mono mb-2 ${
                          item.completed ? 'text-green-400 line-through' : 'text-white'
                        }`}>
                          {item.title}
                        </h3>
                        <p className={`text-gray-300 font-mono mb-3 ${
                          item.completed ? 'line-through' : ''
                        }`}>
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <Badge className={getFrequencyColor(item.frequency)}>
                            {item.frequency === 'daily' ? 'Diária' :
                             item.frequency === 'weekly' ? 'Semanal' :
                             item.frequency === 'monthly' ? 'Mensal' : 'Trimestral'}
                          </Badge>
                          <Badge className={PRIORITIES.find(p => p.value === item.priority)?.color}>
                            {PRIORITIES.find(p => p.value === item.priority)?.label}
                          </Badge>
                          {item.completed && item.lastCompleted && (
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                              Concluído em {item.lastCompleted.toLocaleDateString()}
                            </Badge>
                          )}
                        </div>

                        {/* Informações adicionais */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-3">
                          {item.assignedTo && (
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-white">Responsável:</span>
                              <span>{item.assignedTo}</span>
                            </div>
                          )}
                          {item.estimatedTime && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{item.estimatedTime} min</span>
                            </div>
                          )}
                          {item.tags.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-white">Tags:</span>
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map(tag => (
                                  <Badge key={tag} className="bg-gray-600/20 text-gray-300 border-gray-600/30 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Notas */}
                        {item.notes.length > 0 && (
                          <div className="space-y-2 mb-3">
                            <p className="text-sm font-semibold text-white">Notas:</p>
                            {item.notes.map((note, index) => (
                              <div key={index} className="p-2 bg-gray-800/60 rounded text-sm text-gray-300">
                                {note}
                              </div>
                            ))}
                          </div>
                        )}
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
          ))
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/80 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-400 font-mono">Total de Rotinas</p>
                <p className="text-2xl font-bold text-blue-400 font-mono">{checklists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-400 font-mono">Concluídas</p>
                <p className="text-2xl font-bold text-green-400 font-mono">
                  {checklists.filter(item => item.completed).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-400 font-mono">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-400 font-mono">
                  {checklists.filter(item => !item.completed).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-400 font-mono">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-purple-400 font-mono">
                  {checklists.length > 0 ? Math.round((checklists.filter(item => item.completed).length / checklists.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/80 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-400 font-mono">Críticas Pendentes</p>
                <p className="text-2xl font-bold text-red-400 font-mono">
                  {checklists.filter(item => !item.completed && item.priority === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-400 font-mono">Tempo Total Estimado</p>
                <p className="text-2xl font-bold text-orange-400 font-mono">
                  {checklists.filter(item => !item.completed).reduce((total, item) => total + (item.estimatedTime || 0), 0)} min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/80 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              <div>
                <p className="text-sm text-gray-400 font-mono">Categorias Ativas</p>
                <p className="text-2xl font-bold text-cyan-400 font-mono">
                  {new Set(checklists.map(item => item.category)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChecklistTab; 