import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      console.log("Iniciando logout...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro no logout:", error);
        throw error;
      }
      
      console.log("Logout realizado com sucesso");
      toast({
        title: t("success"),
        description: t("logoutSuccess"),
      });

      // Forçar navegação após o logout
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