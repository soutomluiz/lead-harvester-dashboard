import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppFooter } from "@/components/AppFooter";
import { WelcomeTour } from "@/components/WelcomeTour";
import { Lead } from "@/types/lead";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserProfilePanel } from "@/components/UserProfilePanel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { AuthPage } from "@/components/AuthPage";

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

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { handleSignOut } = useAuth();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Starting to fetch user profile for ID:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (profile) {
        console.log("Profile loaded successfully:", profile);
        setUserName(profile.full_name || '');
        setAvatarUrl(profile.avatar_url);
        setUserProfile(profile);
      } else {
        console.log("No profile found for user:", userId);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const checkAuth = async () => {
      try {
        console.log("Starting authentication check...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session check error:", sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        console.log("Active session found, fetching user profile...");
        if (mounted) {
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, "Session:", session?.user?.id);
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log("User signed out or no session");
          if (mounted) {
            setIsAuthenticated(false);
            setUserName('');
            setAvatarUrl(null);
            setUserProfile(null);
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_IN' && session) {
          console.log("User signed in, fetching profile...");
          if (mounted) {
            setIsAuthenticated(true);
            await fetchUserProfile(session.user.id);
            setIsLoading(false);
          }
        }
      });
      
      authSubscription = subscription;
    } catch (error) {
      console.error("Error setting up auth subscription:", error);
      if (mounted) {
        setIsLoading(false);
      }
    }

    return () => {
      console.log("Cleaning up auth subscriptions...");
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
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

  if (isLoading) {
    console.log("Rendering loading state...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, rendering AuthPage...");
    return <AuthPage />;
  }

  console.log("Rendering main dashboard...");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
        <AppFooter />
        <WelcomeTour />
      </div>
    </SidebarProvider>
  );
};

export default Index;