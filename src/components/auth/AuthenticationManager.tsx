import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthenticationManagerProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: any) => void;
  children: React.ReactNode;
}

export function AuthenticationManager({ onAuthStateChange, children }: AuthenticationManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Forcing logout...");
      await supabase.auth.signOut();
      console.log("Logout successful");
      onAuthStateChange(false);
      navigate('/login');
    } catch (error: any) {
      console.error("Error in handleLogout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair. Por favor, tente novamente.",
      });
    }
  };

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
        throw error;
      }

      console.log("Profile fetched successfully:", profile);
      return profile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Starting authentication check...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            onAuthStateChange(false);
            setIsLoading(false);
            navigate('/login');
          }
          return;
        }

        console.log("Active session found:", session);
        
        if (mounted) {
          try {
            const profile = await fetchUserProfile(session.user.id);
            onAuthStateChange(true, profile);
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
            await handleLogout();
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Error in checkAuth:", error);
        
        if (mounted) {
          const errorMessage = error.message || error.error?.message || '';
          const isAuthError = errorMessage.includes('Invalid Refresh Token') || 
                            errorMessage.includes('JWT expired') ||
                            errorMessage.includes('JWT invalid') ||
                            errorMessage.includes('refresh_token_not_found');
          
          if (isAuthError) {
            console.log("Auth error detected, logging out...");
            await handleLogout();
          }
          
          setIsLoading(false);
          navigate('/login');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session ended");
        onAuthStateChange(false);
        navigate('/login');
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, fetching profile...");
        setIsLoading(true);
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            onAuthStateChange(true, profile);
            navigate('/');
          }
        } catch (error) {
          console.error("Error fetching profile after sign in:", error);
          if (mounted) {
            await handleLogout();
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    });

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onAuthStateChange, navigate]);

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