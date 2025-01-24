import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { LeadTable } from "@/components/LeadTable";
import { ListChecks, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchLeads = async () => {
  console.log("Fetching leads for LeadsList...");
  
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

export function LeadsList() {
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
    queryKey: ['leads-list'],
    queryFn: fetchLeads,
    retry: 1,
    enabled: isAuthenticated === true
  });

  console.log("LeadsList render:", { leads, isLoading, error, isAuthenticated });

  if (error) {
    console.error("Error in LeadsList:", error);
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
        <ListChecks className="h-12 w-12 mb-4" />
        <p>Erro ao carregar leads</p>
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
        <ListChecks className="h-12 w-12 mb-4" />
        <p>Nenhum lead encontrado</p>
      </div>
    );
  }

  return <LeadTable leads={leads} />;
}