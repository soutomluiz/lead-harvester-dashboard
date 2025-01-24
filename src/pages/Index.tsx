import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { WelcomeTour } from "@/components/WelcomeTour";
import { AuthPage } from "@/components/AuthPage";
import { AuthenticationManager } from "@/components/auth/AuthenticationManager";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { useAuthState } from "@/hooks/useAuthState";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAuthenticated, userName, avatarUrl, userProfile, setIsAuthenticated, setUserProfile } = useAuthState();

  console.log("Index render state:", { isAuthenticated, userName, userProfile });

  const handleAuthStateChange = (authenticated: boolean, profile: any) => {
    console.log("Auth state changed in Index:", { authenticated, profile });
    setIsAuthenticated(authenticated);
    if (profile) {
      setUserProfile(profile);
    }
  };

  if (!isAuthenticated) {
    console.log("User not authenticated, showing AuthPage");
    return <AuthPage />;
  }

  console.log("Rendering authenticated layout with profile:", userProfile);
  return (
    <AuthenticationManager onAuthStateChange={handleAuthStateChange}>
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
    </AuthenticationManager>
  );
};

export default Index;