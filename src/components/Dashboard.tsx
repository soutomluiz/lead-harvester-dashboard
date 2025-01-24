import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadForm } from "@/components/LeadForm";
import { UrlExtractionForm } from "@/components/leads/UrlExtractionForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lead } from "@/types/lead";
import { ExtractionCards } from "@/components/ExtractionCards";
import { LeadsList } from "@/components/leads/LeadsList";
import { LeadScore } from "@/components/leads/LeadScore";
import { LeadTimeline } from "@/components/leads/LeadTimeline";
import { Reports } from "@/components/reports/Reports";
import { Subscription } from "@/components/subscription/Subscription";
import { ConfigPanel } from "@/components/config/ConfigPanel";
import { ProspectingForm } from "@/components/ProspectingForm";

interface DashboardProps {
  activeTab: string;
  leads: Lead[];
  onSubmit: (data: Partial<Lead>) => void;
  onAddLeads: (leads: Lead[]) => void;
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ activeTab, leads, onSubmit, onAddLeads, setActiveTab }: DashboardProps) {
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <ExtractionCards setActiveTab={setActiveTab} />;
      case "prospect-form":
        return (
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">{t("manualInput")}</TabsTrigger>
              <TabsTrigger value="url">{t("urlInput")}</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <LeadForm onSubmit={onSubmit} />
            </TabsContent>
            <TabsContent value="url">
              <UrlExtractionForm onAddLeads={onAddLeads} />
            </TabsContent>
          </Tabs>
        );
      case "prospect-places":
        return <ProspectingForm onAddLeads={onAddLeads} searchType="places" />;
      case "prospect-websites":
        return <ProspectingForm onAddLeads={onAddLeads} searchType="websites" />;
      case "leads-list":
        return <LeadsList leads={leads} />;
      case "leads-score":
        return <LeadScore leads={leads} />;
      case "leads-timeline":
        return <LeadTimeline leads={leads} />;
      case "reports":
        return <Reports leads={leads} />;
      case "subscription":
        return <Subscription />;
      case "config":
        return <ConfigPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
}