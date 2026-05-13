import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { Stat } from '../../models/content.models';

@Component({
  selector: 'app-stats-list',
  templateUrl: './stats-list.component.html',
  styleUrls: ['./stats-list.component.css']
})
export class StatsListComponent implements OnInit {
  stats: Stat[] = [];
  loading = true;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getAll().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteStat(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette statistique ?')) return;

    this.statsService.delete(id).subscribe({
      next: () => {
        this.loadStats();
      }
    });
  }
}
