import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import { AuthPage } from "@/components/AuthPage";
import { PricingPage } from "@/components/PricingPage";
import { SubscriptionSuccess } from "@/components/SubscriptionSuccess";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in");
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log("User signed out or deleted");
        setIsAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed");
        setIsAuthenticated(true);
      } else if (event === 'USER_UPDATED') {
        console.log("User updated");
        setIsAuthenticated(true);
      }

      // Handle potential session errors
      if (event === 'INITIAL_SESSION' && !session) {
        console.log("No initial session");
        await supabase.auth.signOut();
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />} 
        />
        <Route 
          path="/pricing" 
          element={<PricingPage />} 
        />
        <Route 
          path="/subscription/success" 
          element={<SubscriptionSuccess />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Index /> : <Navigate to="/login" />} 
        />
      </Routes>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;