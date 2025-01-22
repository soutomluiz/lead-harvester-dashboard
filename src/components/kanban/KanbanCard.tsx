import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, DollarSign, Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KanbanCardProps {
  lead: Lead;
}

export function KanbanCard({ lead }: KanbanCardProps) {
  const calculateScore = (lead: Lead): number => {
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

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const score = calculateScore(lead);
  const lastInteraction = lead.last_interaction_at 
    ? formatDistanceToNow(new Date(lead.last_interaction_at), { locale: ptBR, addSuffix: true })
    : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', lead.id);
        const element = e.currentTarget as HTMLElement;
        element.classList.add('opacity-50', 'scale-105', 'rotate-2', 'transition-all');
      }}
      onDragEnd={(e) => {
        const element = e.currentTarget as HTMLElement;
        element.classList.remove('opacity-50', 'scale-105', 'rotate-2', 'transition-all');
      }}
      className="p-3 cursor-move hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white group"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            <h4 className="font-medium line-clamp-2">{lead.company_name}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Progress 
            value={score} 
            className={`w-full h-1.5 ${getScoreColor(score)}`}
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
}