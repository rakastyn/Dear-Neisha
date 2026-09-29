export interface CoupleProfile {
  partner1Name: string; // "Raka"
  partner2Name: string; // "Neisha"
  anniversaryDate: string; // "2026-03-26"
  relationshipStartDate: string; // "2026-03-26T00:00:00"
  firstDate: string; // "2026-01-12"
  specialSongTitle: string; // "Close to You / Jauh"
  specialSongArtist: string; // "Reality Club"
  youtubeVideoId: string; // "7bz81uv3v1E"
  songAudioUrl?: string;
  tagline: string;
  heroBackgroundImage?: string;
  heroBackgroundMode?: 'banner' | 'full';
  heroDimming?: number;
  forYouBackgroundImage?: string;
  forYouBackgroundMode?: 'banner' | 'full';
  forYouDimming?: number;
  firstDateBackgroundImage?: string;
  firstDateBackgroundMode?: 'banner' | 'full';
  firstDateDimming?: number;
  galleryBackgroundImage?: string;
  galleryBackgroundMode?: 'banner' | 'full';
  galleryDimming?: number;
}

export interface FirstDateInfo {
  date: string; // "12 January 2026"
  time: string;
  location: string;
  city: string;
  tableNumber: string;
  whatWeOrdered: string[];
  storyText: string;
  partner1Memory: string;
  partner2Memory: string;
  firstImpression1: string;
  firstImpression2: string;
  imageSrc: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'first_photo' | 'favorite_her' | 'favorite_us' | 'adventure' | 'everyday' | 'milestone';
  date: string;
  location: string;
  caption: string;
  imageSrc: string;
  likes: number;
  featuredType?: 'first_photo' | 'favorite_her' | 'favorite_us';
}

export interface NeishaStoryPost {
  id: string;
  date: string;
  time: string;
  mood: string;
  condition: string; // Current condition or feelings
  story: string; // Thoughts and stories shared
  photoUrl?: string; // Photo uploaded
  likes: number;
  rakaReply?: string; // Reply or sweet note from partner
}

export interface PartnerCondition {
  partnerName: string;
  mood: string;
  moodLabel: string;
  energyLevel: number;
  thinkingAbout: string;
  craving: string;
  lastUpdated: string;
  statusBadge: string;
}

export interface SharedGoal {
  id: string;
  title: string;
  category: 'Travel' | 'Romantic Dates' | 'Life Milestones' | 'Silly Adventures';
  completed: boolean;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
}

export interface RakaMessage {
  id: string;
  title: string;
  content: string;
  category: 'Love Letter' | 'Encouragement' | 'When You Miss Me' | 'Little Reminder' | 'Late Night Note';
  date: string;
  time?: string;
  isPinned?: boolean;
  likes: number;
}

export type ActiveTab = 'countdown' | 'first-date' | 'gallery' | 'conditions-goals';
