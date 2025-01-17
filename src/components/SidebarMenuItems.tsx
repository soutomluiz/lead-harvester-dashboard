import { Home, UserPlus, Search, Settings, CreditCard, Globe, MapPin, List } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

interface SidebarMenuItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarMenuItems({ activeTab, setActiveTab }: SidebarMenuItemsProps) {
  const menuItems = [
    {
      id: "prospect",
      icon: Search,
      label: "Prospectar",
      subItems: [
        { id: "leads", icon: List, label: "Leads" },
        { id: "form", icon: UserPlus, label: "Adicionar Lead" },
        { id: "places", icon: MapPin, label: "Google Places" },
        { id: "websites", icon: Globe, label: "Websites" },
      ],
    },
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
                onClick={() => setActiveTab(item.id)}
                data-active={activeTab === item.id}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
                tooltip={item.label}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {item.subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton
                      onClick={() => setActiveTab(`${item.id}-${subItem.id}`)}
                      data-active={activeTab === `${item.id}-${subItem.id}`}
                      className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        activeTab === `${item.id}-${subItem.id}`
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.label}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </>
          ) : (
            <SidebarMenuButton
              onClick={() => setActiveTab(item.id)}
              data-active={activeTab === item.id}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === item.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
              tooltip={item.label}
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