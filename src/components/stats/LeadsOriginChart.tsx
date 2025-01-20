import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Lead } from "@/types/lead";

interface LeadsOriginChartProps {
  leads: Lead[];
  chartConfig: any;
}

export function LeadsOriginChart({ leads, chartConfig }: LeadsOriginChartProps) {
  const chartData = [
    { name: 'Manual', value: leads.filter(lead => lead.type === 'manual').length },
    { name: 'Google Maps', value: leads.filter(lead => lead.type === 'place').length },
    { name: 'Websites', value: leads.filter(lead => lead.type === 'website').length },
  ];

  const COLORS = ['#4F46E5', '#10B981', '#8B5CF6'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Leads por Origem</h3>
      <div className="w-full h-[400px] flex items-center justify-center">
        <ChartContainer config={chartConfig}>
          <PieChart width={350} height={350}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={130}
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
  );
}