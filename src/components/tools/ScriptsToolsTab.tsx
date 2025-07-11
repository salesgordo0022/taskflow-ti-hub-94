import { useState } from 'react';
import { Code, Play, Save, Copy, Download, Plus, Trash2, Edit, X, Terminal, Database, Network, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Script {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'maintenance' | 'monitoring' | 'security' | 'backup' | 'other';
  language: 'bash' | 'powershell' | 'python' | 'sql' | 'javascript' | 'other';
  code: string;
  parameters: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  lastUsed?: Date;
  tags: string[];
}

const ScriptsToolsTab = () => {
  const [scripts, setScripts] = useState<Script[]>([
    {
      id: '1',
      name: 'Backup Automático de Banco',
      description: 'Script para backup automático de banco de dados MySQL',
      category: 'backup',
      language: 'bash',
      code: '#!/bin/bash\n# Backup automático de banco MySQL\nDATE=$(date +%Y%m%d_%H%M%S)\nDB_NAME="database_name"\nBACKUP_DIR="/backup/mysql"\nUSER="root"\nPASS="password"\n\n# Criar diretório se não existir\nmkdir -p $BACKUP_DIR\n\n# Executar backup\nmysqldump -u$USER -p$PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql\n\n# Comprimir backup\ngzip $BACKUP_DIR/backup_$DATE.sql\n\n# Remover backups antigos (manter 30 dias)\nfind $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete\n\necho "Backup concluído: backup_$DATE.sql.gz"',
      parameters: ['DB_NAME', 'USER', 'PASS', 'BACKUP_DIR'],
      author: 'João Silva',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      usageCount: 12,
      lastUsed: new Date('2024-01-20'),
      tags: ['mysql', 'backup', 'automation']
    },
    {
      id: '2',
      name: 'Monitor de Processos',
      description: 'Script PowerShell para monitorar processos do sistema',
      category: 'monitoring',
      language: 'powershell',
      code: '# Monitor de Processos do Sistema\nparam(\n    [int]$Interval = 60,\n    [string]$LogFile = "process_monitor.log"\n)\n\nWrite-Host "Iniciando monitoramento de processos..." -ForegroundColor Green\n\nwhile ($true) {\n    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"\n    $processes = Get-Process | Where-Object {$_.CPU -gt 10} | Select-Object Name, CPU, WorkingSet, Id\n    \n    if ($processes) {\n        $logEntry = "$timestamp - Processos com alto uso de CPU:"\n        $processes | ForEach-Object {\n            $logEntry += "  $($_.Name) - CPU: $($_.CPU)s - Memória: $([math]::Round($_.WorkingSet/1MB,2))MB"\n        }\n        \n        Add-Content -Path $LogFile -Value $logEntry\n        Write-Host $logEntry -ForegroundColor Yellow\n    }\n    \n    Start-Sleep -Seconds $Interval\n}',
      parameters: ['Interval', 'LogFile'],
      author: 'Maria Santos',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      usageCount: 8,
      lastUsed: new Date('2024-01-18'),
      tags: ['powershell', 'monitoring', 'processes']
    },
    {
      id: '3',
      name: 'Limpeza de Logs',
      description: 'Script Python para limpeza automática de logs antigos',
      category: 'maintenance',
      language: 'python',
      code: '#!/usr/bin/env python3\n"""\nScript para limpeza automática de logs antigos\n"""\n\nimport os\nimport glob\nimport time\nfrom datetime import datetime, timedelta\nimport logging\n\n# Configuração de logging\nlogging.basicConfig(\n    level=logging.INFO,\n    format="%(asctime)s - %(levelname)s - %(message)s",\n    handlers=[\n        logging.FileHandler("log_cleanup.log"),\n        logging.StreamHandler()\n    ]\n)\n\ndef cleanup_logs(log_dir, days_old=30, file_pattern="*.log"):\n    """\n    Remove logs mais antigos que o número de dias especificado\n    """\n    cutoff_date = datetime.now() - timedelta(days=days_old)\n    deleted_count = 0\n    freed_space = 0\n    \n    try:\n        # Buscar arquivos de log\n        log_files = glob.glob(os.path.join(log_dir, file_pattern))\n        \n        for log_file in log_files:\n            file_time = datetime.fromtimestamp(os.path.getmtime(log_file))\n            \n            if file_time < cutoff_date:\n                file_size = os.path.getsize(log_file)\n                os.remove(log_file)\n                deleted_count += 1\n                freed_space += file_size\n                logging.info(f"Removido: {log_file}")\n        \n        logging.info(f"Limpeza concluída: {deleted_count} arquivos removidos, "\n                    f"{freed_space / (1024*1024):.2f} MB liberados")\n        \n    except Exception as e:\n        logging.error(f"Erro durante limpeza: {e}")\n\nif __name__ == "__main__":\n    # Configurações\n    LOG_DIR = "/var/log"\n    DAYS_OLD = 30\n    \n    cleanup_logs(LOG_DIR, DAYS_OLD)',
      parameters: ['LOG_DIR', 'DAYS_OLD'],
      author: 'Carlos Oliveira',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      usageCount: 15,
      lastUsed: new Date('2024-01-22'),
      tags: ['python', 'maintenance', 'logs']
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newScript, setNewScript] = useState<Partial<Script>>({
    name: '',
    description: '',
    category: 'automation',
    language: 'bash',
    code: '',
    parameters: [],
    tags: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [executionOutput, setExecutionOutput] = useState<string>('');

  const handleEdit = (id: string) => {
    const script = scripts.find(s => s.id === id);
    if (script) {
      setNewScript(script);
      setEditingId(id);
    }
  };

  const handleSave = (id: string) => {
    setScripts(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...newScript, updatedAt: new Date() }
        : item
    ));
    setEditingId(null);
    setNewScript({ name: '', description: '', category: 'automation', language: 'bash', code: '', parameters: [], tags: [] });
  };

  const handleDelete = (id: string) => {
    setScripts(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNew = () => {
    if (newScript.name && newScript.description && newScript.code) {
      const newScriptItem: Script = {
        id: Date.now().toString(),
        name: newScript.name,
        description: newScript.description,
        category: newScript.category as Script['category'],
        language: newScript.language as Script['language'],
        code: newScript.code,
        parameters: newScript.parameters || [],
        author: 'Usuário Atual',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        tags: newScript.tags || []
      };
      setScripts(prev => [...prev, newScriptItem]);
      setNewScript({ name: '', description: '', category: 'automation', language: 'bash', code: '', parameters: [], tags: [] });
    }
  };

  const handleExecute = (script: Script) => {
    // Simular execução do script
    setExecutionOutput(`Executando script: ${script.name}\n\n`);
    setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString()}] Script iniciado\n`);
    
    setTimeout(() => {
      setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString()}] Executando comandos...\n`);
      
      setTimeout(() => {
        setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString()}] Script concluído com sucesso!\n`);
        
        // Incrementar contador de uso
        setScripts(prev => prev.map(item => 
          item.id === script.id 
            ? { ...item, usageCount: item.usageCount + 1, lastUsed: new Date() }
            : item
        ));
      }, 2000);
    }, 1000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Aqui você poderia adicionar uma notificação de sucesso
  };

  const handleDownloadScript = (script: Script) => {
    const blob = new Blob([script.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.name}.${script.language === 'bash' ? 'sh' : script.language === 'powershell' ? 'ps1' : 'py'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'automation': return <Zap className="h-5 w-5" />;
      case 'maintenance': return <Terminal className="h-5 w-5" />;
      case 'monitoring': return <Network className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'backup': return <Database className="h-5 w-5" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'maintenance': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'monitoring': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'security': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'backup': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'bash': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'powershell': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'python': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'sql': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'javascript': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || script.category === filterCategory;
    const matchesLanguage = filterLanguage === 'all' || script.language === filterLanguage;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <div className="space-y-6">
      <div className="card-dark p-6 rounded-lg border-blue-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Scripts e Ferramentas</h1>
        </div>
        <p className="text-gray-300 font-mono">Biblioteca de scripts e ferramentas para automação de tarefas de TI</p>
      </div>

      {/* Filtros e Busca */}
      <div className="card-dark p-6 rounded-lg border-green-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-green-400">Buscar Scripts</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Buscar scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              <SelectItem value="automation">Automação</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="monitoring">Monitoramento</SelectItem>
              <SelectItem value="security">Segurança</SelectItem>
              <SelectItem value="backup">Backup</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Linguagem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Linguagens</SelectItem>
              <SelectItem value="bash">Bash</SelectItem>
              <SelectItem value="powershell">PowerShell</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Code className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Novo Script */}
      <div className="card-dark p-6 rounded-lg border-yellow-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-yellow-400">Novo Script</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Nome do script"
            value={newScript.name}
            onChange={(e) => setNewScript(prev => ({ ...prev, name: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          
          <Select value={newScript.category} onValueChange={(value) => setNewScript(prev => ({ ...prev, category: value as any }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automation">Automação</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="monitoring">Monitoramento</SelectItem>
              <SelectItem value="security">Segurança</SelectItem>
              <SelectItem value="backup">Backup</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={newScript.language} onValueChange={(value) => setNewScript(prev => ({ ...prev, language: value as any }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Linguagem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bash">Bash</SelectItem>
              <SelectItem value="powershell">PowerShell</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Textarea
          placeholder="Descrição do script"
          value={newScript.description}
          onChange={(e) => setNewScript(prev => ({ ...prev, description: e.target.value }))}
          className="mb-4 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          rows={3}
        />
        
        <Textarea
          placeholder="Código do script"
          value={newScript.code}
          onChange={(e) => setNewScript(prev => ({ ...prev, code: e.target.value }))}
          className="mb-4 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400 font-mono"
          rows={10}
        />
        
        <div className="flex justify-end">
          <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Script
          </Button>
        </div>
      </div>

      {/* Lista de Scripts */}
      <div className="space-y-4">
        {filteredScripts.map(script => (
          <div key={script.id} className="card-dark p-6 rounded-lg border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-gray-800/60 rounded-lg">
                  {getCategoryIcon(script.category)}
                </div>
                
                <div className="flex-1">
                  {editingId === script.id ? (
                    <div className="space-y-3">
                      <Input
                        value={newScript.name || script.name}
                        onChange={(e) => setNewScript(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-800/60 border-gray-700/30 text-white"
                        placeholder="Nome"
                      />
                      <Textarea
                        value={newScript.description || script.description}
                        onChange={(e) => setNewScript(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-800/60 border-gray-700/30 text-white"
                        rows={2}
                        placeholder="Descrição"
                      />
                      <Textarea
                        value={newScript.code || script.code}
                        onChange={(e) => setNewScript(prev => ({ ...prev, code: e.target.value }))}
                        className="bg-gray-800/60 border-gray-700/30 text-white font-mono"
                        rows={6}
                        placeholder="Código"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold font-mono text-white cursor-pointer hover:text-blue-400" onClick={() => setSelectedScript(script)}>
                          {script.name}
                        </h3>
                        <Badge className={getCategoryColor(script.category)}>
                          {script.category === 'automation' ? 'Automação' :
                           script.category === 'maintenance' ? 'Manutenção' :
                           script.category === 'monitoring' ? 'Monitoramento' :
                           script.category === 'security' ? 'Segurança' :
                           script.category === 'backup' ? 'Backup' : 'Outros'}
                        </Badge>
                        <Badge className={getLanguageColor(script.language)}>
                          {script.language.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 font-mono text-sm mb-3">
                        {script.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {script.tags.map(tag => (
                          <Badge key={tag} className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
                        <span>Autor: {script.author}</span>
                        <span>Usado: {script.usageCount} vezes</span>
                        {script.lastUsed && (
                          <span>Último uso: {script.lastUsed.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {editingId === script.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSave(script.id)}
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
                      onClick={() => handleExecute(script)}
                      className="bg-green-600 hover:bg-green-700"
                      title="Executar Script"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCode(script.code)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Copiar Código"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadScript(script)}
                      className="text-purple-400 hover:text-purple-300"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(script.id)}
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(script.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Excluir"
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

      {/* Modal de Visualização do Script */}
      {selectedScript && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-dark p-6 rounded-lg border-blue-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-mono text-white">{selectedScript.name}</h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedScript(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <Badge className={getCategoryColor(selectedScript.category)}>
                {selectedScript.category === 'automation' ? 'Automação' :
                 selectedScript.category === 'maintenance' ? 'Manutenção' :
                 selectedScript.category === 'monitoring' ? 'Monitoramento' :
                 selectedScript.category === 'security' ? 'Segurança' :
                 selectedScript.category === 'backup' ? 'Backup' : 'Outros'}
              </Badge>
              <Badge className={getLanguageColor(selectedScript.language)}>
                {selectedScript.language.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedScript.tags.map(tag => (
                <Badge key={tag} className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold font-mono text-white mb-2">Descrição</h3>
              <p className="text-gray-300 font-mono">{selectedScript.description}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold font-mono text-white mb-2">Código</h3>
              <pre className="bg-gray-800/60 p-4 rounded-lg overflow-x-auto text-gray-300 font-mono text-sm">
                {selectedScript.code}
              </pre>
            </div>
            
            {selectedScript.parameters.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold font-mono text-white mb-2">Parâmetros</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScript.parameters.map(param => (
                    <Badge key={param} className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      {param}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
              <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
                <span>Autor: {selectedScript.author}</span>
                <span>Usado: {selectedScript.usageCount} vezes</span>
                {selectedScript.lastUsed && (
                  <span>Último uso: {selectedScript.lastUsed.toLocaleDateString()}</span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleExecute(selectedScript)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Executar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCopyCode(selectedScript.code)}
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadScript(selectedScript)}
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Output de Execução */}
      {executionOutput && (
        <div className="card-dark p-6 rounded-lg border-green-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-xl font-bold font-mono text-green-400">Output de Execução</h2>
          </div>
          <pre className="bg-gray-800/60 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
            {executionOutput}
          </pre>
          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              onClick={() => setExecutionOutput('')}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-dark p-4 rounded-lg border-blue-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Total de Scripts</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">{scripts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Total de Execuções</p>
              <p className="text-2xl font-bold text-green-400 font-mono">
                {scripts.reduce((sum, script) => sum + script.usageCount, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-yellow-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Scripts Mais Usados</p>
              <p className="text-2xl font-bold text-yellow-400 font-mono">
                {scripts.filter(script => script.usageCount > 5).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-purple-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Linguagens</p>
              <p className="text-2xl font-bold text-purple-400 font-mono">
                {new Set(scripts.map(script => script.language)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptsToolsTab; 