import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfilePanel } from "@/components/UserProfilePanel";
import { Crown, LogOut, UserRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileButtonProps {
  avatarUrl: string | null;
  userProfile: any;
  onSignOut: () => void;
}

interface ProfileResponse {
  subscription_status: string | null;
}

export function UserProfileButton({ avatarUrl, userProfile, onSignOut }: UserProfileButtonProps) {
  const { t } = useLanguage();
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription status:', error);
          return;
        }

        const profile = data as ProfileResponse;
        setHasSubscription(profile?.subscription_status === 'active');
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, []);

  return (
    <div className="relative">
      <Sheet>
        <SheetTrigger asChild>
          <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback>
              <UserRound className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>
        {hasSubscription && (
          <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
            <Crown className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{t("profile")}</SheetTitle>
          </SheetHeader>
          <UserProfilePanel initialData={userProfile} />
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={onSignOut}
              className="w-full hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-5 w-5 mr-2" />
              {t("signOut")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}