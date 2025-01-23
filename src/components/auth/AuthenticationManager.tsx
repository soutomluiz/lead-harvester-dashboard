import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthenticationManagerProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: any) => void;
  children: React.ReactNode;
}

export function AuthenticationManager({ onAuthStateChange, children }: AuthenticationManagerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          onAuthStateChange(false);
          setIsLoading(false);
          return;
        }

        const profile = await fetchUserProfile(session.user.id);
        onAuthStateChange(true, profile);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in checkAuth:", error);
        onAuthStateChange(false);
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        onAuthStateChange(false);
      } else if (event === 'SIGNED_IN' && session) {
        const profile = await fetchUserProfile(session.user.id);
        onAuthStateChange(true, profile);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onAuthStateChange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
}