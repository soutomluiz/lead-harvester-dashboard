import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfilePanel } from "@/components/UserProfilePanel";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function SidebarUserSection() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const { handleSignOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        
        console.log("Profile loaded:", profile);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar suas informações. Por favor, tente novamente.",
        });
      }
    };

    fetchProfile();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN') {
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (!userProfile) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              <UserRound className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center gap-2 justify-start p-2 hover:bg-accent">
            <Avatar>
              <AvatarImage src={userProfile.avatar_url} />
              <AvatarFallback>
                <UserRound className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{userProfile.full_name || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile.email || userProfile.company_name || ''}
              </p>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Seu Perfil</SheetTitle>
          </SheetHeader>
          <UserProfilePanel initialData={userProfile} />
          <div className="mt-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}