import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LeadTableHeader } from "./leads/LeadTableHeader";
import { LeadTableRow } from "./leads/LeadTableRow";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

const statusColors = {
  new: "bg-gray-100 text-gray-800",
  qualified: "bg-green-100 text-green-800",
  unqualified: "bg-red-100 text-red-800",
  open: "bg-blue-100 text-blue-800",
} as const;

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
      const { data, error } = await supabase
        .from("leads")
        .update({ notes: noteContent })
        .eq("id", leadId)
        .select()
        .single();

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, notes: noteContent } : lead
      ));

      setEditingNoteId(null);
      setNoteContent("");
      
      toast({
        title: "Note saved successfully",
        description: "The lead note has been updated.",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error saving note",
        description: "There was a problem saving the note. Please try again.",
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
      "Status"
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
          lead.status
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

      // Handle special cases for certain columns
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

  const renderSortIcon = (columnKey: keyof Lead) => {
    return (
      <Button
        variant="ghost"
        onClick={() => handleSort(columnKey)}
        className="h-8 w-8 p-0 ml-2 hover:bg-transparent"
      >
        <ArrowUpDown className={`h-4 w-4 ${
          sortConfig.key === columnKey 
            ? sortConfig.direction === 'asc'
              ? 'text-primary rotate-180'
              : 'text-primary'
            : 'text-muted-foreground'
        }`} />
      </Button>
    );
  };

  return (
    <Card className="w-full">
      <LeadTableHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onExportCSV={handleExportCSV}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">
              Company Name {renderSortIcon('company_name')}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Status {renderSortIcon('status')}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Industry {renderSortIcon('industry')}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Location {renderSortIcon('location')}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Contact Name {renderSortIcon('contact_name')}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Email {renderSortIcon('email')}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Phone {renderSortIcon('phone')}
            </TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              editingNoteId={editingNoteId}
              noteContent={noteContent}
              statusColors={statusColors}
              onStatusChange={handleStatusChange}
              onEditNote={handleEditNote}
              onSaveNote={handleSaveNote}
              onNoteContentChange={setNoteContent}
              onTagsChange={handleTagsChange}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
