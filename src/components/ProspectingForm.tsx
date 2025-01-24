import { useState } from "react";
import { Lead } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SearchResult } from "@/types/search";
import { DashboardStats } from "./DashboardStats";

interface ProspectingFormProps {
  onAddLeads: (leads: Lead[]) => void;
  searchType?: "places" | "websites";
}

export function ProspectingForm({ onAddLeads, searchType }: ProspectingFormProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: t("error"),
        description: t("searchTermRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = searchType === "places" 
        ? "/api/search/places"
        : "/api/search/websites";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          location: location.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);

      if (data.results.length === 0) {
        toast({
          title: t("noResults"),
          description: t("tryDifferentSearch")
        });
      } else {
        toast({
          title: t("success"),
          description: t("resultsFound", { count: data.results.length })
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: t("error"),
        description: t("searchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToLeads = () => {
    const newLeads: Lead[] = results.map(result => ({
      id: crypto.randomUUID(),
      company_name: result.companyName || result.name,
      industry: result.category || null,
      location: result.location || null,
      contact_name: null,
      email: result.email || null,
      phone: result.phone || null,
      website: result.website || null,
      address: result.address || null,
      type: searchType === "places" ? "place" : "website",
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      created_at: new Date().toISOString(),
      status: "new",
      deal_value: 0,
      tags: [],
    }));

    onAddLeads(newLeads);
    toast({
      title: t("success"),
      description: t("leadsAdded", { count: newLeads.length })
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">{t("searchTerm")}</Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("locationPlaceholder")}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("search")}
            </Button>
            {results.length > 0 && (
              <Button
                type="button"
                onClick={handleAddToLeads}
                disabled={isLoading}
                className="w-full"
              >
                {t("addToLeads")}
              </Button>
            )}
          </div>
        </form>
      </Card>

      {results.length > 0 && (
        <DashboardStats results={results} searchType={searchType} />
      )}
    </div>
  );
}