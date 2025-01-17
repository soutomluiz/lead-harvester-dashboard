import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

export function AuthPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in successfully");
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setError(null);
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleError = (error: AuthError) => {
    console.error("Auth error:", error);
    const errorMessage = error.message === "Invalid login credentials"
      ? "Email ou senha inválidos"
      : error.message;
    setError(errorMessage);
    toast.error(errorMessage);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="w-full max-w-[972px] mx-auto flex flex-col">
        <div className="text-center mt-1">
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="mx-auto w-[486px] h-[120px] object-contain animate-fadeIn"
          />
          <h1 className="text-3xl font-bold text-primary animate-slideUp mt-[30px]">Lead Management Pro</h1>
          <p className="text-gray-600 mt-1 animate-slideUp">
            Comece gratuitamente e desbloqueie recursos premium quando precisar
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center mt-4">
          <Card className="w-full max-w-md p-6 animate-fadeIn">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#3080a3',
                      brandAccent: '#2b7291',
                    }
                  }
                },
                className: {
                  button: 'supabase-auth-button',
                  anchor: 'supabase-auth-link',
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Email',
                    password_label: 'Senha',
                    button_label: 'Login',
                  },
                  sign_up: {
                    email_label: 'Email',
                    password_label: 'Senha',
                    button_label: 'Inscrever-se',
                  },
                }
              }}
              theme="light"
              providers={[]}
              onError={handleError}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}