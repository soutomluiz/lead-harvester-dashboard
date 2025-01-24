import { Lead } from "@/types/lead";
import { SearchResult } from "@/types/search";
import { Card } from "@/components/ui/card";
import { StatsHeader } from "./stats/StatsHeader";
import { StatsCharts } from "./stats/StatsCharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const newChannel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    setChannel(newChannel);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  if (leads) {
    return (
      <div className="space-y-6 p-6">
        <StatsHeader leads={leads} />
        <StatsCharts leads={leads} chartConfig={chartConfig} />
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
          <h3 className="text-lg font-semibold text-primary">Websites Found</h3>
          <p className="text-3xl font-bold text-primary">{totalWebsites}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">With Contact Info</h3>
          <p className="text-3xl font-bold text-primary">{websitesWithContact}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Unique Domains</h3>
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
          <h3 className="text-lg font-semibold text-primary">Companies Found</h3>
          <p className="text-3xl font-bold text-primary">{results.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">Average Rating</h3>
          <p className="text-3xl font-bold text-primary">{averageRating}/5</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-lg font-semibold text-primary">With Phone</h3>
          <p className="text-3xl font-bold text-primary">{companiesWithPhone}</p>
        </Card>
      </div>
    );
  }

  return null;
}