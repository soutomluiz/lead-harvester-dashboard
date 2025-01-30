import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSubscriptionStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status da Assinatura</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="h-5 w-5" />
            <span>Assinatura Vitalícia Ativa (Admin)</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Plano Admin</p>
            <p>Acesso vitalício a todas as funcionalidades da plataforma</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}