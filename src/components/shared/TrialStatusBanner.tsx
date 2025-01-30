import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrialStatusBannerProps {
  userProfile: any;
}

export function TrialStatusBanner({ userProfile }: TrialStatusBannerProps) {
  const [isTrialValid, setIsTrialValid] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (userProfile) {
        const { data: trialValid } = await supabase
          .rpc('is_valid_trial', { user_profile_id: userProfile.id });
        
        setIsTrialValid(trialValid);
      }
    };

    const checkUserRole = async () => {
      if (userProfile) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userProfile.id)
          .single();
        
        setIsAdmin(roleData?.role === 'admin');
      }
    };

    const checkSubscriptionStatus = () => {
      if (userProfile) {
        setIsPremium(userProfile.subscription_type === 'premium');
      }
    };

    checkTrialStatus();
    checkUserRole();
    checkSubscriptionStatus();
  }, [userProfile]);

  // Don't show banner for admin, premium users, or if no profile
  if (!userProfile || isAdmin || isPremium) return null;

  if (userProfile.subscription_type === 'trial' && isTrialValid) {
    return (
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Período de Trial: Você tem acesso completo a todas as funcionalidades por 14 dias.
          {userProfile.trial_start_date && (
            <span className="block mt-1">
              Início do trial: {new Date(userProfile.trial_start_date).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>
    );
  }

  // Only show this for free users who are not in trial
  if (userProfile.subscription_type === 'free' && !isTrialValid) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const extractionDate = userProfile.last_extraction_reset;
    const shouldResetCount = !extractionDate || 
      new Date(extractionDate).getMonth() !== currentMonth || 
      new Date(extractionDate).getFullYear() !== currentYear;
    
    const leadsCount = shouldResetCount ? 0 : (userProfile.extracted_leads_count || 0);

    return (
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Plano Gratuito: Você pode extrair até 10 leads por mês.
          Leads extraídos este mês: {leadsCount}/10
        </p>
      </div>
    );
  }

  return null;
}