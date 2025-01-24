import { TableBody } from "@/components/ui/table";
import { Lead } from "@/types/lead";
import { LeadTableRow } from "./LeadTableRow";

interface LeadTableBodyProps {
  leads: Lead[];
  editingNoteId: string | null;
  noteContent: string;
  onStatusChange: (leadId: string, newStatus: Lead["status"]) => void;
  onEditNote: (lead: Lead) => void;
  onSaveNote: (leadId: string) => void;
  onNoteContentChange: (content: string) => void;
  onTagsChange: (leadId: string, tags: string[]) => void;
}

export function LeadTableBody({
  leads,
  editingNoteId,
  noteContent,
  onStatusChange,
  onEditNote,
  onSaveNote,
  onNoteContentChange,
  onTagsChange,
}: LeadTableBodyProps) {
  return (
    <TableBody>
      {leads.map((lead) => (
        <LeadTableRow
          key={lead.id}
          lead={lead}
          editingNoteId={editingNoteId}
          noteContent={noteContent}
          onStatusChange={onStatusChange}
          onEditNote={onEditNote}
          onSaveNote={onSaveNote}
          onNoteContentChange={onNoteContentChange}
          onTagsChange={onTagsChange}
        />
      ))}
    </TableBody>
  );
}