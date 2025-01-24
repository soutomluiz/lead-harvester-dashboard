import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function AuthStateManager({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.access_token && mounted) {
          console.log("Active session found, redirecting...");
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Ocorreu um erro ao verificar sua sessão. Por favor, tente novamente.",
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    let authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting...");
        setError(null);
        navigate('/', { replace: true });
      }
    });

    checkSession();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return children;
}