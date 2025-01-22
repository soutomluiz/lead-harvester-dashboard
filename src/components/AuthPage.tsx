import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from "./auth/LoginForm";
import { SignUpForm } from "./auth/SignUpForm";
import { AuthError } from "./auth/AuthError";

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in");
        navigate("/");
        setError(null);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setError(null);
      } else if (event === 'USER_UPDATED') {
        console.log("User updated");
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth error:", error);
          let message = "Ocorreu um erro durante a autenticação.";
          
          if (error.message.includes("missing email")) {
            message = "Por favor, preencha o campo de email.";
          } else if (error.message.includes("invalid credentials") || error.message.includes("Invalid login credentials")) {
            message = "Email ou senha inválidos.";
          } else if (error.message.includes("Email not confirmed")) {
            message = "Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.";
          }
          
          setError(message);
          toast({
            title: "Erro de autenticação",
            description: message,
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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