import { Home, UserPlus, Search, Settings, LogOut } from "lucide-react";
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
import { CheckoutButton } from "@/components/CheckoutButton";

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

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
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
              tooltip="Prospectar"
            >
              <Search className="h-4 w-4" />
              <span>Prospectar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab("config")}
              data-active={activeTab === "config"}
              tooltip="Configurações"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 flex flex-col gap-4">
        <Button variant="outline" className="w-full mb-2" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>

        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <CheckoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}