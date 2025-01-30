import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentHistoryProps {
  isAdmin: boolean;
}

export function PaymentHistory({ isAdmin }: PaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
        <CardDescription>
          {isAdmin 
            ? "Você possui uma assinatura vitalícia como administrador"
            : "Nenhum pagamento registrado ainda"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}