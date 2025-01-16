import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function CheckoutButton() {
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
    <Button 
      onClick={handleCheckout}
      className="w-full"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Assinar Agora
    </Button>
  );
}