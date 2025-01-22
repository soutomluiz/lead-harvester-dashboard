import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { LeadTable } from "@/components/LeadTable";
import { ListChecks, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const fetchLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }

  return (data || []).map(lead => ({
    ...lead,
    type: (lead.type || 'manual') as 'website' | 'place' | 'manual',
    status: (lead.status || 'new') as 'new' | 'qualified' | 'unqualified' | 'open',
    deal_value: lead.deal_value || 0,
    tags: lead.tags || []
  }));
};

export function LeadsList() {
  const { toast } = useToast();
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads-list'],
    queryFn: fetchLeads,
  });

  if (error) {
    console.error("Error in LeadsList:", error);
    toast({
      title: "Erro ao carregar leads",
      description: "Não foi possível carregar a lista de leads.",
      variant: "destructive",
    });
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <ListChecks className="h-12 w-12 mb-4" />
        <p>Erro ao carregar leads</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <ListChecks className="h-12 w-12 mb-4" />
        <p>Nenhum lead encontrado</p>
      </div>
    );
  }

  return <LeadTable leads={leads} />;
}