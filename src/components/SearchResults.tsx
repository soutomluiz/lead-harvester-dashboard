import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchResult } from "@/types/search";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface SearchResultsProps {
  results: SearchResult[];
  onAddToLeads: (selectedResults: SearchResult[]) => void;
}

export const SearchResults = ({ results, onAddToLeads }: SearchResultsProps) => {
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (results.length === 0) return null;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedLeads.size === currentResults.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(currentResults.map((_, index) => startIndex + index)));
    }
  };

  const handleSelectLead = (index: number) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedLeads(newSelected);
  };

  const handleAddSelected = () => {
    const selectedResults = Array.from(selectedLeads).map(index => results[index]);
    onAddToLeads(selectedResults);
    setSelectedLeads(new Set());
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resultados da Busca</h3>
        <div className="flex gap-4">
          <Button 
            onClick={handleSelectAll} 
            variant="outline"
            size="sm"
          >
            {selectedLeads.size === currentResults.length ? "Desmarcar Todos" : "Selecionar Todos"}
          </Button>
          <Button 
            onClick={handleAddSelected}
            variant="secondary"
            size="sm"
            disabled={selectedLeads.size === 0}
          >
            Adicionar Selecionados ({selectedLeads.size})
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {currentResults.map((result, index) => (
          <Card key={startIndex + index} className="p-4">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={selectedLeads.has(startIndex + index)}
                onCheckedChange={() => handleSelectLead(startIndex + index)}
                className="mt-1"
              />
              <div className="flex-1">
                <h4 className="font-medium">{result.companyName}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {result.type !== 'website' && (
                    <>
                      <p className="text-sm">
                        <strong>Endereço:</strong> {result.address || "Não disponível"}
                      </p>
                      <p className="text-sm">
                        <strong>Telefone:</strong> {result.phone || "Não disponível"}
                      </p>
                      <p className="text-sm">
                        <strong>Avaliação:</strong>{" "}
                        {result.rating ? `${result.rating}/5` : "Sem avaliação"}
                      </p>
                      <p className="text-sm">
                        <strong>Total de Avaliações:</strong>{" "}
                        {result.user_ratings_total || 0}
                      </p>
                      <p className="text-sm">
                        <strong>Horário de Funcionamento:</strong>{" "}
                        {result.opening_date || "Não disponível"}
                      </p>
                    </>
                  )}
                  <p className="text-sm">
                    <strong>Website:</strong>{" "}
                    {result.website ? (
                      <a
                        href={result.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {result.website}
                      </a>
                    ) : (
                      "Não disponível"
                    )}
                  </p>
                  <p className="text-sm">
                    <strong>Cidade:</strong> {result.city}
                  </p>
                  <p className="text-sm">
                    <strong>Palavra-chave:</strong> {result.keyword}
                  </p>
                  <p className="text-sm">
                    <strong>Data de Exportação:</strong>{" "}
                    {new Date(result.extractionDate).toLocaleDateString()}
                  </p>
                  {result.type === 'website' && (
                    <p className="text-sm">
                      <strong>Fonte:</strong> {result.source}
                    </p>
                  )}
                </div>
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                >
                  Visitar {result.type === 'website' ? 'Website' : 'no Google Maps'}
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="cursor-pointer"
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="cursor-pointer"
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};