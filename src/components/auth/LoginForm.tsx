import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Attempting login for email:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Login error:", error);
        console.log("Error message:", error.message);
        console.log("Error details:", JSON.stringify(error, null, 2));
        
        let title = "Erro no login";
        let description = "Email ou senha incorretos. Por favor, verifique suas credenciais.";
        
        if (error.message.includes("Email not confirmed")) {
          title = "Email não confirmado";
          description = "Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login. Se não encontrar o email de confirmação, você pode solicitar um novo no processo de cadastro.";
          
          // Add a note about disabling email confirmation for testing
          console.log("Note: For testing, you may want to disable email confirmation in the Supabase dashboard");
        } else if (error.message.includes("Invalid login credentials")) {
          title = "Credenciais inválidas";
          description = "Por favor, verifique seu email e senha.";
        }
        
        toast({
          title,
          description,
          variant: "destructive",
          duration: 6000, // Increased duration for email confirmation message
        });
        return;
      }

      if (data?.user) {
        console.log("Login successful for user:", data.user.id);
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para o dashboard.",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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