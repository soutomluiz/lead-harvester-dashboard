import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function UserCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const FREE_TIER_LIMIT = 50; // Limite de leads gratuitos

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscar total de leads do usuário
        const { count, error } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (error) throw error;

        // Calcular créditos restantes
        const remainingCredits = FREE_TIER_LIMIT - (count || 0);
        setCredits(remainingCredits > 0 ? remainingCredits : 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar seus créditos.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCredits();
  }, [toast]);

  if (isLoading) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="px-3 py-1">
        <Coins className="w-4 h-4 mr-1" />
        <span>{credits} leads gratuitos</span>
      </Badge>
    </div>
  );
}