import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-biblio',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './biblio.component.html',
  styleUrl: './biblio.component.scss',
})
export class BiblioComponent implements OnInit {
  constructor() {
    this.dateAujourdhui = this.obtenirDateAujourdhui();

    this.heureActuelle = this.obtenirHeureActuelle();
  }
  heureActuelle: string;
  dateAujourdhui: string;
  ngOnInit(): void {
    this.obtenirHeureActuelle();
    setInterval(() => {
      this.obtenirHeureActuelle();
    }, 1000);
  }

  obtenirHeureActuelle(): any {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    this.heureActuelle = `${hours}:${minutes}:${seconds}`;
  }
  obtenirDateAujourdhui(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
