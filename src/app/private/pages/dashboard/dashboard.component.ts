import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { AdherentService } from '../../service/adherent.service';
import { BibliothecaireService } from '../../service/bibliothecaire.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private adherent: AdherentService,
    private bibliothecaire: BibliothecaireService
  ) {}

  // title = 'ng2-charts-demo';

  // public lineChartData: ChartConfiguration<'line'>['data'] = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //   datasets: [
  //     {
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       label: 'Series A',
  //       fill: true,
  //       tension: 0.5,
  //       borderColor: 'black',
  //       backgroundColor: 'rgba(255,0,0,0.3)',
  //     },
  //   ],
  // };
  // public lineChartOptions: ChartOptions<'line'> = {
  //   responsive: false,
  // };
  // public lineChartLegend = true;

  ngOnInit() {
    this.getadherent();
    this.getbibliothecaire();
  }

  // --------------adherent------------------
  adherentdata: any[] = [];
  getadherent() {
    this.adherent.getAlladherents().subscribe({
      next: (res) => {
        this.adherentdata = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  adherenttotal(): number {
    return this.adherentdata.length;
  }

  // --------------bibliothecaire------------------
  bibliothecairedata: any[] = [];
  getbibliothecaire() {
    this.bibliothecaire.getAllBibliothecaires().subscribe({
      next: (res) => {
        this.bibliothecairedata = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  bibliothecairetotal(): number {
    return this.bibliothecairedata.length;
  }
}
