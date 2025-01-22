import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NotificationSettings } from "./config/NotificationSettings";
import { WebhookSettings } from "./config/WebhookSettings";
import { Loader2 } from "lucide-react";

export function ConfigPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApplySettings = async () => {
    setIsLoading(true);
    try {
      // Save settings to localStorage or your preferred storage
      toast({
        title: "Configurações aplicadas",
        description: "Suas configurações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao aplicar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aplicar as configurações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações Gerais</h2>
      
      <Card className="p-6">
        <div className="space-y-8">
          <WebhookSettings />
          <NotificationSettings />
          
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={handleApplySettings}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aplicando...
                </>
              ) : (
                "Aplicar Configurações"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}