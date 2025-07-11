import { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit, Save, X, Search, Tag, Calendar, User, Eye, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: 'troubleshooting' | 'procedures' | 'documentation' | 'tips' | 'faq';
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
}

const KnowledgeBaseTab = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([
    {
      id: '1',
      title: 'Como resolver problemas de conectividade de rede',
      content: `# Solução de Problemas de Rede

## Sintomas Comuns
- Computador não consegue acessar a internet
- Conexão lenta ou instável
- Erro "Sem acesso à internet"

## Passos para Diagnóstico

### 1. Verificar Configurações Básicas
- Confirmar se o cabo de rede está conectado
- Verificar se o adaptador de rede está habilitado
- Testar com cabo diferente se possível

### 2. Comandos de Diagnóstico
\`\`\`bash
ipconfig /all
ping 8.8.8.8
tracert google.com
\`\`\`

### 3. Soluções Comuns
- Reiniciar o adaptador de rede
- Limpar cache DNS: \`ipconfig /flushdns\`
- Verificar configurações de proxy

## Contato para Suporte
Se o problema persistir, entre em contato com a equipe de TI.`,
      category: 'troubleshooting',
      tags: ['rede', 'conectividade', 'diagnóstico', 'windows'],
      author: 'João Silva',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      views: 45,
      likes: 12,
      difficulty: 'intermediate',
      status: 'published'
    },
    {
      id: '2',
      title: 'Procedimento de Backup Automático',
      content: `# Backup Automático - Guia Completo

## Configuração do Sistema de Backup

### Pré-requisitos
- Acesso administrativo ao servidor
- Espaço suficiente em disco
- Script de backup configurado

### Passos de Implementação

1. **Criar Script de Backup**
\`\`\`bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/daily"
SOURCE_DIR="/var/www"

tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $SOURCE_DIR
\`\`\`

2. **Configurar Cron Job**
\`\`\`bash
# Executar backup diário às 2h da manhã
0 2 * * * /usr/local/bin/backup_script.sh
\`\`\`

3. **Monitoramento**
- Verificar logs de execução
- Configurar alertas por email
- Testar restauração periodicamente

## Manutenção
- Limpar backups antigos (manter 30 dias)
- Verificar integridade dos arquivos
- Atualizar documentação conforme necessário`,
      category: 'procedures',
      tags: ['backup', 'automation', 'linux', 'cron'],
      author: 'Maria Santos',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      views: 78,
      likes: 23,
      difficulty: 'advanced',
      status: 'published'
    },
    {
      id: '3',
      title: 'FAQ - Perguntas Frequentes sobre TI',
      content: `# FAQ - Perguntas Frequentes

## Senhas e Acessos

**Q: Como alterar minha senha?**
R: Acesse o portal de usuários e clique em "Alterar Senha". A nova senha deve ter pelo menos 8 caracteres.

**Q: Esqueci minha senha, o que fazer?**
R: Entre em contato com o suporte de TI pelo telefone ou email.

## Impressoras

**Q: A impressora não está funcionando**
R: Verifique se está ligada e conectada à rede. Tente imprimir uma página de teste.

**Q: Como adicionar uma nova impressora?**
R: Solicite ao suporte de TI que configure a impressora no seu computador.

## Software

**Q: Preciso instalar um novo software**
R: Entre em contato com TI para solicitar a instalação. Alguns softwares requerem aprovação.

**Q: O software está lento**
R: Reinicie o computador. Se persistir, contate o suporte.`,
      category: 'faq',
      tags: ['faq', 'senhas', 'impressoras', 'software'],
      author: 'Equipe TI',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      views: 156,
      likes: 34,
      difficulty: 'beginner',
      status: 'published'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState<Partial<KnowledgeArticle>>({
    title: '',
    content: '',
    category: 'troubleshooting',
    tags: [],
    difficulty: 'beginner',
    status: 'draft'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const handleEdit = (id: string) => {
    const article = articles.find(art => art.id === id);
    if (article) {
      setNewArticle(article);
      setEditingId(id);
    }
  };

  const handleSave = (id: string) => {
    setArticles(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...newArticle, updatedAt: new Date() }
        : item
    ));
    setEditingId(null);
    setNewArticle({ title: '', content: '', category: 'troubleshooting', tags: [], difficulty: 'beginner', status: 'draft' });
  };

  const handleDelete = (id: string) => {
    setArticles(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNew = () => {
    if (newArticle.title && newArticle.content) {
      const newKnowledgeArticle: KnowledgeArticle = {
        id: Date.now().toString(),
        title: newArticle.title,
        content: newArticle.content,
        category: newArticle.category as KnowledgeArticle['category'],
        tags: newArticle.tags || [],
        author: 'Usuário Atual',
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0,
        difficulty: newArticle.difficulty as KnowledgeArticle['difficulty'],
        status: newArticle.status as KnowledgeArticle['status']
      };
      setArticles(prev => [...prev, newKnowledgeArticle]);
      setNewArticle({ title: '', content: '', category: 'troubleshooting', tags: [], difficulty: 'beginner', status: 'draft' });
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !newArticle.tags?.includes(tag)) {
      setNewArticle(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewArticle(prev => ({ ...prev, tags: prev.tags?.filter(tag => tag !== tagToRemove) || [] }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'troubleshooting': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'procedures': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'documentation': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'tips': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'faq': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || article.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="card-dark p-6 rounded-lg border-blue-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Base de Conhecimento</h1>
        </div>
        <p className="text-gray-300 font-mono">Central de conhecimento e documentação técnica da equipe de TI</p>
      </div>

      {/* Filtros e Busca */}
      <div className="card-dark p-6 rounded-lg border-green-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-green-400">Buscar Artigos</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              <SelectItem value="troubleshooting">Solução de Problemas</SelectItem>
              <SelectItem value="procedures">Procedimentos</SelectItem>
              <SelectItem value="documentation">Documentação</SelectItem>
              <SelectItem value="tips">Dicas</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Dificuldades</SelectItem>
              <SelectItem value="beginner">Iniciante</SelectItem>
              <SelectItem value="intermediate">Intermediário</SelectItem>
              <SelectItem value="advanced">Avançado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Novo Artigo */}
      <div className="card-dark p-6 rounded-lg border-yellow-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-yellow-400">Novo Artigo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Título do artigo"
            value={newArticle.title}
            onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
            className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          />
          
          <Select value={newArticle.category} onValueChange={(value) => setNewArticle(prev => ({ ...prev, category: value as any }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="troubleshooting">Solução de Problemas</SelectItem>
              <SelectItem value="procedures">Procedimentos</SelectItem>
              <SelectItem value="documentation">Documentação</SelectItem>
              <SelectItem value="tips">Dicas</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={newArticle.difficulty} onValueChange={(value) => setNewArticle(prev => ({ ...prev, difficulty: value as any }))}>
            <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Iniciante</SelectItem>
              <SelectItem value="intermediate">Intermediário</SelectItem>
              <SelectItem value="advanced">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-mono">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {newArticle.tags?.map(tag => (
              <Badge key={tag} className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Adicionar tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  handleAddTag(input.value);
                  input.value = '';
                }
              }}
              className="bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
            />
            <Button
              onClick={() => {
                const input = document.querySelector('input[placeholder="Adicionar tag"]') as HTMLInputElement;
                if (input.value) {
                  handleAddTag(input.value);
                  input.value = '';
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Textarea
          placeholder="Conteúdo do artigo (suporta Markdown)"
          value={newArticle.content}
          onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
          className="mb-4 bg-gray-800/60 border-gray-700/30 text-white placeholder-gray-400"
          rows={8}
        />
        
        <div className="flex justify-end">
          <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Criar Artigo
          </Button>
        </div>
      </div>

      {/* Lista de Artigos */}
      <div className="space-y-4">
        {filteredArticles.map(article => (
          <div key={article.id} className="card-dark p-6 rounded-lg border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-gray-800/60 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                
                <div className="flex-1">
                  {editingId === article.id ? (
                    <div className="space-y-3">
                      <Input
                        value={newArticle.title || article.title}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-gray-800/60 border-gray-700/30 text-white"
                        placeholder="Título"
                      />
                      <Textarea
                        value={newArticle.content || article.content}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                        className="bg-gray-800/60 border-gray-700/30 text-white"
                        rows={4}
                        placeholder="Conteúdo"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select value={newArticle.category || article.category} onValueChange={(value) => setNewArticle(prev => ({ ...prev, category: value as any }))}>
                          <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="troubleshooting">Solução de Problemas</SelectItem>
                            <SelectItem value="procedures">Procedimentos</SelectItem>
                            <SelectItem value="documentation">Documentação</SelectItem>
                            <SelectItem value="tips">Dicas</SelectItem>
                            <SelectItem value="faq">FAQ</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={newArticle.difficulty || article.difficulty} onValueChange={(value) => setNewArticle(prev => ({ ...prev, difficulty: value as any }))}>
                          <SelectTrigger className="bg-gray-800/60 border-gray-700/30 text-white">
                            <SelectValue placeholder="Dificuldade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediário</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold font-mono text-white cursor-pointer hover:text-blue-400" onClick={() => setSelectedArticle(article)}>
                          {article.title}
                        </h3>
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category === 'troubleshooting' ? 'Solução de Problemas' :
                           article.category === 'procedures' ? 'Procedimentos' :
                           article.category === 'documentation' ? 'Documentação' :
                           article.category === 'tips' ? 'Dicas' : 'FAQ'}
                        </Badge>
                        <Badge className={getDifficultyColor(article.difficulty)}>
                          {article.difficulty === 'beginner' ? 'Iniciante' :
                           article.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 font-mono text-sm mb-3 line-clamp-2">
                        {article.content.substring(0, 200)}...
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tags.map(tag => (
                          <Badge key={tag} className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{article.updatedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{article.likes}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {editingId === article.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSave(article.id)}
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
                      onClick={() => handleEdit(article.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(article.id)}
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

      {/* Modal de Visualização do Artigo */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-dark p-6 rounded-lg border-blue-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-mono text-white">{selectedArticle.title}</h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <Badge className={getCategoryColor(selectedArticle.category)}>
                {selectedArticle.category === 'troubleshooting' ? 'Solução de Problemas' :
                 selectedArticle.category === 'procedures' ? 'Procedimentos' :
                 selectedArticle.category === 'documentation' ? 'Documentação' :
                 selectedArticle.category === 'tips' ? 'Dicas' : 'FAQ'}
              </Badge>
              <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                {selectedArticle.difficulty === 'beginner' ? 'Iniciante' :
                 selectedArticle.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedArticle.tags.map(tag => (
                <Badge key={tag} className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm bg-gray-800/60 p-4 rounded-lg">
                {selectedArticle.content}
              </pre>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/30">
              <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Atualizado em {selectedArticle.updatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{selectedArticle.views} visualizações</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{selectedArticle.likes} curtidas</span>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  // Incrementar visualizações
                  setArticles(prev => prev.map(item => 
                    item.id === selectedArticle.id 
                      ? { ...item, views: item.views + 1 }
                      : item
                  ));
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Útil
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-dark p-4 rounded-lg border-blue-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Total de Artigos</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">{articles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Total de Visualizações</p>
              <p className="text-2xl font-bold text-green-400 font-mono">
                {articles.reduce((sum, article) => sum + article.views, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-yellow-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Total de Curtidas</p>
              <p className="text-2xl font-bold text-yellow-400 font-mono">
                {articles.reduce((sum, article) => sum + article.likes, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-purple-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Artigos Publicados</p>
              <p className="text-2xl font-bold text-purple-400 font-mono">
                {articles.filter(article => article.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseTab; 