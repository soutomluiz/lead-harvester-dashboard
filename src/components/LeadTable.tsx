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
  const { toast } = useToast();

  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    if (!newStatus) return;
    
    try {
      const { data, error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId)
        .select()
        .single();

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

  const handleDealValueChange = async (leadId: string, newValue: number) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ deal_value: newValue })
        .eq("id", leadId);
      
      if (error) throw error;
      
      setLeads(leads.map(l => 
        l.id === leadId ? { ...l, deal_value: newValue } : l
      ));
    } catch (error) {
      console.error("Error updating deal value:", error);
      toast({
        title: "Error",
        description: "Failed to update deal value",
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
      "Status",
      "Deal Value"
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
          lead.deal_value
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

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.contact_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (lead.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const leadValue = lead[key as keyof Lead];
      return typeof leadValue === 'string' ? 
        leadValue.toLowerCase().includes(value.toString().toLowerCase()) : 
        leadValue === value;
    });

    return matchesSearch && matchesFilters;
  });

  return (
    <Card className="w-full">
      <LeadTableHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onExportCSV={handleExportCSV}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deal Value</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
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
              onDealValueChange={handleDealValueChange}
              onEditNote={handleEditNote}
              onSaveNote={handleSaveNote}
              onNoteContentChange={setNoteContent}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};