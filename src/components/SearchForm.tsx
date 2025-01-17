import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        <Search className="mr-2 h-4 w-4" />
        {isLoading ? "Buscando..." : "Buscar"}
      </Button>
    </form>
  );
};