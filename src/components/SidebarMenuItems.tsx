import { Database, Users, MapPin, Globe, Settings, CreditCard, PlusCircle } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
  SidebarMenuTrigger,
  SidebarMenuContent,
} from "@/components/ui/sidebar";

interface SidebarMenuItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarMenuItems({ activeTab, setActiveTab }: SidebarMenuItemsProps) {
  const menuItems = [
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
              <SidebarMenuTrigger
                active={activeTab.startsWith(item.id)}
                icon={item.icon}
              >
                {item.label}
              </SidebarMenuTrigger>
              <SidebarMenuContent>
                {item.subItems.map((subItem) => (
                  <SidebarMenuLink
                    key={`${item.id}-${subItem.id}`}
                    active={activeTab === `${item.id}-${subItem.id}`}
                    icon={subItem.icon}
                    onClick={() => setActiveTab(`${item.id}-${subItem.id}`)}
                  >
                    {subItem.label}
                  </SidebarMenuLink>
                ))}
              </SidebarMenuContent>
            </>
          ) : (
            <SidebarMenuLink
              active={activeTab === item.id}
              icon={item.icon}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </SidebarMenuLink>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}