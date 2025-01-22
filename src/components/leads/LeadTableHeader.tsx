import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/lead";
import { FilterPopover } from "./FilterPopover";
import { ListChecks, Download, ArrowUpDown } from "lucide-react";

interface LeadTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Partial<Lead>;
  onFiltersChange: (filters: Partial<Lead>) => void;
  onExportCSV: () => void;
  sortConfig: {
    key: keyof Lead | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (key: keyof Lead) => void;
}

export function LeadTableHeader({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onExportCSV,
  sortConfig,
  onSort,
}: LeadTableHeaderProps) {
  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <ListChecks className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar leads..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-[300px]"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <FilterPopover filters={filters} onFiltersChange={onFiltersChange} />
        <Button variant="outline" onClick={onExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>
    </div>
  );
}