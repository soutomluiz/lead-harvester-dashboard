import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { LeadScore } from "@/components/leads/LeadScore";
import { Card } from "@/components/ui/card";
import { Award, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function LeadScorePage() {
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

        setLeads(data || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Erro ao carregar leads",
          description: "Não foi possível carregar os scores dos leads.",
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
        <Award className="h-12 w-12 mb-4" />
        <p>Nenhum lead encontrado para pontuação</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead) => (
        <Card key={lead.id} className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium">{lead.company_name}</h3>
              <p className="text-sm text-muted-foreground">{lead.industry || 'Indústria não especificada'}</p>
            </div>
          </div>
          <LeadScore lead={lead} />
        </Card>
      ))}
    </div>
  );
}