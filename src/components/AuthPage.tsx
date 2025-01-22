import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

const signUpSchema = z.object({
  full_name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  location: z.string().min(1, "Endereço é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema)
  });

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
          } else if (error.message.includes("Email not confirmed")) {
            message = "Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.";
          }
          
          setError(message);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const onSignUp = async (data: SignUpForm) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          }
        }
      });

      if (signUpError) {
        if (signUpError.status === 429) {
          throw new Error("Por favor, aguarde 20 segundos antes de tentar novamente.");
        }
        throw signUpError;
      }

      // Update profile with additional information
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found after signup");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          location: data.location,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Conta criada com sucesso!",
        description: "Você receberá um email de confirmação em instantes.",
      });
      
      reset();
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar conta. Por favor, tente novamente.";
      setError(errorMessage);
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-8">
      <Card className="p-8">
        <div className="mb-8 space-y-4">
          <img src="/logo.svg" alt="Logo" className="h-24 mx-auto" />
          <p className="text-center text-gray-600">
            {isSignUp ? "Crie sua conta" : "Faça login para acessar sua conta"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" onValueChange={(value) => setIsSignUp(value === "signup")}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
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
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSubmit(onSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  {...register("full_name")}
                  disabled={isSubmitting}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Endereço</Label>
                <Input
                  id="location"
                  {...register("location")}
                  disabled={isSubmitting}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
