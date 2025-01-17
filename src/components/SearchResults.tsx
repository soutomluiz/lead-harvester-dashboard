import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface SearchResult {
  title?: string;
  link: string;
  description?: string;
  companyName: string;
  address?: string;
  phone?: string;
  email?: string;
  keyword: string;
  city: string;
  extractionDate: string;
  rating: number;
  user_ratings_total: number;
  opening_date?: string;
  website?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onAddToLeads: () => void;
}

export const SearchResults = ({ results, onAddToLeads }: SearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resultados da Busca</h3>
        <Button onClick={onAddToLeads} variant="secondary">
          Adicionar à Lista de Leads
        </Button>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="p-4">
            <h4 className="font-medium">{result.companyName}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <p className="text-sm">
                <strong>Endereço:</strong> {result.address || "Não disponível"}
              </p>
              <p className="text-sm">
                <strong>Telefone:</strong> {result.phone || "Não disponível"}
              </p>
              <p className="text-sm">
                <strong>Website:</strong>{" "}
                {result.website ? (
                  <a
                    href={result.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {result.website}
                  </a>
                ) : (
                  "Não disponível"
                )}
              </p>
              <p className="text-sm">
                <strong>Cidade:</strong> {result.city}
              </p>
              <p className="text-sm">
                <strong>Palavra-chave:</strong> {result.keyword}
              </p>
              <p className="text-sm">
                <strong>Data de Exportação:</strong>{" "}
                {new Date(result.extractionDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Horário de Funcionamento:</strong>{" "}
                {result.opening_date || "Não disponível"}
              </p>
              <p className="text-sm">
                <strong>Avaliação:</strong>{" "}
                {result.rating ? `${result.rating}/5` : "Sem avaliação"}
              </p>
              <p className="text-sm">
                <strong>Total de Avaliações:</strong>{" "}
                {result.user_ratings_total || 0}
              </p>
            </div>
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline mt-2 inline-block"
            >
              Visitar no Google Maps
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};