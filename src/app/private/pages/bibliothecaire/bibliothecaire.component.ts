import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AddBibliothecaireComponent } from '../../component/add-bibliothecaire/add-bibliothecaire.component';

@Component({
  selector: 'app-bibliothecaire',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AddBibliothecaireComponent],
  templateUrl: './bibliothecaire.component.html',
  styleUrl: './bibliothecaire.component.scss',
})
export class BibliothecaireComponent {
  isBibliothecaireComponentOpen: boolean = true;
  closeCard() {
    this.isBibliothecaireComponentOpen = false;
  }
  openAddBibliothecaire() {
    this.isBibliothecaireComponentOpen = true;
  }
}
