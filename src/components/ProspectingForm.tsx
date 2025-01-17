import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchForm } from "./SearchForm";
import { SearchResults } from "./SearchResults";

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
  rating: number;
  user_ratings_total: number;
  opening_date: string;
}

export const ProspectingForm = ({
  onAddLeads,
}: {
  onAddLeads: (leads: any[]) => void;
}) => {
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
        description:
          "Por favor, configure a API nas configurações antes de realizar buscas.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "google-places-search",
        {
          body: {
            query: searchQuery,
            apiKey: apiKey,
          },
        }
      );

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
          rating: result.rating || 0,
          user_ratings_total: result.user_ratings_total || 0,
          opening_date: result.opening_date || "",
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
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível realizar a busca. Verifique suas configurações e tente novamente.",
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
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      opening_date: result.opening_date,
    }));

    onAddLeads(newLeads);
    toast({
      title: "Leads adicionados",
      description: `${newLeads.length} leads foram adicionados à sua lista`,
    });
  };

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <SearchForm
        industry={industry}
        location={location}
        isLoading={isLoading}
        onIndustryChange={setIndustry}
        onLocationChange={setLocation}
        onSubmit={handleSearch}
      />
      <SearchResults results={results} onAddToLeads={handleAddToLeads} />
    </Card>
  );
};