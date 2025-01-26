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
      <SidebarHeader className="p-0 border-b border-border">
        <div className="flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-17px w-auto my-0"
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
