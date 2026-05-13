import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillsService } from '../../services/skills.service';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.css']
})
export class SkillFormComponent implements OnInit {
  skillForm!: FormGroup;
  loading = false;
  isEditMode = false;
  skillId?: number;

  constructor(
    private fb: FormBuilder,
    private skillsService: SkillsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.skillForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      order: [0, Validators.required]
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.skillId = +id;
      this.loadSkill(this.skillId);
    }
  }

  loadSkill(id: number): void {
    this.skillsService.getById(id).subscribe({
      next: (skill) => {
        this.skillForm.patchValue(skill);
      }
    });
  }

  onSubmit(): void {
    if (this.skillForm.invalid) return;

    this.loading = true;
    const formValue = this.skillForm.value;

    const request = this.isEditMode
      ? this.skillsService.update(this.skillId!, formValue)
      : this.skillsService.create(formValue);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/skills']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
