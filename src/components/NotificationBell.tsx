import { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  action?: {
    type: 'navigate' | 'mark_read';
    path?: string;
    tab?: string;
  };
}

export function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      message: "Bem-vindo ao Lead Harvester! Comece importando seus leads.",
      read: false,
      type: 'info',
      timestamp: new Date(),
      action: {
        type: 'navigate',
        tab: 'prospect'
      }
    },
    {
      id: "2",
      message: "Dica: Configure seu webhook para integração automática com seu CRM.",
      read: false,
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      action: {
        type: 'navigate',
        tab: 'config'
      }
    },
    {
      id: "3",
      message: "Novo: Exporte seus leads em formato CSV ou Excel.",
      read: false,
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      action: {
        type: 'navigate',
        tab: 'leads-all'
      }
    },
    {
      id: "4",
      message: "Lembrete: Complete seu perfil para melhor experiência.",
      read: false,
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      action: {
        type: 'navigate',
        tab: 'config'
      }
    },
    {
      id: "5",
      message: "Dica: Use tags para organizar seus leads por categoria.",
      read: false,
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      action: {
        type: 'mark_read'
      }
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.action?.type === 'navigate' && notification.action.tab) {
      // Navigate to the specified tab
      window.dispatchEvent(new CustomEvent('setActiveTab', { detail: notification.action.tab }));
    }
    
    // Mark as read in both cases
    markAsRead(notification.id);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true }))
    );
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-semibold">Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`px-4 py-3 cursor-pointer ${
                  notification.read ? 'opacity-60' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                      {notification.message}
                    </span>
                    {!notification.read && (
                      <Badge variant="secondary" className="h-2 w-2 rounded-full" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Nenhuma notificação
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}