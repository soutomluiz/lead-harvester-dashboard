import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthenticationManagerProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: any) => void;
  children: React.ReactNode;
}

export function AuthenticationManager({ onAuthStateChange, children }: AuthenticationManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Handling logout...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
      } else {
        console.log("Logout successful");
        onAuthStateChange(false);
        navigate('/login');
      }
    } catch (error) {
      console.error("Error in handleLogout:", error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        await handleLogout();
        return null;
      }

      if (!profile) {
        console.log("No profile found, creating new one");
        const { data: session } = await supabase.auth.getSession();
        const user = session?.session?.user;
        
        if (!user) {
          console.error("No user session found");
          await handleLogout();
          return null;
        }

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          await handleLogout();
          return null;
        }

        console.log("New profile created:", newProfile);
        return newProfile;
      }
      
      console.log("Profile fetched successfully:", profile);
      return profile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      await handleLogout();
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Starting authentication check...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          await handleLogout();
          return;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            onAuthStateChange(false);
            setIsLoading(false);
          }
          return;
        }

        console.log("Active session found:", session);
        const profile = await fetchUserProfile(session.user.id);
        
        if (mounted) {
          if (!profile) {
            await handleLogout();
            return;
          }
          onAuthStateChange(true, profile);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        if (mounted) {
          await handleLogout();
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session ended");
        onAuthStateChange(false);
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, fetching profile...");
        const profile = await fetchUserProfile(session.user.id);
        if (!profile) {
          await handleLogout();
          return;
        }
        onAuthStateChange(true, profile);
        navigate('/');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onAuthStateChange, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return children;
}