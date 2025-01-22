import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { LeadTable } from "@/components/LeadTable";
import { Loader2, ListChecks } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
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
          deal_value: lead.deal_value || 0,
          tags: lead.tags || []
        }));

        setLeads(typedLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Erro ao carregar leads",
          description: "Não foi possível carregar a lista de leads.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [toast]);

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