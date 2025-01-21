import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Lead } from "@/types/lead";

interface LeadStatusChartProps {
  leads: Lead[];
  chartConfig: any;
}

export function LeadStatusChart({ leads, chartConfig }: LeadStatusChartProps) {
  const statusData = leads.reduce((acc, lead) => {
    const status = lead.status || 'new';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const COLORS = ['#10B981', '#4F46E5', '#F43F5E', '#F59E0B'];

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