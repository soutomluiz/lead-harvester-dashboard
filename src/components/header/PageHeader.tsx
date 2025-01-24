import { NotificationBell } from "@/components/NotificationBell";
import { UserCredits } from "@/components/UserCredits";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfileButton } from "./UserProfileButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageHeaderProps {
  userName?: string;
  avatarUrl: string | null;
  userProfile: any;
  onSignOut: () => void;
}

export function PageHeader({ userName, avatarUrl, userProfile, onSignOut }: PageHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-4">
      {userName && (
        <span className="text-sm font-medium">
          {t("hello")}, {userName}
        </span>
      )}
      <NotificationBell />
      <UserCredits />
      <ThemeToggle />
      <UserProfileButton 
        avatarUrl={avatarUrl} 
        userProfile={userProfile} 
        onSignOut={onSignOut}
      />
    </div>
  );
}