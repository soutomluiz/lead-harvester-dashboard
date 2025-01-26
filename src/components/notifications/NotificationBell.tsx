import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Notification } from "@/types/notification";

export function NotificationBell() {
  const { notifications, isLoading, updateNotification, markAllAsRead } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.action_type === 'navigate' && notification.action_tab) {
      window.dispatchEvent(new CustomEvent('setActiveTab', { detail: notification.action_tab }));
    }
    await updateNotification.mutateAsync(notification.id);
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 animate-pulse" />
      </Button>
    );
  }

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
              onClick={() => markAllAsRead.mutate()}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                formatTimestamp={formatTimestamp}
              />
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