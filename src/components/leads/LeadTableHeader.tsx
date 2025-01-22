import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { TagInput } from "@/components/TagInput";

interface LeadTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onExportCSV: () => void;
}

export function LeadTableHeader({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onExportCSV,
}: LeadTableHeaderProps) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterPopover
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={onExportCSV}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TagInput
          tags={filters.tags || []}
          onChange={(tags) => onFiltersChange({ ...filters, tags })}
          placeholder="Filtrar por tags..."
        />
      </div>
    </div>
  );
}