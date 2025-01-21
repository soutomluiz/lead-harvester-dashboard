import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { Lead } from "@/types/lead";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface LeadsTimelineChartProps {
  leads: Lead[];
  chartConfig: any;
}

export function LeadsTimelineChart({ leads, chartConfig }: LeadsTimelineChartProps) {
  const timelineData = leads.reduce((acc, lead) => {
    const date = lead.created_at ? format(parseISO(lead.created_at), 'yyyy-MM-dd') : null;
    if (date) {
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const startDate = leads.length > 0 ? 
    startOfMonth(parseISO(leads[0].created_at || new Date().toISOString())) : 
    startOfMonth(new Date());
  
  const endDate = leads.length > 0 ? 
    endOfMonth(parseISO(leads[leads.length - 1].created_at || new Date().toISOString())) : 
    endOfMonth(new Date());

  const chartData = eachDayOfInterval({ start: startDate, end: endDate })
    .map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date: dateStr,
        leads: timelineData[dateStr] || 0
      };
    });

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full">Nenhum dado disponível</div>;
  }

  return (
    <div className="w-full h-full">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(parseISO(date), 'dd/MM')}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(date) => format(parseISO(date as string), 'dd/MM/yyyy')}
            />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="#4F46E5" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}