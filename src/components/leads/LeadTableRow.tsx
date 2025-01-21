import { Lead } from "@/types/lead";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const LeadTableRow = ({
  lead,
  editingNoteId,
  noteContent,
  statusColors,
  onStatusChange,
  onDealValueChange,
  onEditNote,
  onSaveNote,
  onNoteContentChange,
}: LeadTableRowProps) => {
  return (
    <TableRow key={lead.id}>
      <TableCell>{lead.company_name}</TableCell>
      <TableCell>
        <Select
          value={lead.status || "new"}
          onValueChange={(value) => onStatusChange(lead.id, value as Lead["status"])}
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
          onChange={(e) => onDealValueChange(lead.id, parseFloat(e.target.value))}
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
            onChange={(e) => onNoteContentChange(e.target.value)}
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
            onClick={() => onSaveNote(lead.id)}
          >
            <Save className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditNote(lead)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};