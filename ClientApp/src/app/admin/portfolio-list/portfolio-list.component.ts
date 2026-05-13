import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioItem } from '../../models/content.models';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit {
  items: PortfolioItem[] = [];
  loading = true;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.portfolioService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteItem(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    this.portfolioService.delete(id).subscribe({
      next: () => {
        this.loadItems();
      }
    });
  }
}
