import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const { toast } = useToast();

  const handleNotificationChange = (checked: boolean) => {
    setEmailNotifications(checked);
    console.log("Email notifications:", checked);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Configuração de Notificações</h3>
      <div className="flex items-center space-x-2">
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={handleNotificationChange}
        />
        <Label htmlFor="email-notifications">Ativar notificações por e-mail</Label>
      </div>
    </div>
  );
}