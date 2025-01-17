import { PlusCircle, MapPin, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ExtractionCardsProps {
  setActiveTab: (tab: string) => void;
}

export function ExtractionCards({ setActiveTab }: ExtractionCardsProps) {
  const cards = [
    {
      id: "prospect-form",
      icon: PlusCircle,
      title: "Adicionar Lead",
      description: "Adicione leads manualmente ao sistema",
    },
    {
      id: "prospect-places",
      icon: MapPin,
      title: "Google Places",
      description: "Extraia leads do Google Places",
    },
    {
      id: "prospect-websites",
      icon: Globe,
      title: "Websites",
      description: "Extraia leads de websites",
    },
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Escolha o Método de Extração
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
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