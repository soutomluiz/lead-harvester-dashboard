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
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Session found in Index:", session);
          setIsAuthenticated(true);
          // Fetch user profile if needed
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
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Index:", event, session);
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
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