import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export function LoginForm() {
  return (
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
            social_provider_text: 'Entrar com {{provider}}',
          },
          forgotten_password: {
            link_text: 'Esqueceu sua senha?',
            email_label: 'Email',
            password_label: 'Nova senha',
            button_label: 'Enviar instruções',
            confirmation_text: 'Verifique seu email para redefinir sua senha',
          },
        },
      }}
      view="sign_in"
      showLinks={false}
    />
  );
}