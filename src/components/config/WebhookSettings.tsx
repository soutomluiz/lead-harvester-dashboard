import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedCrm, setSelectedCrm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do webhook",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('profiles')
        .update({ 
          webhook_url: webhookUrl,
          crm_type: selectedCrm 
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Webhook salvo com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar webhook:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, configure primeiro a URL do webhook",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          event: "test",
          timestamp: new Date().toISOString(),
          data: {
            message: "Teste de integração CRM",
          },
        }),
      });

      toast({
        title: "Teste enviado",
        description: "O webhook de teste foi enviado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Erro",
        description: "Não foi possível testar o webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Configuração de Webhook</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="crm-select">Selecione seu CRM</Label>
          <Select value={selectedCrm} onValueChange={setSelectedCrm}>
            <SelectTrigger id="crm-select">
              <SelectValue placeholder="Selecione um CRM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salesforce">Salesforce</SelectItem>
              <SelectItem value="hubspot">HubSpot</SelectItem>
              <SelectItem value="pipedrive">Pipedrive</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="webhook-url">URL do Webhook</Label>
          <Input
            id="webhook-url"
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://seu-crm.com/webhook"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveWebhook} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Webhook"
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTestWebhook}
            disabled={isLoading || !webhookUrl}
          >
            Testar Webhook
          </Button>
        </div>
      </div>
    </div>
  );
}