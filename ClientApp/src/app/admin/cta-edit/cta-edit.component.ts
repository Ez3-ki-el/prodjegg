import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CtaService } from '../../services/cta.service';

@Component({
  selector: 'app-cta-edit',
  templateUrl: './cta-edit.component.html',
  styleUrls: ['./cta-edit.component.css']
})
export class CtaEditComponent implements OnInit {
  ctaForm!: FormGroup;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private ctaService: CtaService
  ) {}

  ngOnInit(): void {
    this.ctaForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      description: ['', Validators.required],
      imagePath: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });

    this.loadCta();
  }

  loadCta(): void {
    this.ctaService.get().subscribe({
      next: (cta) => {
        this.ctaForm.patchValue(cta);
      }
    });
  }

  onImageUploaded(path: string): void {
    this.ctaForm.patchValue({ imagePath: path });
    this.ctaForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.ctaForm.invalid) return;

    this.loading = true;
    this.ctaService.update(this.ctaForm.value).subscribe({
      next: () => {
        this.message = 'Section CTA mise à jour avec succès !';
        this.loading = false;
      },
      error: () => {
        this.message = 'Erreur lors de la mise à jour';
        this.loading = false;
      }
    });
  }
}
