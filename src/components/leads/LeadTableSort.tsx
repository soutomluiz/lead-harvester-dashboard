import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Lead } from "@/types/lead";

interface LeadTableSortProps {
  columnKey: keyof Lead;
  sortConfig: {
    key: keyof Lead | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (key: keyof Lead) => void;
}

export function LeadTableSort({ columnKey, sortConfig, onSort }: LeadTableSortProps) {
  return (
    <Button
      variant="ghost"
      onClick={() => onSort(columnKey)}
      className="h-8 w-8 p-0 ml-2 hover:bg-transparent"
    >
      <ArrowUpDown className={`h-4 w-4 ${
        sortConfig.key === columnKey 
          ? sortConfig.direction === 'asc'
            ? 'text-primary rotate-180'
            : 'text-primary'
          : 'text-muted-foreground'
      }`} />
    </Button>
  );
}