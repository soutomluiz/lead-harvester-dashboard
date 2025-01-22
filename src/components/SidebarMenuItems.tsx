import { Database, Users, MapPin, Globe, Settings, CreditCard, PlusCircle, LayoutDashboard, KanbanSquare, Timer, LineChart, ChevronDown } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface SidebarMenuItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarMenuItems({ activeTab, setActiveTab }: SidebarMenuItemsProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "pipeline", icon: KanbanSquare, label: "Pipeline" },
    {
      id: "prospect",
      icon: Database,
      label: "Adicionar Leads",
      subItems: [
        { id: "form", icon: PlusCircle, label: "Inserir manualmente" },
        { id: "places", icon: MapPin, label: "Google Maps" },
        { id: "websites", icon: Globe, label: "Websites" },
      ],
    },
    { 
      id: "leads", 
      icon: Users, 
      label: "Leads",
      subItems: [
        { id: "list", icon: LineChart, label: "Lista de Leads" },
        { id: "score", icon: LineChart, label: "Score de Leads" },
        { id: "timeline", icon: Timer, label: "Timeline" },
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
                isActive={activeTab.startsWith(item.id)}
                onClick={() => {
                  toggleMenu(item.id);
                  setActiveTab(item.id);
                }}
                className={`w-full flex justify-between items-center transition-colors ${
                  activeTab.startsWith(item.id) 
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expandedMenus.includes(item.id) ? 'rotate-180' : ''
                  }`} 
                />
              </SidebarMenuButton>
              {expandedMenus.includes(item.id) && (
                <div className="ml-4 mt-1 space-y-1 animate-slideUp">
                  {item.subItems.map((subItem) => (
                    <SidebarMenuButton
                      key={`${item.id}-${subItem.id}`}
                      isActive={activeTab === `${item.id}-${subItem.id}`}
                      onClick={() => setActiveTab(`${item.id}-${subItem.id}`)}
                      className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                        activeTab === `${item.id}-${subItem.id}`
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-primary/5'
                      }`}
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span className="text-sm">{subItem.label}</span>
                    </SidebarMenuButton>
                  ))}
                </div>
              )}
            </>
          ) : (
            <SidebarMenuButton
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2 transition-colors ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-primary/5'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}