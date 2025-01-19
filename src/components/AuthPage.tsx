import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
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
          } else if (error.message.includes("invalid credentials")) {
            message = "Email ou senha inválidos.";
          }
          
          setError(message);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="container max-w-lg mx-auto py-8">
      <Card className="p-8">
        <div className="mb-8 space-y-4">
          <img src="/logo.svg" alt="Logo" className="h-24 mx-auto" />
          <p className="text-center text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3080a3',
                  brandAccent: '#2c7492',
                },
              },
            },
          }}
          providers={['google']}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                email_input_placeholder: 'Seu email',
                password_input_placeholder: 'Sua senha',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Cadastrar',
                loading_button_label: 'Cadastrando...',
                email_input_placeholder: 'Seu email',
                password_input_placeholder: 'Sua senha',
              },
            },
          }}
        />
      </Card>
    </div>
  );
}