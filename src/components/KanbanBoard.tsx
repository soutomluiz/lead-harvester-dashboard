import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Building2, Phone, Mail, DollarSign, Calendar, Tag, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type PipelineStage = 'novo' | 'primeiro_contato' | 'proposta' | 'negociacao' | 'fechado_ganho' | 'fechado_perdido';

interface KanbanColumn {
  id: PipelineStage;
  title: string;
  leads: Lead[];
  color: string;
  icon: React.ReactNode;
}

const initialColumns: KanbanColumn[] = [
  { 
    id: 'novo', 
    title: 'Novo', 
    leads: [],
    color: 'bg-blue-100 border-blue-300',
    icon: <AlertCircle className="w-4 h-4 text-blue-600" />
  },
  { 
    id: 'primeiro_contato', 
    title: 'Em Contato', 
    leads: [],
    color: 'bg-purple-100 border-purple-300',
    icon: <Phone className="w-4 h-4 text-purple-600" />
  },
  { 
    id: 'proposta', 
    title: 'Proposta Enviada', 
    leads: [],
    color: 'bg-amber-100 border-amber-300',
    icon: <Mail className="w-4 h-4 text-amber-600" />
  },
  { 
    id: 'negociacao', 
    title: 'Em Negociação', 
    leads: [],
    color: 'bg-orange-100 border-orange-300',
    icon: <DollarSign className="w-4 h-4 text-orange-600" />
  },
  { 
    id: 'fechado_ganho', 
    title: 'Fechado', 
    leads: [],
    color: 'bg-green-100 border-green-300',
    icon: <DollarSign className="w-4 h-4 text-green-600" />
  },
  { 
    id: 'fechado_perdido', 
    title: 'Perdido', 
    leads: [],
    color: 'bg-red-100 border-red-300',
    icon: <AlertCircle className="w-4 h-4 text-red-600" />
  },
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
    const element = e.currentTarget as HTMLElement;
    element.classList.add('opacity-50', 'scale-105');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('opacity-50', 'scale-105');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLElement;
    element.classList.add('bg-muted/80');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('bg-muted/80');
  };

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('bg-muted/80');
    
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
        <div className="flex gap-2">
          {columns.map(column => (
            <TooltipProvider key={column.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="px-3 py-1">
                    {column.title}: {column.leads.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total: {formatCurrency(column.leads.reduce((acc, lead) => acc + (lead.deal_value || 0), 0))}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className={`rounded-lg p-4 border-2 transition-colors ${column.color}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center gap-2 mb-4">
              {column.icon}
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary" className="ml-auto">
                {column.leads.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {column.leads.map(lead => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onDragEnd={handleDragEnd}
                  className="p-3 cursor-move hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-2">{lead.company_name}</h4>
                      {lead.deal_value > 0 && (
                        <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                          {formatCurrency(lead.deal_value)}
                        </span>
                      )}
                    </div>
                    
                    {lead.contact_name && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span className="line-clamp-1">{lead.contact_name}</span>
                      </div>
                    )}

                    {lead.last_interaction_at && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {format(new Date(lead.last_interaction_at), "dd 'de' MMMM", { locale: ptBR })}
                        </span>
                      </div>
                    )}

                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {lead.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lead.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}