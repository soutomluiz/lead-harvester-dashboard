import { AlertCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FreeSubscriptionStatusProps {
  isCheckoutLoading: boolean;
  onSubscribe: () => void;
}

export function FreeSubscriptionStatus({ isCheckoutLoading, onSubscribe }: FreeSubscriptionStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status da Assinatura</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <span>Plano Gratuito</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Funcionalidades Limitadas</p>
            <p>Faça upgrade para ter acesso a todas as funcionalidades</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="default"
          onClick={onSubscribe}
          disabled={isCheckoutLoading}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isCheckoutLoading ? "Processando..." : "Fazer Upgrade"}
        </Button>
      </CardFooter>
    </Card>
  );
}