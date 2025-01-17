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