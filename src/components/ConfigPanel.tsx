import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ConfigPanel = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("searchApiKey") || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira sua chave de API do Google Maps.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("searchApiKey", apiKey.trim());
    
    toast({
      title: "Configurações salvas",
      description: "Sua chave de API do Google Maps foi salva com sucesso.",
    });
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast({
        title: "Configuração necessária",
        description: "Por favor, configure sua chave de API do Google Maps antes de testar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Testando conexão",
      description: "Aguarde enquanto testamos sua configuração...",
    });

    try {
      const { data, error } = await supabase.functions.invoke('google-places-search', {
        body: {
          query: 'restaurants in São Paulo',
          apiKey: apiKey
        }
      });

      if (error) throw error;

      if (data.status === "REQUEST_DENIED") {
        throw new Error("Chave de API inválida ou sem permissões necessárias");
      }

      toast({
        title: "Conexão bem-sucedida",
        description: "Sua configuração da API do Google Maps está funcionando corretamente.",
      });
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      toast({
        title: "Erro na conexão",
        description: error instanceof Error ? error.message : "Verifique sua chave de API do Google Maps.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Configurações da API do Google Maps</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Chave da API do Google Maps
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Insira sua chave de API do Google Maps"
            className="font-mono"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
            Salvar Configurações
          </Button>
          <Button 
            onClick={handleTestConnection} 
            variant="secondary" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Testando..." : "Testar Conexão"}
          </Button>
        </div>
      </div>
    </Card>
  );
};