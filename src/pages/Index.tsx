import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { WelcomeTour } from "@/components/WelcomeTour";
import { AuthPage } from "@/components/AuthPage";
import { AuthenticationManager } from "@/components/auth/AuthenticationManager";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session in Index...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }

        if (session) {
          console.log("Active session found in Index");
          setIsAuthenticated(true);
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (profile) {
            console.log("Profile loaded:", profile);
            setUserName(profile.full_name || '');
            setAvatarUrl(profile.avatar_url);
            setUserProfile(profile);
          }
        } else {
          console.log("No active session in Index");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in Index:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, updating state...");
        setIsAuthenticated(true);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserName(profile.full_name || '');
          setAvatarUrl(profile.avatar_url);
          setUserProfile(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsAuthenticated(false);
        setUserName('');
        setAvatarUrl(null);
        setUserProfile(null);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <AuthenticationManager onAuthStateChange={handleAuthStateChange}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <AuthenticatedLayout
            userName={userName}
            avatarUrl={avatarUrl}
            userProfile={userProfile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <AppFooter />
          <WelcomeTour />
        </div>
      </SidebarProvider>
    </AuthenticationManager>
  );

  function handleAuthStateChange(authenticated: boolean, profile?: any) {
    console.log("Auth state changed in Index handleAuthStateChange:", authenticated, profile);
    setIsAuthenticated(authenticated);
    if (profile) {
      setUserName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url);
      setUserProfile(profile);
    } else {
      setUserName('');
      setAvatarUrl(null);
      setUserProfile(null);
    }
  }
};

export default Index;