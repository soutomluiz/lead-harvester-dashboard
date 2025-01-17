import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  title: string;
  link: string;
  description: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  keyword: string;
  city: string;
  extractionDate: string;
}

export const ProspectingForm = ({ onAddLeads }: { onAddLeads: (leads: any[]) => void }) => {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const apiKey = localStorage.getItem("searchApiKey");
    const searchQuery = `${industry} em ${location}`;

    if (!apiKey) {
      toast({
        title: "Configuração necessária",
        description: "Por favor, configure a API nas configurações antes de realizar buscas.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('google-places-search', {
        body: {
          query: searchQuery,
          apiKey: apiKey
        }
      });

      if (error) throw error;

      if (data.status === "REQUEST_DENIED") {
        throw new Error("Chave de API inválida ou sem permissões necessárias");
      }

      if (data.results && Array.isArray(data.results)) {
        const formattedResults = data.results.map((result: any) => ({
          title: result.name,
          link: `https://www.google.com/maps/place/?q=place_id:${result.place_id}`,
          description: result.formatted_address || "Endereço não disponível",
          companyName: result.name,
          address: result.formatted_address || "",
          phone: result.formatted_phone_number || "",
          email: result.email || "",
          keyword: industry,
          city: location,
          extractionDate: new Date().toISOString(),
        }));

        setResults(formattedResults);
        toast({
          title: "Busca realizada com sucesso",
          description: `Encontrados ${formattedResults.length} resultados`,
        });
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      toast({
        title: "Erro na busca",
        description: error instanceof Error ? error.message : "Não foi possível realizar a busca. Verifique suas configurações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToLeads = () => {
    const newLeads = results.map((result, index) => ({
      id: Date.now() + index,
      companyName: result.companyName,
      industry: result.keyword,
      location: result.city,
      address: result.address,
      contactName: "",
      email: result.email,
      phone: result.phone,
      extractionDate: result.extractionDate,
    }));

    onAddLeads(newLeads);
    toast({
      title: "Leads adicionados",
      description: `${newLeads.length} leads foram adicionados à sua lista`,
    });
  };

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="industry" className="text-sm font-medium">
              Nicho de Atuação
            </label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Ex: Restaurantes, Academias..."
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Localização
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: São Paulo, SP"
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Resultados da Busca</h3>
            <Button onClick={handleAddToLeads} variant="secondary">
              Adicionar à Lista de Leads
            </Button>
          </div>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index} className="p-4">
                <h4 className="font-medium">{result.companyName}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <p className="text-sm"><strong>Endereço:</strong> {result.address}</p>
                  <p className="text-sm"><strong>Telefone:</strong> {result.phone || "Não disponível"}</p>
                  <p className="text-sm"><strong>Email:</strong> {result.email || "Não disponível"}</p>
                  <p className="text-sm"><strong>Cidade:</strong> {result.city}</p>
                  <p className="text-sm"><strong>Palavra-chave:</strong> {result.keyword}</p>
                  <p className="text-sm"><strong>Data de Exportação:</strong> {new Date(result.extractionDate).toLocaleDateString()}</p>
                </div>
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                >
                  Visitar no Google Maps
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};