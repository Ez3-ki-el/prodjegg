import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ServicesService } from '../../services/services.service';

interface IconifySearchResponse {
  icons: string[];
}

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  serviceForm!: FormGroup;
  loading = false;
  isEditMode = false;
  serviceId?: number;

  private readonly iconAliases: Record<string, string> = {
    'bx bx-cocktail': 'bx:drink',
    'bx bxs-cocktail': 'bxs:drink',
    'bx-cocktail': 'bx:drink',
    'bxs-cocktail': 'bxs:drink'
  };

  private readonly allowedPrefixes = new Set(['bx', 'bxs', 'bxl']);

  iconSearchQuery = '';
  iconSearchResults: string[] = [];
  iconSearchLoading = false;
  private readonly iconSearch$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      description: ['', Validators.required],
      iconClass: ['bxs:video', Validators.required],
      order: [0, Validators.required]
    });

    this.iconSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.iconSearchLoading = true;
          return this.http.get<IconifySearchResponse>('https://api.iconify.design/search', {
            params: { query, limit: '48', prefixes: 'bx,bxs,bxl' }
          });
        })
      )
      .subscribe({
        next: (res) => {
          this.iconSearchResults = res.icons || [];
          this.iconSearchLoading = false;
        },
        error: () => {
          this.iconSearchResults = [];
          this.iconSearchLoading = false;
        }
      });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.serviceId = +id;
      this.loadService(this.serviceId);
    }
  }

  loadService(id: number): void {
    this.servicesService.getById(id).subscribe({
      next: (service) => {
        this.serviceForm.patchValue({
          ...service,
          iconClass: this.toIconifyIcon(service.iconClass)
        });
      }
    });
  }

  onIconSearchInput(query: string): void {
    this.iconSearchQuery = query;

    const trimmed = query.trim();
    if (!trimmed) {
      this.iconSearchResults = [];
      this.iconSearchLoading = false;
      return;
    }

    this.iconSearch$.next(trimmed);
  }

  selectIcon(icon: string): void {
    this.serviceForm.get('iconClass')?.setValue(icon);
    this.iconSearchQuery = '';
    this.iconSearchResults = [];
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) return;

    this.loading = true;
    const formValue = {
      ...this.serviceForm.value,
      iconClass: this.toIconifyIcon(this.serviceForm.value.iconClass)
    };

    const request = this.isEditMode
      ? this.servicesService.update(this.serviceId!, formValue)
      : this.servicesService.create(formValue);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/services']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getPreviewIcon(): string {
    return this.toIconifyIcon(this.serviceForm?.get('iconClass')?.value);
  }

  normalizeIconInput(): void {
    const iconControl = this.serviceForm.get('iconClass');
    if (!iconControl) {
      return;
    }

    const rawValue = (iconControl.value || '').toString().trim();
    if (!rawValue) {
      return;
    }

    iconControl.setValue(this.toIconifyIcon(rawValue), { emitEvent: false });
  }

  private toIconifyIcon(value: string | null | undefined): string {
    const normalized = (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
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
}
