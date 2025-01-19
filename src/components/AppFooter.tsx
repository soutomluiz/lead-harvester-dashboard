import { Package, Phone, Mail } from "lucide-react";

interface AppFooterProps {
  whitelabelName?: string;
}

export function AppFooter({ whitelabelName }: AppFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-2">
    </footer>
  );
}