import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Search, Edit2, Save, Filter } from "lucide-react";
import { Lead } from "@/types/lead";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
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

  const handleSaveNote = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .update({ notes: noteContent })
        .eq("id", leadId)
        .select()
        .single();

      if (error) throw error;

      // Update local state with the new note
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

  // ... keep existing code (render JSX)

  return (
    <Card className="w-full">
      <div className="p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {Object.values(filters).filter(Boolean).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {Object.values(filters).filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filter Leads</h4>
                <p className="text-sm text-muted-foreground">
                  Filter leads by different criteria
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status || ""}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value as Lead['status'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="unqualified">Unqualified</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="Filter by industry..."
                    value={filters.industry || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, industry: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Filter by location..."
                    value={filters.location || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Filter by phone..."
                    value={filters.phone || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, phone: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Filter by email..."
                    value={filters.email || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
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
            <TableRow key={lead.id}>
              <TableCell>{lead.company_name}</TableCell>
              <TableCell>
                <Select
                  value={lead.status || "new"}
                  onValueChange={(value) => handleStatusChange(lead.id, value as Lead['status'])}
                >
                  <SelectTrigger className={`w-32 ${statusColors[lead.status as keyof typeof statusColors] || statusColors.new}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="unqualified">Unqualified</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={lead.deal_value || 0}
                  onChange={async (e) => {
                    const newValue = parseFloat(e.target.value);
                    try {
                      const { error } = await supabase
                        .from("leads")
                        .update({ deal_value: newValue })
                        .eq("id", lead.id);
                      
                      if (error) throw error;
                      
                      setLeads(leads.map(l => 
                        l.id === lead.id ? { ...l, deal_value: newValue } : l
                      ));
                    } catch (error) {
                      console.error("Error updating deal value:", error);
                      toast({
                        title: "Error",
                        description: "Failed to update deal value",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-24"
                />
              </TableCell>
              <TableCell>{lead.industry}</TableCell>
              <TableCell>{lead.location}</TableCell>
              <TableCell>{lead.contact_name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>
                {editingNoteId === lead.id ? (
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="max-w-[200px] truncate">{lead.notes}</div>
                )}
              </TableCell>
              <TableCell>
                {editingNoteId === lead.id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveNote(lead.id)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditNote(lead)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
