import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PartyPopper } from "lucide-react";
import { toast } from "sonner";

export function SubscriptionSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Parabéns por assinar a ferramenta mais completa do mercado!");
    
    // If opened from a new tab, notify the parent window
    if (window.opener) {
      window.opener.postMessage('checkout_complete', '*');
      window.close();
    } else {
      // If not in a new tab, redirect after a delay
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <PartyPopper className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-4">
          Parabéns pela sua assinatura!
        </h1>
        <p className="text-gray-600 mb-6">
          Você agora tem acesso à ferramenta mais completa do mercado. 
          {window.opener 
            ? "Esta janela será fechada automaticamente..." 
            : "Você será redirecionado em alguns segundos..."}
        </p>
        <Button onClick={() => navigate("/")} className="w-full">
          Ir para Dashboard
        </Button>
      </Card>
    </div>
  );
}