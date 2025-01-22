import { Lead } from "@/types/lead";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LeadScore } from "./LeadScore";

interface LeadTableRowProps {
  lead: Lead;
  editingNoteId: string | null;
  noteContent: string;
  statusColors: Record<string, string>;
  onStatusChange: (leadId: string, newStatus: Lead["status"]) => void;
  onDealValueChange: (leadId: string, newValue: number) => void;
  onEditNote: (lead: Lead) => void;
  onSaveNote: (leadId: string) => void;
  onNoteContentChange: (content: string) => void;
}

export function LeadTableRow({
  lead,
  editingNoteId,
  noteContent,
  statusColors,
  onStatusChange,
  onDealValueChange,
  onEditNote,
  onSaveNote,
  onNoteContentChange,
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
      <TableCell>
        <Input
          type="number"
          value={lead.deal_value || 0}
          onChange={(e) => onDealValueChange(lead.id, Number(e.target.value))}
          className="w-32"
        />
      </TableCell>
      <TableCell>{lead.industry || "-"}</TableCell>
      <TableCell>{lead.location || "-"}</TableCell>
      <TableCell>{lead.contact_name || "-"}</TableCell>
      <TableCell>{lead.email || "-"}</TableCell>
      <TableCell>{lead.phone || "-"}</TableCell>
      <TableCell>
        {editingNoteId === lead.id ? (
          <div className="flex gap-2">
            <Input
              value={noteContent}
              onChange={(e) => onNoteContentChange(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={() => onSaveNote(lead.id)}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="truncate max-w-[200px]">{lead.notes || "-"}</span>
            <Button size="sm" variant="ghost" onClick={() => onEditNote(lead)}>
              Edit
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell>
        <LeadScore lead={lead} />
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {lead.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
}