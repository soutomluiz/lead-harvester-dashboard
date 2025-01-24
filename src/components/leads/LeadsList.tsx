import { Lead } from "@/types/lead";

interface LeadsListProps {
  leads: Lead[];
}

export function LeadsList({ leads }: LeadsListProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lista de Leads</h2>
      <p>Total de leads: {leads.length}</p>
    </div>
  );
}
