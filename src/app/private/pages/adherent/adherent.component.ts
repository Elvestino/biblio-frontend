import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrcodeAdherentComponent } from '../../component/qrcode-adherent/qrcode-adherent.component';
import { AddAdherentComponent } from '../../component/add-adherent/add-adherent.component';

@Component({
  selector: 'app-adherent',
  standalone: true,
  imports: [RouterOutlet, QrcodeAdherentComponent, AddAdherentComponent],
  templateUrl: './adherent.component.html',
  styleUrl: './adherent.component.scss',
})
export class AdherentComponent {
  filter: string[] = ['Tous', 'Eleve', 'Professeur', 'Externe'];
  isAdherentComponentOpen: boolean = false;
  qrcodeBibliothecaire: boolean = false;
  closeCard() {
    this.isAdherentComponentOpen = false;
  }
  QrcodeClose() {
    this.qrcodeBibliothecaire = false;
  }
  QrcodeOpen() {
    this.qrcodeBibliothecaire = true;
  }
  openAdd() {
    this.isAdherentComponentOpen = true;
  }
}
