import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AddBibliothecaireComponent } from '../../component/add-bibliothecaire/add-bibliothecaire.component';
import { QrcodeBibliothecaireComponent } from '../../component/qrcode-bibliothecaire/qrcode-bibliothecaire.component';

@Component({
  selector: 'app-bibliothecaire',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AddBibliothecaireComponent,
    QrcodeBibliothecaireComponent,
  ],
  templateUrl: './bibliothecaire.component.html',
  styleUrl: './bibliothecaire.component.scss',
})
export class BibliothecaireComponent {
  isBibliothecaireComponentOpen: boolean = false;
  qrcodeBibliothecaire: boolean = true;
  closeCard() {
    this.isBibliothecaireComponentOpen = false;
  }
  openAddBibliothecaire() {
    this.isBibliothecaireComponentOpen = true;
  }
  QrcodeClose() {
    this.qrcodeBibliothecaire = false;
  }
  QrcodeOpen() {
    this.qrcodeBibliothecaire = !this.qrcodeBibliothecaire;
  }
}
