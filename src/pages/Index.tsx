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
  const { isAuthenticated, userName, avatarUrl, userProfile, isLoading } = useAuthState();

  console.log("Index render state:", { isAuthenticated, isLoading, userName, userProfile });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !userProfile) {
    console.log("User not authenticated or profile not loaded, showing AuthPage");
    return <AuthPage />;
  }

  console.log("Rendering authenticated layout with profile:", userProfile);
  return (
    <AuthenticationManager 
      onAuthStateChange={(authenticated, profile) => {
        console.log("Auth state changed in Index:", { authenticated, profile });
      }}
    >
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
};

export default Index;