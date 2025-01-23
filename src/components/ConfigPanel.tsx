import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NotificationSettings } from "./config/NotificationSettings";
import { WebhookSettings } from "./config/WebhookSettings";
import { ThemeSettings } from "./config/ThemeSettings";
import { LanguageSettings } from "./config/LanguageSettings";
import { ExportSettings } from "./config/ExportSettings";
import { DisplaySettings } from "./config/DisplaySettings";
import { CalendarSettings } from "./config/CalendarSettings";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ConfigPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleApplySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save settings to localStorage or your preferred storage
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula um delay para feedback visual
      
      toast({
        title: t("settingsApplied"),
        description: t("success"),
      });
    } catch (error) {
      console.error("Erro ao aplicar configurações:", error);
      toast({
        title: t("error"),
        description: t("settingsError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t("settings")}</h2>
      
      <form onSubmit={handleApplySettings} data-config-panel>
        <Card className="p-6">
          <div className="space-y-8">
            <WebhookSettings />
            <NotificationSettings />
            <CalendarSettings />
            <ExportSettings />
            <DisplaySettings />
            <ThemeSettings />
            <LanguageSettings />
            
            <div className="pt-4 border-t">
              <Button 
                type="submit"
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  t("applySettings")
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}