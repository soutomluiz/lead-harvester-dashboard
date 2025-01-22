import { Input } from "@/components/ui/input";
import { FilterPopover } from "./FilterPopover";
import { Button } from "@/components/ui/button";
import { Download, ListChecks } from "lucide-react";
import { Lead } from "@/types/lead";

interface LeadTableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Partial<Lead>;
  onFiltersChange: (filters: Partial<Lead>) => void;
  onExportCSV: () => void;
}

export function LeadTableFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onExportCSV,
}: LeadTableFiltersProps) {
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