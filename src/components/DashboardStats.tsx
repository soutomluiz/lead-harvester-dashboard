import { Card } from "@/components/ui/card";
import { Mail, Phone, Users } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lead } from "@/types/lead";

interface DashboardStatsProps {
  leads: Lead[];
}

export function DashboardStats({ leads }: DashboardStatsProps) {
  const totalLeads = leads.length;
  const emailsFound = leads.filter(lead => lead.email).length;
  const phonesFound = leads.filter(lead => lead.phone).length;
  const manualLeads = leads.filter(lead => lead.type === 'manual').length;

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
    { name: 'Manual', value: manualLeads },
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