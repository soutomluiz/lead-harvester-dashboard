import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";

interface Lead {
  id: number;
  companyName: string;
  industry: string;
  location: string;
  contactName: string;
  email: string;
  phone: string;
}

interface DashboardProps {
  activeTab: string;
  leads: Lead[];
  onSubmit: (data: any) => void;
  onAddLeads: (leads: any[]) => void;
}

interface DashboardStatsProps {
  totalLeads: number;
  uniqueLocations: number;
  uniqueIndustries: number;
}

export function DashboardStats({ totalLeads, uniqueLocations, uniqueIndustries }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border p-4 text-center">
        <h3 className="text-lg font-semibold">Total Leads</h3>
        <p className="text-3xl font-bold">{totalLeads}</p>
      </div>
      <div className="rounded-lg border p-4 text-center">
        <h3 className="text-lg font-semibold">Unique Locations</h3>
        <p className="text-3xl font-bold">{uniqueLocations}</p>
      </div>
      <div className="rounded-lg border p-4 text-center">
        <h3 className="text-lg font-semibold">Unique Industries</h3>
        <p className="text-3xl font-bold">{uniqueIndustries}</p>
      </div>
    </div>
  );
}

export function Dashboard({ activeTab, leads, onSubmit, onAddLeads }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto">
      {activeTab === "table" && <LeadTable leads={leads} />}
      {activeTab === "form" && <LeadForm onSubmit={onSubmit} />}
      {activeTab === "prospect" && <ProspectingForm onAddLeads={onAddLeads} />}
      {activeTab === "config" && <ConfigPanel />}
      {activeTab === "subscription" && <SubscriptionPanel />}
    </div>
  );
}