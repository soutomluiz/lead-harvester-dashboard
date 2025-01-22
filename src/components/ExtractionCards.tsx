import { PlusCircle, MapPin, Globe } from "lucide-react";
import { ExtractionCard } from "./extraction/ExtractionCard";

interface ExtractionCardsProps {
  setActiveTab: (tab: string) => void;
}

export function ExtractionCards({ setActiveTab }: ExtractionCardsProps) {
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
      requiresSubscription: false,
    },
    {
      id: "prospect-websites",
      icon: Globe,
      title: "Websites",
      description: "Extraia leads de websites",
      requiresSubscription: false,
    },
  ];

  const handleCardClick = (cardId: string) => {
    console.log("Card clicked:", cardId);
    setActiveTab(cardId);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Escolha o Método de Extração
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <ExtractionCard
            key={card.id}
            id={card.id}
            icon={card.icon}
            title={card.title}
            description={card.description}
            isLocked={card.requiresSubscription}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}