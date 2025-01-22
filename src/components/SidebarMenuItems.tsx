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
    { id: "pipeline", icon: KanbanSquare, label: "Pipeline", requiresAdmin: true },
    {
      id: "prospect",
      icon: Database,
      label: "Adicionar Leads",
      subItems: [
        { id: "form", icon: PlusCircle, label: "Inserir manualmente" },
        { id: "places", icon: MapPin, label: "Google Maps", requiresAdmin: true },
        { id: "websites", icon: Globe, label: "Websites", requiresAdmin: true },
      ],
    },
    { 
      id: "leads", 
      icon: Users, 
      label: "Leads",
      subItems: [
        { id: "list", icon: LineChart, label: "Lista de Leads" },
        { id: "score", icon: LineChart, label: "Score de Leads", requiresAdmin: true },
        { id: "timeline", icon: Timer, label: "Timeline", requiresAdmin: true },
      ],
    },
    { id: "subscription", icon: CreditCard, label: "Assinatura" },
    { id: "config", icon: Settings, label: "Configurações" },
  ];

  const handleMenuClick = (item: any) => {
    if (item.requiresAdmin && !isAdmin) {
      toast({
        title: "Recurso Premium",
        description: "Assine para ter acesso a esta funcionalidade.",
      });
      navigate("/pricing");
      return;
    }
    
    if (item.subItems) {
      toggleMenu(item.id);
      setActiveTab(item.id);
    } else {
      setActiveTab(item.id);
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
                onClick={() => handleMenuClick(item)}
                className={`w-full flex justify-between items-center transition-colors ${
                  activeTab.startsWith(item.id) 
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-primary/5'
                } ${item.requiresAdmin && !isAdmin ? 'opacity-50' : ''}`}
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
                      onClick={() => handleMenuClick(subItem)}
                      className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                        activeTab === `${item.id}-${subItem.id}`
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-primary/5'
                      } ${subItem.requiresAdmin && !isAdmin ? 'opacity-50' : ''}`}
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
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-2 transition-colors ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-primary/5'
              } ${item.requiresAdmin && !isAdmin ? 'opacity-50' : ''}`}
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