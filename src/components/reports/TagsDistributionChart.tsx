import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";

interface TagsDistributionChartProps {
  leads: Lead[];
}

export function TagsDistributionChart({ leads }: TagsDistributionChartProps) {
  // Conta todas as tags de todos os leads
  const tagsCount = leads.reduce((acc, lead) => {
    if (lead.tags && Array.isArray(lead.tags)) {
      lead.tags.forEach(tag => {
        if (tag && typeof tag === 'string') {
          acc[tag] = (acc[tag] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // Transforma o objeto de contagem em um array para o Recharts
  const data = Object.entries(tagsCount)
    .map(([name, value]) => ({ 
      name, 
      value,
      percentage: (value / leads.length) * 100 
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#4F46E5', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição por Tags</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Nenhuma tag encontrada
        </div>
      </Card>
    );
  }

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
              label={({ name, percentage }) => 
                `${name} (${percentage.toFixed(1)}%)`
              }
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} leads (${((value / leads.length) * 100).toFixed(1)}%)`,
                name
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}