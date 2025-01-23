import { Package, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarUserSectionProps {
  className?: string;
}

export function SidebarUserSection({ className }: SidebarUserSectionProps) {
  const version = "1.0.0";
  const supportEmail = "contato@abbacreator.com.br";
  const supportPhone = "(48) 9 9142-4168";
  const whatsappLink = `https://wa.me/${supportPhone.replace(/\D/g, '')}`;
  const { t } = useLanguage();

  return (
    <div className={cn("p-4 border-t", className)}>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="16" 
            height="16" 
            stroke="currentColor" 
            fill="none" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span className="text-xs">{t("support")}: {supportPhone}</span>
        </a>
        <a 
          href={`mailto:${supportEmail}`}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Mail className="h-4 w-4" />
          <span className="text-xs">{supportEmail}</span>
        </a>
        <div className="flex items-center gap-2 pt-2">
          <Package className="h-4 w-4" />
          <span className="text-xs">{t("version")} {version}</span>
        </div>
      </div>
    </div>
  );
}