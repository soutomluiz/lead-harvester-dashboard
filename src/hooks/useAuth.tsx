import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      console.log("Starting logout process...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível fazer logout. Tente novamente.",
        });
        return;
      }
      
      console.log("Logout successful");
      toast({
        title: "Sucesso",
        description: "Logout realizado com sucesso",
      });
      
      // Force navigation to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao fazer logout",
      });
    }
  };

  return {
    handleSignOut,
  };
};