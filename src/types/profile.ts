export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  location: string;
  bio: string;
  updated_at: string;
  company_name: string;
  email: string;
  website: string;
  industry: string;
  subscription_status?: 'active' | 'inactive' | null;
}

export interface ProfileFormData {
  full_name: string;
  phone: string;
  location: string;
  bio: string;
  company_name: string;
  email: string;
  website: string;
  industry: string;
}