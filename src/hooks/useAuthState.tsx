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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
      }
      
      console.log("Profile loaded:", profile);
      return profile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  const updateUserState = (profile: UserProfile | null) => {
    if (profile) {
      setUserName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url);
      setUserProfile(profile);
    } else {
      setUserName('');
      setAvatarUrl(null);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session in useAuthState...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }

        if (session) {
          console.log("Active session found in useAuthState");
          setIsAuthenticated(true);
          const profile = await fetchUserProfile(session.user.id);
          updateUserState(profile);
        } else {
          console.log("No active session in useAuthState");
          setIsAuthenticated(false);
          updateUserState(null);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in useAuthState:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, updating state...");
        setIsAuthenticated(true);
        const profile = await fetchUserProfile(session.user.id);
        updateUserState(profile);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsAuthenticated(false);
        updateUserState(null);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
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