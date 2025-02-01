import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { Lead } from "@/types/lead";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthPage } from "@/components/AuthPage";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // Consider data fresh for 1 minute
      gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Only retry failed requests once
    },
  },
});

const getPageTitle = (tab: string) => {
  switch (tab) {
    case "dashboard": return "Dashboard";
    case "prospect-form": return "Manual Input";
    case "prospect-places": return "Google Maps";
    case "prospect-websites": return "Websites";
    case "leads-list": return "Leads List";
    case "leads-score": return "Lead Score";
    case "leads-timeline": return "Timeline";
    case "reports": return "Reports";
    case "subscription": return "Subscription";
    case "config": return "Settings";
    default: return "";
  }
};

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isLoading, isAuthenticated, userProfile } = useUserProfile();

  const handleAddLead = (data: Omit<Lead, "id">) => {
    const newLead = {
      ...data,
      id: crypto.randomUUID(),
    };
    setLeads(prevLeads => [...prevLeads, newLead]);
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  };

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads(prevLeads => [...prevLeads, ...newLeads]);
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  };

  if (isAuthenticated === null || isLoading) {
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
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-6 pb-16">
            <div className="flex justify-between items-center mb-8 animate-fadeIn">
              <h1 className="text-2xl font-bold">
                {getPageTitle(activeTab)}
              </h1>
              <DashboardHeader 
                userName={userProfile?.full_name || ''}
                avatarUrl={userProfile?.avatar_url}
                userProfile={userProfile}
              />
            </div>

            <div className="mt-6 animate-fadeIn">
              <Dashboard 
                activeTab={activeTab}
                leads={leads}
                onSubmit={handleAddLead}
                onAddLeads={handleAddLeads}
                setActiveTab={setActiveTab}
              />
            </div>
          </main>
          <AppFooter />
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default Index;
