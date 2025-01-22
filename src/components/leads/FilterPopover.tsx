import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPopoverProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function FilterPopover({ filters, onFiltersChange }: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Status</h4>
            <Select
              value={filters.status || ""}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="unqualified">Não Qualificado</SelectItem>
                <SelectItem value="open">Em Aberto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Indústria</h4>
            <Input
              placeholder="Filtrar por indústria"
              value={filters.industry || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, industry: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Localização</h4>
            <Input
              placeholder="Filtrar por localização"
              value={filters.location || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, location: e.target.value })
              }
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}