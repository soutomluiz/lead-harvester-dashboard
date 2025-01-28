import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface WelcomeDialogProps {
  isNewUser?: boolean;
  trialDaysLeft?: number;
}

export function WelcomeDialog({ isNewUser, trialDaysLeft = 14 }: WelcomeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isNewUser) {
      setIsOpen(true);
    }
  }, [isNewUser]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Bem-vindo! 🎉
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <p className="text-base">
              Estamos muito felizes em ter você conosco! Você tem acesso a todas as funcionalidades premium por {trialDaysLeft} dias.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Durante seu período de teste você pode:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Extrair leads ilimitados</li>
                <li>Acessar todas as fontes de prospecção</li>
                <li>Usar todas as ferramentas de gestão</li>
                <li>Exportar seus leads sem restrições</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => setIsOpen(false)}>
            Começar a usar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}