import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { WelcomeTour } from "@/components/WelcomeTour";
import { Lead } from "@/types/lead";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState("table");

  const handleAddLead = (data: Omit<Lead, "id">) => {
    const newLead = {
      ...data,
      id: crypto.randomUUID(),
    };
    setLeads([...leads, newLead]);
  };

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads([...leads, ...newLeads]);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 pb-16">
          <div className="flex items-center justify-between mb-8 animate-fadeIn">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-4xl font-bold text-center">
              Lead Management Dashboard
            </h1>
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
        <AppFooter whitelabelName="Sua Empresa" />
        <WelcomeTour />
      </div>
    </SidebarProvider>
  );
};

export default Index;