import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ExtractionEfficiencyChart } from "./ExtractionEfficiencyChart";
import { IndustryDistributionChart } from "./IndustryDistributionChart";
import { ActivityTimelineChart } from "./ActivityTimelineChart";

export function ReportsPage() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Lead[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Métricas de Extração</h3>
          <div className="space-y-2">
            <p>
              Taxa de Sucesso (Email): {' '}
              {((leads.filter(l => l.email).length / leads.length) * 100).toFixed(1)}%
            </p>
            <p>
              Taxa de Sucesso (Telefone): {' '}
              {((leads.filter(l => l.phone).length / leads.length) * 100).toFixed(1)}%
            </p>
            <p>
              Completude Média: {' '}
              {calculateCompletenessScore(leads)}%
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Distribuição por Fonte</h3>
          <div className="space-y-2">
            <p>
              Google Maps: {leads.filter(l => l.type === 'place').length} leads
            </p>
            <p>
              Websites: {leads.filter(l => l.type === 'website').length} leads
            </p>
            <p>
              Manual: {leads.filter(l => l.type === 'manual').length} leads
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Atividade</h3>
          <div className="space-y-2">
            <p>
              Hoje: {leads.filter(l => isToday(new Date(l.created_at || ''))).length} leads
            </p>
            <p>
              Esta Semana: {leads.filter(l => isThisWeek(new Date(l.created_at || ''))).length} leads
            </p>
            <p>
              Este Mês: {leads.filter(l => isThisMonth(new Date(l.created_at || ''))).length} leads
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Eficiência de Extração</h3>
          <div className="h-[300px]">
            <ExtractionEfficiencyChart leads={leads} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Distribuição por Indústria</h3>
          <div className="h-[300px]">
            <IndustryDistributionChart leads={leads} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Timeline de Atividade</h3>
        <div className="h-[300px]">
          <ActivityTimelineChart leads={leads} />
        </div>
      </Card>
    </div>
  );
}

function calculateCompletenessScore(leads: Lead[]): string {
  const fields = ['company_name', 'industry', 'location', 'email', 'phone', 'website'];
  const scores = leads.map(lead => {
    const filledFields = fields.filter(field => lead[field as keyof Lead]).length;
    return (filledFields / fields.length) * 100;
  });
  
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  return averageScore.toFixed(1);
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isThisWeek(date: Date): boolean {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  return date >= weekStart;
}

function isThisMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
}