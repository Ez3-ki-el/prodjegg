import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-edit',
  templateUrl: './settings-edit.component.html',
  styleUrls: ['./settings-edit.component.css']
})
export class SettingsEditComponent implements OnInit {
  settingsForm!: FormGroup;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      id: [0],
      showServices: [true],
      showPortfolio: [true],
      showTestimonials: [true],
      showStats: [true],
      showSkills: [true]
    });

    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.get().subscribe({
      next: (settings) => {
        this.settingsForm.patchValue(settings);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.settingsService.update(this.settingsForm.value).subscribe({
      next: () => {
        this.message = 'Réglages mis à jour avec succès !';
        this.loading = false;
      },
      error: () => {
        this.message = 'Erreur lors de la mise à jour';
        this.loading = false;
      }
    });
  }
}
