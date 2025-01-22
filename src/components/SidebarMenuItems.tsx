import { Database, Users, MapPin, Globe, Settings, CreditCard, PlusCircle, LayoutDashboard, KanbanSquare, Timer, ListChecks, Award, ChevronDown } from "lucide-react";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) throw roleError;
        setIsAdmin(roleData?.role === 'admin');
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkUserRole();
  }, []);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "pipeline", icon: KanbanSquare, label: "Pipeline", requiresAdmin: false },
    {
      id: "prospect",
      icon: Database,
      label: "Adicionar Leads",
      subItems: [
        { id: "prospect-form", icon: PlusCircle, label: "Inserir manualmente" },
        { id: "prospect-places", icon: MapPin, label: "Google Maps", requiresAdmin: false },
        { id: "prospect-websites", icon: Globe, label: "Websites", requiresAdmin: false },
      ],
    },
    { 
      id: "leads", 
      icon: Users, 
      label: "Leads",
      subItems: [
        { id: "leads-list", icon: ListChecks, label: "Lista de Leads" },
        { id: "leads-score", icon: Award, label: "Score de Leads", requiresAdmin: false },
        { id: "leads-timeline", icon: Timer, label: "Timeline", requiresAdmin: false },
      ],
    },
    { id: "subscription", icon: CreditCard, label: "Assinatura" },
    { id: "config", icon: Settings, label: "Configurações" },
  ];

  const handleMenuClick = (menuId: string, subItemId?: string) => {
    const targetId = subItemId || menuId;
    console.log("Menu clicked:", targetId); // Debug log
    setActiveTab(targetId);
    if (!subItemId) {
      toggleMenu(menuId);
    }
  };

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          {item.subItems ? (
            <>
              <SidebarMenuButton
                isActive={activeTab.startsWith(item.id)}
                onClick={() => handleMenuClick(item.id)}
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
                      isActive={activeTab === subItem.id}
                      onClick={() => handleMenuClick(item.id, subItem.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                        activeTab === subItem.id
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
              onClick={() => handleMenuClick(item.id)}
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