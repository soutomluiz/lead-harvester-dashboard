import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  id: string;
  title: string;
  leads: Lead[];
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetStage: any) => void;
}

export function KanbanColumn({
  id,
  title,
  leads,
  color,
  icon,
  bgColor,
  borderColor,
  onDragOver,
  onDragLeave,
  onDrop,
}: KanbanColumnProps) {
  const totalValue = leads.reduce((sum, lead) => sum + (lead.deal_value || 0), 0);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div
      className={`rounded-lg p-4 border-2 transition-all ${bgColor} ${borderColor}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, id)}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className={`font-semibold ${color}`}>{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="ml-auto">
                {leads.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total: {formatCurrency(totalValue)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <KanbanCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}