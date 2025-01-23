import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface AdvancedSearchFormProps {
  onSearch: (params: {
    type: 'competitors' | 'opportunities',
    industry?: string,
    location?: string,
    radius?: number
  }) => void;
  isLoading: boolean;
}

export const AdvancedSearchForm = ({
  onSearch,
  isLoading
}: AdvancedSearchFormProps) => {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState([5]); // km

  const handleCompetitorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'competitors',
      industry,
      location,
      radius: radius[0]
    });
  };

  const handleOpportunitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: 'opportunities',
      industry,
      location,
      radius: radius[0]
    });
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="competitors">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="competitors">Buscar Concorrentes</TabsTrigger>
          <TabsTrigger value="opportunities">Buscar Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors">
          <form onSubmit={handleCompetitorSearch} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Nicho de Atuação</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Ex: Restaurantes, Academias..."
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label>Localização</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Raio de Busca: {radius}km</Label>
                <Slider
                  value={radius}
                  onValueChange={setRadius}
                  min={1}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Buscando..." : "Buscar Concorrentes"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="opportunities">
          <form onSubmit={handleOpportunitySearch} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Nicho de Atuação</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Ex: Restaurantes, Academias..."
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label>Localização</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Raio de Busca: {radius}km</Label>
                <Slider
                  value={radius}
                  onValueChange={setRadius}
                  min={1}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Buscando..." : "Buscar Oportunidades"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};