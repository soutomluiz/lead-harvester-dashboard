import { Lead } from "@/types/lead";
import { SearchResult } from "@/types/search";
import { Mail, Phone, Users, Target, Building2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatCard } from "./stats/StatCard";
import { LeadsOriginChart } from "./stats/LeadsOriginChart";
import { IndustriesChart } from "./stats/IndustriesChart";

interface DashboardStatsProps {
  leads?: Lead[];
  results?: SearchResult[];
  searchType?: "places" | "websites";
}

const chartConfig = {
  leads: {
    theme: {
      light: "#4F46E5",
      dark: "#818CF8",
    },
  },
  places: {
    theme: {
      light: "#10B981",
      dark: "#34D399",
    },
  },
  websites: {
    theme: {
      light: "#8B5CF6",
      dark: "#A78BFA",
    },
  },
};

export function DashboardStats({ leads, results, searchType }: DashboardStatsProps) {
  if (leads) {
    const totalLeads = leads.length;
    const emailsFound = leads.filter(lead => lead.email).length;
    const phonesFound = leads.filter(lead => lead.phone).length;
    const withLocation = leads.filter(lead => lead.location).length;
    const withWebsite = leads.filter(lead => lead.website).length;
    const withIndustry = leads.filter(lead => lead.industry).length;

    const stats = [
      {
        title: "Total de Leads",
        value: totalLeads,
        icon: Users,
        color: "text-blue-500",
        description: "Leads cadastrados"
      },
      {
        title: "Emails",
        value: emailsFound,
        icon: Mail,
        color: "text-green-500",
        description: "Contatos com email"
      },
      {
        title: "Telefones",
        value: phonesFound,
        icon: Phone,
        color: "text-purple-500",
        description: "Contatos com telefone"
      },
      {
        title: "Localização",
        value: withLocation,
        icon: MapPin,
        color: "text-orange-500",
        description: "Com endereço"
      },
      {
        title: "Websites",
        value: withWebsite,
        icon: Building2,
        color: "text-pink-500",
        description: "Com site"
      },
      {
        title: "Indústrias",
        value: withIndustry,
        icon: Target,
        color: "text-indigo-500",
        description: "Com setor definido"
      },
    ];

    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 min-h-[400px]">
          <Card className="p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-center">Leads por Origem</h3>
            <div className="flex-1 w-full min-h-[350px]">
              <LeadsOriginChart leads={leads} chartConfig={chartConfig} />
            </div>
          </Card>
          <Card className="p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-center">Top 5 Indústrias</h3>
            <div className="flex-1 w-full min-h-[350px]">
              <IndustriesChart leads={leads} chartConfig={chartConfig} />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (results && searchType === "websites") {
    const totalWebsites = results.length;
    const websitesWithContact = results.filter(result => result.email || result.phone).length;
    const uniqueDomains = new Set(results.map(result => result.source)).size;

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Websites Encontrados</h3>
          <p className="text-3xl font-bold text-primary">{totalWebsites}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Com Informações de Contato</h3>
          <p className="text-3xl font-bold text-primary">{websitesWithContact}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Domínios Únicos</h3>
          <p className="text-3xl font-bold text-primary">{uniqueDomains}</p>
        </Card>
      </div>
    );
  }

  if (results && searchType === "places") {
    const resultsWithRating = results.filter(result => result.rating !== undefined);
    const averageRating = resultsWithRating.length > 0
      ? (resultsWithRating.reduce((acc, curr) => acc + (curr.rating || 0), 0) / resultsWithRating.length).toFixed(1)
      : '0.0';

    const companiesWithPhone = results.filter(result => result.phone).length;

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Empresas Encontradas</h3>
          <p className="text-3xl font-bold text-primary">{results.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Média de Avaliações</h3>
          <p className="text-3xl font-bold text-primary">{averageRating}/5</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Com Telefone</h3>
          <p className="text-3xl font-bold text-primary">{companiesWithPhone}</p>
        </Card>
      </div>
    );
  }

  return null;
}