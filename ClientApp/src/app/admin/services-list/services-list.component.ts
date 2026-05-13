import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service';
import { Service } from '../../models/content.models';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {
  services: Service[] = [];
  loading = true;

  private readonly iconAliases: Record<string, string> = {
    'bx bx-cocktail': 'bx:drink',
    'bx bxs-cocktail': 'bxs:drink',
    'bx-cocktail': 'bx:drink',
    'bxs-cocktail': 'bxs:drink'
  };

  private readonly allowedPrefixes = new Set(['bx', 'bxs', 'bxl']);

  constructor(private servicesService: ServicesService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.servicesService.getAll().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteService(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    this.servicesService.delete(id).subscribe({
      next: () => {
        this.loadServices();
      }
    });
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

    if (!iconName) {
      return 'bx:briefcase';
    }

    return this.allowedPrefixes.has(prefix) ? `${prefix}:${iconName}` : 'bx:briefcase';
  }
}
