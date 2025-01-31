import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { SidebarUserSection } from "./SidebarUserSection";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    setActiveTab("dashboard");
    navigate("/");
  };

  return (
    <Sidebar className="bg-background border-r border-border">
      <SidebarHeader className="p-2 border-b border-border">
        <div 
          className="flex items-center justify-center pl-2 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-20 w-auto"
          />
          <Home className="ml-2 h-6 w-6 text-primary" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenuItems activeTab={activeTab} setActiveTab={setActiveTab} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserSection />
      </SidebarFooter>
    </Sidebar>
  );
}