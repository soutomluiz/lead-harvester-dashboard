import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function PricingPage() {
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      });
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Escolha seu plano</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Desbloqueie todo o potencial da sua prospecção com nossa ferramenta líder de mercado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Plano Gratuito */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Gratuito</CardTitle>
              <CardDescription>Para começar a explorar</CardDescription>
              <div className="text-3xl font-bold mt-4">R$ 0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Até 10 leads por mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Busca básica</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Exportação limitada</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                Começar Grátis
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Pro */}
          <Card className="relative border-primary">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
              Mais Popular
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Para profissionais</CardDescription>
              <div className="text-3xl font-bold mt-4">R$ 29,90</div>
              <div className="text-sm text-gray-500">por mês</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Até 100 leads por mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Busca avançada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Exportação ilimitada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Suporte em horário comercial</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubscribe}>
                Assinar Agora
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Enterprise */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Para grandes equipes</CardDescription>
              <div className="text-3xl font-bold mt-4">Personalizado</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Tudo do plano Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>API dedicada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Gerenciamento de equipe</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>SLA garantido</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "mailto:contato@leadmanagementpro.com"}>
                Fale Conosco
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}