import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionPanel() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  const [trialStatus, setTrialStatus] = useState<string | null>(null);
  const [trialStartDate, setTrialStartDate] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("No user found");
          return;
        }

        setUserEmail(user.email);

        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) {
          console.error("Error fetching user role:", roleError);
          return;
        }

        setIsAdmin(roleData?.role === 'admin');

        // Fetch subscription info from profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_type, trial_status, trial_start_date')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        if (profileData) {
          setSubscriptionType(profileData.subscription_type);
          setTrialStatus(profileData.trial_status);
          setTrialStartDate(profileData.trial_start_date);
        }

      } catch (error) {
        console.error("Error checking user role:", error);
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

  const handleSubscribe = async () => {
    try {
      setIsCheckoutLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para assinar."
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { price: 4990 },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        console.error('Error details:', error);
        let errorMessage;
        
        try {
          const errorBody = JSON.parse(error.message);
          errorMessage = errorBody.error || "Erro ao processar pagamento. Tente novamente.";
        } catch {
          errorMessage = "Erro ao processar pagamento. Tente novamente.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro",
          description: errorMessage
        });
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o processo de assinatura. Tente novamente mais tarde."
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const calculateTrialDaysLeft = () => {
    if (!trialStartDate) return 0;
    const start = new Date(trialStartDate);
    const now = new Date();
    const trialEndDate = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
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

  const renderSubscriptionStatus = () => {
    if (isAdmin) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Status da Assinatura</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span>Assinatura Vitalícia Ativa (Admin)</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Plano Admin</p>
                <p>Acesso vitalício a todas as funcionalidades da plataforma</p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (subscriptionType === 'trial' && trialStatus === 'active') {
      const daysLeft = calculateTrialDaysLeft();
      return (
        <Card>
          <CardHeader>
            <CardTitle>Status da Assinatura</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 text-blue-500">
                <AlertCircle className="h-5 w-5" />
                <span>Período de Teste em Andamento</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Teste Gratuito</p>
                <p>Você tem acesso a todas as funcionalidades por {daysLeft} dias</p>
                <p className="text-sm mt-2">
                  Início do teste: {new Date(trialStartDate!).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="default"
              onClick={handleSubscribe}
              disabled={isCheckoutLoading}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isCheckoutLoading ? "Processando..." : "Assinar Agora"}
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Status da Assinatura</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              <span>Plano Gratuito</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Funcionalidades Limitadas</p>
              <p>Faça upgrade para ter acesso a todas as funcionalidades</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="default"
            onClick={handleSubscribe}
            disabled={isCheckoutLoading}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isCheckoutLoading ? "Processando..." : "Fazer Upgrade"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <h1 className="text-3xl font-bold">Assinatura</h1>
      {renderSubscriptionStatus()}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Você possui uma assinatura vitalícia como administrador"
              : "Nenhum pagamento registrado ainda"}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}