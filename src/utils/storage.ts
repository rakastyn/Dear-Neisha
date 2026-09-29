import { CoupleProfile, FirstDateInfo, PhotoItem, NeishaStoryPost, PartnerCondition, SharedGoal } from '../types';

import favPhotoUsImg from '../assets/images/real_fav_photo_us_1790657970207.jpg';
import becameCoupleImg from '../assets/images/day_we_became_couple_1790657981504.jpg';
import favPhotoHerImg from '../assets/images/real_fav_photo_her_1790657995551.jpg';
import firstDatePhotoboothImg from '../assets/images/first_date_photobooth_1790658006945.jpg';
import neishaDailyImg from '../assets/images/neisha_daily_photo_1790657137975.jpg';
import homepageHeroBgImg from '../assets/images/homepage_hero_bg_1790665351760.jpg';
import firstDateCafeImg from '../assets/images/first_date_cafe_1790656473424.jpg';
import firstPhotoTogetherImg from '../assets/images/first_photo_together_1790656494330.jpg';

export const DEFAULT_HERO_BG = homepageHeroBgImg;
export const ALT_HERO_BG = favPhotoUsImg;
export const DEFAULT_FOR_YOU_BG = favPhotoHerImg;
export const DEFAULT_FIRST_DATE_BG = firstDatePhotoboothImg;
export const DEFAULT_GALLERY_BG = favPhotoUsImg;

export interface BackgroundPreset {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  tag?: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'cinematic-wide',
    name: 'Cinematic Horizon',
    description: 'Japan, Indonesia & everything in between (16:9)',
    imageSrc: homepageHeroBgImg,
    tag: 'Recommended'
  },
  {
    id: 'night-lights-us',
    name: 'Night Lights & Bouquet',
    description: 'Resting on shoulder with vibrant flowers',
    imageSrc: favPhotoUsImg,
    tag: 'Romantic'
  },
  {
    id: 'day-we-became-couple',
    name: 'Day We Became A Couple',
    description: 'March 26 car trunk flowers & celebration',
    imageSrc: becameCoupleImg,
    tag: 'Milestone'
  },
  {
    id: 'fav-photo-her',
    name: 'Favorite Photo of Neisha',
    description: 'Gentle golden glow & sweet smile',
    imageSrc: favPhotoHerImg,
    tag: 'Sweet'
  },
  {
    id: 'first-date-photobooth',
    name: 'First Date Photobooth',
    description: 'January 12 matching white shirts & glasses',
    imageSrc: firstDatePhotoboothImg,
    tag: 'Photobooth'
  },
  {
    id: 'first-date-cafe',
    name: 'Cozy Cafe Corner',
    description: 'Where 45 minutes became 3 hours',
    imageSrc: firstDateCafeImg,
    tag: 'First Date'
  },
  {
    id: 'first-photo-together',
    name: 'First Photo Together',
    description: 'The first chapter of our love story',
    imageSrc: firstPhotoTogetherImg,
    tag: 'Memories'
  },
  {
    id: 'neisha-daily',
    name: 'Neisha’s Daily Glow',
    description: 'Warm, cozy smile that brightens any day',
    imageSrc: neishaDailyImg,
    tag: 'Daily'
  }
];

export const DEFAULT_PROFILE: CoupleProfile = {
  partner1Name: 'Raka',
  partner2Name: 'Neisha',
  anniversaryDate: '2026-03-26',
  relationshipStartDate: '2026-03-26T00:00:00',
  firstDate: '2026-01-12',
  specialSongTitle: 'Close to You / Jauh',
  specialSongArtist: 'Reality Club',
  youtubeVideoId: '7bz81uv3v1E',
  songAudioUrl: '',
  tagline: 'Though miles apart or side by side, always close to you.',
  heroBackgroundImage: homepageHeroBgImg,
  heroBackgroundMode: 'banner',
  heroDimming: 55,
  forYouBackgroundImage: favPhotoHerImg,
  forYouBackgroundMode: 'full',
  forYouDimming: 65,
  firstDateBackgroundImage: firstDatePhotoboothImg,
  firstDateBackgroundMode: 'full',
  firstDateDimming: 65,
  galleryBackgroundImage: favPhotoUsImg,
  galleryBackgroundMode: 'full',
  galleryDimming: 65
};

