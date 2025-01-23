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
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to login");
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      console.log("Starting logout process...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      console.log("Logout successful");
      toast({
        title: t("success"),
        description: t("logoutSuccess"),
      });

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