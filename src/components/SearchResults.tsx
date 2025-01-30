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
import { MapPin, Globe, Phone, Star } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
  onAddToLeads: (selectedResults: SearchResult[]) => void;
}

export const SearchResults = ({ results, onAddToLeads }: SearchResultsProps) => {
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("Rendering SearchResults with:", results);

  if (!results || results.length === 0) {
    console.log("No results to display");
    return null;
  }

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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Resultados da Busca ({results.length})</h3>
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

      <div className="grid gap-4">
        {currentResults.map((result, index) => (
          <Card key={startIndex + index} className="p-4">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={selectedLeads.has(startIndex + index)}
                onCheckedChange={() => handleSelectLead(startIndex + index)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-lg">{result.companyName || result.name}</h4>
                  {result.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{result.rating}/5</span>
                      {result.user_ratings_total && (
                        <span className="text-sm text-gray-500">
                          ({result.user_ratings_total} avaliações)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {result.address && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{result.address}</span>
                  </div>
                )}

                {result.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{result.phone}</span>
                  </div>
                )}

                {result.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="h-4 w-4" />
                    <a
                      href={result.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {result.website}
                    </a>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Ver no {result.type === 'website' ? 'Website' : 'Google Maps'}
                  </a>
                </div>
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
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};