export const DEFAULT_FIRST_DATE: FirstDateInfo = {
  date: 'January 12, 2026',
  time: '5:30 PM (Golden Hour)',
  location: 'Photomatics & The Cozy Corner Cafe',
  city: 'Downtown where our journey began',
  tableNumber: 'Table by the window',
  whatWeOrdered: [
    'Caramel Sea Salt Latte (Neisha)',
    'Iced Americano (Raka, trying to look composed while heart was racing)',
    'Warm cinnamon rolls we shared slowly together'
  ],
  storyText: 'Monday, January 12, 2026. What was supposed to be a quick 45-minute casual hangout turned into three unforgettable hours. From taking goofy pictures in the photobooth in our matching white shirts to sharing warm drinks at the cafe, time completely vanished the moment Neisha smiled. Walking her home under the night lights, Raka knew right then that she was someone he never wanted to let go of.',
  partner1Memory: 'I remember the exact moment you adjusted your glasses and smiled. My heart skipped about three beats all at once.',
  partner2Memory: 'You listened to every little story with such care and warmth, making me feel so safe and understood from day one.',
  firstImpression1: '"Her radiant smile made every worry and tiredness disappear in an instant."',
  firstImpression2: '"He is genuinely kind, funny, and has a way of making me feel truly cherished."',
  imageSrc: firstDatePhotoboothImg
};

export const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'fav-photo-us',
    title: 'My Favorite Photo of Us',
    category: 'favorite_us',
    featuredType: 'favorite_us',
    date: 'Our Special Evening',
    location: 'Under the night lights',
    caption: 'Resting your head on my shoulder with the biggest, most colorful bouquet of flowers. Every time I look at this picture, I fall in love all over again.',
    imageSrc: favPhotoUsImg,
    likes: 88
  },
  {
    id: 'day-we-became-couple',
    title: 'The Day We Officially Became a Couple',
    category: 'milestone',
    featuredType: 'first_photo',
    date: 'March 26, 2026',
    location: 'Car trunk surprise & flowers',
    caption: '"May I be your..." — The happiest question I have ever asked, and your shy, glowing smile when you said yes will forever be my favorite core memory.',
    imageSrc: becameCoupleImg,
    likes: 95
  },
  {
    id: 'fav-photo-her',
    title: 'My Favorite Photo of You',
    category: 'favorite_her',
    featuredType: 'favorite_her',
    date: 'Golden Glow',
    location: 'Right in front of me',
    caption: 'That gentle pout, sparkling dark eyes, and effortless beauty. You are, and always will be, the most breathtaking girl in the entire universe.',
    imageSrc: favPhotoHerImg,
    likes: 79
  },
  {
    id: 'our-first-date',
    title: 'Our First Date',
    category: 'first_photo',
    date: 'January 12, 2026',
    location: 'Photomatics Photobooth',
    caption: 'Matching white t-shirts, glasses on our heads, and goofy matching expressions. The photostrip that started our beautiful adventure together.',
    imageSrc: firstDatePhotoboothImg,
    likes: 84
  }
];

export const DEFAULT_NEISHA_STORIES: NeishaStoryPost[] = [
  {
    id: 'neisha-post-1',
    date: 'Today',
    time: '2:20 PM',
    mood: '🥰 Happy & Missing You',
    condition: 'A little tired from classes/work today, but listening to our Reality Club song immediately cheered me up!',
    story: 'Walking home today, I suddenly remembered our first date on January 12th. I am so grateful to have you as my safe haven where I can tell you anything. Let us have a quick phone call tonight, I have a funny story from lunchtime to tell you!',
    photoUrl: neishaDailyImg,
    likes: 18,
    rakaReply: 'Of course my love! Rest up first, I will call you at 8 sharp tonight. Remember to drink lots of water ❤️'
  },
  {
    id: 'neisha-post-2',
    date: 'Yesterday',
    time: '8:45 PM',
    mood: '🥺 Need Hugs & Warmth',
    condition: 'Feeling slightly overwhelmed by deadlines and got a mild headache.',
    story: 'Felt a bit stressed earlier, but scrolling through our photos in this gallery made all the tension melt away. Thank you Raka for always being so patient and loving whenever I am in a mood.',
    likes: 14,
    rakaReply: 'You did so well today Neisha. You are never alone, I am always right here beside you and so proud of you. Sleep tight sweetheart 🤍'
  },
  {
    id: 'neisha-post-3',
    date: 'March 26, 2026',
    time: '00:01 AM',
    mood: '🎉 Anniversary Day!',
    condition: 'Too excited and happy to sleep!',
    story: 'Happy Anniversary my love! March 26th is the most special date. Thank you for choosing to be in my life and for always being my warmest home. I love you more than words could ever describe.',
    likes: 45,
    rakaReply: 'Happy Anniversary Neisha! Every day with you is the sweetest blessing of my life. Forever and always, close to you ✨'
  }
];

