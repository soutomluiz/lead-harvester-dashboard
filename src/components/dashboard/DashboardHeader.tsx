import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserRound, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfilePanel } from "@/components/UserProfilePanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  userName: string;
  avatarUrl: string | null;
  userProfile: any;
}

export function DashboardHeader({ userName, avatarUrl, userProfile }: DashboardHeaderProps) {
  const { t } = useLanguage();
  const { handleSignOut } = useAuth();
  const [trialProgress, setTrialProgress] = useState(100);
  const [trialDaysLeft, setTrialDaysLeft] = useState(14);

  useEffect(() => {
    if (userProfile?.trial_start_date) {
      const startDate = new Date(userProfile.trial_start_date);
      const now = new Date();
      const trialEndDate = new Date(startDate.getTime() + (14 * 24 * 60 * 60 * 1000));
      const totalDuration = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
      const elapsed = now.getTime() - startDate.getTime();
      const remaining = trialEndDate.getTime() - now.getTime();
      const daysLeft = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
      
      const progress = Math.max(0, Math.min(100, ((totalDuration - elapsed) / totalDuration) * 100));
      
      setTrialProgress(progress);
      setTrialDaysLeft(daysLeft);
    }
  }, [userProfile?.trial_start_date]);

  const isNewUser = userProfile?.trial_status === 'active' && 
                   new Date(userProfile?.trial_start_date).getTime() > Date.now() - (24 * 60 * 60 * 1000); // Less than 24h old

  return (
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
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#9b87f5 ${trialProgress}%, transparent ${trialProgress}%)`,
                transform: 'rotate(-90deg)',
              }}
            />
            <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity border-4 border-background">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback>
                <UserRound className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            {userProfile?.subscription_type === 'trial' && trialDaysLeft > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {trialDaysLeft}d
              </div>
            )}
          </div>
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
      <WelcomeDialog isNewUser={isNewUser} trialDaysLeft={trialDaysLeft} />
    </div>
  );
}