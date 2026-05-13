import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeroService } from '../../services/hero.service';
import { AboutService } from '../../services/about.service';
import { ServicesService } from '../../services/services.service';
import { PortfolioService } from '../../services/portfolio.service';
import { TestimonialsService } from '../../services/testimonials.service';
import { StatsService } from '../../services/stats.service';
import { SkillsService } from '../../services/skills.service';
import { CtaService } from '../../services/cta.service';
import {
  HeroSection,
  AboutSection,
  Service,
  PortfolioItem,
  Testimonial,
  Stat,
  Skill,
  CtaSection
} from '../../models/content.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hero?: HeroSection;
  about?: AboutSection;
  services: Service[] = [];
  portfolioItems: PortfolioItem[] = [];
  filteredPortfolioItems: PortfolioItem[] = [];
  testimonials: Testimonial[] = [];
  stats: Stat[] = [];
  skills: Skill[] = [];
  cta?: CtaSection;

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

  constructor(
    private sanitizer: DomSanitizer,
    private heroService: HeroService,
    private aboutService: AboutService,
    private servicesService: ServicesService,
    private portfolioService: PortfolioService,
    private testimonialsService: TestimonialsService,
    private statsService: StatsService,
    private skillsService: SkillsService,
    private ctaService: CtaService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
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
      this.ctaService.get().toPromise()
    ]).then(([hero, about, services, portfolio, testimonials, stats, skills, cta]) => {
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
}
