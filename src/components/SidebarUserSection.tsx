import { Package, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarUserSectionProps {
  className?: string;
}

export function SidebarUserSection({ className }: SidebarUserSectionProps) {
  const version = "1.0.0";
  const supportEmail = "suporte@exemplo.com";
  const supportPhone = "(11) 99999-9999";

  return (
    <div className={cn("p-4 border-t", className)}>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span className="text-xs">{supportPhone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span className="text-xs">{supportEmail}</span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Package className="h-4 w-4" />
          <span className="text-xs">v{version}</span>
        </div>
      </div>
    </div>
  );
}