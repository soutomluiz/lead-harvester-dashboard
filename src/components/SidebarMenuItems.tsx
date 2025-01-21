import { Database, Users, MapPin, Globe, Settings, CreditCard, PlusCircle, LayoutDashboard, Crown, ChevronRight } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SidebarMenuItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarMenuItems({ activeTab, setActiveTab }: SidebarMenuItemsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("No user found");
          return;
        }

        setUserEmail(user.email);

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle(); // Changed from .single() to .maybeSingle()

        if (roleError) {
          console.error("Error fetching user role:", roleError);
          return;
        }

        setIsAdmin(roleData?.role === 'admin' || user.email === 'contato@abbacreator.com.br');
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setIsLoading(false);
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

  const hasSubscription = isAdmin || userEmail === 'contato@abbacreator.com.br';

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      id: "prospect",
      icon: Database,
      label: "Adicionar Leads",
      subItems: [
        { id: "form", icon: PlusCircle, label: "Inserir manualmente" },
        { 
          id: "places", 
          icon: MapPin, 
          label: "Google Maps",
          requiresSubscription: true
        },
        { 
          id: "websites", 
          icon: Globe, 
          label: "Websites",
          requiresSubscription: true
        },
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
                onClick={() => {
                  toggleMenu(item.id);
                  setActiveTab(item.id);
                }}
                className="w-full flex justify-between items-center"
              >
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight 
                  className={`h-4 w-4 transition-transform ${
                    expandedMenus.includes(item.id) ? 'rotate-90' : ''
                  }`} 
                />
              </SidebarMenuButton>
              {expandedMenus.includes(item.id) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubscriptionRequired = subItem.requiresSubscription && !hasSubscription;
                    return (
                      <SidebarMenuButton
                        key={`${item.id}-${subItem.id}`}
                        isActive={activeTab === `${item.id}-${subItem.id}`}
                        onClick={() => !isSubscriptionRequired && setActiveTab(`${item.id}-${subItem.id}`)}
                        className={`w-full flex justify-between items-center ${
                          isSubscriptionRequired ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <subItem.icon className="h-4 w-4 mr-2" />
                          <span>{subItem.label}</span>
                        </div>
                        {isSubscriptionRequired && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </SidebarMenuButton>
                    );
                  })}
                </div>
              )}
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