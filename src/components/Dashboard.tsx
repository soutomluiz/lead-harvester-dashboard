import { Card } from "@/components/ui/card";
import { Users, MapPin, Building } from "lucide-react";

interface DashboardStatsProps {
  totalLeads: number;
  uniqueLocations: number;
  uniqueIndustries: number;
}

export const DashboardStats = ({
  totalLeads,
  uniqueLocations,
  uniqueIndustries,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-slideUp">
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
          <h3 className="text-2xl font-bold">{totalLeads}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Locations</p>
          <h3 className="text-2xl font-bold">{uniqueLocations}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Industries</p>
          <h3 className="text-2xl font-bold">{uniqueIndustries}</h3>
        </div>
      </Card>
    </div>
  );
};