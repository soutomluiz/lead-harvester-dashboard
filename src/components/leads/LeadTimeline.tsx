import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { Timer, Loader2, Building2, Mail, Phone, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const fetchLeads = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(lead => ({
    ...lead,
    type: lead.type as 'website' | 'place' | 'manual',
    status: (lead.status || 'new') as 'new' | 'qualified' | 'unqualified' | 'open',
    deal_value: lead.deal_value || 0,
    tags: lead.tags || []
  }));
};

export function LeadTimeline() {
  const { toast } = useToast();
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads-timeline'],
    queryFn: fetchLeads,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    toast({
      title: "Erro ao carregar leads",
      description: "Não foi possível carregar a timeline dos leads.",
      variant: "destructive",
    });
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Timer className="h-12 w-12 mb-4" />
        <p>Erro ao carregar timeline</p>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Timer className="h-12 w-12 mb-4" />
        <p>Nenhuma atividade encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{lead.company_name}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(lead.created_at || ''), "PPP 'às' p", { locale: ptBR })}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lead.email && (
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-1" />
                    {lead.email}
                  </span>
                )}
                {lead.phone && (
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1" />
                    {lead.phone}
                  </span>
                )}
                {lead.website && (
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 mr-1" />
                    {lead.website}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}