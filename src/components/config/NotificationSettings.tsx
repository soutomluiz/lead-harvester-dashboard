import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export function NotificationSettings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("notifications")}</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="browser-notifications" />
          <Label htmlFor="browser-notifications">{t("browserNotifications")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="sound-notifications" />
          <Label htmlFor="sound-notifications">{t("soundNotifications")}</Label>
        </div>
      </div>
    </div>
  );
}