import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeroService } from '../../services/hero.service';
import { AboutService } from '../../services/about.service';
import { ServicesService } from '../../services/services.service';
import { PortfolioService } from '../../services/portfolio.service';
import { TestimonialsService } from '../../services/testimonials.service';
import { StatsService } from '../../services/stats.service';
import { SkillsService } from '../../services/skills.service';
import { CtaService } from '../../services/cta.service';
import { SettingsService } from '../../services/settings.service';
import {
  HeroSection,
  AboutSection,
  Service,
  PortfolioItem,
  Testimonial,
  Stat,
  Skill,
  CtaSection,
  SiteSettings
} from '../../models/content.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  hero?: HeroSection;
  about?: AboutSection;
  services: Service[] = [];
  portfolioItems: PortfolioItem[] = [];
  filteredPortfolioItems: PortfolioItem[] = [];
  testimonials: Testimonial[] = [];
  stats: Stat[] = [];
  skills: Skill[] = [];
  cta?: CtaSection;
  settings?: SiteSettings;

  selectedCategory: string = 'TOUT';
  categories: string[] = ['TOUT'];

  isLoading = true;
  mobileMenuOpen = false;
  currentYear = new Date().getFullYear();

  private readonly iconAliases: Record<string, string> = {
    'bx bx-cocktail': 'bx:drink',
    'bx bxs-cocktail': 'bxs:drink',
    'bx-cocktail': 'bx:drink',
    'bxs-cocktail': 'bxs:drink'
  };

  private readonly allowedPrefixes = new Set(['bx', 'bxs', 'bxl']);

  // Hauteur du bandeau d'en-tête Instagram (logo + compte) qu'on masque en
  // décalant l'iframe vers le haut - constante côté Instagram, indépendante du post.
  private readonly instagramHeaderHeight = 65;
  private readonly instagramFrameHeights: Record<number, number> = {};
  private readonly instagramWindowToItemId = new Map<Window, number>();
  private readonly onInstagramMessage = (event: MessageEvent): void => {
    if (event.origin !== 'https://www.instagram.com') {
      return;
    }

    const itemId = this.instagramWindowToItemId.get(event.source as Window);
    if (itemId === undefined) {
      return;
    }

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (data?.type === 'MEASURE' && typeof data.details?.height === 'number') {
        this.instagramFrameHeights[itemId] = data.details.height;
      }
    } catch {
      // Message non-JSON ou inattendu : on l'ignore simplement.
    }
  };

  constructor(
    private sanitizer: DomSanitizer,
    private heroService: HeroService,
    private aboutService: AboutService,
    private servicesService: ServicesService,
    private portfolioService: PortfolioService,
    private testimonialsService: TestimonialsService,
    private statsService: StatsService,
    private skillsService: SkillsService,
    private ctaService: CtaService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
    window.addEventListener('message', this.onInstagramMessage);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.onInstagramMessage);
  }

  loadAllData(): void {
    Promise.all([
      this.heroService.get().toPromise(),
      this.aboutService.get().toPromise(),
      this.servicesService.getAll().toPromise(),
      this.portfolioService.getAll().toPromise(),
      this.testimonialsService.getAll().toPromise(),
      this.statsService.getAll().toPromise(),
      this.skillsService.getAll().toPromise(),
      this.ctaService.get().toPromise(),
      this.settingsService.get().toPromise()
    ]).then(([hero, about, services, portfolio, testimonials, stats, skills, cta, settings]) => {
      this.hero = hero;
      this.about = about;
      this.services = services || [];
      this.portfolioItems = portfolio || [];
      this.filteredPortfolioItems = portfolio || [];
      this.categories = ['TOUT', ...new Set((portfolio || []).map(p => p.category?.toUpperCase()).filter(Boolean) as string[])];
      this.testimonials = testimonials || [];
      this.stats = stats || [];
      this.skills = skills || [];
      this.cta = cta;
      this.settings = settings;
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading = false;
    });
  }

  filterPortfolio(category: string): void {
    this.selectedCategory = category;
    if (category === 'TOUT') {
      this.filteredPortfolioItems = this.portfolioItems;
    } else {
      this.filteredPortfolioItems = this.portfolioItems.filter(
        item => item.category?.toUpperCase() === category.toUpperCase()
      );
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getIconifyIcon(iconClass: string | null | undefined): string {
    const normalized = (iconClass || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!normalized) {
      return 'bx:briefcase';
    }

    const aliased = this.iconAliases[normalized] || normalized;
    if (aliased.includes(':')) {
      const [prefix, name] = aliased.split(':');
      return this.allowedPrefixes.has(prefix) && !!name ? aliased : 'bx:briefcase';
    }

    const parts = aliased.split(' ');
    let prefix = 'bx';
    let iconName = '';

    for (const part of parts) {
      if (part === 'bx' || part === 'bxs' || part === 'bxl') {
        prefix = part;
      }

      if (part.startsWith('bx-')) {
        prefix = 'bx';
        iconName = part.slice(3);
      } else if (part.startsWith('bxs-')) {
        prefix = 'bxs';
        iconName = part.slice(4);
      } else if (part.startsWith('bxl-')) {
        prefix = 'bxl';
        iconName = part.slice(4);
      }
    }

    return iconName && this.allowedPrefixes.has(prefix) ? `${prefix}:${iconName}` : 'bx:briefcase';
  }

  isInstagramUrl(url: string | null | undefined): boolean {
    const normalized = (url || '').trim();
    return /(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\//i.test(normalized);
  }

  getInstagramEmbedUrl(url: string | null | undefined): SafeResourceUrl | null {
    const normalized = (url || '').trim();
    if (!this.isInstagramUrl(normalized)) {
      return null;
    }

    const match = normalized.match(/(?:instagram\.com|instagr\.am)\/(p|reel|tv)\/([^/?#]+)/i);
    if (!match) {
      return null;
    }

    const type = match[1].toLowerCase();
    const shortcode = match[2];
    const embedUrl = `https://www.instagram.com/${type}/${shortcode}/embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  onInstagramFrameLoad(event: Event, itemId: number): void {
    const contentWindow = (event.target as HTMLIFrameElement).contentWindow;
    if (contentWindow) {
      this.instagramWindowToItemId.set(contentWindow, itemId);
    }
  }

  // null tant que la vraie hauteur du post n'est pas connue: le CSS applique
  // alors sa taille par défaut, en attendant le message Instagram.
  getInstagramFrameHeight(itemId: number): number | null {
    const measured = this.instagramFrameHeights[itemId];
    return measured ? Math.max(measured - this.instagramHeaderHeight, 0) : null;
  }

  getInstagramIframeHeight(itemId: number): number | null {
    return this.instagramFrameHeights[itemId] || null;
  }
}
