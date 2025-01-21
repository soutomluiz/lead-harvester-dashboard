import { PlusCircle, MapPin, Globe, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExtractionCardsProps {
  setActiveTab: (tab: string) => void;
}

export function ExtractionCards({ setActiveTab }: ExtractionCardsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("No user found");
          return;
        }

        setUserEmail(user.email);

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleError) {
          console.error("Error fetching user role:", roleError);
          return;
        }

        setIsAdmin(roleData?.role === 'admin' || user.email === 'contato@abbacreator.com.br');
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkUserRole();
  }, []);

  const hasSubscription = isAdmin || userEmail === 'contato@abbacreator.com.br';

  const cards = [
    {
      id: "prospect-form",
      icon: PlusCircle,
      title: "Inserir manualmente",
      description: "Adicione leads manualmente ao sistema",
      requiresSubscription: false,
    },
    {
      id: "prospect-places",
      icon: MapPin,
      title: "Google Maps",
      description: "Extraia leads do Google Maps",
      requiresSubscription: true,
    },
    {
      id: "prospect-websites",
      icon: Globe,
      title: "Websites",
      description: "Extraia leads de websites",
      requiresSubscription: true,
    },
  ];

  const handleCardClick = (card: typeof cards[0]) => {
    if (card.requiresSubscription && !hasSubscription) {
      toast({
        title: "Recurso Premium",
        description: "Assine para ter acesso a esta funcionalidade.",
      });
      navigate("/subscription");
      return;
    }
    setActiveTab(card.id);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Escolha o Método de Extração
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const isLocked = card.requiresSubscription && !hasSubscription;
          
          return (
            <Card
              key={card.id}
              className={`p-6 transition-all cursor-pointer ${
                isLocked ? 'opacity-75' : 'hover:shadow-lg hover:scale-105'
              }`}
              onClick={() => handleCardClick(card)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Icon className="h-12 w-12 text-primary" />
                  {card.requiresSubscription && (
                    <Crown className="h-5 w-5 text-yellow-500 absolute -top-2 -right-2" />
                  )}
                </div>
                <h3 className="text-xl font-medium">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}