export const DEFAULT_CONDITIONS: { partner1: PartnerCondition; partner2: PartnerCondition } = {
  partner1: {
    partnerName: 'Raka',
    mood: '🥰',
    moodLabel: 'Completely in love with Neisha',
    energyLevel: 90,
    thinkingAbout: 'Ways to make Neisha smile and laugh throughout the day',
    craving: 'Hearing Neisha giggle & long warm hugs',
    lastUpdated: '10 minutes ago',
    statusBadge: 'Thinking of Neisha'
  },
  partner2: {
    partnerName: 'Neisha',
    mood: '🌸',
    moodLabel: 'Cozy & Affectionate',
    energyLevel: 80,
    thinkingAbout: 'Planning our next weekend date together',
    craving: 'Iced Matcha Latte & gentle head pats',
    lastUpdated: '25 minutes ago',
    statusBadge: 'Listening to Close to You'
  }
};

export const DEFAULT_GOALS: SharedGoal[] = [
  {
    id: 'goal-1',
    title: 'Sing "Close to You / Jauh" together in the front row of a Reality Club concert',
    category: 'Romantic Dates',
    completed: false,
    targetDate: '2026 / 2027',
    notes: 'Holding hands tight when the chorus hits.'
  },
  {
    id: 'goal-2',
    title: 'Our first date at Photomatics & the cozy cafe on January 12, 2026',
    category: 'Life Milestones',
    completed: true,
    completedDate: 'January 12, 2026',
    notes: 'Where our lovely journey began.'
  },
  {
    id: 'goal-3',
    title: 'The day we officially became a couple on March 26, 2026',
    category: 'Life Milestones',
    completed: true,
    completedDate: 'March 26, 2026',
    notes: 'The car trunk flower surprise and saying yes forever.'
  },
  {
    id: 'goal-4',
    title: 'Sunset picnic in the park with homemade bento boxes',
    category: 'Romantic Dates',
    completed: false,
    targetDate: 'Next Month',
    notes: 'With a checkered blanket and Polaroid camera.'
  },
  {
    id: 'goal-5',
    title: 'Roadtrip to the ocean beach to catch the sunrise together',
    category: 'Travel',
    completed: false,
    targetDate: 'Upcoming Holiday',
    notes: 'Cozy blankets and a thermos of hot cocoa.'
  },
  {
    id: 'goal-6',
    title: 'Print a physical memory book filled with all photos from this gallery',
    category: 'Silly Adventures',
    completed: false,
    targetDate: 'End of Year',
    notes: 'Decorated with cute stickers and our handwritten notes.'
  }
];

const KEYS = {
  PROFILE: 'couple_app_profile_v3',
  FIRST_DATE: 'couple_app_first_date_v3',
  PHOTOS: 'couple_app_photos_v3',
  NEISHA_STORIES: 'couple_app_neisha_stories_v3',
  CONDITIONS: 'couple_app_conditions_v3',
  GOALS: 'couple_app_goals_v3'
};

