import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

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
      
      navigate('/login');
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