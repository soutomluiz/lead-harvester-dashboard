import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";

interface DashboardProps {
  activeTab: string;
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

export function Dashboard({ activeTab }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto">
      {activeTab === "table" && <LeadTable />}
      {activeTab === "form" && <LeadForm />}
      {activeTab === "prospect" && <ProspectingForm />}
      {activeTab === "config" && <ConfigPanel />}
      {activeTab === "subscription" && <SubscriptionPanel />}
    </div>
  );
}