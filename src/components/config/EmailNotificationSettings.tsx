import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export function EmailNotificationSettings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("emailNotifications")}</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="new-lead" />
          <Label htmlFor="new-lead">{t("newLeadNotification")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="lead-status" />
          <Label htmlFor="lead-status">{t("leadStatusNotification")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="daily-summary" />
          <Label htmlFor="daily-summary">{t("dailySummaryNotification")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="weekly-report" />
          <Label htmlFor="weekly-report">{t("weeklyReportNotification")}</Label>
        </div>
      </div>
    </div>
  );
}