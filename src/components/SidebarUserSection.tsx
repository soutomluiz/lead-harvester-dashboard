import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function SidebarUserSection() {
  const { handleSignOut } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="mt-auto p-4">
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