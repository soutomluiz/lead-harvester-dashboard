import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { WelcomeTour } from "@/components/WelcomeTour";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { SidebarUserSection } from "@/components/SidebarUserSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name || '');
          setAvatarUrl(profile.avatar_url);
        }
      }
    };

    fetchUserProfile();
  }, []);

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 pb-16">
          <div className="flex justify-between items-center mb-8 animate-fadeIn">
            <h1 className="text-2xl font-bold">
              Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {userName}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl || ""} />
                <AvatarFallback>
                  <UserRound className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
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
        <AppFooter />
        <WelcomeTour />
      </div>
    </SidebarProvider>
  );
};

export default Index;