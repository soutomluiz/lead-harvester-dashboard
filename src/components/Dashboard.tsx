import { LeadTable } from "@/components/LeadTable";
import { LeadForm } from "@/components/LeadForm";
import { ProspectingForm } from "@/components/ProspectingForm";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SubscriptionPanel } from "@/components/SubscriptionPanel";
import { SearchResult } from "@/types/search";
import { Search, Building2, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  searchType?: "places" | "websites";
}

export function DashboardStats({ results, searchType }: DashboardStatsProps) {
  if (searchType === "websites") {
    const totalWebsites = results.length;
    const websitesWithContact = results.filter(result => result.email || result.phone).length;
    const uniqueDomains = new Set(results.map(result => result.source)).size;

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-primary">Websites Encontrados</h3>
          <p className="text-3xl font-bold text-primary">{totalWebsites}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-primary">Com Informações de Contato</h3>
          <p className="text-3xl font-bold text-primary">{websitesWithContact}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-primary">Domínios Únicos</h3>
          <p className="text-3xl font-bold text-primary">{uniqueDomains}</p>
        </div>
      </div>
    );
  }

  // Stats for Google Places
  const resultsWithRating = results.filter(result => result.rating !== undefined);
  const averageRating = resultsWithRating.length > 0
    ? (resultsWithRating.reduce((acc, curr) => acc + (curr.rating || 0), 0) / resultsWithRating.length).toFixed(1)
    : '0.0';

  const companiesWithWebsite = results.filter(result => result.website).length;
  const companiesWithPhone = results.filter(result => result.phone).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Empresas Encontradas</h3>
        <p className="text-3xl font-bold text-primary">{results.length}</p>
      </div>
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Média de Avaliações</h3>
        <p className="text-3xl font-bold text-primary">{averageRating}/5</p>
      </div>
      <div className="rounded-lg border bg-white p-4 text-center shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-primary">Com Telefone</h3>
        <p className="text-3xl font-bold text-primary">{companiesWithPhone}</p>
      </div>
    </div>
  );
}

export function Dashboard({ activeTab, leads, onSubmit, onAddLeads }: DashboardProps) {
  const searchType = activeTab.includes("prospect-places") 
    ? "places" 
    : activeTab.includes("prospect-websites") 
    ? "websites" 
    : undefined;

  const renderProspectingWelcome = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Escolha uma Opção de Prospecção
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto">
        Selecione um dos métodos de prospecção disponíveis no menu lateral para começar sua busca por leads.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            const event = new CustomEvent('setActiveTab', { detail: 'prospect-places' });
            window.dispatchEvent(event);
          }}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <Building2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-medium">Google Places</h3>
            <p className="text-gray-600">
              Encontre empresas locais através do Google Places. Ideal para negócios com presença física e listados no Google Maps.
            </p>
          </div>
        </Card>
        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            const event = new CustomEvent('setActiveTab', { detail: 'prospect-websites' });
            window.dispatchEvent(event);
          }}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <Globe className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-medium">Websites</h3>
            <p className="text-gray-600">
              Pesquise leads através de websites. Perfeito para encontrar empresas com presença online e contatos disponíveis na web.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6 rounded-lg">
      {activeTab === "table" && <LeadTable leads={leads} />}
      {activeTab === "form" && <LeadForm onSubmit={onSubmit} />}
      {activeTab === "prospect" && renderProspectingWelcome()}
      {(activeTab === "prospect-places" || activeTab === "prospect-websites") && (
        <ProspectingForm onAddLeads={onAddLeads} searchType={searchType} />
      )}
      {activeTab === "config" && <ConfigPanel />}
      {activeTab === "subscription" && <SubscriptionPanel />}
    </div>
  );
}