import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { AboutService } from '../../services/about.service';
import { ServicesService } from '../../services/services.service';
import { PortfolioService } from '../../services/portfolio.service';
import { TestimonialsService } from '../../services/testimonials.service';
import { StatsService } from '../../services/stats.service';
import { SkillsService } from '../../services/skills.service';

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

  isLoading = true;

  constructor(
    private servicesService: ServicesService,
    private portfolioService: PortfolioService,
    private testimonialsService: TestimonialsService,
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
      this.skillsService.getAll().toPromise()
    ]).then(([services, portfolio, testimonials, skills]) => {
      this.stats.services = services?.length || 0;
      this.stats.portfolioItems = portfolio?.length || 0;
      this.stats.testimonials = testimonials?.length || 0;
      this.stats.skills = skills?.length || 0;
      this.isLoading = false;
    });
  }
}
