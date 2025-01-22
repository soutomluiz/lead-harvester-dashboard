import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { Timer, Loader2, Building2, Mail, Phone, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchLeads = async () => {
  console.log("Fetching leads for LeadTimeline...");
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }

  console.log("Leads fetched:", data);
  return (data || []).map(lead => ({
    ...lead,
    type: (lead.type || 'manual') as 'website' | 'place' | 'manual',
    status: (lead.status || 'new') as 'new' | 'qualified' | 'unqualified' | 'open',
    deal_value: lead.deal_value || 0,
    tags: lead.tags || []
  }));
};

export function LeadTimeline() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads-timeline'],
    queryFn: fetchLeads,
    retry: 1,
    enabled: isAuthenticated === true
  });

  console.log("LeadTimeline render:", { leads, isLoading, error, isAuthenticated });

  if (error) {
    console.error("Error in LeadTimeline:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao carregar leads";
    toast({
      title: "Erro ao carregar leads",
      description: errorMessage,
      variant: "destructive",
    });
    if (errorMessage.includes("No active session")) {
      navigate('/login');
      return null;
    }
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Timer className="h-12 w-12 mb-4" />
        <p>Erro ao carregar timeline</p>
      </div>
    );
  }

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
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
                {lead.created_at ? format(new Date(lead.created_at), "PPP 'às' p", { locale: ptBR }) : 'Data não disponível'}
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