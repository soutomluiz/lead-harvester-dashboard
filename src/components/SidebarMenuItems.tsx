import { Home, UserPlus, Search, Settings, CreditCard } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarMenuItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarMenuItems({ activeTab, setActiveTab }: SidebarMenuItemsProps) {
  const menuItems = [
    { id: "table", icon: Home, label: "Ver Leads" },
    { id: "form", icon: UserPlus, label: "Adicionar Lead" },
    { id: "prospect", icon: Search, label: "Prospectar" },
    { id: "subscription", icon: CreditCard, label: "Assinatura" },
    { id: "config", icon: Settings, label: "Configurações" },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => setActiveTab(item.id)}
            data-active={activeTab === item.id}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
            tooltip={item.label}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}