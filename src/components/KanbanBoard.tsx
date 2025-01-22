import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, Building2, Phone, Mail, DollarSign, Calendar, Tag, AlertCircle,
  ArrowUp, ArrowRight, Clock, Star, Filter, BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const getPriorityColor = (score: number): string => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
};

const getPriorityLabel = (score: number): string => {
  if (score >= 80) return "Alta";
  if (score >= 60) return "Média";
  if (score >= 40) return "Baixa";
  return "Sem Prioridade";
};

const getLeadTypeIcon = (type?: string) => {
  switch (type) {
    case 'website':
      return <Building2 className="w-4 h-4 text-blue-500" />;
    case 'place':
      return <BarChart3 className="w-4 h-4 text-green-500" />;
    default:
      return <Star className="w-4 h-4 text-purple-500" />;
  }
};

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    const element = e.currentTarget as HTMLElement;
    element.classList.add('opacity-50', 'scale-105', 'rotate-2', 'transition-all');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('opacity-50', 'scale-105', 'rotate-2', 'transition-all');
  };

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
        {filteredColumns.map(column => {
          const totalValue = column.leads.reduce((sum, lead) => sum + (lead.deal_value || 0), 0);
          
          return (
            <div
              key={column.id}
              className={`rounded-lg p-4 border-2 transition-all ${column.bgColor} ${column.borderColor}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center gap-2 mb-4">
                {column.icon}
                <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="ml-auto">
                        {column.leads.length}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total: {formatCurrency(totalValue)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-3">
                {column.leads.map(lead => {
                  const score = calculateLeadScore(lead);
                  const lastInteraction = lead.last_interaction_at 
                    ? formatDistanceToNow(new Date(lead.last_interaction_at), { locale: ptBR, addSuffix: true })
                    : null;

                  return (
                    <Card
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      className="p-3 cursor-move hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getLeadTypeIcon(lead.type)}
                            <h4 className="font-medium line-clamp-2">{lead.company_name}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Progress 
                            value={score} 
                            className={`w-full h-1.5 ${getPriorityColor(score)}`}
                          />
                          <span className="text-xs font-medium whitespace-nowrap">
                            {score}/100
                          </span>
                        </div>

                        {lead.contact_name && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Building2 className="w-3 h-3" />
                            <span className="line-clamp-1">{lead.contact_name}</span>
                          </div>
                        )}

                        {lead.deal_value > 0 && (
                          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <DollarSign className="w-3 h-3" />
                            <span>{formatCurrency(lead.deal_value)}</span>
                          </div>
                        )}

                        {lastInteraction && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{lastInteraction}</span>
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
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}