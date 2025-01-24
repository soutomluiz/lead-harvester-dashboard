import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  full_name?: string;
  avatar_url?: string | null;
  [key: string]: any;
}

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserState = (profile: UserProfile | null) => {
    if (profile) {
      console.log("Updating user state with profile:", profile);
      setUserName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url);
      setUserProfile(profile);
    } else {
      setUserName('');
      setAvatarUrl(null);
      setUserProfile(null);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("Fetching user profile for ID:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log("Profile loaded successfully:", profile);
      return profile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          if (mounted) {
            setIsAuthenticated(false);
            updateUserState(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user) {
          console.log("Active session found, fetching profile...");
          const profile = await fetchUserProfile(session.user.id);
          
          if (mounted) {
            setIsAuthenticated(true);
            updateUserState(profile);
          }
        } else {
          console.log("No active session");
          if (mounted) {
            setIsAuthenticated(false);
            updateUserState(null);
          }
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        if (mounted) {
          setIsAuthenticated(false);
          updateUserState(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoading(true);
        console.log("User signed in, fetching profile...");
        const profile = await fetchUserProfile(session.user.id);
        
        if (mounted) {
          setIsAuthenticated(true);
          updateUserState(profile);
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        if (mounted) {
          setIsAuthenticated(false);
          updateUserState(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    isAuthenticated,
    userName,
    avatarUrl,
    userProfile,
    isLoading
  };
}