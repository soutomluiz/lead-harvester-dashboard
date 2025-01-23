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
      console.log("Fetching profile for user:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log("Profile fetched successfully:", profile);
      return profile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          if (mounted) {
            onAuthStateChange(false);
            setIsLoading(false);
          }
          return;
        }

        console.log("Active session found for user:", session.user.id);
        const profile = await fetchUserProfile(session.user.id);
        if (mounted) {
          onAuthStateChange(true, profile);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        if (mounted) {
          onAuthStateChange(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or no session");
        if (mounted) {
          onAuthStateChange(false);
        }
        return;
      }
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in:", session.user.id);
        const profile = await fetchUserProfile(session.user.id);
        if (mounted) {
          onAuthStateChange(true, profile);
        }
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