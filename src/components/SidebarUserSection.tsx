import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

export function SidebarUserSection() {
  const { handleSignOut } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="p-4 space-y-4">
      {/* Version and Support Info */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <p>{t("support")}: support@company.com</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>{t("version")}: 1.0.0</p>
        </div>
      </div>
      
      <Separator />
      
      {/* Logout Button */}
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {t("logout")}
      </Button>
    </div>
  );
}