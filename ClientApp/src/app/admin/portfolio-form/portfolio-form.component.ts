import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-form',
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.css']
})
export class PortfolioFormComponent implements OnInit {
  portfolioForm!: FormGroup;
  loading = false;
  isEditMode = false;
  itemId?: number;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.portfolioForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      imagePath: ['', Validators.required],
      category: ['', Validators.required],
      projectUrl: [''],
      order: [0, Validators.required]
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.itemId = +id;
      this.loadItem(this.itemId);
    }
  }

  loadItem(id: number): void {
    this.portfolioService.getById(id).subscribe({
      next: (item) => {
        this.portfolioForm.patchValue(item);
      }
    });
  }

  onImageUploaded(path: string): void {
    this.portfolioForm.patchValue({ imagePath: path });
    this.portfolioForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.portfolioForm.invalid) return;

    this.loading = true;
    const formValue = this.portfolioForm.value;

    const request = this.isEditMode
      ? this.portfolioService.update(this.itemId!, formValue)
      : this.portfolioService.create(formValue);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/portfolio']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
