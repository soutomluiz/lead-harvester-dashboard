import { Lead } from "@/types/lead";
import { SearchResult } from "@/types/search";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Users, Target, Calendar, Star, Building2, MapPin } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

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

    const chartData = [
      { name: 'Manual', value: leads.filter(lead => lead.type === 'manual').length },
      { name: 'Google Maps', value: leads.filter(lead => lead.type === 'place').length },
      { name: 'Websites', value: leads.filter(lead => lead.type === 'website').length },
    ];

    const COLORS = ['#4F46E5', '#10B981', '#8B5CF6'];

    // Dados por indústria
    const industryData = leads.reduce((acc, lead) => {
      if (lead.industry) {
        acc[lead.industry] = (acc[lead.industry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const industryChartData = Object.entries(industryData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Leads por Origem</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ChartContainer config={chartConfig}>
                <PieChart width={280} height={280}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Top 5 Indústrias</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ChartContainer config={chartConfig}>
                <BarChart width={280} height={280} data={industryChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ChartContainer>
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
