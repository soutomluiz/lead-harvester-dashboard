import { Package, Phone, Mail } from "lucide-react";

interface AppFooterProps {
  whitelabelName?: string;
}

export function AppFooter({ whitelabelName }: AppFooterProps) {
  const version = "1.0.0"; // You can manage version manually or use a versioning system
  const supportEmail = "suporte@exemplo.com";
  const supportPhone = "(11) 99999-9999";
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 text-xs text-muted-foreground">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>{supportPhone}</span>
          <span className="mx-2">|</span>
          <Mail className="h-4 w-4" />
          <span>{supportEmail}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>v{version}</span>
          </div>
          <div className="flex items-center gap-1">
            {whitelabelName && (
              <>
                <span>Powered by {whitelabelName}</span>
                <span className="mx-1">|</span>
              </>
            )}
            <span className="opacity-50">Built with Lead Harvester</span>
          </div>
        </div>
      </div>
    </footer>
  );
}