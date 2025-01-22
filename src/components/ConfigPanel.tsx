import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NotificationSettings } from "./config/NotificationSettings";
import { WebhookSettings } from "./config/WebhookSettings";
import { ThemeSettings } from "./config/ThemeSettings";
import { LanguageSettings } from "./config/LanguageSettings";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ConfigPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleApplySettings = async () => {
    setIsLoading(true);
    try {
      // Save settings to localStorage or your preferred storage
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
      
      <Card className="p-6">
        <div className="space-y-8">
          <WebhookSettings />
          <NotificationSettings />
          <ThemeSettings />
          <LanguageSettings />
          
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={handleApplySettings}
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
    </div>
  );
}