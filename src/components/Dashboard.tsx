import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";

interface DashboardProps {
  activeTab: string;
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