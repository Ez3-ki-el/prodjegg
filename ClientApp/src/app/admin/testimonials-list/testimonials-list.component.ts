import { Component, OnInit } from '@angular/core';
import { TestimonialsService } from '../../services/testimonials.service';
import { Testimonial } from '../../models/content.models';

@Component({
  selector: 'app-testimonials-list',
  templateUrl: './testimonials-list.component.html',
  styleUrls: ['./testimonials-list.component.css']
})
export class TestimonialsListComponent implements OnInit {
  testimonials: Testimonial[] = [];
  loading = true;

  constructor(private testimonialsService: TestimonialsService) { }

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials(): void {
    this.testimonialsService.getAll().subscribe({
      next: (data) => {
        this.testimonials = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteTestimonial(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

    this.testimonialsService.delete(id).subscribe({
      next: () => {
        this.loadTestimonials();
      }
    });
  }

  getStars(rating: number): string[] {
    return Array(5).fill('').map((_, i) => i < rating ? 'bxs:star' : 'bx:star');
  }
}
