import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserProfilePanel } from "@/components/UserProfilePanel";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Dashboard } from "@/components/Dashboard";
import { Lead } from "@/types/lead";

interface AuthenticatedLayoutProps {
  userName: string;
  avatarUrl: string | null;
  userProfile: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const getPageTitle = (tab: string) => {
  switch (tab) {
    case "dashboard":
      return "Dashboard";
    case "prospect-form":
      return "Manual Input";
    case "prospect-places":
      return "Google Maps";
    case "prospect-websites":
      return "Websites";
    case "leads-list":
      return "Leads List";
    case "leads-score":
      return "Lead Score";
    case "leads-timeline":
      return "Timeline";
    case "reports":
      return "Reports";
    case "subscription":
      return "Subscription";
    case "config":
      return "Settings";
    default:
      return "";
  }
};

export function AuthenticatedLayout({ 
  userName, 
  avatarUrl, 
  userProfile, 
  activeTab,
  setActiveTab 
}: AuthenticatedLayoutProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { t } = useLanguage();
  const { handleSignOut } = useAuth();

  const handleAddLead = (data: Omit<Lead, "id">) => {
    const newLead = {
      ...data,
      id: crypto.randomUUID(),
    };
    setLeads([...leads, newLead]);
  };

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads([...leads, ...newLeads]);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 p-6 pb-16">
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <h1 className="text-2xl font-bold">
            {getPageTitle(activeTab)}
          </h1>
          <div className="flex items-center gap-4">
            {userName && (
              <span className="text-sm font-medium">
                {t("hello")}, {userName}
              </span>
            )}
            <NotificationBell />
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={avatarUrl || ""} />
                  <AvatarFallback>
                    <UserRound className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>{t("profile")}</SheetTitle>
                </SheetHeader>
                <UserProfilePanel initialData={userProfile} />
              </SheetContent>
            </Sheet>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleSignOut}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mt-6 animate-fadeIn">
          <Dashboard 
            activeTab={activeTab}
            leads={leads}
            onSubmit={handleAddLead}
            onAddLeads={handleAddLeads}
            setActiveTab={setActiveTab}
          />
        </div>
      </main>
    </div>
  );
}