import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { WelcomeTour } from "@/components/WelcomeTour";
import { AuthPage } from "@/components/AuthPage";
import { AuthStateManager } from "@/components/auth/AuthStateManager";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { useAuthState } from "@/hooks/useAuthState";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { 
    isAuthenticated, 
    userName, 
    avatarUrl, 
    userProfile, 
    setIsAuthenticated, 
    setUserProfile 
  } = useAuthState();

  const handleAuthStateChange = (authenticated: boolean, profile: any) => {
    console.log("Estado de autenticação alterado em Index:", { authenticated, profile });
    setIsAuthenticated(authenticated);
    if (profile) {
      setUserProfile(profile);
    }
  };

  // Verificar sessão ao montar o componente
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log("Sessão inválida ou erro:", error);
        await supabase.auth.signOut();
        setIsAuthenticated(false);
      }
    };
    
    checkSession();
  }, [setIsAuthenticated]);

  return (
    <AuthStateManager onAuthStateChange={handleAuthStateChange}>
      {!isAuthenticated ? (
        <AuthPage />
      ) : (
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1">
              <AuthenticatedLayout
                userName={userName}
                avatarUrl={avatarUrl}
                userProfile={userProfile}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <AppFooter />
            <WelcomeTour />
          </div>
        </SidebarProvider>
      )}
    </AuthStateManager>
  );
};

export default Index;