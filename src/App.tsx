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
        console.log("Initializing auth...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await handleAuthError();
          return;
        }

        if (!session) {
          console.log("No session found");
          await handleAuthError();
          return;
        }

        // Validate session is still active
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User validation error:", userError);
          await handleAuthError();
          return;
        }

        console.log("Session validated successfully");
        setIsAuthenticated(true);
        setIsLoading(false);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          switch (event) {
            case 'SIGNED_OUT':
              console.log("User signed out");
              await handleAuthError();
              break;

            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              if (!session) {
                console.error("Session is null after auth event:", event);
                await handleAuthError();
                return;
              }

              try {
                // Validate session is still valid
                const { data: { user }, error: refreshError } = await supabase.auth.getUser();
                
                if (refreshError || !user) {
                  console.error("Session validation error:", refreshError);
                  throw refreshError;
                }

                console.log("Session validated after state change");
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
                await handleAuthError();
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
        await handleAuthError();
      }
    };

    const handleAuthError = async () => {
      console.log("Handling auth error...");
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsLoading(false);
      toast({
        title: "Sessão expirada",
        description: "Por favor, faça login novamente.",
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