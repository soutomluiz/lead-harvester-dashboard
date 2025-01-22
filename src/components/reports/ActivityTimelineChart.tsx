import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lead } from "@/types/lead";
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';

interface ActivityTimelineChartProps {
  leads: Lead[];
}

export function ActivityTimelineChart({ leads }: ActivityTimelineChartProps) {
  const startDate = subDays(new Date(), 30);
  const endDate = new Date();

  const dailyActivity = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
    const dayLeads = leads.filter(lead => {
      const leadDate = lead.created_at ? new Date(lead.created_at) : null;
      return leadDate && leadDate.toDateString() === date.toDateString();
    });

    return {
      date: format(date, 'yyyy-MM-dd'),
      leads: dayLeads.length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={dailyActivity}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => format(parseISO(date), 'dd/MM')}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => format(parseISO(date as string), 'dd/MM/yyyy')}
        />
        <Area 
          type="monotone" 
          dataKey="leads" 
          stroke="#4F46E5" 
          fill="#4F46E5" 
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}