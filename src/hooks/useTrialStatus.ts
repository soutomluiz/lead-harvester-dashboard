import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTrialStatus(userProfile: any) {
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

  const checkLeadLimit = () => {
    // Admin users, premium users, and users in trial have no limits
    if (isAdmin || isPremium || isTrialValid) {
      return true;
    }

    // Free users get 10 leads per month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const extractionDate = userProfile?.last_extraction_reset;
    
    if (!extractionDate || 
        new Date(extractionDate).getMonth() !== currentMonth || 
        new Date(extractionDate).getFullYear() !== currentYear) {
      return true; // New month, reset counter
    }

    return (userProfile?.extracted_leads_count || 0) < 10;
  };

  return {
    isTrialValid,
    checkLeadLimit,
    isFreePlan: !isAdmin && !isPremium && !isTrialValid,
    isAdmin,
    isPremium
  };
}