import { useState } from "react";
import { Table } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LeadTableHeader } from "./leads/LeadTableHeader";
import { LeadTableBody } from "./leads/LeadTableBody";
import { LeadTableFilters } from "./leads/LeadTableFilters";

interface LeadTableProps {
  leads: Lead[];
}

export const LeadTable = ({ leads: initialLeads }: LeadTableProps) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [filters, setFilters] = useState<Partial<Lead>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lead | null;
    direction: 'asc' | 'desc' | null;
  }>({
    key: null,
    direction: null
  });
  const { toast } = useToast();

  const capitalizeFirstLetter = (string: string | null) => {
    if (!string) return "";
    return string.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleSort = (key: keyof Lead) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({
      key: direction ? key : null,
      direction
    });
  };

  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    if (!newStatus) return;
    
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));

      toast({
        title: "Status atualizado",
        description: "O status do lead foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do lead.",
        variant: "destructive",
      });
    }
  };

  const handleTagsChange = async (leadId: string, newTags: string[]) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ tags: newTags })
        .eq("id", leadId);

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, tags: newTags } : lead
      ));

      toast({
        title: "Tags atualizadas",
        description: "As tags do lead foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating tags:", error);
      toast({
        title: "Erro ao atualizar tags",
        description: "Não foi possível atualizar as tags do lead.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNote = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ notes: noteContent })
        .eq("id", leadId);

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, notes: noteContent } : lead
      ));

      setEditingNoteId(null);
      setNoteContent("");
      
      toast({
        title: "Nota salva",
        description: "A nota do lead foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Erro ao salvar nota",
        description: "Não foi possível salvar a nota do lead.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (lead: Lead) => {
    setEditingNoteId(lead.id);
    setNoteContent(lead.notes || "");
  };

  const handleExportCSV = () => {
    const headers = [
      "Company Name",
      "Industry",
      "Location",
      "Contact Name",
      "Email",
      "Phone",
      "Notes",
      "Status",
      "Tags"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.company_name,
          lead.industry,
          lead.location,
          lead.contact_name,
          lead.email,
          lead.phone,
          lead.notes,
          lead.status,
          lead.tags.join(";")
        ]
          .map((field) => `"${field || ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortLeads = (leadsToSort: Lead[]) => {
    if (!sortConfig.key || !sortConfig.direction) return leadsToSort;

    return [...leadsToSort].sort((a, b) => {
      if (a[sortConfig.key!] === null) return 1;
      if (b[sortConfig.key!] === null) return -1;

      let aValue = a[sortConfig.key!];
      let bValue = b[sortConfig.key!];

      if (sortConfig.key === 'location') {
        aValue = capitalizeFirstLetter(aValue as string | null);
        bValue = capitalizeFirstLetter(bValue as string | null);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredLeads = sortLeads(leads.filter((lead) => {
    const matchesSearch =
      lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.contact_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (lead.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return true;
      const leadValue = lead[key as keyof Lead];
      
      if (key === 'tags') {
        const leadTags = leadValue as string[] || [];
        return (value as string[]).every(tag => leadTags.includes(tag));
      }
      
      return typeof leadValue === 'string' ? 
        leadValue.toLowerCase().includes(value.toString().toLowerCase()) : 
        leadValue === value;
    });

    return matchesSearch && matchesFilters;
  })).map(lead => ({
    ...lead,
    location: capitalizeFirstLetter(lead.location)
  }));

  return (
    <Card className="w-full">
      <LeadTableFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onExportCSV={handleExportCSV}
      />
      <Table>
        <LeadTableHeader
          sortConfig={sortConfig}
          onSort={handleSort}
        />
        <LeadTableBody
          leads={filteredLeads}
          editingNoteId={editingNoteId}
          noteContent={noteContent}
          onStatusChange={handleStatusChange}
          onEditNote={handleEditNote}
          onSaveNote={handleSaveNote}
          onNoteContentChange={setNoteContent}
          onTagsChange={handleTagsChange}
        />
      </Table>
    </Card>
  );
};