import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AboutService } from '../../services/about.service';

@Component({
  selector: 'app-about-edit',
  templateUrl: './about-edit.component.html',
  styleUrls: ['./about-edit.component.css']
})
export class AboutEditComponent implements OnInit {
  aboutForm!: FormGroup;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private aboutService: AboutService
  ) {}

  ngOnInit(): void {
    this.aboutForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      paragraph1: ['', Validators.required],
      paragraph2: ['', Validators.required],
      paragraph3: ['', Validators.required]
    });

    this.loadAbout();
  }

  loadAbout(): void {
    this.aboutService.get().subscribe({
      next: (about) => {
        this.aboutForm.patchValue(about);
      },
      error: () => {
        this.message = 'Erreur lors du chargement des données';
      }
    });
  }

  onSubmit(): void {
    if (this.aboutForm.invalid) return;

    this.loading = true;
    this.aboutService.update(this.aboutForm.value).subscribe({
      next: () => {
        this.message = 'Section About mise à jour avec succès !';
        this.loading = false;
      },
      error: () => {
        this.message = 'Erreur lors de la mise à jour';
        this.loading = false;
      }
    });
  }
}
