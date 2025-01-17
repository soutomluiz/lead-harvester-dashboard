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
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-12 w-auto"
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