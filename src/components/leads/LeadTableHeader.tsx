import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterPopover } from "./FilterPopover";
import { Lead } from "@/types/lead";

interface LeadTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: Partial<Lead>;
  onFiltersChange: (filters: Partial<Lead>) => void;
  onExportCSV: () => void;
}

export const LeadTableHeader = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onExportCSV,
}: LeadTableHeaderProps) => {
  return (
    <div className="p-4 flex items-center gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <FilterPopover
        filters={filters}
        onFiltersChange={onFiltersChange}
        activeFiltersCount={Object.values(filters).filter(Boolean).length}
      />
      <Button onClick={onExportCSV} variant="outline">
        <Download className="mr-2 h-4 w-4" /> Export CSV
      </Button>
    </div>
  );
};