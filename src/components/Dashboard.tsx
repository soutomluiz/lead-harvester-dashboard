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
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  activeTab: string;
  leads: Lead[];
  onSubmit: (data: any) => void;
  onAddLeads: (leads: Lead[]) => void;
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ activeTab, leads, onSubmit, onAddLeads, setActiveTab }: DashboardProps) {
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchType = activeTab.includes("prospect-places") 
    ? "places" 
    : activeTab.includes("prospect-websites") 
    ? "websites" 
    : undefined;

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return false;
      }
      return true;
    };

    const fetchLeads = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) return;

        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const typedLeads: Lead[] = (data || []).map(lead => ({
          ...lead,
          type: lead.type as 'website' | 'place' | 'manual',
          status: (lead.status || 'new') as 'new' | 'qualified' | 'unqualified' | 'open',
          deal_value: lead.deal_value || 0,
          tags: lead.tags || []
        }));

        setDbLeads(typedLeads);
        console.log("Leads carregados com sucesso:", typedLeads);
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
        toast({
          title: "Erro ao carregar leads",
          description: "Não foi possível carregar seus leads. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const setupRealtimeSubscription = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;

      try {
        channel = supabase
          .channel('leads-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'leads'
            },
            (payload) => {
              console.log('Atualização em tempo real recebida:', payload);
              fetchLeads();
            }
          )
          .subscribe((status) => {
            console.log('Status da inscrição do canal:', status);
          });
      } catch (error) {
        console.error('Erro ao configurar inscrição em tempo real:', error);
      }
    };

    fetchLeads();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [toast, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <LeadTable 
          leads={dbLeads.filter(lead => {
            if (activeTab === "leads-manual") return lead.type === 'manual';
            if (activeTab === "leads-places") return lead.type === 'place';
            if (activeTab === "leads-websites") return lead.type === 'website';
            return true;
          })} 
        />
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