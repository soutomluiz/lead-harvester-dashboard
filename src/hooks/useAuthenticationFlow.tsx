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

  const createUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log("Creating new profile for user:", userId);
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (existingProfile) {
        console.log("Profile already exists:", existingProfile);
        return existingProfile;
      }

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ id: userId }])
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        throw createError;
      }
      
      console.log("New profile created successfully:", newProfile);
      return newProfile;
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      throw error;
    }
  };

  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      console.log("Profile fetch result:", profile);
      return profile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      throw error;
    }
  };

  const handleSession = async (session: any) => {
    if (!session) {
      console.log("No session found, redirecting to login");
      onAuthStateChange(false);
      navigate('/login');
      return;
    }

    try {
      console.log("Handling session for user:", session.user.id);
      let profile = await createUserProfile(session.user.id);

      if (!profile) {
        console.error("Failed to create or fetch profile");
        throw new Error("Failed to create or fetch profile");
      }

      console.log("Profile handled successfully:", profile);
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
        console.log("Checking current session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
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
      console.log("Auth state changed:", event, session);
      
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