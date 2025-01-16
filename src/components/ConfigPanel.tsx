import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Key } from "lucide-react";

export const ConfigPanel = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("searchApiKey") || "");
  const [searchEndpoint, setSearchEndpoint] = useState(() => localStorage.getItem("searchEndpoint") || "https://maps.googleapis.com/maps/api/place/textsearch/json");
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
    localStorage.setItem("searchEndpoint", searchEndpoint.trim());
    
    toast({
      title: "Configurações salvas",
      description: "Suas configurações da API do Google Maps foram salvas com sucesso.",
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

    toast({
      title: "Testando conexão",
      description: "Aguarde enquanto testamos sua configuração...",
    });

    try {
      // Montando a URL de teste com um query simples
      const testUrl = `${searchEndpoint}?query=restaurants+in+São+Paulo&key=${apiKey}`;
      
      const response = await fetch(testUrl);
      const data = await response.json();

      if (response.ok && data.status !== "REQUEST_DENIED") {
        toast({
          title: "Conexão bem-sucedida",
          description: "Sua configuração da API do Google Maps está funcionando corretamente.",
        });
      } else {
        throw new Error(data.error_message || "Erro na autenticação com o Google Maps");
      }
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: error instanceof Error ? error.message : "Verifique sua chave de API do Google Maps.",
        variant: "destructive",
      });
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

        <div className="space-y-2">
          <label htmlFor="endpoint" className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Endpoint do Google Maps Places API
          </label>
          <Input
            id="endpoint"
            value={searchEndpoint}
            onChange={(e) => setSearchEndpoint(e.target.value)}
            placeholder="https://maps.googleapis.com/maps/api/place/textsearch/json"
            className="font-mono"
            readOnly
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            Salvar Configurações
          </Button>
          <Button onClick={handleTestConnection} variant="secondary" className="flex-1">
            Testar Conexão
          </Button>
        </div>
      </div>
    </Card>
  );
};