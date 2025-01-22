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
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        if (!session) {
          console.log("No active session found");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        console.log("Session found:", session.user.id);
        setIsAuthenticated(true);
        setIsLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          switch (event) {
            case 'SIGNED_OUT':
              console.log("User signed out");
              setIsAuthenticated(false);
              break;

            case 'SIGNED_IN':
              if (session) {
                console.log("User signed in:", session.user.id);
                setIsAuthenticated(true);
                toast({
                  title: "Login realizado",
                  description: "Bem-vindo de volta!",
                });
              }
              break;

            case 'TOKEN_REFRESHED':
              if (session) {
                console.log("Session refreshed for user:", session.user.id);
                setIsAuthenticated(true);
              }
              break;
          }
          
          setIsLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
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