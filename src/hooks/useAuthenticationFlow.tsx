import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/profile";

interface UseAuthenticationFlowProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: any) => void;
}

export function useAuthenticationFlow({ onAuthStateChange }: UseAuthenticationFlowProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfileError = async () => {
    console.error("Profile error occurred, signing out...");
    await supabase.auth.signOut();
    onAuthStateChange(false);
    navigate('/login');
    toast({
      title: "Erro ao carregar perfil",
      description: "Houve um problema ao carregar seu perfil. Por favor, tente novamente.",
      variant: "destructive",
    });
  };

  const getOrCreateProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log("Buscando ou criando perfil para usuário:", userId);
      
      // Primeiro, tentamos buscar o perfil existente
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          console.log("Perfil não encontrado, criando novo...");
          // Se o perfil não existe, criamos um novo
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ id: userId }])
            .select()
            .single();

          if (createError) {
            console.error("Erro ao criar perfil:", createError);
            throw createError;
          }

          console.log("Novo perfil criado com sucesso:", newProfile);
          return newProfile;
        }
        throw fetchError;
      }

      console.log("Perfil encontrado:", profile);
      return profile;
    } catch (error) {
      console.error("Erro ao buscar/criar perfil:", error);
      throw error;
    }
  };

  const handleSession = async (session: any) => {
    if (!session) {
      console.log("Sessão não encontrada, redirecionando para login");
      onAuthStateChange(false);
      navigate('/login');
      return;
    }

    try {
      console.log("Processando sessão para usuário:", session.user.id);
      const profile = await getOrCreateProfile(session.user.id);

      if (!profile) {
        console.error("Falha ao buscar ou criar perfil");
        throw new Error("Falha ao buscar ou criar perfil");
      }

      console.log("Perfil processado com sucesso:", profile);
      onAuthStateChange(true, profile);
      navigate('/');
    } catch (error) {
      console.error("Erro ao processar sessão:", error);
      await handleProfileError();
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Verificando sessão atual...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro na sessão:", sessionError);
          throw sessionError;
        }
        
        if (mounted) {
          await handleSession(session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        if (mounted) {
          setIsLoading(false);
          navigate('/login');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Estado de autenticação alterado:", event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        console.log("Usuário desconectado ou sessão encerrada");
        onAuthStateChange(false);
        navigate('/login');
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log("Usuário conectado, processando sessão...");
        await handleSession(session);
      }
    });

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, onAuthStateChange, toast]);

  return { isLoading };
}