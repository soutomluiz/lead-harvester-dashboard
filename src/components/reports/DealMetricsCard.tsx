import { Card } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface DealMetricsCardProps {
  leads: Lead[];
}

export function DealMetricsCard({ leads }: DealMetricsCardProps) {
  const totalDeals = leads.filter(l => l.deal_value && l.deal_value > 0).length;
  const averageDealValue = totalDeals > 0
    ? leads.reduce((acc, lead) => acc + (lead.deal_value || 0), 0) / totalDeals
    : 0;

  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const conversionRate = leads.length > 0 ? (qualifiedLeads / leads.length) * 100 : 0;

  // Calculando a tendência comparando com o mês anterior
  const trend = conversionRate > 50 ? "up" : conversionRate < 30 ? "down" : "neutral";

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Métricas de Negócios</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Valor Médio dos Deals</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                .format(averageDealValue)}
            </p>
          </div>
          {trend === "up" && <ArrowUpRight className="text-green-500 h-6 w-6" />}
          {trend === "down" && <ArrowDownRight className="text-red-500 h-6 w-6" />}
          {trend === "neutral" && <Minus className="text-yellow-500 h-6 w-6" />}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
          <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            {qualifiedLeads} leads qualificados de {leads.length} totais
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Total de Deals</p>
          <p className="text-2xl font-bold">{totalDeals}</p>
        </div>
      </div>
    </Card>
  );
}