import { useState } from 'react';
import { Wifi, Globe, Zap, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Download, Upload, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface NetworkTest {
  id: string;
  name: string;
  url: string;
  description: string;
  category: 'speed' | 'connectivity' | 'ping' | 'dns';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: {
    ping?: number;
    download?: number;
    upload?: number;
    latency?: number;
    jitter?: number;
    packetLoss?: number;
  };
  lastTest?: Date;
}

const NetworkTestTab = () => {
  const [tests, setTests] = useState<NetworkTest[]>([
    {
      id: '1',
      name: 'Speedtest.net',
      url: 'https://www.speedtest.net',
      description: 'Teste de velocidade de download e upload',
      category: 'speed',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Fast.com (Netflix)',
      url: 'https://fast.com',
      description: 'Teste de velocidade simples da Netflix',
      category: 'speed',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Google DNS',
      url: 'https://dns.google.com',
      description: 'Teste de conectividade com DNS do Google',
      category: 'dns',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Cloudflare DNS',
      url: 'https://1.1.1.1',
      description: 'Teste de conectividade com DNS da Cloudflare',
      category: 'dns',
      status: 'pending'
    },
    {
      id: '5',
      name: 'OpenDNS',
      url: 'https://www.opendns.com',
      description: 'Teste de conectividade com OpenDNS',
      category: 'dns',
      status: 'pending'
    },
    {
      id: '6',
      name: 'Ping Test',
      url: 'https://www.pingtest.net',
      description: 'Teste de latência e jitter',
      category: 'ping',
      status: 'pending'
    },
    {
      id: '7',
      name: 'Down Detector',
      url: 'https://downdetector.com',
      description: 'Verificar status de serviços populares',
      category: 'connectivity',
      status: 'pending'
    },
    {
      id: '8',
      name: 'Internet Health Test',
      url: 'https://www.internethealthtest.org',
      description: 'Teste completo de saúde da internet',
      category: 'connectivity',
      status: 'pending'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<NetworkTest | null>(null);

  const runTest = async (test: NetworkTest) => {
    setTests(prev => prev.map(t => 
      t.id === test.id ? { ...t, status: 'running' } : t
    ));

    // Simular teste de rede
    setTimeout(() => {
      const mockResult = {
        ping: Math.floor(Math.random() * 50) + 10,
        download: Math.floor(Math.random() * 100) + 50,
        upload: Math.floor(Math.random() * 50) + 20,
        latency: Math.floor(Math.random() * 30) + 5,
        jitter: Math.floor(Math.random() * 10) + 1,
        packetLoss: Math.random() * 2
      };

      setTests(prev => prev.map(t => 
        t.id === test.id 
          ? { 
              ...t, 
              status: 'completed', 
              result: mockResult,
              lastTest: new Date()
            } 
          : t
      ));
    }, 2000 + Math.random() * 3000);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      await runTest(test);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsRunning(false);
  };

  const openTestInNewTab = (test: NetworkTest) => {
    window.open(test.url, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'running': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speed': return <Zap className="h-5 w-5" />;
      case 'connectivity': return <Globe className="h-5 w-5" />;
      case 'ping': return <Activity className="h-5 w-5" />;
      case 'dns': return <Wifi className="h-5 w-5" />;
      default: return <Wifi className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speed': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'connectivity': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ping': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'dns': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getSpeedQuality = (speed: number) => {
    if (speed >= 100) return { label: 'Excelente', color: 'text-green-400' };
    if (speed >= 50) return { label: 'Boa', color: 'text-blue-400' };
    if (speed >= 25) return { label: 'Regular', color: 'text-yellow-400' };
    return { label: 'Lenta', color: 'text-red-400' };
  };

  const getPingQuality = (ping: number) => {
    if (ping <= 20) return { label: 'Excelente', color: 'text-green-400' };
    if (ping <= 50) return { label: 'Boa', color: 'text-blue-400' };
    if (ping <= 100) return { label: 'Regular', color: 'text-yellow-400' };
    return { label: 'Alta', color: 'text-red-400' };
  };

  return (
    <div className="space-y-6">
      <div className="card-dark p-6 rounded-lg border-blue-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Teste de Conectividade WiFi</h1>
        </div>
        <p className="text-gray-300 font-mono">Teste a qualidade da sua conexão de internet e WiFi</p>
      </div>

      {/* Controles Principais */}
      <div className="card-dark p-6 rounded-lg border-green-500/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-green-400">Controles de Teste</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Executando Testes...' : 'Executar Todos os Testes'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setTests(prev => prev.map(t => ({ ...t, status: 'pending', result: undefined })))}
            className="border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Limpar Resultados
          </Button>
        </div>
      </div>

      {/* Lista de Testes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map(test => (
          <div key={test.id} className="card-dark p-6 rounded-lg border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-800/60 rounded-lg">
                  {getCategoryIcon(test.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold font-mono text-white">{test.name}</h3>
                    <Badge className={getStatusColor(test.status)}>
                      {getStatusIcon(test.status)}
                    </Badge>
                    <Badge className={getCategoryColor(test.category)}>
                      {test.category === 'speed' ? 'Velocidade' :
                       test.category === 'connectivity' ? 'Conectividade' :
                       test.category === 'ping' ? 'Latência' : 'DNS'}
                    </Badge>
                  </div>
                  <p className="text-gray-300 font-mono text-sm mb-2">{test.description}</p>
                  <p className="text-gray-400 font-mono text-xs">{test.url}</p>
                </div>
              </div>
            </div>

            {/* Resultados do Teste */}
            {test.status === 'completed' && test.result && (
              <div className="space-y-3 mb-4">
                {test.result.download && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400 font-mono">Download</span>
                      <span className={`font-semibold font-mono ${getSpeedQuality(test.result.download).color}`}>
                        {test.result.download} Mbps - {getSpeedQuality(test.result.download).label}
                      </span>
                    </div>
                    <Progress value={(test.result.download / 200) * 100} className="h-2" />
                  </div>
                )}
                
                {test.result.upload && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400 font-mono">Upload</span>
                      <span className={`font-semibold font-mono ${getSpeedQuality(test.result.upload).color}`}>
                        {test.result.upload} Mbps - {getSpeedQuality(test.result.upload).label}
                      </span>
                    </div>
                    <Progress value={(test.result.upload / 100) * 100} className="h-2" />
                  </div>
                )}
                
                {test.result.ping && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400 font-mono">Ping</span>
                      <span className={`font-semibold font-mono ${getPingQuality(test.result.ping).color}`}>
                        {test.result.ping} ms - {getPingQuality(test.result.ping).label}
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 - (test.result.ping / 2))} className="h-2" />
                  </div>
                )}
                
                {test.result.jitter && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-mono">Jitter</span>
                    <span className="font-semibold font-mono text-blue-400">{test.result.jitter} ms</span>
                  </div>
                )}
                
                {test.result.packetLoss && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 font-mono">Perda de Pacotes</span>
                    <span className="font-semibold font-mono text-blue-400">{test.result.packetLoss.toFixed(2)}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Ações */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => runTest(test)}
                disabled={test.status === 'running' || isRunning}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${test.status === 'running' ? 'animate-spin' : ''}`} />
                {test.status === 'running' ? 'Testando...' : 'Testar'}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => openTestInNewTab(test)}
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              >
                <Globe className="h-4 w-4 mr-1" />
                Abrir Site
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedTest(test)}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <Activity className="h-4 w-4 mr-1" />
                Detalhes
              </Button>
            </div>

            {/* Último Teste */}
            {test.lastTest && (
              <div className="mt-3 pt-3 border-t border-gray-700/30">
                <p className="text-xs text-gray-500 font-mono">
                  Último teste: {test.lastTest.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Detalhes */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-dark p-6 rounded-lg border-blue-500/30 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-mono text-white">{selectedTest.name}</h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedTest(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold font-mono text-white mb-2">Descrição</h3>
                <p className="text-gray-300 font-mono">{selectedTest.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold font-mono text-white mb-2">URL do Teste</h3>
                <p className="text-blue-400 font-mono">{selectedTest.url}</p>
              </div>
              
              {selectedTest.result && (
                <div>
                  <h3 className="text-lg font-semibold font-mono text-white mb-2">Resultados Detalhados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTest.result.download && (
                      <div className="p-4 bg-gray-800/60 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Download className="h-5 w-5 text-green-400" />
                          <span className="font-semibold text-white">Download</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400">{selectedTest.result.download} Mbps</p>
                        <p className="text-sm text-gray-400">{getSpeedQuality(selectedTest.result.download).label}</p>
                      </div>
                    )}
                    
                    {selectedTest.result.upload && (
                      <div className="p-4 bg-gray-800/60 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Upload className="h-5 w-5 text-blue-400" />
                          <span className="font-semibold text-white">Upload</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-400">{selectedTest.result.upload} Mbps</p>
                        <p className="text-sm text-gray-400">{getSpeedQuality(selectedTest.result.upload).label}</p>
                      </div>
                    )}
                    
                    {selectedTest.result.ping && (
                      <div className="p-4 bg-gray-800/60 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="h-5 w-5 text-yellow-400" />
                          <span className="font-semibold text-white">Ping</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-400">{selectedTest.result.ping} ms</p>
                        <p className="text-sm text-gray-400">{getPingQuality(selectedTest.result.ping).label}</p>
                      </div>
                    )}
                    
                    {selectedTest.result.jitter && (
                      <div className="p-4 bg-gray-800/60 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-5 w-5 text-purple-400" />
                          <span className="font-semibold text-white">Jitter</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-400">{selectedTest.result.jitter} ms</p>
                        <p className="text-sm text-gray-400">Variação de Latência</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2 pt-4 border-t border-gray-700/30">
                <Button
                  onClick={() => runTest(selectedTest)}
                  disabled={selectedTest.status === 'running'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Executar Teste
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openTestInNewTab(selectedTest)}
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Abrir no Navegador
                </Button>
              </div>
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
              <p className="text-sm text-gray-400 font-mono">Total de Testes</p>
              <p className="text-2xl font-bold text-blue-400 font-mono">{tests.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Concluídos</p>
              <p className="text-2xl font-bold text-green-400 font-mono">
                {tests.filter(test => test.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-yellow-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Em Execução</p>
              <p className="text-2xl font-bold text-yellow-400 font-mono">
                {tests.filter(test => test.status === 'running').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card-dark p-4 rounded-lg border-red-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm text-gray-400 font-mono">Falharam</p>
              <p className="text-2xl font-bold text-red-400 font-mono">
                {tests.filter(test => test.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTestTab; 