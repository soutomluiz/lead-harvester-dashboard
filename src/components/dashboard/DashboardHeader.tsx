import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserRound, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfilePanel } from "@/components/UserProfilePanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  userName: string;
  avatarUrl: string | null;
  userProfile: any;
}

export function DashboardHeader({ userName, avatarUrl, userProfile }: DashboardHeaderProps) {
  const { t } = useLanguage();
  const { handleSignOut } = useAuth();

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
  );
}