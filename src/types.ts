export interface BookMetadata {
  title: string;
  author: string;
  publisher: string;
  publishYear: string;
  pageCount: string;
  genre: string;
  targetAudience: string;
  keywords: string;
  qrUrl?: string;
}

export interface ImageEnhancement {
  sharpen: boolean;
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  cleanBackground: boolean;
  perspectiveFix: boolean;
}

export interface LibraryConfig {
  logoUrl: string | null;
  organizationName: string;
  footerText: string;
  showWatermark: boolean;
}

export interface CoverAnalysis {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  styleName: string;
  mood: string;
  dominantTopic: string;
  recommendedIcons: string[];
}

export interface HighlightPoint {
  icon: string;
  title: string;
  description: string;
}

export interface ContentAnalysis {
  tagline: string;
  coreMessage: string;
  valueProposition: string;
  highlights: HighlightPoint[];
  keyLessons: string[];
  notableQuotes: string[];
  targetAudienceDesc: string;
  reasonsToRead: string[];
}

export interface MediaContentPackage {
  bookReviewEssay: string;
  slogans: string[];
  facebookCaption: string;
  zaloPost: string;
  websiteArticle: string;
  hashtags: string[];
}

export interface InfographicDesignVariant {
  id: string; // 'formal' | 'modern' | 'vibrant'
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cardBgColor: string;
  textColor: string;
  subtextColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  headerStyle: 'gradient' | 'minimal' | 'banner' | 'card';
  badgeStyle: 'pill' | 'square' | 'outline';
  layoutPattern: 'balanced' | 'split-hero' | 'grid-cards';
}

export type CanvasDimensionId = '1080x1350' | '1080x1080' | '1080x1920' | 'a4-v' | 'a4-h';

export interface DimensionOption {
  id: CanvasDimensionId;
  label: string;
  subLabel: string;
  width: number;
  height: number;
  aspectRatioLabel: string;
}

export interface GeneratedInfographicPackage {
  coverAnalysis: CoverAnalysis;
  contentAnalysis: ContentAnalysis;
  variants: InfographicDesignVariant[];
  mediaPackage: MediaContentPackage;
  generatedAt: string;
}
