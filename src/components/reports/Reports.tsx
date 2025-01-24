import { Lead } from "@/types/lead";

interface ReportsProps {
  leads: Lead[];
}

export function Reports({ leads }: ReportsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatórios</h2>
      {/* Reports content will be implemented later */}
      <p>Em desenvolvimento...</p>
    </div>
  );
}