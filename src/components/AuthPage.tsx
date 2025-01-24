import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./auth/LoginForm";
import { SignUpForm } from "./auth/SignUpForm";
import { AuthError } from "./auth/AuthError";
import { Loader2 } from "lucide-react";

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Checking session in AuthPage...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.access_token && mounted) {
          console.log("Active session found, redirecting...");
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Ocorreu um erro ao verificar sua sessão. Por favor, tente novamente.",
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Armazena a subscription em uma variável
    let authSubscription;

    // Configura o listener de mudança de estado de autenticação
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in, redirecting...");
          setError(null);
          navigate('/', { replace: true });
        }
      });

      return subscription;
    };

    // Inicializa a subscription
    authSubscription = setupAuthListener();

    // Executa a verificação inicial
    checkSession();

    // Cleanup
    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-8">
      <Card className="p-8">
        <div className="mb-8 space-y-4">
          <img src="/logo.svg" alt="Logo" className="h-24 mx-auto" />
          <p className="text-center text-gray-600">
            {isSignUp ? "Crie sua conta" : "Faça login para acessar sua conta"}
          </p>
        </div>

        <AuthError message={error} />

        <Tabs defaultValue="login" onValueChange={(value) => setIsSignUp(value === "signup")}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}