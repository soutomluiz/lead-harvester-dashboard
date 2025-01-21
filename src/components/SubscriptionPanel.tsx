import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionPanel() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError) throw roleError;
        setIsAdmin(roleData?.role === 'admin');
      } catch (error) {
        console.error("Erro ao verificar papel do usuário:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível verificar seu status de assinatura.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [toast]);

  const handleCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para assinar.",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erro ao iniciar checkout:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o checkout. Tente novamente.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <h1 className="text-3xl font-bold">Assinatura</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <h1 className="text-3xl font-bold">Assinatura</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Status da Assinatura</CardTitle>
          <CardDescription>
            {isAdmin ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span>Assinatura Vitalícia Ativa (Admin)</span>
              </div>
            ) : (
              "Você ainda não possui uma assinatura ativa"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Plano Pro</p>
              <p>R$ 49,90/mês - Acesso a todas as funcionalidades da plataforma</p>
            </div>
          </div>
        </CardContent>
        {!isAdmin && (
          <CardFooter>
            <Button onClick={handleCheckout} className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Assinar Agora
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Você possui uma assinatura vitalícia como administrador do sistema" 
              : "Nenhum pagamento realizado ainda."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}