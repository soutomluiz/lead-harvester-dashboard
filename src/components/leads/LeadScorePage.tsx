import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { LeadScore } from "@/components/leads/LeadScore";
import { Award, Loader2, Mail, Phone, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchLeads = async () => {
  console.log("Fetching leads for LeadScorePage...");
  
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

export function LeadScorePage() {
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
    queryKey: ['leads-score'],
    queryFn: fetchLeads,
    retry: 1,
    enabled: isAuthenticated === true
  });

  console.log("LeadScorePage render:", { leads, isLoading, error, isAuthenticated });

  if (error) {
    console.error("Error in LeadScorePage:", error);
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
        <Award className="h-12 w-12 mb-4" />
        <p>Erro ao carregar scores</p>
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
            <div className="max-w-[70%]">
              <h3 className="font-medium truncate" title={lead.company_name}>{lead.company_name}</h3>
              <p className="text-sm text-muted-foreground truncate" title={lead.industry || 'Indústria não especificada'}>
                {lead.industry || 'Indústria não especificada'}
              </p>
            </div>
            <LeadScore lead={lead} />
          </div>
          <div className="space-y-2">
            {lead.email && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate" title={lead.email}>{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate" title={lead.phone}>{lead.phone}</span>
              </div>
            )}
            {lead.website && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate" title={lead.website}>{lead.website}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}