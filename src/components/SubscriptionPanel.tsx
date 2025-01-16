import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function SubscriptionPanel() {
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
      });
      
      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar o checkout. Tente novamente.",
      });
      console.error("Erro ao iniciar checkout:", error);
    }
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <h1 className="text-3xl font-bold">Assinatura</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Status da Assinatura</CardTitle>
          <CardDescription>Você ainda não possui uma assinatura ativa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Plano Básico</p>
              <p>R$ 29,90/mês - Acesso a todas as funcionalidades da plataforma</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCheckout} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Assinar Agora
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Aqui você encontra todos os seus pagamentos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum pagamento realizado ainda.</p>
        </CardContent>
      </Card>
    </div>
  );
}