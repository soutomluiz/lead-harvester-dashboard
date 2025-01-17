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
        </div>
      </div>
    </div>
  );
}