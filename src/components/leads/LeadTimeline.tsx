import { Lead } from "@/types/lead";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Timeline, TimelineItem, TimelineConnector, TimelineContent, TimelineDot, TimelineSeparator } from "@mui/lab";
import { CalendarDays, Mail, Phone, Globe, Building2, MapPin, Tags, DollarSign } from "lucide-react";

interface LeadTimelineProps {
  leads: Lead[];
}

export function LeadTimeline({ leads }: LeadTimelineProps) {
  const sortedLeads = [...leads].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  const getIcon = (field: string) => {
    switch (field) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      case "company_name":
        return <Building2 className="h-4 w-4" />;
      case "location":
        return <MapPin className="h-4 w-4" />;
      case "tags":
        return <Tags className="h-4 w-4" />;
      case "deal_value":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Timeline de Leads</h2>
      <Timeline position="right">
        {sortedLeads.map((lead, index) => (
          <TimelineItem key={lead.id}>
            <TimelineSeparator>
              <TimelineDot color="primary">
                {getIcon("company_name")}
              </TimelineDot>
              {index < sortedLeads.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <div className="mb-4">
                <h3 className="font-semibold">{lead.company_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {lead.created_at && format(parseISO(lead.created_at), "dd/MM/yyyy HH:mm")}
                </p>
                <div className="mt-2 space-y-1">
                  {lead.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      {lead.email}
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {lead.phone}
                    </div>
                  )}
                  {lead.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4" />
                      {lead.website}
                    </div>
                  )}
                  {lead.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {lead.location}
                    </div>
                  )}
                  {lead.deal_value > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4" />
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(lead.deal_value)}
                    </div>
                  )}
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tags className="h-4 w-4" />
                      {lead.tags.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}