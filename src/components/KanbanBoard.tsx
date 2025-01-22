import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type PipelineStage = 'novo' | 'primeiro_contato' | 'proposta' | 'negociacao' | 'fechado_ganho' | 'fechado_perdido';

interface KanbanColumn {
  id: PipelineStage;
  title: string;
  leads: Lead[];
}

const initialColumns: KanbanColumn[] = [
  { id: 'novo', title: 'Novo', leads: [] },
  { id: 'primeiro_contato', title: 'Em Contato', leads: [] },
  { id: 'proposta', title: 'Proposta Enviada', leads: [] },
  { id: 'negociacao', title: 'Em Negociação', leads: [] },
  { id: 'fechado_ganho', title: 'Fechado', leads: [] },
  { id: 'fechado_perdido', title: 'Perdido', leads: [] },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('kanban_order', { ascending: true });

      if (error) throw error;

      const updatedColumns = initialColumns.map(column => ({
        ...column,
        leads: (leads || [])
          .filter(lead => lead.stage === column.id)
          .map(lead => ({
            ...lead,
            type: lead.type as 'website' | 'place' | 'manual',
            status: (lead.status || 'new') as 'new' | 'qualified' | 'unqualified' | 'open',
            deal_value: lead.deal_value || 0,
            tags: lead.tags || []
          }))
      }));

      setColumns(updatedColumns);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Erro ao carregar leads",
        description: "Não foi possível carregar os leads do pipeline.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel('public:leads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        fetchLeads
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeads]);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          stage: targetStage,
          last_interaction_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Lead atualizado",
        description: "O lead foi movido com sucesso.",
      });
    } catch (error) {
      console.error('Error updating lead stage:', error);
      toast({
        title: "Erro ao atualizar lead",
        description: "Não foi possível mover o lead.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Pipeline de Vendas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className="bg-muted/50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <h3 className="font-semibold mb-4">{column.title}</h3>
            <div className="space-y-3">
              {column.leads.map(lead => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="p-3 cursor-move hover:shadow-md transition-shadow bg-background"
                >
                  <h4 className="font-medium">{lead.company_name}</h4>
                  {lead.contact_name && (
                    <p className="text-sm text-muted-foreground">{lead.contact_name}</p>
                  )}
                  {lead.deal_value > 0 && (
                    <p className="text-sm font-medium text-green-600">
                      R$ {lead.deal_value.toLocaleString('pt-BR')}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}