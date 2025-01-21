import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Lead } from "@/types/lead";

interface DealValueChartProps {
  leads: Lead[];
  chartConfig: any;
}

export function DealValueChart({ leads, chartConfig }: DealValueChartProps) {
  const dealValueRanges = {
    '0-1000': { min: 0, max: 1000, count: 0, total: 0 },
    '1000-5000': { min: 1000, max: 5000, count: 0, total: 0 },
    '5000-10000': { min: 5000, max: 10000, count: 0, total: 0 },
    '10000+': { min: 10000, max: Infinity, count: 0, total: 0 },
  };

  leads.forEach(lead => {
    const value = lead.deal_value || 0;
    for (const [range, data] of Object.entries(dealValueRanges)) {
      if (value >= data.min && value < data.max) {
        data.count++;
        data.total += value;
        break;
      }
    }
  });

  const chartData = Object.entries(dealValueRanges).map(([range, data]) => ({
    range,
    count: data.count,
    total: data.total
  }));

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full">Nenhum dado disponível</div>;
  }

  return (
    <div className="w-full h-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" name="Quantidade" />
            <Bar dataKey="total" fill="#10B981" name="Valor Total" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}