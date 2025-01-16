import { useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import { LeadTable } from "@/components/LeadTable";
import { Dashboard, DashboardStats } from "@/components/Dashboard";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";

interface Lead {
  id: number;
  companyName: string;
  industry: string;
  location: string;
  contactName: string;
  email: string;
  phone: string;
}

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState("table");

  const handleAddLead = (data: Omit<Lead, "id">) => {
    const newLead = {
      ...data,
      id: leads.length + 1,
    };
    setLeads([...leads, newLead]);
  };

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads([...leads, ...newLeads]);
  };

  const uniqueLocations = new Set(leads.map((lead) => lead.location)).size;
  const uniqueIndustries = new Set(leads.map((lead) => lead.industry)).size;

  const renderContent = () => {
    switch (activeTab) {
      case "table":
        return <LeadTable leads={leads} />;
      case "form":
        return (
          <div className="flex justify-center">
            <LeadForm onSubmit={handleAddLead} />
          </div>
        );
      case "prospect":
        return <ProspectingForm onAddLeads={handleAddLeads} />;
      case "config":
        return <ConfigPanel />;
      default:
        return <LeadTable leads={leads} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 pb-16">
          <h1 className="text-4xl font-bold text-center mb-8 animate-fadeIn">
            Lead Management Dashboard
          </h1>

          <DashboardStats
            totalLeads={leads.length}
            uniqueLocations={uniqueLocations}
            uniqueIndustries={uniqueIndustries}
          />

          <div className="mt-6 animate-fadeIn">
            {renderContent()}
          </div>
        </main>
        <AppFooter whitelabelName="Sua Empresa" />
      </div>
    </SidebarProvider>
  );
};

export default Index;