import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SearchResult {
  title: string;
  link: string;
  description: string;
  companyName: string;
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

    try {
      // Simulated search results for demonstration
      // In a real implementation, this would make an API call to a search service
      const mockResults = [
        {
          title: `${industry} em ${location} - Empresa A`,
          link: "https://empresaa.com",
          description: "Descrição da empresa A especializada no setor.",
          companyName: "Empresa A"
        },
        {
          title: `${industry} em ${location} - Empresa B`,
          link: "https://empresab.com",
          description: "Descrição da empresa B especializada no setor.",
          companyName: "Empresa B"
        }
      ];

      setResults(mockResults);
      toast({
        title: "Busca realizada com sucesso",
        description: `Encontrados ${mockResults.length} resultados`,
      });
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca. Tente novamente.",
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
      industry: industry,
      location: location,
      contactName: "",
      email: "",
      phone: "",
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
                <h4 className="font-medium">{result.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                >
                  Visitar website
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};