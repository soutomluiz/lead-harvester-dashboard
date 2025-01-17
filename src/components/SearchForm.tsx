import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface SearchFormProps {
  industry: string;
  location: string;
  isLoading: boolean;
  searchType: "places" | "websites";
  onIndustryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearchTypeChange: (value: "places" | "websites") => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchForm = ({
  industry,
  location,
  isLoading,
  searchType,
  onIndustryChange,
  onLocationChange,
  onSearchTypeChange,
  onSubmit,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex gap-4 justify-center mb-4">
        <Toggle
          pressed={searchType === "places"}
          onPressedChange={() => onSearchTypeChange("places")}
          className="data-[state=on]:bg-primary"
        >
          Google Places
        </Toggle>
        <Toggle
          pressed={searchType === "websites"}
          onPressedChange={() => onSearchTypeChange("websites")}
          className="data-[state=on]:bg-primary"
        >
          Websites
        </Toggle>
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