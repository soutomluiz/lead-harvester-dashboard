import { useEffect, useState } from "react";
import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { ExtractionCards } from "@/components/ExtractionCards";
import { LeadCards } from "@/components/LeadCards";
import { DashboardStats } from "@/components/DashboardStats";
import { KanbanBoard } from "@/components/KanbanBoard";
import { LeadsList } from "@/components/leads/LeadsList";
import { LeadScorePage } from "@/components/leads/LeadScorePage";
import { LeadTimeline } from "@/components/leads/LeadTimeline";
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

export function Dashboard({ activeTab, leads, onSubmit, onAddLeads, setActiveTab }: DashboardProps) {
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);
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

        const typedLeads: Lead[] = (data || []).map(lead => ({
          ...lead,
          type: lead.type as 'website' | 'place' | 'manual',
          status: (lead.status || 'new') as 'new' | 'qualified' | 'unqualified' | 'open',
          deal_value: lead.deal_value || 0
        }));

        setDbLeads(typedLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Erro ao carregar leads",
          description: "Não foi possível carregar seus leads. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    };

    fetchLeads();

    const channel = supabase
      .channel('public:leads')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('Atualização em tempo real:', payload);
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="w-full bg-background">
      {activeTab === "dashboard" && (
        <DashboardStats leads={dbLeads} />
      )}
      {activeTab === "pipeline" && (
        <KanbanBoard />
      )}
      {activeTab === "prospect" && (
        <ExtractionCards setActiveTab={setActiveTab} />
      )}
      {activeTab === "leads" && (
        <LeadCards setActiveTab={setActiveTab} />
      )}
      {activeTab === "leads-list" && (
        <LeadsList />
      )}
      {activeTab === "leads-score" && (
        <LeadScorePage />
      )}
      {activeTab === "leads-timeline" && (
        <LeadTimeline />
      )}
      {(activeTab === "leads-all" || 
        activeTab === "leads-manual" || 
        activeTab === "leads-places" || 
        activeTab === "leads-websites") && (
        <LeadTable 
          leads={dbLeads.filter(lead => {
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