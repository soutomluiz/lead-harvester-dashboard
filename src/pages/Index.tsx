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
            <Dashboard 
              activeTab={activeTab}
              leads={leads}
              onSubmit={handleAddLead}
              onAddLeads={handleAddLeads}
            />
          </div>
        </main>
        <AppFooter whitelabelName="Sua Empresa" />
      </div>
    </SidebarProvider>
  );
};

export default Index;