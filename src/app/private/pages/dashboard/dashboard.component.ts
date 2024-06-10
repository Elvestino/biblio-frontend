import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdherentService } from '../../service/adherent.service';
import { BibliothecaireService } from '../../service/bibliothecaire.service';
import { EmprunterService } from '../../service/emprunter.service';
import { Chart, ChartData, ChartOptions } from 'chart.js/auto';
import { LivreService } from '../../service/livre.service';
import { Livre } from '../../model/livre.model';
import { Emprunter } from '../../model/emprunter.model';

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
    private bibliothecaire: BibliothecaireService,
    private emprunt: EmprunterService,
    private livre: LivreService
  ) {
    this.getlivre();
    this.getemprunt();
    this.getadherent();
    this.getbibliothecaire();
    // this.createChart();
    this.getData();
  }
  date_adhesion: any[] = [];

  ngOnInit() {
    // this.createChart();
    this.getlivre();
    this.getemprunt();
    this.getadherent();
    this.getbibliothecaire();

    this.getData();

    /////////////////////////CHART ADHESION PAR MOIS ///////////////
    for (let i = 0; i < this.adherentdata.length; i++) {
      const element = this.adherentdata[i].dt_adhesion;
      console.log(element);
      this.date_adhesion.push(element);
    }
    const CountDate: { [key: number]: number } = this.date_adhesion.reduce(
      (acc: { [key: number]: number }, test) => {
        const mois = new Date(test).getMonth();
        acc[mois] = (acc[mois] || 0) + 1;
        return acc;
      },
      {}
    );
    const monthNames = [
      'Janvier',
      'Fevrier',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Aout',
      'Septembre',
      'Octobre',
      'Novembre',
      'Decembre',
    ];

    const labelMois = monthNames;
    const testMois = labelMois.map((_, index) => CountDate[index] || 0);
    const historiquemois: any = document.getElementById('chat_mois');
    const mois = new Chart(historiquemois.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labelMois,
        datasets: [
          {
            label: 'Adhesion par mois',
            data: testMois,
            backgroundColor: this.color,
            borderColor: this.color,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    /////////////////////CHART COUNT PAR EMPRUNT//////////////////////
    for (let i = 0; i < this.empruntdata.length; i++) {
      const element = this.empruntdata[i].livre.categorie;
      this.categories.push(element);
      this.CountCategories = this.countOccurence(this.categories);
      this.Uniquecategories = this.getUniqueCategories(this.categories);
    }
    const barCanvasEmprunt: any = document.getElementById('bar_chart_emprunt');
    const barChartEmprunt = new Chart(barCanvasEmprunt.getContext('2d'), {
      type: 'bar',
      data: {
        labels: this.Uniquecategories,
        datasets: [
          {
            label: 'Total',
            data: this.CountCategories,
            backgroundColor: this.color,
            borderColor: this.color,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    /////////////////////CHART COUNT PAR TYPE//////////////////////
    for (let i = 0; i < this.livredata.length; i++) {
      const element = this.livredata[i].categorie;
      this.categories.push(element);
      this.CountCategories = this.countOccurence(this.categories);
      this.Uniquecategories = this.getUniqueCategories(this.categories);
    }
    const barCanvasEle: any = document.getElementById('bar_chart');
    const barChart = new Chart(barCanvasEle.getContext('2d'), {
      type: 'bar',
      data: {
        labels: this.Uniquecategories,
        datasets: [
          {
            label: 'Total',
            data: this.CountCategories,
            backgroundColor: this.color,
            borderColor: this.color,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    /////////////////////CHART REPARTITION EMPRUNT ET RETOURNER//////////////////////
    const emprunteCanvas: any = document.getElementById('emprunter_chart');
    const enpre = new Chart(emprunteCanvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['Livres retourné', 'Livres emprunté'],
        datasets: [
          {
            data: [this.calculateTotalDataCount(), this.empruntdata.length],
            label: 'nombres ',
            borderColor: this.color,
            backgroundColor: this.color,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
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

  // -------------------------livre---------------------------
  livredata: Livre[] = [];
  getlivre() {
    this.livre.getAlllivres().subscribe({
      next: (res) => {
        this.livredata = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  livretotal(): number {
    return this.livredata.length;
  }
  //////////////////////CHART /////////////////////////////
  color: any = [
    '#00CED1',
    '#CE2029',
    '#87421F',
    '#0048BA',
    '#B0BF1A',
    '#DB2D43',
    '#9F2B68',
    '3DDC84',
    '#665D1E',
    '#4B6F44',
    '#FDEE00',
    '#7C0A02',
    '#7BB661',
    '#3D2B1F',
    '#CC5500',
    '#FFEF00',
  ];
  categories: string[] = [];
  Uniquecategories: string[] = [];
  CountCategories: { [key: string]: number } = {};
  countOccurence(categories: string[]): { [key: string]: number } {
    return categories.reduce(
      (acc: { [key: string]: number }, category: string) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {}
    );
  }
  getUniqueCategories(categories: string[]): string[] {
    return Array.from(new Set(categories));
  }

  ////////////////////////RETOURNER ///////////////////
  key: string = 'myData';
  data: Emprunter[] = [];
  getData() {
    const storedData = localStorage.getItem(this.key);
    if (storedData) {
      this.data = JSON.parse(storedData);
    }
  }

  calculateTotalDataCount(): number {
    return this.data.length;
  }
}
