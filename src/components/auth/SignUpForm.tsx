import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Tentando criar conta com email:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Erro no cadastro:", error);
        let message = "Erro ao criar conta. Por favor, tente novamente.";
        
        if (error.message.includes("already registered")) {
          message = "Este email já está cadastrado. Tente fazer login.";
        }
        
        toast({
          title: "Erro no cadastro",
          description: message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log("Conta criada com sucesso para usuário:", data.user.id);
        
        // Enviar email de boas-vindas
        try {
          const response = await supabase.functions.invoke('send-welcome-email', {
            body: {
              email,
              name,
            },
          });

          if ('error' in response) {
            console.error("Erro ao enviar email de boas-vindas:", response.error);
          } else {
            console.log("Email de boas-vindas enviado com sucesso");
          }
        } catch (emailError) {
          console.error("Erro ao enviar email de boas-vindas:", emailError);
        }

        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo ao sistema!",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Erro inesperado durante cadastro:", error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

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
          placeholder="Mínimo 6 caracteres"
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
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
}