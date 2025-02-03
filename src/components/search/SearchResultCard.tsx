import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchResult } from "@/types/search";
import { MapPin, Globe, Phone, Star } from "lucide-react";

interface SearchResultCardProps {
  result: SearchResult;
  isSelected: boolean;
  onSelect: () => void;
}

export const SearchResultCard = ({ result, isSelected, onSelect }: SearchResultCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="mt-1"
        />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">{result.companyName || result.name}</h4>
            {result.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{result.rating}/5</span>
                {result.user_ratings_total && (
                  <span className="text-sm text-gray-500">
                    ({result.user_ratings_total} avaliações)
                  </span>
                )}
              </div>
            )}
          </div>

          {result.address && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{result.address}</span>
            </div>
          )}

          {result.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{result.phone}</span>
            </div>
          )}

          {result.website && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="h-4 w-4" />
              <a
                href={result.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {result.website}
              </a>
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              Ver no {result.type === 'website' ? 'Website' : 'Google Maps'}
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};