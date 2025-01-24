import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthenticationManagerProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: any) => void;
  children: React.ReactNode;
}

export function AuthenticationManager({ onAuthStateChange, children }: AuthenticationManagerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("AuthenticationManager: Fetching profile for user:", userId);
      
      // Primeiro, verifica se o perfil existe
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("AuthenticationManager: Error fetching profile:", error);
        throw error;
      }

      // Se não encontrou perfil, cria um novo
      if (!profile) {
        console.log("AuthenticationManager: Creating new profile for user");
        const { data: session } = await supabase.auth.getSession();
        const user = session?.session?.user;
        
        if (!user) {
          console.error("AuthenticationManager: No user session found");
          return null;
        }

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("AuthenticationManager: Error creating profile:", createError);
          throw createError;
        }

        console.log("AuthenticationManager: New profile created:", newProfile);
        return newProfile;
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
        console.log("AuthenticationManager: Starting authentication check...");
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

        console.log("AuthenticationManager: Active session found:", session);
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
      console.log("AuthenticationManager: Auth state changed:", event, session);
      
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return children;
}