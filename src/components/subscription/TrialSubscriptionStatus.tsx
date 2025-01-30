import { AlertCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrialSubscriptionStatusProps {
  trialStartDate: string;
  daysLeft: number;
  isCheckoutLoading: boolean;
  onSubscribe: () => void;
}

export function TrialSubscriptionStatus({ 
  trialStartDate, 
  daysLeft, 
  isCheckoutLoading, 
  onSubscribe 
}: TrialSubscriptionStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status da Assinatura</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 text-blue-500">
            <AlertCircle className="h-5 w-5" />
            <span>Período de Teste em Andamento</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Teste Gratuito</p>
            <p>Você tem acesso a todas as funcionalidades por {daysLeft} dias</p>
            <p className="text-sm mt-2">
              Início do teste: {new Date(trialStartDate).toLocaleDateString()}
            </p>
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
          {isCheckoutLoading ? "Processando..." : "Assinar Agora"}
        </Button>
      </CardFooter>
    </Card>
  );
}