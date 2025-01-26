import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrialStatusBannerProps {
  userProfile: any;
}

export function TrialStatusBanner({ userProfile }: TrialStatusBannerProps) {
  const [isTrialValid, setIsTrialValid] = useState<boolean>(false);

  useEffect(() => {
    const checkTrialStatus = async () => {
      if (userProfile) {
        const { data: trialValid } = await supabase
          .rpc('is_valid_trial', { user_profile_id: userProfile.id });
        
        setIsTrialValid(trialValid);
      }
    };

    checkTrialStatus();
  }, [userProfile]);

  if (!userProfile) return null;

  if (userProfile.subscription_type === 'trial') {
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

  if (userProfile.subscription_type === 'free' && !isTrialValid) {
    return (
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Plano Gratuito: Você pode extrair até 10 leads no total.
          Leads extraídos: {userProfile.extracted_leads_count || 0}/10
        </p>
      </div>
    );
  }

  return null;
}