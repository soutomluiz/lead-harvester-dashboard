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
    await supabase.auth.signOut();
    onAuthStateChange(false);
    navigate('/login');
    toast({
      title: "Erro ao carregar perfil",
      description: "Houve um problema ao carregar seu perfil. Por favor, tente novamente.",
      variant: "destructive",
    });
  };

  const createUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ id: userId }])
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  };

  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

  const handleSession = async (session: any) => {
    if (!session) {
      onAuthStateChange(false);
      navigate('/login');
      return;
    }

    try {
      let profile = await fetchUserProfile(session.user.id);
      
      if (!profile) {
        console.log("Profile not found, creating new profile...");
        profile = await createUserProfile(session.user.id);
      }

      onAuthStateChange(true, profile);
      navigate('/');
    } catch (error) {
      console.error("Error handling session:", error);
      await handleProfileError();
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          await handleSession(session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        if (mounted) {
          setIsLoading(false);
          navigate('/login');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session ended");
        onAuthStateChange(false);
        navigate('/login');
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, handling session...");
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