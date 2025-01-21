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
import { Download, Search, Edit2, Save } from "lucide-react";
import { Lead } from "@/types/lead";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const LeadTable = ({ leads: initialLeads }: { leads: Lead[] }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const { toast } = useToast();

  const filteredLeads = leads.filter((lead) =>
    Object.values(lead).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEditNote = (lead: Lead) => {
    setEditingNoteId(lead.id);
    setNoteContent(lead.notes || "");
  };

  const handleSaveNote = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ notes: noteContent })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      // Atualiza o estado local com a nota atualizada
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, notes: noteContent } : lead
      ));

      toast({
        title: "Nota salva",
        description: "A nota foi atualizada com sucesso.",
      });
      
      setEditingNoteId(null);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      toast({
        title: "Erro ao salvar nota",
        description: "Não foi possível salvar a nota. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Company Name",
      "Industry",
      "Location",
      "Contact Name",
      "Email",
      "Phone",
      "Notes",
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
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
          ].join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Empresa</TableHead>
              <TableHead>Indústria</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Nome do Contato</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.company_name}</TableCell>
                <TableCell>{lead.industry}</TableCell>
                <TableCell>{lead.location}</TableCell>
                <TableCell>{lead.contact_name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell className="max-w-md">
                  {editingNoteId === lead.id ? (
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Adicione suas notas aqui..."
                    />
                  ) : (
                    <div className="whitespace-pre-wrap">{lead.notes}</div>
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
      </div>
    </Card>
  );
};