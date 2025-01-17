import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          className="mx-auto h-16 w-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-primary">Lead Management Pro</h1>
        <p className="text-gray-600 mt-2">
          Comece gratuitamente e desbloqueie recursos premium quando precisar
        </p>
      </div>

      <Card className="w-full max-w-md p-6">
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
            }
          }}
          theme="light"
          providers={[]}
        />
      </Card>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Versão gratuita inclui:</p>
        <ul className="mt-2">
          <li>• Até 50 leads por mês</li>
          <li>• Busca básica no Google Places</li>
          <li>• Exportação limitada</li>
        </ul>
      </div>
    </div>
  );
}