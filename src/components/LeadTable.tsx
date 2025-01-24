import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { LeadTableRow } from "./leads/LeadTableRow";
import { LeadTableSort } from "./leads/LeadTableSort";
import { LeadTableFilters } from "./leads/LeadTableFilters";
import { useLeadTable } from "./leads/table/useLeadTable";

interface LeadTableProps {
  leads: Lead[];
}

export const LeadTable = ({ leads: initialLeads }: LeadTableProps) => {
  const {
    leads,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    handleSort,
    handleStatusChange,
    handleTagsChange,
    handleEditNote,
    handleSaveNote,
    editingNoteId,
    noteContent,
    setNoteContent,
    handleExportCSV
  } = useLeadTable(initialLeads);

  return (
    <Card className="w-full">
      <LeadTableFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onExportCSV={handleExportCSV}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">
              Company Name <LeadTableSort columnKey="company_name" sortConfig={sortConfig} onSort={handleSort} />
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Status <LeadTableSort columnKey="status" sortConfig={sortConfig} onSort={handleSort} />
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Industry <LeadTableSort columnKey="industry" sortConfig={sortConfig} onSort={handleSort} />
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Location <LeadTableSort columnKey="location" sortConfig={sortConfig} onSort={handleSort} />
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Contact Name <LeadTableSort columnKey="contact_name" sortConfig={sortConfig} onSort={handleSort} />
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Email <LeadTableSort columnKey="email" sortConfig={sortConfig} onSort={handleSort} />
            </TableHead>
            <TableHead className="whitespace-nowrap">
              Phone <LeadTableSort columnKey="phone" sortConfig={sortConfig} onSort={handleSort} />
            </TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              editingNoteId={editingNoteId}
              noteContent={noteContent}
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