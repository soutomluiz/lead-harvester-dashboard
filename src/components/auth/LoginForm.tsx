import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResendConfirmationEmail = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para reenviar a confirmação.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsResendingEmail(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });

      if (error) {
        console.error("Erro ao reenviar email:", error);
        toast({
          title: "Erro ao reenviar email",
          description: "Não foi possível reenviar o email de confirmação. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email reenviado",
        description: "Por favor, verifique sua caixa de entrada e confirme seu email.",
      });
    } catch (error) {
      console.error("Erro inesperado ao reenviar email:", error);
      toast({
        title: "Erro ao reenviar email",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Tentando fazer login com email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Erro no login:", error);
        console.log("Mensagem de erro:", error.message);
        console.log("Detalhes do erro:", JSON.stringify(error, null, 2));
        
        let message = "";
        
        if (error.message.includes("Email not confirmed")) {
          message = (
            <div>
              <p>Por favor, confirme seu email antes de fazer login.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendConfirmationEmail}
                disabled={isResendingEmail}
                className="mt-2"
              >
                {isResendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  "Reenviar email de confirmação"
                )}
              </Button>
            </div>
          );
        } else if (error.message.includes("Invalid login credentials")) {
          message = "Email ou senha incorretos. Por favor, verifique suas credenciais.";
        } else {
          message = "Erro ao tentar fazer login. Por favor, tente novamente.";
        }
        
        setErrorMessage(message);
        toast({
          title: "Erro no login",
          description: typeof message === 'string' ? message : "Por favor, confirme seu email antes de fazer login.",
          variant: "destructive",
          duration: 6000,
        });
        return;
      }

      if (data?.user) {
        console.log("Login realizado com sucesso para usuário:", data.user.id);
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para o dashboard.",
          duration: 4000,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Erro inesperado durante login:", error);
      setErrorMessage("Ocorreu um erro inesperado. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>
            {typeof errorMessage === 'string' ? errorMessage : errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}