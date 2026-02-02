
export enum ComplaintStatus {
  IN_ANALYSIS = '🟡 Em análise',
  IN_PROGRESS = '🔵 Em andamento',
  RESOLVED = '🟢 Resolvido'
}

export enum ComplaintCategory {
  POTHOLE = 'Buracos nas ruas',
  LIGHTING = 'Iluminação pública',
  CLEANING = 'Lixo e limpeza',
  TRAFFIC = 'Trânsito',
  SECURITY = 'Segurança',
  WORKS = 'Obras',
  OTHER = 'Outros'
}

export enum PostType {
  WARNING = 'Aviso importante',
  REPORT = 'Denúncia',
  PHOTO = 'Foto da cidade',
  LOST_FOUND = 'Achados e perdidos',
  EVENT_PROMO = 'Divulgação de eventos'
}

export interface User {
  id: string;
  name: string;
  neighborhood: string;
  photo?: string;
  role: 'CITIZEN' | 'ADMIN';
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userNeighborhood: string;
  type: PostType;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

export interface Complaint {
  id: string;
  userId: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  location?: { lat: number; lng: number; address: string };
  image?: string;
  protocol: string;
  isAnonymous: boolean;
  adminNote?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  category: 'Show' | 'Esporte' | 'Reunião Pública' | 'Cultural';
  interested: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  fileUrl?: string;
  fileType?: 'image' | 'video' | 'audio' | 'pdf';
  createdAt: Date;
}
