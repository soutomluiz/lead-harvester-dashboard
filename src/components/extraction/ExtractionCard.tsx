import { Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExtractionCardProps {
  id: string;
  icon: any;
  title: string;
  description: string;
  isLocked: boolean;
  onClick: () => void;
}

export function ExtractionCard({
  id,
  icon: Icon,
  title,
  description,
  isLocked,
  onClick,
}: ExtractionCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className={`p-6 transition-all ${
        isLocked 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-lg hover:scale-105 cursor-pointer'
      }`}
      onClick={() => !isLocked && onClick()}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <Icon className={`h-12 w-12 ${isLocked ? 'text-gray-400' : 'text-primary'}`} />
          {isLocked && (
            <Crown className="h-5 w-5 text-yellow-500 absolute -top-2 -right-2" />
          )}
        </div>
        <h3 className="text-xl font-medium">{title}</h3>
        <p className={`${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
        {isLocked && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/pricing");
            }}
          >
            Assinar agora
          </Button>
        )}
      </div>
    </Card>
  );
}