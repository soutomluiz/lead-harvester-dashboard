import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LeadNotesProps {
  id: string;
  notes: string | null;
  isEditing: boolean;
  noteContent: string;
  onEdit: () => void;
  onSave: (id: string) => void;
  onContentChange: (content: string) => void;
}

export function LeadNotes({
  id,
  notes,
  isEditing,
  noteContent,
  onEdit,
  onSave,
  onContentChange,
}: LeadNotesProps) {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <Input
          value={noteContent}
          onChange={(e) => onContentChange(e.target.value)}
          className="flex-1"
        />
        <Button size="sm" onClick={() => onSave(id)}>
          Save
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="truncate max-w-[200px]">{notes || "-"}</span>
      <Button size="sm" variant="ghost" onClick={onEdit}>
        Edit
      </Button>
    </div>
  );
}