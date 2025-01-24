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
      console.log("Clearing user state");
      setUserName('');
      setAvatarUrl(null);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    if (userProfile) {
      updateUserState(userProfile);
    }
  }, [userProfile]);

  return {
    isAuthenticated,
    userName,
    avatarUrl,
    userProfile,
    isLoading,
    setIsAuthenticated,
    setUserProfile,
    updateUserState
  };
}