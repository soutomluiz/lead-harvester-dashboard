import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === "SIGNED_IN") {
        console.log("User signed in");
        navigate("/");
        setError(null);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setError(null);
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
        setError(null);
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
          <img src="/logo.svg" alt="Logo" className="h-12 mx-auto" />
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            Bem-vindo ao Prospecção Inteligente
          </h1>
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
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Senha',
                button_label: 'Cadastrar',
              },
            },
          }}
        />
      </Card>
    </div>
  );
}