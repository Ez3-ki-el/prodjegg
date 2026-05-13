export interface HeroSection {
  id: number;
  fullName: string;
  title: string;
  description: string;
  imagePath: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export interface AboutSection {
  id: number;
  title: string;
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  iconClass: string;
  order: number;
}

export interface PortfolioItem {
  id: number;
  title: string;
  imagePath: string;
  category: string;
  projectUrl?: string;
  order: number;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientTitle: string;
  clientImagePath: string;
  content: string;
  rating: number;
  order: number;
}

export interface Stat {
  id: number;
  label: string;
  value: number;
  order: number;
}

export interface Skill {
  id: number;
  name: string;
  percentage: number;
  order: number;
}

export interface CtaSection {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  email: string;
  phoneNumber: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  expiresAt: string;
}
