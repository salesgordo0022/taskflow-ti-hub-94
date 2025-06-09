
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Check, X, AlertTriangle, Info, CheckCircle, MessageCircle, Settings, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  sentViaWhatsApp?: boolean;
}

interface WhatsAppSettings {
  enabled: boolean;
  phoneNumber: string;
  autoSend: boolean;
}

const NotificationsPanel = () => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings>({
    enabled: false,
    phoneNumber: '',
    autoSend: false,
  });
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Tarefa Vencida',
      message: 'A tarefa "Implementar sistema ERP" está vencida há 2 dias',
      type: 'error',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      sentViaWhatsApp: true,
    },
    {
      id: '2',
      title: 'Sistema Implementado',
      message: 'O sistema CRM foi implementado com sucesso na Empresa Alpha',
      type: 'success',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
      sentViaWhatsApp: false,
    },
    {
      id: '3',
      title: 'Prazo Próximo',
      message: 'A tarefa "Backup do servidor" vence em 1 dia',
      type: 'warning',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      sentViaWhatsApp: true,
    },
    {
      id: '4',
      title: 'Nova Empresa Cadastrada',
      message: 'A empresa Beta Corp foi adicionada ao sistema',
      type: 'info',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: true,
      sentViaWhatsApp: false,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const sendWhatsAppNotification = async (notification: Notification) => {
    if (!whatsappSettings.enabled || !whatsappSettings.phoneNumber) {
      toast({
        title: "Erro",
        description: "Configure o WhatsApp nas configurações primeiro.",
        variant: "destructive",
      });
      return;
    }

    // Simulação de envio via WhatsApp
    console.log('Enviando notificação via WhatsApp:', {
      to: whatsappSettings.phoneNumber,
      message: `${notification.title}\n\n${notification.message}`,
    });

    // Marca a notificação como enviada via WhatsApp
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notification.id ? { ...notif, sentViaWhatsApp: true } : notif
      )
    );

    toast({
      title: "Enviado via WhatsApp",
      description: `Notificação "${notification.title}" enviada para ${whatsappSettings.phoneNumber}`,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "Todas as notificações marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };

  const saveWhatsAppSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do WhatsApp foram salvas com sucesso.",
    });
    setShowSettings(false);
  };

  const testWhatsAppConnection = () => {
    if (!whatsappSettings.phoneNumber) {
      toast({
        title: "Erro",
        description: "Digite um número de telefone primeiro.",
        variant: "destructive",
      });
      return;
    }

    // Simulação de teste de conexão
    toast({
      title: "Teste realizado",
      description: `Mensagem de teste enviada para ${whatsappSettings.phoneNumber}`,
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">Acompanhe todas as atualizações do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            WhatsApp
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Configurações do WhatsApp */}
      {showSettings && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Configurações do WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Habilitar notificações via WhatsApp</label>
              <Switch
                checked={whatsappSettings.enabled}
                onCheckedChange={(checked) =>
                  setWhatsappSettings(prev => ({ ...prev, enabled: checked }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Número do WhatsApp</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: +5511999999999"
                  value={whatsappSettings.phoneNumber}
                  onChange={(e) =>
                    setWhatsappSettings(prev => ({ ...prev, phoneNumber: e.target.value }))
                  }
                  disabled={!whatsappSettings.enabled}
                />
                <Button
                  onClick={testWhatsAppConnection}
                  variant="outline"
                  disabled={!whatsappSettings.enabled}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Digite o número com código do país (ex: +55 para Brasil)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Envio automático</label>
              <Switch
                checked={whatsappSettings.autoSend}
                onCheckedChange={(checked) =>
                  setWhatsappSettings(prev => ({ ...prev, autoSend: checked }))
                }
                disabled={!whatsappSettings.enabled}
              />
            </div>
            <p className="text-xs text-gray-500">
              Quando ativado, as notificações serão enviadas automaticamente via WhatsApp
            </p>

            <div className="flex gap-2 pt-4">
              <Button onClick={saveWhatsAppSettings} className="bg-green-600 hover:bg-green-700">
                Salvar Configurações
              </Button>
              <Button onClick={() => setShowSettings(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {notification.title}
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">Nova</Badge>
                      )}
                      {notification.sentViaWhatsApp && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          WhatsApp
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.timestamp.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {whatsappSettings.enabled && !notification.sentViaWhatsApp && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendWhatsAppNotification(notification)}
                      title="Enviar via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-gray-500">
              Você está em dia! Não há notificações pendentes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPanel;
