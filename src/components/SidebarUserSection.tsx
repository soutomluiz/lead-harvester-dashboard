import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserProfilePanel } from "./UserProfilePanel";
import { supabase } from "@/integrations/supabase/client";

export function SidebarUserSection() {
  const user = {
    name: "Usuário",
    email: "usuario@exemplo.com",
    avatar: "/placeholder.svg"
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <Button 
        variant="outline" 
        className="w-full mb-2 text-primary hover:bg-primary hover:text-white" 
        size="sm"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-white">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-none truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <UserProfilePanel />
        </PopoverContent>
      </Popover>
    </div>
  );
}