import { useEffect, useState } from "react";
import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { ExtractionCards } from "@/components/ExtractionCards";
import { LeadCards } from "@/components/LeadCards";
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

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6 rounded-lg">
      {activeTab === "prospect" && (
        <ExtractionCards setActiveTab={setActiveTab} />
      )}
      {activeTab === "leads" && (
        <LeadCards setActiveTab={setActiveTab} />
      )}
      {(activeTab === "leads-all" || 
        activeTab === "leads-manual" || 
        activeTab === "leads-places" || 
        activeTab === "leads-websites") && (
        <LeadTable 
          leads={leads.filter(lead => {
            if (activeTab === "leads-manual") return lead.type === 'manual';
            if (activeTab === "leads-places") return lead.type === 'place';
            if (activeTab === "leads-websites") return lead.type === 'website';
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