import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lead } from "@/types/lead";

interface IndustryDistributionChartProps {
  leads: Lead[];
}

export function IndustryDistributionChart({ leads }: IndustryDistributionChartProps) {
  const industryData = leads.reduce((acc, lead) => {
    if (lead.industry) {
      acc[lead.industry] = (acc[lead.industry] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(industryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip />
        <Bar dataKey="value" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  );
}