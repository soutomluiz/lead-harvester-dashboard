import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

export function CalendarSettings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("calendarIntegration")}</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="calendar-sync" />
          <Label htmlFor="calendar-sync">{t("enableCalendarSync")}</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="calendar-url">{t("calendarUrl")}</Label>
          <Input 
            id="calendar-url" 
            type="url" 
            placeholder="https://calendar.google.com/..." 
          />
        </div>
      </div>
    </div>
  );
}