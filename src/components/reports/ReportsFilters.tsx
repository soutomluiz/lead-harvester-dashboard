import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeCalendar } from "./DateRangeCalendar";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FiltersState {
  dateRange: "today" | "week" | "month" | "custom";
  customDateRange: DateRange;
  leadType: string;
  leadStatus: string;
}

interface ReportsFiltersProps {
  onFilterChange: (filters: FiltersState) => void;
  currentFilters: FiltersState;
}

export function ReportsFilters({ onFilterChange, currentFilters }: ReportsFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select 
        value={filters.dateRange} 
        onValueChange={(value: "today" | "week" | "month" | "custom") => 
          handleFilterChange("dateRange", value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Última Semana</SelectItem>
          <SelectItem value="month">Último Mês</SelectItem>
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {filters.dateRange === "custom" && (
        <DateRangeCalendar
          dateRange={filters.customDateRange}
          onDateRangeChange={(range) => handleFilterChange("customDateRange", range)}
        />
      )}

      <Select 
        value={filters.leadType} 
        onValueChange={(value) => handleFilterChange("leadType", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo de Lead" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="place">Google Maps</SelectItem>
          <SelectItem value="website">Websites</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.leadStatus} 
        onValueChange={(value) => handleFilterChange("leadStatus", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="new">Novo</SelectItem>
          <SelectItem value="qualified">Qualificado</SelectItem>
          <SelectItem value="unqualified">Não Qualificado</SelectItem>
          <SelectItem value="open">Em Aberto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}