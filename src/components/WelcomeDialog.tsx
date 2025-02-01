import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeDialogProps {
  isNewUser?: boolean;
  trialDaysLeft?: number;
  userProfile?: any;
}

export function WelcomeDialog({ isNewUser, trialDaysLeft = 14, userProfile }: WelcomeDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setIsAdmin(roleData?.role === 'admin');
      }
    };

    checkUserRole();
  }, []);

  // Don't show dialog if user has a subscription or is admin
  if (userProfile?.subscription_type === 'premium' || isAdmin) {
    return null;
  }

  const handleClose = () => {
    setHasInteracted(true);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    // Prevent closing unless it's through the button click
    if (!hasInteracted) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()} 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {isNewUser ? "Bem-vindo! 🎉" : "Olá novamente! 👋"}
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <p className="text-base">
              {isNewUser 
                ? "Estamos muito felizes em ter você conosco!" 
                : "Que bom ter você de volta!"} 
              Você tem acesso a todas as funcionalidades premium por {trialDaysLeft} dias.
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
          <Button onClick={handleClose}>
            Começar a usar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}