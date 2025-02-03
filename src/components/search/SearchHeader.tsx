import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchHeaderProps {
  totalResults: number;
  selectedCount: number;
  onSelectAll: () => void;
  onAddSelected: () => void;
  isAllSelected: boolean;
}

export const SearchHeader = ({
  totalResults,
  selectedCount,
  onSelectAll,
  onAddSelected,
  isAllSelected,
}: SearchHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">
        Resultados da Busca ({totalResults})
      </h3>
      <div className="flex gap-4">
        <Button 
          onClick={onSelectAll} 
          variant="outline"
          size="sm"
        >
          {isAllSelected ? "Desmarcar Todos" : "Selecionar Todos"}
        </Button>
        <Button 
          onClick={onAddSelected}
          variant="secondary"
          size="sm"
          disabled={selectedCount === 0}
        >
          Adicionar Selecionados ({selectedCount})
        </Button>
      </div>
    </div>
  );
};