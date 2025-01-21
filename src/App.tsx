import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthPage } from "@/components/AuthPage";
import { PricingPage } from "@/components/PricingPage";
import Index from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);

      if (event === 'SIGNED_IN') {
        console.log("User signed in");
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed");
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;