import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeroService } from '../../services/hero.service';
import { HeroSection } from '../../models/content.models';

@Component({
  selector: 'app-hero-edit',
  templateUrl: './hero-edit.component.html',
  styleUrls: ['./hero-edit.component.css']
})
export class HeroEditComponent implements OnInit {
  heroForm!: FormGroup;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    this.heroForm = this.fb.group({
      id: [0],
      fullName: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      imagePath: ['', Validators.required],
      facebookUrl: [''],
      twitterUrl: [''],
      instagramUrl: [''],
      youtubeUrl: ['']
    });

    this.loadHero();
  }

  loadHero(): void {
    this.heroService.get().subscribe({
      next: (hero) => {
        this.heroForm.patchValue(hero);
      },
      error: (err) => {
        console.error('Error loading hero:', err);
        this.message = 'Erreur lors du chargement des données';
      }
    });
  }

  onImageUploaded(path: string): void {
    this.heroForm.patchValue({ imagePath: path });
    this.heroForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      return;
    }

    this.loading = true;
    this.heroService.update(this.heroForm.value).subscribe({
      next: () => {
        this.message = 'Hero section mise à jour avec succès !';
        this.loading = false;
      },
      error: () => {
        this.message = 'Erreur lors de la mise à jour';
        this.loading = false;
      }
    });
  }
}
