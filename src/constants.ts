import { Track } from './types';

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Synthwave',
    coverUrl: 'https://picsum.photos/seed/neon1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Standard demo MP3s
    duration: 372,
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Digital Echo',
    coverUrl: 'https://picsum.photos/seed/neon2/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Vector Flux',
    coverUrl: 'https://picsum.photos/seed/neon3/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 388,
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 100;
