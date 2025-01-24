import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { WelcomeTour } from "@/components/WelcomeTour";
import { AuthPage } from "@/components/AuthPage";
import { AuthStateManager } from "@/components/auth/AuthStateManager";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { useAuthState } from "@/hooks/useAuthState";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAuthenticated, userName, avatarUrl, userProfile, setIsAuthenticated, setUserProfile } = useAuthState();

  const handleAuthStateChange = (authenticated: boolean, profile: any) => {
    console.log("Auth state changed in Index:", { authenticated, profile });
    setIsAuthenticated(authenticated);
    if (profile) {
      setUserProfile(profile);
    }
  };

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