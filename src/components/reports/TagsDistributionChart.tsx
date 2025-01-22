import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";

interface TagsDistributionChartProps {
  leads: Lead[];
}

export function TagsDistributionChart({ leads }: TagsDistributionChartProps) {
  const tagsCount = leads.reduce((acc, lead) => {
    if (lead.tags) {
      lead.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(tagsCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#4F46E5', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Distribuição por Tags</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => 
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}