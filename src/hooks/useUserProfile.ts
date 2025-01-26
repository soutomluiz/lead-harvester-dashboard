import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } };

    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load user profile");
          return;
        }

        if (profile && mounted) {
          console.log("Profile loaded:", profile);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        toast.error("An unexpected error occurred");
      }
    };

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error checking session:", sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    try {
      authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_OUT' || !session) {
          if (mounted) {
            setIsAuthenticated(false);
            setUserProfile(null);
          }
        } else if (event === 'SIGNED_IN' && session) {
          if (mounted) {
            setIsAuthenticated(true);
            await fetchUserProfile(session.user.id);
          }
        }
      });
    } catch (error) {
      console.error("Error setting up auth subscription:", error);
    }

    return () => {
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  return {
    userProfile,
    isAuthenticated,
    isLoading
  };
}