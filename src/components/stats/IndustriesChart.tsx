import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Lead } from "@/types/lead";

interface IndustriesChartProps {
  leads: Lead[];
  chartConfig: any;
}

export function IndustriesChart({ leads, chartConfig }: IndustriesChartProps) {
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

  if (industryChartData.length === 0) {
    return <div className="flex items-center justify-center h-full">Nenhum dado disponível</div>;
  }

  return (
    <div className="w-full h-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={industryChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}