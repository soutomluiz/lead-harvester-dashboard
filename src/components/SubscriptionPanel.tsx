import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminSubscriptionStatus } from "./subscription/AdminSubscriptionStatus";
import { TrialSubscriptionStatus } from "./subscription/TrialSubscriptionStatus";
import { FreeSubscriptionStatus } from "./subscription/FreeSubscriptionStatus";
import { PaymentHistory } from "./subscription/PaymentHistory";

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
        window.open(data.url, '_blank');
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
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <h1 className="text-3xl font-bold">Assinatura</h1>
      {isAdmin ? (
        <AdminSubscriptionStatus />
      ) : subscriptionType === 'trial' && trialStatus === 'active' ? (
        <TrialSubscriptionStatus
          trialStartDate={trialStartDate!}
          daysLeft={calculateTrialDaysLeft()}
          isCheckoutLoading={isCheckoutLoading}
          onSubscribe={handleSubscribe}
        />
      ) : (
        <FreeSubscriptionStatus
          isCheckoutLoading={isCheckoutLoading}
          onSubscribe={handleSubscribe}
        />
      )}
      <PaymentHistory isAdmin={isAdmin} />
    </div>
  );
}