import { useEffect, useState } from "react";
import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { Search, MapPin, Globe, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SearchResult } from "@/types/search";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Lead } from "@/types/lead";

interface DashboardProps {
  activeTab: string;
  leads: Lead[];
  onSubmit: (data: any) => void;
  onAddLeads: (leads: Lead[]) => void;
  setActiveTab: (tab: string) => void;
}

interface DashboardStatsProps {
  results: SearchResult[];
  searchType?: "places" | "websites";
}

export function DashboardStats({ results, searchType }: DashboardStatsProps) {
  if (searchType === "websites") {
    const totalWebsites = results.length;
    const websitesWithContact = results.filter(result => result.email || result.phone).length;
    const uniqueDomains = new Set(results.map(result => result.source)).size;

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-primary">Websites Encontrados</h3>
          <p className="text-3xl font-bold text-primary">{totalWebsites}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-primary">Com Informações de Contato</h3>
          <p className="text-3xl font-bold text-primary">{websitesWithContact}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-primary">Domínios Únicos</h3>
          <p className="text-3xl font-bold text-primary">{uniqueDomains}</p>
        </div>
      </div>
    );
  }

  const resultsWithRating = results.filter(result => result.rating !== undefined);
  const averageRating = resultsWithRating.length > 0
    ? (resultsWithRating.reduce((acc, curr) => acc + (curr.rating || 0), 0) / resultsWithRating.length).toFixed(1)
    : '0.0';

  const companiesWithWebsite = results.filter(result => result.website).length;
  const companiesWithPhone = results.filter(result => result.phone).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Empresas Encontradas</h3>
        <p className="text-3xl font-bold text-primary">{results.length}</p>
      </div>
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Média de Avaliações</h3>
        <p className="text-3xl font-bold text-primary">{averageRating}/5</p>
      </div>
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Com Telefone</h3>
        <p className="text-3xl font-bold text-primary">{companiesWithPhone}</p>
      </div>
    </div>
  );
}

export function Dashboard({ activeTab, onSubmit, onAddLeads, setActiveTab }: DashboardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { toast } = useToast();
  const searchType = activeTab.includes("prospect-places") 
    ? "places" 
    : activeTab.includes("prospect-websites") 
    ? "websites" 
    : undefined;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*');

        if (error) throw error;

        // Ensure the type field is properly typed
        const typedLeads = (data || []).map(lead => ({
          ...lead,
          type: lead.type as 'website' | 'place' | 'manual'
        }));

        setLeads(typedLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Error fetching leads",
          description: "Could not load your leads. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchLeads();
  }, [toast]);

  const renderLeadsOverview = () => {
    const manualLeads = leads.filter(lead => lead.type === 'manual');
    const placesLeads = leads.filter(lead => lead.type === 'place');
    const websiteLeads = leads.filter(lead => lead.type === 'website');

    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Seus Leads por Origem
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setActiveTab('prospect-manual-leads')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <UserPlus className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-medium">Leads Manuais</h3>
              <p className="text-3xl font-bold text-primary">{manualLeads.length}</p>
              <p className="text-gray-600">
                Leads adicionados manualmente através do formulário
              </p>
            </div>
          </Card>
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setActiveTab('prospect-places-leads')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <MapPin className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-medium">Google Places</h3>
              <p className="text-3xl font-bold text-primary">{placesLeads.length}</p>
              <p className="text-gray-600">
                Leads encontrados através do Google Places
              </p>
            </div>
          </Card>
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setActiveTab('prospect-websites-leads')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Globe className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-medium">Websites</h3>
              <p className="text-3xl font-bold text-primary">{websiteLeads.length}</p>
              <p className="text-gray-600">
                Leads encontrados através de websites
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6 rounded-lg">
      {activeTab === "prospect-leads" && renderLeadsOverview()}
      {(activeTab === "prospect-manual-leads" || 
        activeTab === "prospect-places-leads" || 
        activeTab === "prospect-websites-leads") && (
        <LeadTable 
          leads={leads.filter(lead => {
            if (activeTab === "prospect-manual-leads") return lead.type === 'manual';
            if (activeTab === "prospect-places-leads") return lead.type === 'place';
            if (activeTab === "prospect-websites-leads") return lead.type === 'website';
            return true;
          })} 
        />
      )}
      {activeTab === "prospect-form" && <LeadForm onSubmit={onSubmit} />}
      {(activeTab === "prospect-places" || activeTab === "prospect-websites") && (
        <ProspectingForm onAddLeads={onAddLeads} searchType={searchType} />
      )}
      {activeTab === "config" && <ConfigPanel />}
      {activeTab === "subscription" && <SubscriptionPanel />}
    </div>
  );
}