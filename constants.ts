
import { ComplaintCategory, ComplaintStatus, PostType } from './types';

export const NEIGHBORHOODS = [
  'Meia Praia',
  'Centro',
  'Morretes',
  'Sertão do Trombudo',
  'Jardim Praiamar',
  'Ilhota',
  'Alto São Bento',
  'Várzea',
  'Canto da Praia',
  'Tabuleiro'
];

export const INITIAL_USER = {
  id: 'user-123',
  name: 'João da Silva',
  neighborhood: 'Meia Praia',
  photo: 'https://picsum.photos/seed/joao/200',
  role: 'CITIZEN' as const
};

export const MOCK_POSTS = [
  {
    id: 'p1',
    userId: 'u2',
    userName: 'Maria Souza',
    userNeighborhood: 'Centro',
    type: PostType.WARNING,
    content: 'Atenção moradores do Centro: haverá manutenção na rede elétrica amanhã entre 08h e 12h.',
    likes: 15,
    comments: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 'p2',
    userId: 'u3',
    userName: 'Carlos Pereira',
    userNeighborhood: 'Morretes',
    type: PostType.PHOTO,
    content: 'Lindo pôr do sol hoje na Meia Praia! Itapema é um paraíso.',
    image: 'https://picsum.photos/seed/itapema1/600/400',
    likes: 84,
    comments: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
  }
];

export const MOCK_COMPLAINTS = [
  {
    id: 'c1',
    userId: 'user-123',
    category: ComplaintCategory.POTHOLE,
    description: 'Grande buraco na Rua 234, perigo constante para ciclistas.',
    status: ComplaintStatus.IN_ANALYSIS,
    protocol: '2023-ITP-4592',
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    location: { lat: -27.1354, lng: -48.6042, address: 'Rua 234, Meia Praia' }
  }
];

export const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'Show de Verão na Orla',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    location: 'Palco Central - Meia Praia',
    description: 'Grande show gratuito para toda a família.',
    category: 'Show' as const,
    interested: 450
  },
  {
    id: 'e2',
    title: 'Copa Itapema de Surf',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
    location: 'Canto da Praia',
    description: 'Competição regional de surf categorias amador e pro.',
    category: 'Esporte' as const,
    interested: 230
  }
];
