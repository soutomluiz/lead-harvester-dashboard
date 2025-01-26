import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./auth/LoginForm";
import { SignUpForm } from "./auth/SignUpForm";
import { AuthError } from "./auth/AuthError";

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session check error:", sessionError);
        return;
      }
      
      if (session) {
        console.log("Active session found, redirecting to dashboard");
        navigate("/");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to dashboard");
        navigate("/");
        setError(null);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, staying on login page");
        if (window.location.pathname !== '/login') {
          navigate("/login");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center -mt-[10vh]">
      <div className="w-full max-w-lg px-4">
        <Card className="p-8">
          <div className="mb-8 space-y-4">
            <img src="/logo.svg" alt="Logo" className="h-30 mx-auto" />
            <div className="space-y-2">
              <p className="text-center text-gray-600">
                {isSignUp ? "Crie sua conta" : "Faça login para acessar sua conta"}
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-center text-primary font-medium">
                  ✨ Experimente todas as funcionalidades gratuitamente por 14 dias! ✨
                </p>
                <p className="text-center text-sm text-gray-600 mt-1">
                  Cadastre-se agora e aproveite o período de teste completo
                </p>
              </div>
            </div>
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
    </div>
  );
}