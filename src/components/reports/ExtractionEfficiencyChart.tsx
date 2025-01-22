import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lead } from "@/types/lead";
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

interface ExtractionEfficiencyChartProps {
  leads: Lead[];
}

export function ExtractionEfficiencyChart({ leads }: ExtractionEfficiencyChartProps) {
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  const dailyStats = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
    const dayLeads = leads.filter(lead => {
      const leadDate = lead.created_at ? new Date(lead.created_at) : null;
      return leadDate && leadDate.toDateString() === date.toDateString();
    });

    const total = dayLeads.length;
    const withEmail = dayLeads.filter(l => l.email).length;
    const withPhone = dayLeads.filter(l => l.phone).length;

    return {
      date: format(date, 'yyyy-MM-dd'),
      total,
      emailRate: total > 0 ? (withEmail / total) * 100 : 0,
      phoneRate: total > 0 ? (withPhone / total) * 100 : 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dailyStats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => format(parseISO(date), 'dd/MM')}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => format(parseISO(date as string), 'dd/MM/yyyy')}
          formatter={(value: number) => [`${value.toFixed(1)}%`]}
        />
        <Line 
          type="monotone" 
          dataKey="emailRate" 
          stroke="#4F46E5" 
          name="Taxa de Email"
        />
        <Line 
          type="monotone" 
          dataKey="phoneRate" 
          stroke="#10B981" 
          name="Taxa de Telefone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}