import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface ProspectingFormProps {
  onAddLeads: (leads: Lead[]) => void;
  searchType?: "places" | "websites";
}

export function ProspectingForm({ onAddLeads, searchType }: ProspectingFormProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isTrialValid, setIsTrialValid] = useState<boolean>(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          
          // Verificar se o trial é válido
          const { data: trialValid } = await supabase
            .rpc('is_valid_trial', { user_profile_id: profile.id });
          
          setIsTrialValid(trialValid);
        }
      }
    };

    fetchUserProfile();
  }, []);

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

    // Check if user is on free plan and has reached the limit
    if (userProfile?.subscription_type === 'free' && !isTrialValid && userProfile?.extracted_leads_count >= 10) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de 10 leads no plano gratuito. Faça upgrade para continuar.",
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
          limit: userProfile?.subscription_type === 'free' && !isTrialValid ? 10 : undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Limit results for free users
      const limitedResults = userProfile?.subscription_type === 'free' && !isTrialValid
        ? data.results.slice(0, 10) 
        : data.results;
      
      setResults(limitedResults);

      if (limitedResults.length === 0) {
        toast({
          title: t("noResults"),
          description: t("tryDifferentSearch")
        });
      } else {
        toast({
          title: t("success"),
          description: userProfile?.subscription_type === 'free' && !isTrialValid
            ? `${limitedResults.length} resultados encontrados (limite do plano gratuito)`
            : t("resultsFound")
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

  const handleAddToLeads = async () => {
    // Check if adding these leads would exceed the free plan limit
    if (userProfile?.subscription_type === 'free' && !isTrialValid) {
      const remainingLeads = 10 - (userProfile.extracted_leads_count || 0);
      if (remainingLeads <= 0) {
        toast({
          title: "Limite atingido",
          description: "Você atingiu o limite de 10 leads no plano gratuito. Faça upgrade para continuar.",
          variant: "destructive",
        });
        return;
      }
      // Only add up to the remaining limit
      results.splice(remainingLeads);
    }

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
    
    // Update the extracted_leads_count in the profile
    if (userProfile) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          extracted_leads_count: (userProfile.extracted_leads_count || 0) + newLeads.length 
        })
        .eq('id', userProfile.id);

      if (error) {
        console.error('Error updating extracted_leads_count:', error);
      }
    }

    toast({
      title: t("success"),
      description: t("leadsAdded")
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6">
        {userProfile?.subscription_type === 'trial' && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Período de Trial: Você tem acesso completo a todas as funcionalidades por 14 dias.
              {userProfile.trial_start_date && (
                <span className="block mt-1">
                  Início do trial: {new Date(userProfile.trial_start_date).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        )}
        
        {userProfile?.subscription_type === 'free' && !isTrialValid && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Plano Gratuito: Você pode extrair até 10 leads no total.
              Leads extraídos: {userProfile.extracted_leads_count || 0}/10
            </p>
          </div>
        )}

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
            <Label htmlFor="location">{t("locationLabel")}</Label>
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
