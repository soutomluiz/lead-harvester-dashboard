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
      console.log("AuthenticationManager: Fetching profile for user:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("AuthenticationManager: Error fetching profile:", error);
        throw error;
      }
      console.log("AuthenticationManager: Profile fetched successfully:", profile);
      return profile;
    } catch (error) {
      console.error("AuthenticationManager: Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("AuthenticationManager: Checking authentication status...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthenticationManager: Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("AuthenticationManager: No active session found");
          if (mounted) {
            onAuthStateChange(false);
            setIsLoading(false);
          }
          return;
        }

        console.log("AuthenticationManager: Active session found, fetching profile...");
        const profile = await fetchUserProfile(session.user.id);
        
        if (mounted) {
          onAuthStateChange(true, profile);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("AuthenticationManager: Error in checkAuth:", error);
        if (mounted) {
          onAuthStateChange(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthenticationManager: Auth state changed:", event);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        console.log("AuthenticationManager: User signed out or session ended");
        onAuthStateChange(false);
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log("AuthenticationManager: User signed in, fetching profile...");
        const profile = await fetchUserProfile(session.user.id);
        onAuthStateChange(true, profile);
      }
    });

    return () => {
      mounted = false;
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