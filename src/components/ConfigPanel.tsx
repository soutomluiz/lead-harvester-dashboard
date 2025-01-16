import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const ConfigPanel = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("searchApiKey") || "");
  const [searchEndpoint, setSearchEndpoint] = useState(() => localStorage.getItem("searchEndpoint") || "");
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem("searchApiKey", apiKey);
    localStorage.setItem("searchEndpoint", searchEndpoint);
    
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de API foram salvas com sucesso.",
    });
  };

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Configurações da API</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            Chave da API
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Insira sua chave de API"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endpoint" className="text-sm font-medium">
            Endpoint de Busca
          </label>
          <Input
            id="endpoint"
            value={searchEndpoint}
            onChange={(e) => setSearchEndpoint(e.target.value)}
            placeholder="https://api.exemplo.com/search"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Salvar Configurações
        </Button>
      </div>
    </Card>
  );
};