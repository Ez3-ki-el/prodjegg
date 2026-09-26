import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { PortfolioService } from '../../services/portfolio.service';
import { TestimonialsService } from '../../services/testimonials.service';
import { StatsService } from '../../services/stats.service';
import { SkillsService } from '../../services/skills.service';

export interface DuplicateGroup {
  section: string;
  adminLink: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    services: 0,
    portfolioItems: 0,
    testimonials: 0,
    skills: 0
  };

  duplicates: DuplicateGroup[] = [];
  isLoading = true;

  constructor(
    private servicesService: ServicesService,
    private portfolioService: PortfolioService,
    private testimonialsService: TestimonialsService,
    private statsService: StatsService,
    private skillsService: SkillsService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    Promise.all([
      this.servicesService.getAll().toPromise(),
      this.portfolioService.getAll().toPromise(),
      this.testimonialsService.getAll().toPromise(),
      this.statsService.getAll().toPromise(),
      this.skillsService.getAll().toPromise()
    ]).then(([services, portfolio, testimonials, siteStats, skills]) => {
      this.stats.services = services?.length || 0;
      this.stats.portfolioItems = portfolio?.length || 0;
      this.stats.testimonials = testimonials?.length || 0;
      this.stats.skills = skills?.length || 0;

      this.duplicates = [
        ...this.findDuplicates('Services', '/admin/services', services || [], (s) => s.title),
        ...this.findDuplicates('Avis clients', '/admin/testimonials', testimonials || [], (t) => `${t.clientName}|${t.content}`, (t) => t.clientName),
        ...this.findDuplicates('Statistiques', '/admin/stats', siteStats || [], (s) => s.label),
        ...this.findDuplicates('Compétences', '/admin/skills', skills || [], (s) => s.name)
      ];

      this.isLoading = false;
    });
  }

  private findDuplicates<T>(
    section: string,
    adminLink: string,
    items: T[],
    keyFn: (item: T) => string,
    labelFn: (item: T) => string = keyFn
  ): DuplicateGroup[] {
    const counts = new Map<string, { label: string; count: number }>();

    for (const item of items) {
      const key = (keyFn(item) || '').trim().toLowerCase();
      if (!key) continue;

      const existing = counts.get(key);
      if (existing) {
        existing.count++;
      } else {
        counts.set(key, { label: labelFn(item), count: 1 });
      }
    }

    return Array.from(counts.values())
      .filter((entry) => entry.count > 1)
      .map((entry) => ({ section, adminLink, label: entry.label, count: entry.count }));
  }
}
