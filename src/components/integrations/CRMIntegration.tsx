import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export function CRMIntegration() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [zapierWebhook, setZapierWebhook] = useState("");
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
    const url = webhookUrl || zapierWebhook;
    if (!url) {
      toast({
        title: "Erro",
        description: "Por favor, configure primeiro a URL do webhook",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(url, {
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Integrações CRM</h2>
      
      <Tabs defaultValue="webhook" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="webhook">Webhook Personalizado</TabsTrigger>
          <TabsTrigger value="zapier">Zapier</TabsTrigger>
        </TabsList>

        <TabsContent value="webhook">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Selecione seu CRM
              </label>
              <Select
                value={selectedCrm}
                onValueChange={setSelectedCrm}
              >
                <SelectTrigger>
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
              <label className="block text-sm font-medium mb-2">
                URL do Webhook
              </label>
              <Input
                type="url"
                placeholder="https://seu-crm.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Insira a URL do webhook fornecida pelo seu CRM
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveWebhook} disabled={isLoading}>
                Salvar Configuração
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
        </TabsContent>

        <TabsContent value="zapier">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Webhook do Zapier
              </label>
              <Input
                type="url"
                placeholder="https://hooks.zapier.com/..."
                value={zapierWebhook}
                onChange={(e) => setZapierWebhook(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Crie um Zap no Zapier usando o trigger "Webhook" e cole a URL aqui
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSaveWebhook} 
                disabled={isLoading}
              >
                Salvar Configuração
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestWebhook}
                disabled={isLoading || !zapierWebhook}
              >
                Testar Webhook
              </Button>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Como configurar:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Crie uma nova Zap no Zapier</li>
                <li>Escolha "Webhook" como trigger</li>
                <li>Selecione "Catch Hook"</li>
                <li>Copie a URL do webhook fornecida</li>
                <li>Cole a URL no campo acima</li>
                <li>Configure as ações no Zapier para seu CRM</li>
              </ol>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}