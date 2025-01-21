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
        // First, try to recover any existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setIsLoading(false);
          toast({
            title: "Erro de sessão",
            description: "Por favor, faça login novamente.",
            variant: "destructive",
          });
          return;
        }

        // Update authentication state based on session
        setIsAuthenticated(!!session);
        setIsLoading(false);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          switch (event) {
            case 'SIGNED_OUT':
              setIsAuthenticated(false);
              setIsLoading(false);
              toast({
                title: "Sessão encerrada",
                description: "Você foi desconectado.",
              });
              break;

            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              if (!session) {
                console.error("Session is null after auth event:", event);
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
              }

              try {
                // Validate session is still valid
                const { data: currentSession, error: refreshError } = await supabase.auth.getSession();
                
                if (refreshError || !currentSession.session) {
                  console.error("Error validating session:", refreshError);
                  throw refreshError;
                }

                setIsAuthenticated(true);
                setIsLoading(false);
                
                if (event === 'SIGNED_IN') {
                  toast({
                    title: "Login realizado",
                    description: "Bem-vindo de volta!",
                  });
                }
              } catch (error) {
                console.error("Session validation error:", error);
                await supabase.auth.signOut();
                setIsAuthenticated(false);
                setIsLoading(false);
                toast({
                  title: "Erro de sessão",
                  description: "Houve um problema com sua sessão. Por favor, faça login novamente.",
                  variant: "destructive",
                });
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
        setIsAuthenticated(false);
        setIsLoading(false);
        toast({
          title: "Erro de inicialização",
          description: "Houve um problema ao inicializar a autenticação.",
          variant: "destructive",
        });
      }
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