import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
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
  ].filter(item => item.value > 0);

  const COLORS = ['#4F46E5', '#10B981', '#8B5CF6'];

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full">Nenhum dado disponível</div>;
  }

  return (
    <div className="w-full h-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}