import { Database, Users, MapPin, Globe, Settings, CreditCard, PlusCircle, LayoutDashboard } from "lucide-react";
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
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      id: "prospect",
      icon: Database,
      label: "Extração",
      subItems: [
        { id: "form", icon: PlusCircle, label: "Adicionar Lead" },
        { id: "places", icon: MapPin, label: "Google Places" },
        { id: "websites", icon: Globe, label: "Websites" },
      ],
    },
    { id: "leads", icon: Users, label: "Leads" },
    { id: "subscription", icon: CreditCard, label: "Assinatura" },
    { id: "config", icon: Settings, label: "Configurações" },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          {item.subItems ? (
            <>
              <SidebarMenuButton
                isActive={activeTab.startsWith(item.id)}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
              <div className="ml-4 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <SidebarMenuButton
                    key={`${item.id}-${subItem.id}`}
                    isActive={activeTab === `${item.id}-${subItem.id}`}
                    onClick={() => setActiveTab(`${item.id}-${subItem.id}`)}
                  >
                    <subItem.icon className="h-4 w-4" />
                    <span>{subItem.label}</span>
                  </SidebarMenuButton>
                ))}
              </div>
            </>
          ) : (
            <SidebarMenuButton
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}