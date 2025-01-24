import { Loader2 } from "lucide-react";
import { useAuthenticationFlow } from "@/hooks/useAuthenticationFlow";

interface AuthStateManagerProps {
  onAuthStateChange: (isAuthenticated: boolean, userData?: any) => void;
  children: React.ReactNode;
}

export function AuthStateManager({ onAuthStateChange, children }: AuthStateManagerProps) {
  const { isLoading } = useAuthenticationFlow({ onAuthStateChange });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return children;
}