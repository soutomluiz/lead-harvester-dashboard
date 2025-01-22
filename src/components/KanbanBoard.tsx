import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertCircle, Phone, Mail, DollarSign, Star,
  Filter, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanColumn } from "./kanban/KanbanColumn";

type PipelineStage = 'novo' | 'primeiro_contato' | 'proposta' | 'negociacao' | 'fechado_ganho' | 'fechado_perdido';

interface KanbanColumn {
  id: PipelineStage;
  title: string;
  leads: Lead[];
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

const initialColumns: KanbanColumn[] = [
  { 
    id: 'novo', 
    title: 'Novo', 
    leads: [],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <AlertCircle className="w-4 h-4 text-blue-600" />
  },
  { 
    id: 'primeiro_contato', 
    title: 'Em Contato', 
    leads: [],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: <Phone className="w-4 h-4 text-purple-600" />
  },
  { 
    id: 'proposta', 
    title: 'Proposta Enviada', 
    leads: [],
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: <Mail className="w-4 h-4 text-amber-600" />
  },
  { 
    id: 'negociacao', 
    title: 'Em Negociação', 
    leads: [],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: <DollarSign className="w-4 h-4 text-orange-600" />
  },
  { 
    id: 'fechado_ganho', 
    title: 'Fechado', 
    leads: [],
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: <Star className="w-4 h-4 text-green-600" />
  },
  { 
    id: 'fechado_perdido', 
    title: 'Perdido', 
    leads: [],
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <AlertCircle className="w-4 h-4 text-red-600" />
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLElement;
    element.classList.add('bg-muted/80', 'scale-[1.02]', 'transition-all');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('bg-muted/80', 'scale-[1.02]', 'transition-all');
  };

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('bg-muted/80', 'scale-[1.02]', 'transition-all');
    
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

  const filteredColumns = columns.map(column => ({
    ...column,
    leads: column.leads.filter(lead => {
      if (!filterPriority) return true;
      const score = calculateLeadScore(lead);
      return getPriorityLabel(score) === filterPriority;
    })
  }));

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrar por Prioridade
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterPriority(null)}>
                Todas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("Alta")}>
                Alta Prioridade
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("Média")}>
                Média Prioridade
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("Baixa")}>
                Baixa Prioridade
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {filteredColumns.map(column => (
          <KanbanColumn
            key={column.id}
            {...column}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}

// Helper functions
const calculateLeadScore = (lead: Lead): number => {
  let score = 0;
  if (lead.company_name) score += 10;
  if (lead.contact_name) score += 10;
  if (lead.email) score += 15;
  if (lead.phone) score += 15;
  if (lead.website) score += 10;
  if (lead.industry) score += 10;
  if (lead.location) score += 10;
  if (lead.deal_value > 0) score += 10;
  if (lead.tags && lead.tags.length > 0) score += 10;
  return score;
};

const getPriorityLabel = (score: number): string => {
  if (score >= 80) return "Alta";
  if (score >= 60) return "Média";
  if (score >= 40) return "Baixa";
  return "Sem Prioridade";
};