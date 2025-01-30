import { useEffect, useState } from "react";
import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { ExtractionCards } from "@/components/ExtractionCards";
import { LeadCards } from "@/components/LeadCards";
import { DashboardStats } from "@/components/DashboardStats";
import { LeadsList } from "@/components/leads/LeadsList";
import { LeadScorePage } from "@/components/leads/LeadScorePage";
import { LeadTimeline } from "@/components/leads/LeadTimeline";
import { ReportsPage } from "@/components/reports/ReportsPage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Lead } from "@/types/lead";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface DashboardProps {
  activeTab: string;
  leads: Lead[];
  onSubmit: (data: any) => void;
  onAddLeads: (leads: Lead[]) => void;
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ activeTab, leads, onSubmit, onAddLeads, setActiveTab }: DashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchType = activeTab.includes("prospect-places") 
    ? "places" 
    : activeTab.includes("prospect-websites") 
    ? "websites" 
    : undefined;

  const { data: dbLeads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const typedLeads: Lead[] = (data || []).map(lead => ({
          ...lead,
          type: lead.type as 'website' | 'place' | 'manual',
          status: (lead.status || 'new') as 'new' | 'qualified' | 'unqualified' | 'open',
          deal_value: lead.deal_value || 0
        }));

        return typedLeads;
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
        toast({
          title: "Erro ao carregar leads",
          description: "Não foi possível carregar seus leads. Por favor, tente novamente.",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });

  useEffect(() => {
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['leads'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filteredLeads = dbLeads.filter((lead) => {
    if (activeTab === "leads-manual") return lead.type === 'manual';
    if (activeTab === "leads-places") return lead.type === 'place';
    if (activeTab === "leads-websites") return lead.type === 'website';
    return true;
  });

  return (
    <div className="w-full bg-background">
      {activeTab === "dashboard" && (
        <DashboardStats leads={dbLeads} />
      )}
      {activeTab === "reports" && (
        <ReportsPage />
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
        <LeadTable leads={filteredLeads} />
      )}
      {activeTab === "prospect" && (
        <ExtractionCards setActiveTab={setActiveTab} />
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