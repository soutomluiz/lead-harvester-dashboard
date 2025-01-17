import { SearchResult } from "@/types/search";
import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Users } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardStatsProps {
  leads?: Lead[];
  results?: SearchResult[];
  searchType?: "places" | "websites";
}

export function DashboardStats({ leads, results, searchType }: DashboardStatsProps) {
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

  if (leads) {
    const totalLeads = leads.length;
    const emailsFound = leads.filter(lead => lead.email).length;
    const phonesFound = leads.filter(lead => lead.phone).length;

    const stats = [
      {
        title: "Total de Leads",
        value: totalLeads,
        icon: Users,
        color: "text-blue-500",
      },
      {
        title: "Emails Encontrados",
        value: emailsFound,
        icon: Mail,
        color: "text-green-500",
      },
      {
        title: "Telefones Encontrados",
        value: phonesFound,
        icon: Phone,
        color: "text-purple-500",
      },
    ];

    const chartData = [
      { name: 'Manual', value: leads.filter(lead => lead.type === 'manual').length },
      { name: 'Google Places', value: leads.filter(lead => lead.type === 'place').length },
      { name: 'Websites', value: leads.filter(lead => lead.type === 'website').length },
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center space-x-4">
                  <Icon className={`h-10 w-10 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Leads por Origem</h3>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                bar1: { color: "#4F46E5" },
              }}
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-bar1)" />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}