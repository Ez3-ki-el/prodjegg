import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-stat-form',
  templateUrl: './stat-form.component.html',
  styleUrls: ['./stat-form.component.css']
})
export class StatFormComponent implements OnInit {
  statForm!: FormGroup;
  loading = false;
  isEditMode = false;
  statId?: number;

  constructor(
    private fb: FormBuilder,
    private statsService: StatsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.statForm = this.fb.group({
      id: [0],
      label: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      order: [0, Validators.required]
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.statId = +id;
      this.loadStat(this.statId);
    }
  }

  loadStat(id: number): void {
    this.statsService.getById(id).subscribe({
      next: (stat) => {
        this.statForm.patchValue(stat);
      }
    });
  }

  onSubmit(): void {
    if (this.statForm.invalid) return;

    this.loading = true;
    const formValue = this.statForm.value;

    const request = this.isEditMode
      ? this.statsService.update(this.statId!, formValue)
      : this.statsService.create(formValue);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/stats']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
