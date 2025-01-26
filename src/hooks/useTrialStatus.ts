import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTrialStatus(userProfile: any) {
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

  const checkLeadLimit = () => {
    if (userProfile?.subscription_type === 'free' && !isTrialValid && userProfile?.extracted_leads_count >= 10) {
      return false;
    }
    return true;
  };

  return {
    isTrialValid,
    checkLeadLimit,
    isFreePlan: userProfile?.subscription_type === 'free' && !isTrialValid
  };
}