export interface SearchResult {
  name: string;
  companyName: string;
  category?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  rating?: number;
  user_ratings_total?: number;
  type?: 'place' | 'website';
  source?: string;
  link?: string;
  city?: string;
  keyword?: string;
  extractionDate?: string;
  opening_date?: string;
}