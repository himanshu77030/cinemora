import { Genre } from '../types';

export const TMDB_GENRES: Genre[] = [
  {
    id: 28,
    name: 'Action',
    slug: 'action',
    description: 'High stakes, kinetic combat, thrilling chases, and explosive set pieces.',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 12,
    name: 'Adventure',
    slug: 'adventure',
    description: 'Expeditions into the unknown, sweeping journeys across vast landscapes and uncharted worlds.',
    backdrop: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 16,
    name: 'Animation',
    slug: 'animation',
    description: 'Stunning visual storytelling from visionary animators, ranging from anime to hand-drawn classics.',
    backdrop: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 35,
    name: 'Comedy',
    slug: 'comedy',
    description: 'Clever wit, hilarious situational humor, satire, and unforgettable laugh-out-loud moments.',
    backdrop: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 80,
    name: 'Crime',
    slug: 'crime',
    description: 'Gritty underworlds, intricate heists, mob syndicates, detectives, and psychological tension.',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 99,
    name: 'Documentary',
    slug: 'documentary',
    description: 'Captivating real-world explorations, untold histories, human resilience, and natural wonders.',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 18,
    name: 'Drama',
    slug: 'drama',
    description: 'Intense human conflict, profound relationships, moral dilemmas, and heartfelt emotional arcs.',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 10751,
    name: 'Family',
    slug: 'family',
    description: 'Heartwarming stories, wholesome adventure, and uplifting themes for all generations.',
    backdrop: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 14,
    name: 'Fantasy',
    slug: 'fantasy',
    description: 'Mythical realms, ancient magic, legendary creatures, and grand heroic destinies.',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 36,
    name: 'History',
    slug: 'history',
    description: 'Dramatizations of monumental world events, historical figures, and civilizational turning points.',
    backdrop: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 27,
    name: 'Horror',
    slug: 'horror',
    description: 'Spine-chilling terror, psychological dread, supernatural horrors, and terrifying suspense.',
    backdrop: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 10402,
    name: 'Music',
    slug: 'music',
    description: 'Rhythmic masterworks, biopics of musical legends, electric concerts, and soul-stirring scores.',
    backdrop: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 9648,
    name: 'Mystery',
    slug: 'mystery',
    description: 'Enigmatic puzzles, neo-noir investigations, twist-laden plots, and shocking reveals.',
    backdrop: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 10749,
    name: 'Romance',
    slug: 'romance',
    description: 'Passionate encounters, tender connections, heartbreak, and everlasting romantic devotion.',
    backdrop: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 878,
    name: 'Sci-Fi',
    slug: 'scifi',
    description: 'Futuristic technology, deep space odyssey, artificial intelligence, time travel, and cyberpunk.',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 53,
    name: 'Thriller',
    slug: 'thriller',
    description: 'Edge-of-your-seat suspense, paranoia, espionage, relentless pacing, and nail-biting stakes.',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 10752,
    name: 'War',
    slug: 'war',
    description: 'The visceral crucible of armed combat, courage, brotherhood, and the devastating cost of war.',
    backdrop: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 37,
    name: 'Western',
    slug: 'western',
    description: 'Dusty frontier towns, lone gunslingers, outlaws, vengeance, and legendary showdowns.',
    backdrop: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop'
  }
];

export const GENRE_MAP: Record<number, string> = TMDB_GENRES.reduce((acc, g) => {
  acc[g.id] = g.name;
  return acc;
}, {} as Record<number, string>);
