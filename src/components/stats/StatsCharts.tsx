import { Card } from "@/components/ui/card";
import { Lead } from "@/types/lead";
import { useLanguage } from "@/contexts/LanguageContext";
import { LeadsTimelineChart } from "./LeadsTimelineChart";
import { LeadStatusChart } from "./LeadStatusChart";
import { LeadsOriginChart } from "./LeadsOriginChart";
import { IndustriesChart } from "./IndustriesChart";

interface StatsChartsProps {
  leads: Lead[];
  chartConfig: any;
}

export function StatsCharts({ leads, chartConfig }: StatsChartsProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">{t("leadsOverTime")}</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <LeadsTimelineChart leads={leads} chartConfig={chartConfig} />
          </div>
        </Card>
        <Card className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">{t("leadsStatus")}</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <LeadStatusChart leads={leads} chartConfig={chartConfig} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">{t("leadsOrigin")}</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <LeadsOriginChart leads={leads} chartConfig={chartConfig} />
          </div>
        </Card>
        <Card className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">{t("topIndustries")}</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <IndustriesChart leads={leads} chartConfig={chartConfig} />
          </div>
        </Card>
      </div>
    </>
  );
}