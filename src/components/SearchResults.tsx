import { useState } from "react";
import { SearchResult } from "@/types/search";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SearchHeader } from "./search/SearchHeader";
import { SearchResultCard } from "./search/SearchResultCard";
import { SearchPagination } from "./search/SearchPagination";
import { Database } from "@/integrations/supabase/types";

type PipelineStage = Database['public']['Enums']['pipeline_stage'];

interface SearchResultsProps {
  results: SearchResult[];
  onAddLeads: (selectedResults: SearchResult[]) => void;
}

export const SearchResults = ({ results, onAddLeads }: SearchResultsProps) => {
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  if (!results || results.length === 0) {
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

  const handleAddSelected = async () => {
    const selectedResults = Array.from(selectedLeads).map(index => results[index]);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para adicionar leads.",
          variant: "destructive",
        });
        return;
      }

      const leadsToAdd = selectedResults.map(result => ({
        company_name: result.companyName || result.name || '',
        industry: result.industry || result.category || null,
        location: result.location || result.city || null,
        contact_name: null,
        email: result.email || null,
        phone: result.phone || null,
        website: result.website || null,
        address: result.address || null,
        type: result.type || 'place',
        rating: result.rating || null,
        user_ratings_total: result.user_ratings_total || null,
        opening_date: result.opening_date || null,
        created_at: new Date().toISOString(),
        user_id: user.id,
        status: 'new',
        deal_value: 0,
        tags: [],
        extraction_date: new Date().toISOString(),
        last_interaction_at: null,
        stage: 'novo' as PipelineStage,
        kanban_order: 0,
        notes: null,
      }));

      console.log('Leads to add:', leadsToAdd);

      const { error } = await supabase
        .from('leads')
        .insert(leadsToAdd);

      if (error) {
        console.error('Error inserting leads:', error);
        toast({
          title: "Erro ao adicionar leads",
          description: "Não foi possível salvar os leads selecionados.",
          variant: "destructive",
        });
        return;
      }

      onAddLeads(selectedResults);
      setSelectedLeads(new Set());
      
      toast({
        title: "Sucesso",
        description: `${selectedResults.length} leads adicionados com sucesso!`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar os leads.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <SearchHeader
        totalResults={results.length}
        selectedCount={selectedLeads.size}
        onSelectAll={handleSelectAll}
        onAddSelected={handleAddSelected}
        isAllSelected={selectedLeads.size === currentResults.length}
      />

      <div className="grid gap-4">
        {currentResults.map((result, index) => (
          <SearchResultCard
            key={startIndex + index}
            result={result}
            isSelected={selectedLeads.has(startIndex + index)}
            onSelect={() => handleSelectLead(startIndex + index)}
          />
        ))}
      </div>

      <SearchPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};