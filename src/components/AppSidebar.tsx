import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { SidebarUserSection } from "./SidebarUserSection";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  return (
    <Sidebar className="bg-background border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-start pl-2 mb-2">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-16 w-auto"
          />
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