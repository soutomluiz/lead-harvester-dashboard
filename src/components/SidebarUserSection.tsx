import { cn } from "@/lib/utils";

interface SidebarUserSectionProps {
  className?: string;
}

export function SidebarUserSection({ className }: SidebarUserSectionProps) {
  return (
    <div className={cn("p-4", className)}>
      {/* Empty div to maintain spacing */}
    </div>
  );
}