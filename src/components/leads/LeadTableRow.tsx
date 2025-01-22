import { Lead } from "@/types/lead";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LeadScore } from "./LeadScore";
import { LeadNotes } from "./LeadNotes";
import { TagInput } from "@/components/TagInput";

interface LeadTableRowProps {
  lead: Lead;
  editingNoteId: string | null;
  noteContent: string;
  onStatusChange: (leadId: string, newStatus: Lead["status"]) => void;
  onEditNote: (lead: Lead) => void;
  onSaveNote: (leadId: string) => void;
  onNoteContentChange: (content: string) => void;
  onTagsChange: (leadId: string, tags: string[]) => void;
}

export function LeadTableRow({
  lead,
  editingNoteId,
  noteContent,
  onStatusChange,
  onEditNote,
  onSaveNote,
  onNoteContentChange,
  onTagsChange,
}: LeadTableRowProps) {
  return (
    <TableRow key={lead.id}>
      <TableCell>{lead.company_name}</TableCell>
      <TableCell>
        <Select
          value={lead.status || "new"}
          onValueChange={(value) => onStatusChange(lead.id, value as Lead["status"])}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Novo</SelectItem>
            <SelectItem value="qualified">Qualificado</SelectItem>
            <SelectItem value="unqualified">Não Qualificado</SelectItem>
            <SelectItem value="open">Em Aberto</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{lead.industry || "-"}</TableCell>
      <TableCell>{lead.location || "-"}</TableCell>
      <TableCell>{lead.contact_name || "-"}</TableCell>
      <TableCell>{lead.email || "-"}</TableCell>
      <TableCell>{lead.phone || "-"}</TableCell>
      <TableCell>
        <LeadNotes
          id={lead.id}
          notes={lead.notes}
          isEditing={editingNoteId === lead.id}
          noteContent={noteContent}
          onEdit={() => onEditNote(lead)}
          onSave={onSaveNote}
          onContentChange={onNoteContentChange}
        />
      </TableCell>
      <TableCell>
        <LeadScore lead={lead} />
      </TableCell>
      <TableCell>
        <TagInput
          tags={lead.tags || []}
          onChange={(newTags) => onTagsChange(lead.id, newTags)}
        />
      </TableCell>
    </TableRow>
  );
}