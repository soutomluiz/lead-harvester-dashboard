import { Lead } from "@/types/lead";
import { SearchResult } from "@/types/search";
import { Mail, Phone, Users, Target, Building2, MapPin, Clock, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatCard } from "./stats/StatCard";
import { LeadsOriginChart } from "./stats/LeadsOriginChart";
import { IndustriesChart } from "./stats/IndustriesChart";
import { LeadsTimelineChart } from "./stats/LeadsTimelineChart";
import { LeadStatusChart } from "./stats/LeadStatusChart";
import { format, parseISO, differenceInDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardStatsProps {
  leads?: Lead[];
  results?: SearchResult[];
  searchType?: "places" | "websites";
}

const chartConfig = {
  leads: {
    theme: {
      light: "#4F46E5",
      dark: "#818CF8",
    },
  },
  places: {
    theme: {
      light: "#10B981",
      dark: "#34D399",
    },
  },
  websites: {
    theme: {
      light: "#8B5CF6",
      dark: "#A78BFA",
    },
  },
};

export function DashboardStats({ leads, results, searchType }: DashboardStatsProps) {
  const { t } = useLanguage();

  if (leads) {
    const totalLeads = leads.length;
    const emailsFound = leads.filter(lead => lead.email).length;
    const phonesFound = leads.filter(lead => lead.phone).length;
    const withLocation = leads.filter(lead => lead.location).length;
    const withWebsite = leads.filter(lead => lead.website).length;
    const withIndustry = leads.filter(lead => lead.industry).length;
    const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
    
    const leadsWithTags = leads.filter(lead => lead.tags && lead.tags.length > 0).length;
    const recentLeads = leads.filter(lead => {
      if (!lead.created_at) return false;
      const daysDiff = differenceInDays(new Date(), parseISO(lead.created_at));
      return daysDiff <= 30;
    }).length;

    const stats = [
      {
        title: t("totalLeads"),
        value: totalLeads,
        icon: Users,
        color: "text-blue-500",
        description: t("leadsRegistered")
      },
      {
        title: t("recentLeads"),
        value: recentLeads,
        icon: Clock,
        color: "text-yellow-500",
        description: t("last30Days")
      },
      {
        title: t("withTags"),
        value: leadsWithTags,
        icon: Target,
        color: "text-pink-500",
        description: t("leadsWithTags")
      },
      {
        title: t("withEmail"),
        value: emailsFound,
        icon: Mail,
        color: "text-indigo-500",
        description: t("contactsWithEmail")
      },
      {
        title: t("withPhone"),
        value: phonesFound,
        icon: Phone,
        color: "text-cyan-500",
        description: t("contactsWithPhone")
      },
      {
        title: t("withWebsite"),
        value: withWebsite,
        icon: Building2,
        color: "text-teal-500",
        description: t("withSite")
      },
    ];

    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

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
      </div>
    );
  }

  if (results && searchType === "websites") {
    const totalWebsites = results.length;
    const websitesWithContact = results.filter(result => result.email || result.phone).length;
    const uniqueDomains = new Set(results.map(result => result.source)).size;

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">{t("websitesFound")}</h3>
          <p className="text-3xl font-bold text-primary">{totalWebsites}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">{t("withContactInfo")}</h3>
          <p className="text-3xl font-bold text-primary">{websitesWithContact}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">{t("uniqueDomains")}</h3>
          <p className="text-3xl font-bold text-primary">{uniqueDomains}</p>
        </Card>
      </div>
    );
  }

  if (results && searchType === "places") {
    const resultsWithRating = results.filter(result => result.rating !== undefined);
    const averageRating = resultsWithRating.length > 0
      ? (resultsWithRating.reduce((acc, curr) => acc + (curr.rating || 0), 0) / resultsWithRating.length).toFixed(1)
      : '0.0';

    const companiesWithPhone = results.filter(result => result.phone).length;

    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">{t("companiesFound")}</h3>
          <p className="text-3xl font-bold text-primary">{results.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">{t("averageRating")}</h3>
          <p className="text-3xl font-bold text-primary">{averageRating}/5</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">{t("withPhone")}</h3>
          <p className="text-3xl font-bold text-primary">{companiesWithPhone}</p>
        </Card>
      </div>
    );
  }

  return null;
}