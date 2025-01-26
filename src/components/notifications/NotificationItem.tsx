import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  formatTimestamp: (dateStr: string) => string;
}

export function NotificationItem({ notification, onClick, formatTimestamp }: NotificationItemProps) {
  return (
    <DropdownMenuItem
      className={`px-4 py-3 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
      onClick={onClick}
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
          {formatTimestamp(notification.created_at)}
        </span>
      </div>
    </DropdownMenuItem>
  );
}