import { Users, MapPin, Globe, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LeadCardsProps {
  setActiveTab: (tab: string) => void;
}

export function LeadCards({ setActiveTab }: LeadCardsProps) {
  const cards = [
    {
      id: "leads-all",
      icon: Users,
      title: "Todos os Leads",
      description: "Visualize todos os seus leads",
    },
    {
      id: "leads-manual",
      icon: PlusCircle,
      title: "Leads Manuais",
      description: "Leads adicionados manualmente",
    },
    {
      id: "leads-places",
      icon: MapPin,
      title: "Leads do Places",
      description: "Leads extraídos do Google Places",
    },
    {
      id: "leads-websites",
      icon: Globe,
      title: "Leads de Websites",
      description: "Leads extraídos de websites",
    },
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Escolha a Categoria de Leads
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => setActiveTab(card.id)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <Icon className="h-12 w-12 text-primary" />
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