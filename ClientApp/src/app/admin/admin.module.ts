import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HeroEditComponent } from './hero-edit/hero-edit.component';
import { AboutEditComponent } from './about-edit/about-edit.component';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';
import { PortfolioListComponent } from './portfolio-list/portfolio-list.component';
import { PortfolioFormComponent } from './portfolio-form/portfolio-form.component';
import { TestimonialsListComponent } from './testimonials-list/testimonials-list.component';
import { TestimonialFormComponent } from './testimonial-form/testimonial-form.component';
import { StatsListComponent } from './stats-list/stats-list.component';
import { StatFormComponent } from './stat-form/stat-form.component';
import { SkillsListComponent } from './skills-list/skills-list.component';
import { SkillFormComponent } from './skill-form/skill-form.component';
import { CtaEditComponent } from './cta-edit/cta-edit.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      // Hero
      { path: 'hero', component: HeroEditComponent },

      // About
      { path: 'about', component: AboutEditComponent },

      // Services
      { path: 'services', component: ServicesListComponent },
      { path: 'services/new', component: ServiceFormComponent },
      { path: 'services/edit/:id', component: ServiceFormComponent },

      // Portfolio
      { path: 'portfolio', component: PortfolioListComponent },
      { path: 'portfolio/new', component: PortfolioFormComponent },
      { path: 'portfolio/edit/:id', component: PortfolioFormComponent },

      // Testimonials
      { path: 'testimonials', component: TestimonialsListComponent },
      { path: 'testimonials/new', component: TestimonialFormComponent },
      { path: 'testimonials/edit/:id', component: TestimonialFormComponent },

      // Stats
      { path: 'stats', component: StatsListComponent },
      { path: 'stats/new', component: StatFormComponent },
      { path: 'stats/edit/:id', component: StatFormComponent },

      // Skills
      { path: 'skills', component: SkillsListComponent },
      { path: 'skills/new', component: SkillFormComponent },
      { path: 'skills/edit/:id', component: SkillFormComponent },

      // CTA
      { path: 'cta', component: CtaEditComponent }
    ]
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    AdminLayoutComponent,
    HeroEditComponent,
    AboutEditComponent,
    ServicesListComponent,
    ServiceFormComponent,
    PortfolioListComponent,
    PortfolioFormComponent,
    TestimonialsListComponent,
    TestimonialFormComponent,
    StatsListComponent,
    StatFormComponent,
    SkillsListComponent,
    SkillFormComponent,
    CtaEditComponent,
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
