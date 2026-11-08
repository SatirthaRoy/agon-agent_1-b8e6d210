export interface SiteSettings {
  id?: number;
  partner_name: string;
  user_name: string;
  hero_title: string;
  hero_subtitle: string;
  romantic_quote?: string;
  anniversary_date: string;
  theme_id: 'lovely_pink' | 'rose_gold' | 'pastel_sunset' | 'romantic_midnight' | 'lavender_blush';
  primary_color?: string;
  font_style?: string;
  secret_code: string;
  master_pin: string;
  bg_music_url?: string;
  enabled_components: {
    hero: boolean;
    plushie: boolean;
    countdown: boolean;
    timeline: boolean;
    reasons: boolean;
    gallery: boolean;
    notes: boolean;
    bucketlist: boolean;
    quiz: boolean;
    lovejar: boolean;
    music: boolean;
  };
  section_order: string[];
}

export interface TimelineEvent {
  id: number;
  title: string;
  event_date: string;
  description: string;
  location?: string;
  image_url?: string;
  order_index: number;
}

export interface LoveReason {
  id: number;
  reason: string;
  category: string;
  order_index: number;
}

export interface GalleryMemory {
  id: number;
  title: string;
  caption?: string;
  image_url: string;
  date_taken?: string;
  is_favorite: boolean;
  order_index: number;
}

export interface BucketItem {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  completed_date?: string;
  target_date?: string;
}

export interface LoveNote {
  id: number;
  title: string;
  content: string;
  is_secret: boolean;
  unlock_code?: string;
  created_at?: string;
  read_by_gf?: boolean;
}

export interface GfMessage {
  id: number;
  sender: string;
  message: string;
  sentiment: 'heart' | 'kiss' | 'hug' | 'smile' | string;
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}
