import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TestimonialsService } from '../../services/testimonials.service';

@Component({
  selector: 'app-testimonial-form',
  templateUrl: './testimonial-form.component.html',
  styleUrls: ['./testimonial-form.component.css']
})
export class TestimonialFormComponent implements OnInit {
  testimonialForm!: FormGroup;
  loading = false;
  isEditMode = false;
  testimonialId?: number;

  constructor(
    private fb: FormBuilder,
    private testimonialsService: TestimonialsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.testimonialForm = this.fb.group({
      id: [0],
      clientName: ['', Validators.required],
      clientTitle: ['', Validators.required],
      clientImagePath: ['', Validators.required],
      content: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      order: [0, Validators.required]
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.testimonialId = +id;
      this.loadTestimonial(this.testimonialId);
    }
  }

  loadTestimonial(id: number): void {
    this.testimonialsService.getById(id).subscribe({
      next: (testimonial) => {
        this.testimonialForm.patchValue(testimonial);
      }
    });
  }

  onImageUploaded(path: string): void {
    this.testimonialForm.patchValue({ clientImagePath: path });
    this.testimonialForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.testimonialForm.invalid) return;

    this.loading = true;
    const formValue = this.testimonialForm.value;

    const request = this.isEditMode
      ? this.testimonialsService.update(this.testimonialId!, formValue)
      : this.testimonialsService.create(formValue);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/testimonials']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
