import { Home, UserPlus, Search, Settings, LogOut, CreditCard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserProfilePanel } from "./UserProfilePanel";
import { supabase } from "@/integrations/supabase/client";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const user = {
    name: "Usuário",
    email: "usuario@exemplo.com",
    avatar: "/placeholder.svg"
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/placeholder.svg"
            alt="Logo"
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("table")}
              data-active={activeTab === "table"}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "table"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              tooltip="Ver Leads"
            >
              <Home className="h-4 w-4" />
              <span>Ver Leads</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("form")}
              data-active={activeTab === "form"}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "form"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              tooltip="Adicionar Lead"
            >
              <UserPlus className="h-4 w-4" />
              <span>Adicionar Lead</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("prospect")}
              data-active={activeTab === "prospect"}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "prospect"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              tooltip="Prospectar"
            >
              <Search className="h-4 w-4" />
              <span>Prospectar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("subscription")}
              data-active={activeTab === "subscription"}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "subscription"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              tooltip="Assinatura"
            >
              <CreditCard className="h-4 w-4" />
              <span>Assinatura</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("config")}
              data-active={activeTab === "config"}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "config"
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              tooltip="Configurações"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
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
      </SidebarFooter>
    </Sidebar>
  );
}