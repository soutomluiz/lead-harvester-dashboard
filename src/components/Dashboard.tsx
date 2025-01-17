import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { SearchResult } from "@/types/search";

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
  results: SearchResult[];
}

export function DashboardStats({ results }: DashboardStatsProps) {
  // Calculate average rating only for results that have a rating
  const resultsWithRating = results.filter(result => result.rating !== undefined);
  const averageRating = resultsWithRating.length > 0
    ? (resultsWithRating.reduce((acc, curr) => acc + (curr.rating || 0), 0) / resultsWithRating.length).toFixed(1)
    : '0.0';

  // Count companies with website
  const companiesWithWebsite = results.filter(result => result.website).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Resultados Encontrados</h3>
        <p className="text-3xl font-bold text-primary">{results.length}</p>
      </div>
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Média de Avaliações</h3>
        <p className="text-3xl font-bold text-primary">{averageRating}/5</p>
      </div>
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Com Website</h3>
        <p className="text-3xl font-bold text-primary">{companiesWithWebsite}</p>
      </div>
    </div>
  );
}

export function Dashboard({ activeTab, leads, onSubmit, onAddLeads }: DashboardProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6 rounded-lg">
      {activeTab === "table" && <LeadTable leads={leads} />}
      {activeTab === "form" && <LeadForm onSubmit={onSubmit} />}
      {activeTab === "prospect" && <ProspectingForm onAddLeads={onAddLeads} />}
      {activeTab === "config" && <ConfigPanel />}
      {activeTab === "subscription" && <SubscriptionPanel />}
    </div>
  );
}