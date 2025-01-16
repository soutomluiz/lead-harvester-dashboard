import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Key } from "lucide-react";

export const ConfigPanel = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("searchApiKey") || "");
  const [searchEndpoint, setSearchEndpoint] = useState(() => localStorage.getItem("searchEndpoint") || "");
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim() || !searchEndpoint.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validar se o endpoint é uma URL válida
      new URL(searchEndpoint);
      
      localStorage.setItem("searchApiKey", apiKey.trim());
      localStorage.setItem("searchEndpoint", searchEndpoint.trim());
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações de API foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira um endpoint válido (ex: https://api.exemplo.com)",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey || !searchEndpoint) {
      toast({
        title: "Configuração necessária",
        description: "Por favor, configure a API antes de testar a conexão.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Testando conexão",
      description: "Aguarde enquanto testamos sua configuração...",
    });

    try {
      const response = await fetch(searchEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Conexão bem-sucedida",
          description: "Sua configuração de API está funcionando corretamente.",
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com a API. Verifique suas configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Configurações da API</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Chave da API
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Insira sua chave de API"
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endpoint" className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Endpoint de Busca
          </label>
          <Input
            id="endpoint"
            value={searchEndpoint}
            onChange={(e) => setSearchEndpoint(e.target.value)}
            placeholder="https://api.exemplo.com/search"
            className="font-mono"
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