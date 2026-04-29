export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  price?: string;
  description: string;
  imageUrl: string;
  status: 'public' | 'draft';
  order: number;
}

export interface ConsultationRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'home' | 'kitchen' | 'wardrobe';
  createdAt: string;
}
