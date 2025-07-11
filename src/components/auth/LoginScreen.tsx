
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MagnetLines from '@/components/animations/MagnetLines';

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(password)) {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao TaskFlow TI Hub!",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Verifique sua senha e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      {/* MagnetLines decorativo ao redor do card de senha */}
      <MagnetLines
        rows={9}
        columns={9}
        containerSize="60vmin"
        lineColor="tomato"
        lineWidth="0.8vmin"
        lineHeight="5vmin"
        baseAngle={0}
        style={{ margin: '2rem auto', zIndex: 2 }}
      />
      <Card className="w-full max-w-md bg-gray-900/90 backdrop-blur-sm border-blue-500/30 shadow-2xl shadow-blue-500/20 relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit border border-blue-500/30">
            <Code className="h-8 w-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            TaskFlow TI Hub
          </CardTitle>
          <p className="text-gray-300 font-mono">Digite sua senha para acessar o sistema</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-300 font-mono">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="text-center bg-gray-800/80 border-blue-500/30 text-blue-300 placeholder-gray-500 focus:border-blue-500/60 focus:ring-blue-500/20 font-mono"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
