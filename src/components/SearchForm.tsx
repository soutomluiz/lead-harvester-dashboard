import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface SearchFormProps {
  industry: string;
  location: string;
  isLoading: boolean;
  searchType: "places" | "websites";
  onIndustryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchForm = ({
  industry,
  location,
  isLoading,
  searchType,
  onIndustryChange,
  onLocationChange,
  onSubmit,
}: SearchFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { industry, location, searchType });
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">
          Buscar em {searchType === "places" ? "Google Places" : "Websites"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="industry" className="text-sm font-medium">
            Nicho de Atuação
          </label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => onIndustryChange(e.target.value)}
            placeholder="Ex: Restaurantes, Academias..."
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Localização
          </label>
          <Input
            id="location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Ex: São Paulo, SP"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buscando...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </>
        )}
      </Button>
    </form>
  );
};