export function loadProfile(): CoupleProfile {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) return DEFAULT_PROFILE;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      heroBackgroundImage: parsed.heroBackgroundImage || DEFAULT_PROFILE.heroBackgroundImage,
      heroBackgroundMode: parsed.heroBackgroundMode || DEFAULT_PROFILE.heroBackgroundMode,
      heroDimming: typeof parsed.heroDimming === 'number' ? parsed.heroDimming : DEFAULT_PROFILE.heroDimming,
      forYouBackgroundImage: parsed.forYouBackgroundImage || DEFAULT_PROFILE.forYouBackgroundImage,
      forYouBackgroundMode: parsed.forYouBackgroundMode || DEFAULT_PROFILE.forYouBackgroundMode,
      forYouDimming: typeof parsed.forYouDimming === 'number' ? parsed.forYouDimming : DEFAULT_PROFILE.forYouDimming,
      firstDateBackgroundImage: parsed.firstDateBackgroundImage || DEFAULT_PROFILE.firstDateBackgroundImage,
      firstDateBackgroundMode: parsed.firstDateBackgroundMode || DEFAULT_PROFILE.firstDateBackgroundMode,
      firstDateDimming: typeof parsed.firstDateDimming === 'number' ? parsed.firstDateDimming : DEFAULT_PROFILE.firstDateDimming,
      galleryBackgroundImage: parsed.galleryBackgroundImage || DEFAULT_PROFILE.galleryBackgroundImage,
      galleryBackgroundMode: parsed.galleryBackgroundMode || DEFAULT_PROFILE.galleryBackgroundMode,
      galleryDimming: typeof parsed.galleryDimming === 'number' ? parsed.galleryDimming : DEFAULT_PROFILE.galleryDimming
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: CoupleProfile) {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export function loadFirstDate(): FirstDateInfo {
  try {
    const data = localStorage.getItem(KEYS.FIRST_DATE);
    return data ? { ...DEFAULT_FIRST_DATE, ...JSON.parse(data) } : DEFAULT_FIRST_DATE;
  } catch {
    return DEFAULT_FIRST_DATE;
  }
}

export function saveFirstDate(info: FirstDateInfo) {
  try {
    localStorage.setItem(KEYS.FIRST_DATE, JSON.stringify(info));
  } catch (e) {
    console.error(e);
  }
}

export function loadPhotos(): PhotoItem[] {
  try {
    const data = localStorage.getItem(KEYS.PHOTOS);
    if (!data) return DEFAULT_PHOTOS;
    const parsed = JSON.parse(data);
    return parsed.map((item: PhotoItem) => {
      if (item.id === 'fav-photo-us' && !item.imageSrc.startsWith('data:')) {
        return { ...item, imageSrc: favPhotoUsImg };
      }
      if (item.id === 'day-we-became-couple' && !item.imageSrc.startsWith('data:')) {
        return { ...item, imageSrc: becameCoupleImg };
      }
      if (item.id === 'fav-photo-her' && !item.imageSrc.startsWith('data:')) {
        return { ...item, imageSrc: favPhotoHerImg };
      }
      if (item.id === 'our-first-date' && !item.imageSrc.startsWith('data:')) {
        return { ...item, imageSrc: firstDatePhotoboothImg };
      }
      return item;
    });
  } catch {
    return DEFAULT_PHOTOS;
  }
}

export function savePhotos(photos: PhotoItem[]) {
  try {
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(photos));
  } catch (e) {
    console.error(e);
  }
}

export function loadNeishaStories(): NeishaStoryPost[] {
  try {
    const data = localStorage.getItem(KEYS.NEISHA_STORIES);
    if (!data) return DEFAULT_NEISHA_STORIES;
    const parsed = JSON.parse(data);
    return parsed.map((item: NeishaStoryPost) => {
      if (item.id === 'neisha-post-1' && !item.photoUrl?.startsWith('data:')) {
        return { ...item, photoUrl: neishaDailyImg };
      }
      return item;
    });
  } catch {
    return DEFAULT_NEISHA_STORIES;
  }
}

export function saveNeishaStories(stories: NeishaStoryPost[]) {
  try {
    localStorage.setItem(KEYS.NEISHA_STORIES, JSON.stringify(stories));
  } catch (e) {
    console.error(e);
  }
}

export function loadConditions(): { partner1: PartnerCondition; partner2: PartnerCondition } {
  try {
    const data = localStorage.getItem(KEYS.CONDITIONS);
    return data ? JSON.parse(data) : DEFAULT_CONDITIONS;
  } catch {
    return DEFAULT_CONDITIONS;
  }
}

export function saveConditions(conditions: { partner1: PartnerCondition; partner2: PartnerCondition }) {
  try {
    localStorage.setItem(KEYS.CONDITIONS, JSON.stringify(conditions));
  } catch (e) {
    console.error(e);
  }
}

export function loadGoals(): SharedGoal[] {
  try {
    const data = localStorage.getItem(KEYS.GOALS);
    return data ? JSON.parse(data) : DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
}

export function saveGoals(goals: SharedGoal[]) {
  try {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error(e);
  }
}
