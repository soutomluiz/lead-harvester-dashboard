import { Card } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { Mail, Phone, Globe, Users } from "lucide-react";

interface ProspectingMetricsCardProps {
  leads: Lead[];
}

export function ProspectingMetricsCard({ leads }: ProspectingMetricsCardProps) {
  const totalLeads = leads.length;
  const leadsWithEmail = leads.filter(l => l.email).length;
  const leadsWithPhone = leads.filter(l => l.phone).length;
  const leadsWithWebsite = leads.filter(l => l.website).length;

  const emailPercentage = totalLeads > 0 ? (leadsWithEmail / totalLeads) * 100 : 0;
  const phonePercentage = totalLeads > 0 ? (leadsWithPhone / totalLeads) * 100 : 0;
  const websitePercentage = totalLeads > 0 ? (leadsWithWebsite / totalLeads) * 100 : 0;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Métricas de Prospecção</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="text-blue-500 h-5 w-5" />
            <div>
              <p className="text-sm text-muted-foreground">Total de Leads</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mail className="text-indigo-500 h-5 w-5" />
            <div>
              <p className="text-sm text-muted-foreground">Com Email</p>
              <p className="text-2xl font-bold">{leadsWithEmail}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {emailPercentage.toFixed(1)}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Phone className="text-green-500 h-5 w-5" />
            <div>
              <p className="text-sm text-muted-foreground">Com Telefone</p>
              <p className="text-2xl font-bold">{leadsWithPhone}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {phonePercentage.toFixed(1)}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe className="text-purple-500 h-5 w-5" />
            <div>
              <p className="text-sm text-muted-foreground">Com Website</p>
              <p className="text-2xl font-bold">{leadsWithWebsite}</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {websitePercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  );
}