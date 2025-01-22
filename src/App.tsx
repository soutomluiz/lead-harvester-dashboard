import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthPage } from "@/components/AuthPage";
import { PricingPage } from "@/components/PricingPage";
import { SubscriptionSuccess } from "@/components/SubscriptionSuccess";
import Index from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth and clearing any stale sessions...");
        // First clear any potentially invalid sessions
        await supabase.auth.signOut();
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await handleAuthError("Erro ao verificar sessão");
          return;
        }

        if (!session) {
          console.log("No active session found");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Extra validation to ensure session is valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User validation error:", userError);
          await handleAuthError("Erro ao validar usuário");
          return;
        }

        console.log("Session validated successfully for user:", user.id);
        setIsAuthenticated(true);
        setIsLoading(false);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event);
          
          switch (event) {
            case 'SIGNED_OUT':
              console.log("User signed out");
              setIsAuthenticated(false);
              setIsLoading(false);
              break;

            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              if (!session) {
                console.error("No session after auth event:", event);
                await handleAuthError("Sessão inválida");
                return;
              }

              try {
                const { data: { user }, error: refreshError } = await supabase.auth.getUser();
                
                if (refreshError || !user) {
                  console.error("Session refresh error:", refreshError);
                  throw refreshError;
                }

                console.log("Session refreshed successfully for user:", user.id);
                setIsAuthenticated(true);
                setIsLoading(false);
                
                if (event === 'SIGNED_IN') {
                  toast({
                    title: "Login realizado",
                    description: "Bem-vindo de volta!",
                  });
                }
              } catch (error) {
                console.error("Session refresh error:", error);
                await handleAuthError("Erro ao atualizar sessão");
              }
              break;

            default:
              console.log("Unhandled auth event:", event);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        await handleAuthError("Erro ao inicializar autenticação");
      }
    };

    const handleAuthError = async (message: string) => {
      console.log("Handling auth error:", message);
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsLoading(false);
      toast({
        title: "Sessão expirada",
        description: message + ". Por favor, faça login novamente.",
        variant: "destructive",
      });
    };

    initializeAuth();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Index />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <AuthPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;