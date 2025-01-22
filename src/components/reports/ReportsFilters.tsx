import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReportsFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: {
    dateRange: "today" | "week" | "month" | "custom";
    customDate?: Date;
    leadType: string;
    leadStatus: string;
  };
}

export function ReportsFilters({ onFilterChange, currentFilters }: ReportsFiltersProps) {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "custom">(currentFilters.dateRange);
  const [customDate, setCustomDate] = useState<Date | undefined>(currentFilters.customDate);
  const [leadType, setLeadType] = useState<string>(currentFilters.leadType);
  const [leadStatus, setLeadStatus] = useState<string>(currentFilters.leadStatus);

  useEffect(() => {
    setDateRange(currentFilters.dateRange);
    setCustomDate(currentFilters.customDate);
    setLeadType(currentFilters.leadType);
    setLeadStatus(currentFilters.leadStatus);
  }, [currentFilters]);

  const handleFilterChange = (key: string, value: any) => {
    if (key === "dateRange") {
      setDateRange(value);
    } else if (key === "leadType") {
      setLeadType(value);
    } else if (key === "leadStatus") {
      setLeadStatus(value);
    }

    onFilterChange({
      dateRange,
      customDate,
      leadType,
      leadStatus,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={dateRange} onValueChange={(value: any) => handleFilterChange("dateRange", value)}>
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

      {dateRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDate ? format(customDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customDate}
              onSelect={(date) => {
                setCustomDate(date);
                handleFilterChange("customDate", date);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}

      <Select value={leadType} onValueChange={(value) => handleFilterChange("leadType", value)}>
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

      <Select value={leadStatus} onValueChange={(value) => handleFilterChange("leadStatus", value)}>
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