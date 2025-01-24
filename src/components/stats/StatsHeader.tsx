import { StatCard } from "./StatCard";
import { Users, Clock, Target, Mail, Phone, Building2 } from "lucide-react";
import { Lead } from "@/types/lead";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, parseISO, differenceInDays } from "date-fns";

interface StatsHeaderProps {
  leads: Lead[];
}

export function StatsHeader({ leads }: StatsHeaderProps) {
  const { t } = useLanguage();
  
  const totalLeads = leads.length;
  const emailsFound = leads.filter(lead => lead.email).length;
  const phonesFound = leads.filter(lead => lead.phone).length;
  const withWebsite = leads.filter(lead => lead.website).length;
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}