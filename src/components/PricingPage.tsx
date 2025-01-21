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
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { price: 4990 }, // Pass the price in cents
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        console.error('Error details:', error);
        let errorMessage;
        
        try {
          // Try to parse the error message from the response body
          const errorBody = JSON.parse(error.message);
          errorMessage = errorBody.error || "Erro ao processar pagamento. Tente novamente.";
        } catch {
          // If parsing fails, use a default message
          errorMessage = "Erro ao processar pagamento. Tente novamente.";
        }
        
        toast.error(errorMessage);
        return;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
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

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
              <CardDescription>Acesso completo e ilimitado</CardDescription>
              <div className="text-3xl font-bold mt-4">R$ 49,90</div>
              <div className="text-sm text-gray-500">por mês</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Leads ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Busca avançada ilimitada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Exportação ilimitada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Acesso a todas as funcionalidades</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubscribe} className="w-full">
                Assinar Agora
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}