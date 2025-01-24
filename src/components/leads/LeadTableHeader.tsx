import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeadTableSort } from "./LeadTableSort";
import { Lead } from "@/types/lead";

interface LeadTableHeaderProps {
  sortConfig: {
    key: keyof Lead | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (key: keyof Lead) => void;
}

export function LeadTableHeader({ sortConfig, onSort }: LeadTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="whitespace-nowrap">
          Company Name <LeadTableSort columnKey="company_name" sortConfig={sortConfig} onSort={onSort} />
        </TableHead>
        <TableHead className="whitespace-nowrap">
          Status <LeadTableSort columnKey="status" sortConfig={sortConfig} onSort={onSort} />
        </TableHead>
        <TableHead className="whitespace-nowrap">
          Industry <LeadTableSort columnKey="industry" sortConfig={sortConfig} onSort={onSort} />
        </TableHead>
        <TableHead className="whitespace-nowrap">
          Location <LeadTableSort columnKey="location" sortConfig={sortConfig} onSort={onSort} />
        </TableHead>
        <TableHead className="whitespace-nowrap">
          Contact Name <LeadTableSort columnKey="contact_name" sortConfig={sortConfig} onSort={onSort} />
        </TableHead>
        <TableHead className="whitespace-nowrap">
          Email <LeadTableSort columnKey="email" sortConfig={sortConfig} onSort={onSort} />
        </TableHead>
        <TableHead className="whitespace-nowrap">
          Phone <LeadTableSort columnKey="phone" sortConfig={sortConfig} onSort={onSort} />
        </TableHead>
        <TableHead>Notes</TableHead>
        <TableHead>Tags</TableHead>
      </TableRow>
    </TableHeader>
  );
}