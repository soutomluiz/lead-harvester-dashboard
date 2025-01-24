export interface SearchResult {
  name: string;
  category?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  rating?: number;
  user_ratings_total?: number;
  type?: 'place' | 'website';
}