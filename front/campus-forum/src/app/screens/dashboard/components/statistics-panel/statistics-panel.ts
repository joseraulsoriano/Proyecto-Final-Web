import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../services/analytics';
import { Statistics } from '../../../../shared/interfaces/analytics.interface';

@Component({
  selector: 'app-statistics-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-panel.html',
  styleUrl: './statistics-panel.scss'
})
export class StatisticsPanelComponent implements OnInit {
  stats: Statistics | null = null;
  loading = false;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.analyticsService.getStatistics().subscribe({
      next: (stats) => {
        this.loading = false;
        this.stats = stats;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar estadísticas';
      }
    });
  }
}


