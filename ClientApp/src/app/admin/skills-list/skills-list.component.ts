import { Component, OnInit } from '@angular/core';
import { SkillsService } from '../../services/skills.service';
import { Skill } from '../../models/content.models';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.css']
})
export class SkillsListComponent implements OnInit {
  skills: Skill[] = [];
  loading = true;

  constructor(private skillsService: SkillsService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillsService.getAll().subscribe({
      next: (data) => {
        this.skills = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteSkill(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;

    this.skillsService.delete(id).subscribe({
      next: () => {
        this.loadSkills();
      }
    });
  }
}
