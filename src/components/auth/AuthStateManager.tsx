import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AuthStateManagerProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: any) => void;
  children: React.ReactNode;
}

export function AuthStateManager({ onAuthStateChange, children }: AuthStateManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Checking session...");
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

        console.log("Active session found, redirecting...");
        
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (mounted) {
            onAuthStateChange(true, profile);
            setIsLoading(false);
            navigate('/');
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          if (mounted) {
            await supabase.auth.signOut();
            onAuthStateChange(false);
            setIsLoading(false);
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        if (mounted) {
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
        console.log("User signed in, redirecting...");
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (mounted) {
            onAuthStateChange(true, profile);
            navigate('/');
          }
        } catch (error) {
          console.error("Error fetching profile after sign in:", error);
          if (mounted) {
            await supabase.auth.signOut();
            onAuthStateChange(false);
            navigate('/login');
          }
        }
      }
    });

    checkSession();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate, onAuthStateChange, toast]);

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