import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state changed in useAuth:", event);
      if (event === 'SIGNED_OUT') {
        console.log("User signed out in useAuth, redirecting to login");
        window.location.href = '/login';  // Force a full page reload and navigation
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    console.log("Starting logout process...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      console.log("Logout successful");
      toast({
        title: t("success"),
        description: t("logoutSuccess"),
      });
      
      // Force a full page reload and navigation to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("logoutError"),
      });
    }
  };

  return {
    handleSignOut,
  };
};