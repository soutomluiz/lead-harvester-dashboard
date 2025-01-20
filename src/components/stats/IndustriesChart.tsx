import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
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

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Top 5 Indústrias</h3>
      <div className="w-full h-[400px] flex items-center justify-center">
        <ChartContainer config={chartConfig}>
          <BarChart width={350} height={350} data={industryChartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}