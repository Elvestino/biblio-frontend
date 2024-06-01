import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { AdherentService } from '../../service/adherent.service';
import { BibliothecaireService } from '../../service/bibliothecaire.service';
import {
  Color,
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';
import { EmprunterService } from '../../service/emprunter.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private adherent: AdherentService,
    private bibliothecaire: BibliothecaireService,
    private emprunt: EmprunterService
  ) {}

  venteView: [number, number] = [400, 200];
  gradient: boolean = false;
  showLabels: boolean = true;
  colorScheme: Color = {
    name: 'Armes à feu',
    selectable: false,
    group: ScaleType.Linear,
    domain: [
      '#007bff',
      '#28a745',
      '#ffc107',
      '#17a2b8',
      '#dc3545',
      '#6610f2',
      '#fd7e14',
      '#6c757d',
    ],
  };
  vente = [
    {
      name: 'Lundi',
      value: 4,
    },
    {
      name: 'Mardi',
      value: 5,
    },
    {
      name: 'Mercredi',
      value: 6,
    },
    {
      name: 'Jeudi',
      value: 7,
    },
    {
      name: 'Vendredi',
      value: 7,
    },
    {
      name: 'Samedi',
      value: 3,
    },
  ];
  ngOnInit() {
    this.getadherent();
    this.getbibliothecaire();
    this.getemprunt();
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
  empruntdata: any[] = [];
  getemprunt() {
    this.emprunt.getAllEmprunts().subscribe({
      next: (res) => {
        this.empruntdata = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  emprunttotal(): number {
    return this.empruntdata.length;
  }
}
